import { Observable } from "rxjs";
import { distinctUntilChanged, map as rxMap } from "rxjs/operators";
import { shallowEqual } from "./utils";
import { onMounted, onBeforeUnmount, ref } from "vue";
import { useStore } from "./ctx";

export type TEqualFn = (a: any, b: any) => boolean;

export interface IMapper<T, TOutput> {
  (state: T): TOutput;

  equalFn?: TEqualFn;
}

export class Volume<T, TOutput> extends Observable<TOutput> {
  static from<T, TOutput>(ob$: Observable<T>, mapper: IMapper<T, TOutput>): Observable<TOutput> {
    return new Volume<T, TOutput>(ob$, mapper, mapper.equalFn);
  }

  private _value: TOutput | undefined;

  get value() {
    if (typeof this._value === "undefined") {
      this._value = this.mapper((this.state$ as any).value);
    }
    return this._value;
  }

  constructor(private state$: Observable<T>, private mapper: (state: T) => TOutput, equalFn: TEqualFn = shallowEqual) {
    super((s) => {
      return this.state$
        .pipe(
          rxMap((state) => {
            const nextValue = this.mapper(state);
            if (!equalFn(nextValue, this._value)) {
              this._value = nextValue;
            }
            return this._value;
          }),
          distinctUntilChanged(),
        )
        .subscribe(s);
    });
  }
}

export const useObservable = <T>(ob$: Observable<T>, defaultValue?: T): T => {
  const v = ref(defaultValue || (ob$ as any).value);
  let sub;
  onMounted(() => {
    sub = ob$.subscribe((val) => {
      v.value = val;
    });
  });
  onBeforeUnmount(() => {
    sub && sub.unsubscribe();
  });

  return v;
};

export const useConn = <T, TOutput = T>(ob$: Observable<T>, mapper: IMapper<T, TOutput>): Observable<TOutput> => {
  return Volume.from(ob$, mapper);
};

export const useSelector = <T, TOutput = T>(ob$: Observable<T>, mapper?: IMapper<T, TOutput>): TOutput => {
  return useObservable(useConn(ob$, mapper || (((v: T) => v) as any)));
};

export const useStoreConn = <TOutput>(mapper?: IMapper<any, TOutput>): Observable<TOutput> => {
  return useConn(useStore(), mapper || (((v: any) => v) as any));
};

export const useStoreSelector = <TOutput>(mapper?: IMapper<any, TOutput>) => {
  return useObservable(useStoreConn(mapper));
};
