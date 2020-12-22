import { useAxios, useRequestCreator } from "./core";
import { cancelActorIfExists, fakeCancelRequest, IRequestActor, isCancelActor } from "./request";
import { ref, onBeforeUnmount } from "vue";
import { useStore, AsyncStage } from "@vue-start/store";
import { RequestActor } from "./actor";

// interface IResult<TReq, TRes> {
//   data: Ref<TRes>;
//   loading: Ref<boolean>;
//   run: (arg?: TReq) => void;
//   error?: Ref<Error | undefined>;
// }

export const useRequest = <TRequestActor extends IRequestActor<any, any>>(
  requestActor: TRequestActor,
  options?: {
    params?: TRequestActor["req"];
    manual?: boolean;
    onSuccess?: (data: TRequestActor["res"]) => void;
    onFail?: (err: Error) => void;
    onFinish?: () => void;
    joinSub?: boolean;
  },
) => {
  const client = useAxios();
  const requestCreator = useRequestCreator();
  const store$ = useStore();

  const data = ref<TRequestActor["res"]>();
  const loading = ref<boolean>(false);
  const error = ref<Error>();

  const run = (arg?: TRequestActor["req"]) => {
    //set params
    requestActor.req = arg ? arg : options?.params;

    const request = requestCreator(requestActor);
    loading.value = true;
    request()
      .then((response) => {
        if (isCancelActor(requestActor)) {
          return fakeCancelRequest(client, request.config);
        }
        return response;
      })
      .then((response) => {
        data.value = response.data;
        options?.onSuccess && options.onSuccess(data.value);
        options?.joinSub && RequestActor.named(requestActor.name, { stage: AsyncStage.DONE }).invoke(store$);
      })
      .catch((err: Error) => {
        error.value = err;
        options?.onFail && options.onFail(err);
        options?.joinSub && RequestActor.named(requestActor.name, { stage: AsyncStage.FAILED }).invoke(store$);
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

  onBeforeUnmount(() => {
    cancelActorIfExists(requestActor);
  });

  return [data, loading, run, error] as const;
};
