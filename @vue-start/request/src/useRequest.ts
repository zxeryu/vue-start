import { useAxios, useRequestCreator } from "./core";
import { cancelActorIfExists, fakeCancelRequest, IRequestActor, isCancelActor, TRequestFromReq } from "./request";
import { ref, onBeforeUnmount, Ref } from "vue";

export const createRequestActor = <TReq, TRes>(requestFromReq: TRequestFromReq): IRequestActor<TReq, TRes> => {
  return { requestFromReq };
};

interface IResult<TReq, TRes> {
  data: Ref<TRes>;
  loading: Ref<boolean>;
  run: (arg?: TReq) => void;
  error?: Ref<Error | undefined>;
}

export const useRequest = <TRequestActor extends IRequestActor<any, any>>(
  requestActor: TRequestActor,
  options?: {
    params?: TRequestActor["req"];
    manual?: boolean;
  },
): IResult<TRequestActor["req"], TRequestActor["res"]> => {
  const client = useAxios();
  const requestCreator = useRequestCreator();
  const data = ref<TRequestActor["res"]>();
  const loading = ref<boolean>(false);
  const error = ref<Error>();

  const run = (arg?: TRequestActor["req"]) => {
    if (arg) {
      requestActor.req = arg;
    }
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
      })
      .catch((err: Error) => {
        error.value = err;
      })
      .finally(() => {
        request.clear();
        loading.value = false;
      });
  };

  //set params
  options?.params && (requestActor.req = options.params);

  //automatic
  if (!options?.manual) {
    run();
  }

  onBeforeUnmount(() => {
    cancelActorIfExists(requestActor);
  });

  return { data, loading, run, error };
};
