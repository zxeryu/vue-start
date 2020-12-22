import { Actor, AsyncStage } from "@vue-start/store";
import { merge as rxMerge, Observable } from "rxjs";
import { filter as rxFilter, ignoreElements as rxIgnoreElements, tap as rxTap } from "rxjs/operators";
import { map } from "lodash";

const RequestGroup = "request";

export const RequestActor = Actor.of(RequestGroup);

// const isRequestActor = (actor: Actor) => {
//   return actor.group === RequestGroup;
// };

const isSameDoneActor = (current: Actor, target: Actor) => {
  if (current.group === target.group && current.name === target.name) {
    return current.stage === AsyncStage.DONE;
  }
  return false;
};

export const tapWhen = (next: () => void, ...actors: Actor[]) => {
  return (actor$: Observable<Actor>) => {
    return rxMerge(
      ...map(actors, (actor) =>
        actor$.pipe(
          rxFilter((na) => {
            return isSameDoneActor(na, actor);
          }),
        ),
      ),
    ).pipe(rxTap(next), rxIgnoreElements());
  };
};
