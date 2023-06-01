import { forEach, isNull, isUndefined, keys, map, size, startsWith } from "lodash";
import LocalForage, { createInstance, LOCALSTORAGE } from "localforage";
import { BehaviorSubject } from "rxjs";
import { persistFromRx } from "./rx";

export type TData = { [key: string]: any };

interface LocalForageDbInstanceOptions {
  name?: string;

  storeName?: string;
}

interface LocalForageOptions extends LocalForageDbInstanceOptions {
  driver?: string | string[];

  size?: number;

  version?: number;

  description?: string;
}

export class Storage {
  s!: typeof LocalForage;

  constructor(opts: LocalForageOptions) {
    this.s = createInstance(opts);
  }

  clear() {
    return this.s.clear();
  }

  load<T = any>(key: string) {
    return this.s.getItem<T>(key).then((values) => {
      if (isUndefined(values) || isNull(values)) {
        return undefined;
      }
      return values;
    });
  }

  save<T = any>(key: string, values: T) {
    return this.s.setItem<T>(key, values);
  }

  saveAll(values: TData) {
    const ks = keys(values);
    if (size(ks) <= 0) {
      return Promise.resolve();
    }
    return Promise.all(
      map(ks, (key) =>
        this.save(key, values[key]).catch((e) => {
          console.error(e);
        }),
      ),
    );
  }

  remove(key: string) {
    return this.s.removeItem(key);
  }

  removeAll(keys: string[]) {
    if (size(keys) <= 0) {
      return Promise.resolve();
    }
    return Promise.all(map(keys, (key) => this.remove(key).catch((e) => console.error(e))));
  }
}

export const PersistFlag = "$";
export const PersistKey = `${PersistFlag}persist`;
export const isPersist = (key = "") => {
  return startsWith(key, PersistFlag);
};

const loadData = (storage: Storage, callback?: (data: TData) => void) => {
  return storage
    .load(PersistKey)
    .then((keys: string[]) => {
      return Promise.all(map(keys, (key) => storage.load(key).then((values) => ({ key, values }))));
    })
    .then((values) => {
      const data: TData = {};
      forEach(values, (v) => {
        if (!isUndefined(v.values) && !isNull(v.values)) {
          data[v.key] = v.values;
        }
      });
      callback && callback(data);
      return data;
    })
    .catch((e) => console.error(e));
};

export class Persist {
  storage!: Storage;

  constructor(opts: LocalForageOptions) {
    this.storage = new Storage({
      driver: LOCALSTORAGE,
      ...opts,
      name: opts.name || "app",
    });
  }

  loadPersistData(callback?: (data: TData) => void) {
    return loadData(this.storage, callback);
  }

  persistRx(subject$: BehaviorSubject<TData>) {
    return persistFromRx(this.storage, subject$);
  }
}
