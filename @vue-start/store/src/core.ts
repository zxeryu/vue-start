import { BehaviorSubject, Observable, Subject } from "rxjs";
import { compose, shallowEqual } from "./utils";
import { App } from "vue";
import { storeKey } from "./ctx";

export type TKeyCreator<TActor extends Actor> = (actor: TActor) => string;

export enum AsyncStage {
  STARTED = "STARTED",
  DONE = "DONE",
  FAILED = "FAILED",
  CANCEL = "CANCEL",
}

export interface IActorOpt<TArg = any, TOpts = any> {
  group?: string;
  name?: string;
  stage?: AsyncStage;
  effect?: (state: any, actor: Actor<TArg, TOpts>) => any;
  arg?: TArg;
  opts?: TOpts;
}

export const effectOn =
  <TRoot, TActor extends Actor>(
    keyOrKeyCreator: string | TKeyCreator<TActor>,
    effect: (root: TRoot, actor: TActor) => TRoot | undefined,
  ) =>
  (root: any = {}, actor: TActor) => {
    const k = typeof keyOrKeyCreator === "function" ? keyOrKeyCreator(actor) : keyOrKeyCreator;

    if (k === "") {
      return root;
    }

    const nextState = effect(root[k], actor);

    const nextRoot: typeof root = {};

    for (const key in root) {
      if (key === k) {
        continue;
      }
      nextRoot[key] = root[key];
    }

    if (typeof nextState !== "undefined") {
      nextRoot[k] = nextState;
    }

    return nextRoot;
  };

export class Actor<TArg = any, TOpts = any> {
  static of<TArg = any, TOpts = any>(group: string) {
    return new this<TArg, TOpts>({ group });
  }

  group: string;
  name: string;
  stage?: AsyncStage;

  effect?: (state: any, actor: Actor<TArg, TOpts>) => any;

  arg: TArg;
  opts: TOpts;

  constructor(opt: IActorOpt<TArg, TOpts>) {
    this.group = opt.group || "UN_GROUPED";
    this.name = opt.name! || "UN_NAMED";
    this.stage = opt.stage;

    this.effect = opt.effect;

    this.arg = opt.arg! || ({} as TArg);
    this.opts = opt.opts || ({} as TOpts);
  }

  named<TNamedArg = TArg, TNamedOpts = TOpts>(name: string, opts?: TNamedOpts): Actor<TNamedArg, TNamedOpts & TOpts> {
    return new (this.constructor as any)({
      ...(this as any),
      name,
      opts: {
        ...(this.opts as any),
        ...(opts as any),
      },
    });
  }

  staged(stage: AsyncStage): this {
    return new (this.constructor as any)({
      ...(this as any),
      stage,
    });
  }

  effectWith(effect: (state: any, actor: Actor<TArg, TOpts>) => any): this {
    return new (this.constructor as any)({
      ...(this as any),
      effect,
    });
  }

  effectOn<TState = any>(
    keyOrKeyCreator: string | TKeyCreator<Actor<TArg, TOpts>>,
    effect: (state: TState, actor: Actor<TArg, TOpts>) => TState | undefined,
  ): this {
    return this.effectWith(effectOn(keyOrKeyCreator, effect));
  }

  with(arg: TArg, opts?: TOpts): this {
    return new (this.constructor as any)({
      ...(this as any),
      arg,
      opts: {
        ...(this.opts as any),
        ...(opts as any),
      },
    });
  }

  invoke(dispatcher: { dispatch: (actor: Actor) => void }) {
    dispatcher.dispatch(this);
  }

  get type(): string {
    const opts = {} as any;
    let hasOpts = false;

    for (const k in this.opts) {
      if (k !== "parentActor") {
        opts[k] = this.opts[k];
        hasOpts = true;
      }
    }

    return `@@${this.group}/${this.name}${this.stage ? `::${this.stage}` : ""}${
      hasOpts ? `${JSON.stringify(this.opts)}` : ""
    }`;
  }

  is(actor: Actor): actor is Actor<TArg, TOpts> {
    const isSame = this.isSameGroup(actor) && actor.name === this.name;
    if (this.stage) {
      return isSame && actor.stage === this.stage;
    }
    return isSame;
  }

  isSameGroup(actor: Actor<TArg, TOpts>) {
    return actor.group === this.group;
  }
}

export interface IDispatch {
  (actor: Actor): Actor;
}

export interface IMiddlewareAPI<TState = any> {
  dispatch(actor: Actor<TState>): Actor<TState>;

  getState(): TState;
}

export interface IMiddleware<TState = any> {
  (api: IMiddlewareAPI<TState>): (next: IDispatch) => IDispatch;
}

export interface IEpic<TState extends TData> {
  (actor$: Observable<Actor>, so$: Store<TState>): Observable<Actor>;
}

export const composeEpics = (...epics: Array<IEpic<any>>): IEpic<any> => {
  return (actor$: Observable<Actor>, so$: Store): Observable<Actor> => {
    return epics.reduce((preActor$, epic) => {
      return epic(preActor$, so$) as any;
    }, actor$);
  };
};

export type TData = { [key: string]: any };

export class Store<TRoot extends TData = {}> extends BehaviorSubject<TRoot> {
  static create<TState extends TData>(initialState: TState = {} as TState) {
    return new Store<TState>(initialState);
  }

  actor$: Subject<Actor>;

  constructor(props: TRoot) {
    super(props);
    this.actor$ = new Subject<Actor>();
  }

  applyMiddleware(...middlewares: IMiddleware<TRoot>[]) {
    if (middlewares.length === 0) {
      return;
    }
    const chain = middlewares.map((middleware) => middleware(this));
    this.dispatch = compose(...chain)(this._dispatch);
  }

  epicOn(epic: IEpic<TRoot>) {
    return epic(this.actor$, this).subscribe((actor) => {
      if (actor) {
        this.dispatch(actor);
      }
    });
  }

  dispatch(actor: Actor) {
    return this._dispatch(actor);
  }

  getState(): TRoot {
    return this.value;
  }

  _dispatch(actor: Actor): Actor {
    if (actor.effect) {
      const nextValue = actor.effect(this.value, actor);
      if (!shallowEqual(nextValue, this.value)) {
        this.next(nextValue);
      }
    }
    this.actor$.next(actor);
    return actor;
  }

  install(app: App) {
    app.provide<Store<TRoot>>(storeKey, this);
  }
}
