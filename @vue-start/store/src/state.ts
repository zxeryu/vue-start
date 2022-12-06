import { Actor } from "./core";
import { useStore } from "./ctx";
import { isFunction, get } from "lodash";
import { useObservable, Volume } from "./observable";

const StateActor = Actor.of("state");

export const updateKV = StateActor.named<(prev: any) => any, { key: string }>("update").effectOn(
  (actor) => actor.opts.key,
  (state, actor) => {
    return actor.arg(state);
  },
);

export type TUpdater<T> = (prev: T) => T;

export const useDispatchStore = <T>() => {
  const store$ = useStore();

  return (key: string, stateOrUpdater: T | TUpdater<T>, persist: boolean, initialState?: T | (() => T)) => {
    const realKey = `${persist ? "$" : ""}${key}`;

    const initials = isFunction(initialState) ? initialState() : initialState;

    updateKV
      .with(
        (prevState = initials) => {
          if (isFunction(stateOrUpdater)) {
            return stateOrUpdater(prevState);
          }
          return stateOrUpdater;
        },
        { key: realKey },
      )
      .invoke(store$);
  };
};

export const useStoreState$ = <T>(k: string, initialState: undefined | T | (() => T), persist: boolean) => {
  const key = `${persist ? "$" : ""}${k}`;

  const initials = isFunction(initialState) ? initialState() : initialState;

  const store$ = useStore();

  const update = (stateOrUpdater: T | TUpdater<T>) => {
    return updateKV
      .with(
        (prevState: any = initials) => {
          if (isFunction(stateOrUpdater)) {
            return stateOrUpdater(prevState);
          }
          return stateOrUpdater;
        },
        { key },
      )
      .invoke(store$);
  };

  const state$ = Volume.from(store$, (state) => get(state, [key], initials));
  const state = useObservable(state$);

  return [state, update] as const;
};

export const createStateUse =
  <T>(k: string, initialState?: T, persist = false) =>
  () => {
    const [state, update] = useStoreState$(k, initialState, persist);

    return [state, update] as const;
  };
