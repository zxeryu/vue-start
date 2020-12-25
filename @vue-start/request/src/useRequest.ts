import { useAxios, useRequestCreator } from "./core";
import { cancelActorIfExists, fakeCancelRequest, IRequestConfig, isCancelActor } from "./request";
import { onBeforeUnmount, ref, watch } from "vue";
import { AsyncStage, useStore } from "@vue-start/store";
import { RequestActor } from "./actor";
import { UnwrapRef } from "@vue/reactivity";
import { clone } from "lodash";

// interface IResult<TReq, TRes> {
//   data: Ref<TRes>;
//   loading: Ref<boolean>;
//   run: (arg?: TReq) => void;
//   error?: Ref<Error | undefined>;
// }

export const useRequest = <TRequestConfig extends IRequestConfig<any, any>>(
  requestConfig: TRequestConfig,
  options?: {
    params?: TRequestConfig["req"];
    deps?: UnwrapRef<any>;
    manual?: boolean;
    onSuccess?: (data: TRequestConfig["res"]) => void;
    onFail?: (err: Error) => void;
    onFinish?: () => void;
    joinSub?: boolean;
  },
) => {
  const client = useAxios();
  const requestCreator = useRequestCreator();
  const store$ = useStore();

  const data = ref<TRequestConfig["res"]>();
  const loading = ref<boolean>(false);
  const error = ref<Error>();

  let executeConfig: TRequestConfig;

  const run = (arg?: TRequestConfig["req"]) => {
    executeConfig = clone(requestConfig);
    //set params
    executeConfig.req = arg ? arg : options?.params;

    const request = requestCreator(executeConfig);
    loading.value = true;
    request()
      .then((response) => {
        if (isCancelActor(executeConfig)) {
          return fakeCancelRequest(client, request.config);
        }
        return response;
      })
      .then((response) => {
        data.value = response.data;
        options?.onSuccess && options.onSuccess(data.value);
        options?.joinSub && RequestActor.named(executeConfig.name).staged(AsyncStage.DONE).invoke(store$);
      })
      .catch((err: Error) => {
        error.value = err;
        options?.onFail && options.onFail(err);
        options?.joinSub && RequestActor.named(executeConfig.name).staged(AsyncStage.FAILED).invoke(store$);
      })
      .finally(() => {
        request.clear();
        loading.value = false;
        options?.onFinish && options.onFinish();
      });
  };

  //automatic
  if (!options?.manual) {
    run();
  }

  const stopWatch = watch(options?.deps, () => {
    !options?.manual && run();
  });

  onBeforeUnmount(() => {
    executeConfig && cancelActorIfExists(executeConfig);
    stopWatch && stopWatch();
  });

  return [data, loading, run, error] as const;
};
