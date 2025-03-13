import { useMapPlugin } from "../Plugin";
import { get, isBoolean, isFunction, split } from "lodash";
import { ref, Ref, shallowRef, UnwrapNestedRefs, UnwrapRef, WatchSource, ShallowRef } from "vue";
import { useEffect, useState, useWatch } from "@vue-start/hooks";

export interface IUseMapApiOptions {
  initEmit?: boolean;
  opts?: Record<string, any>;
  params?: any[] | (() => any[]);
  deps?: WatchSource[];
  onComplete?: (status: string, result: any) => void;
  onSuccess?: (result: Record<string, any>) => void;
  onNoData?: (result: any) => void;
  onFail?: (err: any) => void;
}

export interface IUseMapApiResult {
  data: UnwrapNestedRefs<any>;
  requesting: Ref<UnwrapRef<boolean>>;
  request: (opts?: Record<string, any>, params?: any[]) => void;
  targetRef: ShallowRef<any>;
}

/**
 * api组成说明 `AMap.${PluginName}_MethodName`
 * PluginName 插件名称
 * MethodName 要调用该插件的方法名称
 * @param api
 * @param options
 */
export const useMapApi = (api: string, options: IUseMapApiOptions): IUseMapApiResult => {
  let pluginLoaded = false;

  //当前请求对象
  let task: { opts?: Record<string, any>; params?: any[] } | null = null;

  const targetRef = shallowRef<any>();
  const [data, setData] = useState<Record<string, any>>();
  const requesting = ref<boolean>(isBoolean(options.initEmit) ? options.initEmit : false);

  //解析api字符串
  const arr = split(api, "_");
  const plugin = arr[0];
  const methodName = arr[1];

  //创建当前插件对象
  const createTarget = () => {
    const ApiTarget = get(window, plugin);
    if (ApiTarget) {
      return new ApiTarget({ ...options.opts, ...task?.opts });
    }
    return null;
  };

  const getParams = (params?: any[]) => {
    if (params) return params;
    return isFunction(options.params) ? options.params() : options.params || [];
  };

  const executeTask = () => {
    if (!task) return;

    //当前 api 对象
    const apiTarget = createTarget();
    //插件对象赋值
    targetRef.value = apiTarget;
    if (!apiTarget) return;
    //当前方法
    if (!isFunction(apiTarget[methodName])) return;
    //参数
    const params = getParams(task.params);
    requesting.value = true;

    //执行方法
    apiTarget[methodName](...params, (status: string, result: Record<string, any>) => {
      setData(result);
      options.onComplete?.(status, result);
      if (status === "complete") {
        options.onSuccess?.(result);
      } else if (status === "error") {
        options.onFail?.(result);
      } else if (status === "no_data") {
        options.onNoData?.(result);
      }
      //执行成功
      task = null;
      requesting.value = false;
    });

    return apiTarget;
  };

  useMapPlugin([plugin], () => {
    pluginLoaded = true;
    executeTask();
  });

  const request = (opts?: Record<string, any>, params?: any[]) => {
    task = { opts: opts || options.opts, params: getParams(params) };
    if (!pluginLoaded) return;
    return executeTask();
  };

  //初始化请求
  useEffect(() => {
    if (options.initEmit) {
      request();
    }
  }, []);

  useWatch(() => request(), options.deps || []);

  return { data, request, requesting, targetRef };
};
