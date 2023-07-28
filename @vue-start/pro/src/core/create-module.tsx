import { defineComponent, isVNode, ref, DefineComponent, PropType } from "vue";
import { IRequestOpts, ProModule, useModuleEvent, useProModule } from "./Module";
import { IElementConfig, TExecuteItem } from "./core";
import { ElementKeys, useGetCompByKey } from "../comp";
import { useEffect, restorePath, isValidPath, isPathHasParent } from "@vue-start/hooks";
import { cloneDeep, forEach, get, isArray, isEmpty, map, set, size } from "lodash";
import { executeEx, TExpression } from "./expression";
import { useProRouter } from "./router";
import { useProConfig } from "./pro";

export type TConfigData = {
  //初始状态
  initState?: Record<string, any>;
  //初始化执行的方法
  initExecuteList?: TExecuteItem[];
  //
  registerRequest?: Pick<IRequestOpts, "stateName" | "loadingName"> &
    {
      actor: string; //actor name
      convertParamsEx?: TExpression;
      convertDataEx?: TExpression;
      onSuccessEx?: TExecuteItem[];
      onFailedEx?: TExecuteItem[];
    }[];
  //组件树
  elementConfigs?: IElementConfig | IElementConfig[];
};

/******************************* 合并extra方法 ********************************************/

//extra中的值添加到 IElementConfig 中
const setExtraItem = (elementConfig: IElementConfig, extra: Record<string, any>) => {
  if (!elementConfig || !extra || isEmpty(extra)) return;
  //如果已经是渲染后的组件
  if (isVNode(elementConfig)) return;
  forEach(extra, (v, k) => {
    //补充的值添加到elementConfig中
    const path = restorePath(k, elementConfig);
    if (!isValidPath(path)) {
      console.log("ConfigExtra：补充对象key转换失败", elementConfig.elementId, k);
      return;
    }
    if (!isPathHasParent(path, elementConfig)) {
      console.log("ConfigExtra：补充对象key未找到父级", elementConfig.elementId, k, "->", path);
      return;
    }
    set(elementConfig, path, v);
  });
};

//temp merge method
const mergeExtraData = (elementConfig: IElementConfig, configExtra: Record<string, any>) => {
  //当前组件补充
  setExtraItem(elementConfig, get(configExtra, elementConfig.elementId));
  //registerPropsTrans 补充
  const registerPropsTrans = get(elementConfig, ["highConfig$", "registerPropsTrans"]);
  if (registerPropsTrans && size(registerPropsTrans) > 0) {
    forEach(registerPropsTrans, (rpt) => {
      const propEC = get(elementConfig.elementProps, rpt.name);
      if (isArray(propEC)) {
        forEach(propEC, (pec) => {
          mergeExtraData(pec, configExtra);
        });
      } else {
        mergeExtraData(propEC, configExtra);
      }
    });
  }
  if (elementConfig.children && size(elementConfig.children) > 0) {
    forEach(elementConfig.children, (ec) => {
      mergeExtraData(ec, configExtra);
    });
  }
};

const ModuleContent = defineComponent({
  props: {
    initExecuteList: { type: Array as PropType<TConfigData["initExecuteList"]> },
  },
  setup: (props) => {
    const { router } = useProRouter();
    const { expressionMethods } = useProConfig();
    const { state, data } = useProModule();

    //********************** executeList， 执行json描述的方法 *********************

    const execute = (executeList: TExecuteItem[], args: any[]) => {
      if (!executeList) return;

      const options: any = { state, data, args, methodObj: expressionMethods };

      forEach(executeList, (item) => {
        if (!isArray(item) || size(item) < 2) {
          console.log("execute invalid", item);
          return;
        }
        const [name, funName, ...params] = item;
        let fun;
        switch (name) {
          case "router":
            fun = get(router, funName);
            break;
          case "store":
            break;
        }
        if (fun) {
          try {
            const paramValues = map(params, (param) => {
              return executeEx(param, options);
            });
            fun(...paramValues);
          } catch (e) {
            console.log("execute err", e);
          }
        }
      });
    };

    useModuleEvent((action) => {
      //sendEvent方法发送的事件，执行executeList
      if (action.executeList) {
        execute(action.executeList, action.payload);
      }
    });

    //初始化
    useEffect(() => {
      if (props.initExecuteList) {
        execute(props.initExecuteList, []);
      }
    }, []);

    return () => null;
  },
});

export const createModule = ({
  configData,
  elementConfigExtra,
  Logic,
}: {
  configData?: TConfigData;
  elementConfigExtra?: Record<string, any>;
  Logic?: DefineComponent;
}) => {
  return defineComponent(() => {
    const configRef = ref<IElementConfig | IElementConfig[] | undefined>();

    const createData = (elementConfigs: IElementConfig | IElementConfig[]) => {
      const data = cloneDeep(elementConfigs);
      if (!elementConfigExtra) return data;
      if (isArray(data)) {
        forEach(data, (ec) => mergeExtraData(ec, elementConfigExtra));
      } else {
        mergeExtraData(data, elementConfigExtra);
      }
      return data;
    };

    //加载config：网络
    useEffect(() => {
      if (configData && configData.elementConfigs) {
        configRef.value = createData(configData.elementConfigs);
      }
      if (!configData?.elementConfigs) {
        //如果配置了网络方式，执行网络请求
      }
    }, []);

    const getComp = useGetCompByKey();
    const ProLoading = getComp(ElementKeys.LoadingKey);

    return () => {
      if (!configRef.value) {
        if (!ProLoading) return null;
        return (
          <ProLoading loading>
            <div class={"pro-module-loading-dom"} />
          </ProLoading>
        );
      }

      return (
        <ProModule elementConfigs={configRef.value}>
          <ModuleContent />
          {Logic && <Logic />}
        </ProModule>
      );
    };
  });
};
