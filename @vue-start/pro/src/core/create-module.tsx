import { defineComponent, isVNode, ref } from "vue";
import { ProModule } from "./Module";
import { IElementConfig } from "./core";
import { ElementKeys, useGetCompByKey } from "../comp";
import { useEffect, findTreeItem } from "@vue-start/hooks";
import { cloneDeep, forEach, get, isArray, isEmpty, isNumber, set, size } from "lodash";

/******************************* 合并extra方法 ********************************************/

const convertPath = (path: string, obj: IElementConfig): string => {
  const arr = path.match(/\[(.*?)\]/g);
  if (!arr || size(arr) <= 0) return path;

  const firstItem = arr[0];
  if (!firstItem || firstItem.indexOf(",") < 0) return path;

  const [idName, idValue] = firstItem.replace("[", "").replace("]", "").split(",");
  const leftPath = path.substring(0, path.indexOf(firstItem) - 1);

  const arrObj = get(obj, leftPath);
  if (!isArray(arrObj)) return path;

  const { index } = findTreeItem(arrObj, (item) => item[idName] === idValue);
  if (!isNumber(index)) return path;

  const cp = path.replace(firstItem, String(index));

  return convertPath(cp, obj);
};

//是否是合法的path
const isValidPath = (path: string): boolean => {
  if (!path) return false;
  if (path.indexOf("[") > -1) return false;
  if (path.indexOf("]") > -1) return false;
  return true;
};

//父级对象是否存在
const isHasParent = (path: string, obj: IElementConfig): boolean => {
  if (path.indexOf(".") > 0) {
    const leftPath = path.substring(0, path.lastIndexOf("."));
    return !!get(obj, leftPath);
  }
  return true;
};

//extra中的值添加到 IElementConfig 中
const setExtraItem = (elementConfig: IElementConfig, extra: Record<string, any>) => {
  if (!elementConfig || !extra || isEmpty(extra)) return;
  //如果已经是渲染后的组件
  if (isVNode(elementConfig)) return;

  forEach(extra, (v, k) => {
    //补充的值添加到elementConfig中
    const path = convertPath(k, elementConfig);
    if (!isValidPath(path)) {
      console.log("补充对象key转换失败", elementConfig.elementId, k);
      return;
    }

    if (!isHasParent(path, elementConfig)) {
      console.log("补充对象key未找到父级", elementConfig.elementId, k, "->", path);
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

export const createModule = ({
  elementConfigs,
  elementConfigExtra,
}: {
  elementConfigs?: IElementConfig | IElementConfig[];
  elementConfigExtra?: Record<string, any>;
}) => {
  return defineComponent({
    props: {},
    setup: () => {
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
        if (elementConfigs) {
          configRef.value = createData(elementConfigs);
        }
        if (!elementConfigs) {
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

        return <ProModule elementConfigs={configRef.value} />;
      };
    },
  });
};
