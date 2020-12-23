import { Actor, AsyncStage } from "@vue-start/store";
import { merge as rxMerge, Observable } from "rxjs";
import { filter as rxFilter, ignoreElements as rxIgnoreElements, tap as rxTap } from "rxjs/operators";
import { map } from "lodash";
import { IRequestConfig } from "./request";

const RequestGroup = "request";

export const RequestActor = Actor.of(RequestGroup);

const isRequestActor = (actor: Actor) => {
  return actor.group === RequestGroup;
};

const isSameDoneActor = (actor: Actor, config: IRequestConfig<any, any>) => {
  if (isRequestActor(actor) && actor.name === config.name) {
    return actor.stage === AsyncStage.DONE;
  }
  return false;
};

export const tapWhen = (next: () => void, ...configs: IRequestConfig<any, any>[]) => {
  return (actor$: Observable<Actor>) => {
    return rxMerge(
      ...map(configs, (c) =>
        actor$.pipe(
          rxFilter((actor) => {
            return isSameDoneActor(actor, c);
          }),
        ),
      ),
    ).pipe(rxTap(next), rxIgnoreElements());
  };
};
