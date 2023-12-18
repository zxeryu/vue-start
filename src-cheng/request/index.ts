import {
  ContentTypeInterceptor,
  createRequest as createRequestOrigin,
  isFailedRequestActor,
  useRequestProvide,
} from "@vue-start/request";
import { AxiosInterceptorManager, AxiosRequestConfig } from "axios";
import { useEffect } from "@vue-start/hooks";
import { filter as rxFilter, tap as rxTap } from "rxjs";

//complete url
const urlInterceptor = (request: AxiosInterceptorManager<AxiosRequestConfig>) => {
  request.use((requestConfig) => {
    //
    return requestConfig;
  });
};

export const createRequest = () => {
  return createRequestOrigin({}, [ContentTypeInterceptor, urlInterceptor], {});
};

/**
 * 错误信息提示
 */
export const useErrorHandler = () => {
  const { requestSubject$ } = useRequestProvide();

  useEffect(() => {
    const sub = requestSubject$
      .pipe(
        rxFilter(isFailedRequestActor),
        rxTap((actor) => {
          //错误提示
          //401登录处理
        }),
      )
      .subscribe();
    return () => {
      sub.unsubscribe();
    };
  }, []);
};
