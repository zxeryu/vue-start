import {
  IRequestActor,
  isDoneRequestActor,
  isFailedRequestActor,
  isPreRequestActor,
  useRequestProvide,
} from "../../../request";
import { useEffect } from "../../../hooks";
import { merge as rxMerge, filter as rxFilter, tap as rxTap } from "rxjs";
import { forEach, isString, map } from "lodash";

const createUseRequestActor =
  (filterFun: (actor: IRequestActor) => boolean) =>
  (actors: (IRequestActor | string)[], callback: (actor: IRequestActor) => void) => {
    const { requestSubject$ } = useRequestProvide();

    const nameSet = new Set(map(actors, (actor) => (isString(actor) ? actor : actor.name)));

    useEffect(() => {
      const sub = requestSubject$
        .pipe(
          rxFilter(filterFun),
          rxTap((actor) => {
            if (nameSet.has(actor.name)) {
              callback(actor);
            }
          }),
        )
        .subscribe();
      return () => {
        sub.unsubscribe();
      };
    }, []);
  };

export const useDoneRequestActor = createUseRequestActor(isDoneRequestActor);
export const useFailedRequestActor = createUseRequestActor(isFailedRequestActor);

export const useComposeRequestActor = (
  //接口 或 接口名称 集合
  actors: (IRequestActor | string)[],
  //各种状态回调
  options: {
    onStart?: (actor: IRequestActor) => void;
    onSuccess?: (actor: IRequestActor) => void;
    onFailed?: (actor: IRequestActor) => void;
    onFinish?: (actor: IRequestActor) => void;
  },
  //是否cancel，当组件卸载的时候
  cancelWhileUnmount?: boolean,
) => {
  const { requestSubject$, dispatchRequest } = useRequestProvide();

  const nameSet = new Set(map(actors, (actor) => (isString(actor) ? actor : actor.name)));

  const lastRequestActors: { [key: string]: IRequestActor | undefined } = {};

  useEffect(() => {
    const sub = rxMerge(
      requestSubject$.pipe(
        rxFilter(isPreRequestActor),
        rxTap((actor) => {
          if (nameSet.has(actor.name)) {
            options.onStart?.(actor);

            lastRequestActors[actor.name] = actor;
          }
        }),
      ),
      requestSubject$.pipe(
        rxFilter(isDoneRequestActor),
        rxTap((actor) => {
          if (nameSet.has(actor.name)) {
            options.onSuccess?.(actor);
            options.onFinish?.(actor);

            lastRequestActors[actor.name] = undefined;
          }
        }),
      ),
      requestSubject$.pipe(
        rxFilter(isFailedRequestActor),
        rxTap((actor) => {
          if (nameSet.has(actor.name)) {
            options.onFailed?.(actor);
            options.onFinish?.(actor);

            lastRequestActors[actor.name] = undefined;
          }
        }),
      ),
    ).subscribe();
    return () => {
      sub.unsubscribe();
      if (cancelWhileUnmount) {
        //组件销毁的时候cancel请求
        forEach(lastRequestActors, (actor) => {
          actor && dispatchRequest({ ...actor, stage: "CANCEL" });
        });
      }
    };
  }, []);
};
