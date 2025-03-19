import { IRequestActor } from "./createRequest";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getRequestConfig } from "./utils";
import { clone, isString } from "lodash";
import { strToJson } from "@vue-start/hooks";

export type TDownloadOptions = {
  onSuccess: (res: AxiosResponse) => void;
  onFail?: (err: Error) => void;
  onStart?: () => void;
  //转换请求参数
  convertConfig?: (config: AxiosRequestConfig) => AxiosRequestConfig;
  //判断内容是否是错误消息
  isErrorContent?: (content: Record<string, any>) => boolean;
};

export const download = (actor: IRequestActor | string, options: TDownloadOptions) => {
  if (!actor) {
    options.onFail?.(new Error("actor can not empty"));
    return;
  }

  let requestConfig;
  if (isString(actor)) {
    requestConfig = { url: actor } as AxiosRequestConfig;
  } else {
    const reActor = clone(actor);
    requestConfig = getRequestConfig(reActor);
  }

  //默认为 blob
  requestConfig.responseType = "blob";
  if (!requestConfig.method) {
    requestConfig.method = "GET";
  }

  const reRequestConfig = options.convertConfig?.(requestConfig) || requestConfig;

  options.onStart?.();

  axios(reRequestConfig)
    .then((res) => {
      const data = res.data;
      //若是json格式的数据
      if (data.type === "application/json") {
        const reader = new FileReader();
        reader.onload = () => {
          const content = strToJson(reader.result as string);
          //默认理解为返回的是错误内容
          let errFlag = true;
          if (options.isErrorContent) {
            //isErrorContent方法提供错误判断
            errFlag = options.isErrorContent(content);
          }
          if (errFlag) {
            options.onFail?.(content);
          } else {
            options.onSuccess?.(res);
          }
        };
        reader.readAsText(data);
      } else {
        options.onSuccess?.(res);
      }
    })
    .catch((err) => {
      options.onFail?.(err);
    });
};
