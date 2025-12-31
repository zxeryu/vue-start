import { computed, defineComponent, ExtractPropTypes, PropType, reactive } from "vue";
import { ElementKeys, useGetCompByKey } from "../comp";
import { createStateUse, TUpdater } from "@vue-start/store";
import { isFunction, map, pick } from "lodash";
import { useProConfig } from "../core";
import { setReactiveValue, useWatch } from "@vue-start/hooks";
import { TAppConfig } from "./ctx";

const useAppConfigState = createStateUse("app-config", undefined, true);

export const useAppConfig = () => {
  const { appConfig: defConfig } = useProConfig();
  const [localConfig, setLocalConfig] = useAppConfigState();

  const appConfig = reactive<TAppConfig>({ ...defConfig, ...localConfig });

  useWatch(() => {
    setReactiveValue(appConfig, { ...defConfig, ...localConfig });
  }, localConfig);

  const setAppConfig = (c: TAppConfig | TUpdater<TAppConfig>) => {
    const ac = isFunction(c) ? c(appConfig) : c;
    setLocalConfig(ac as any);
  };

  const delAppConfig = () => {
    setLocalConfig(undefined);
  };

  return { appConfig, setAppConfig, delAppConfig } as const;
};

const appConfigProps = () => ({
  columns: { type: Array as PropType<{ title?: string; dataIndex: string; valueType: string }[]> },
});

export type ProAppConfigDrawerProps = Partial<ExtractPropTypes<ReturnType<typeof appConfigProps>>> &
  Record<string, any>;

export const ProAppConfigDrawer = defineComponent<ProAppConfigDrawerProps>({
  props: {
    ...appConfigProps(),
  } as any,
  setup: (props, { slots, emit }) => {
    const { appConfig, setAppConfig, delAppConfig } = useAppConfig();

    const formState = reactive({ ...appConfig });

    const handleClose = () => {
      emit("cancel");
    };

    useWatch(() => {
      setAppConfig((prev) => ({ ...prev, ...formState }));
    }, formState);

    const updateLayout = (layout: string) => {
      formState.layout = layout;
      handleClose();
    };

    const list = [
      { title: "布局切换", dataIndex: "布局切换", valueType: "title" },
      { dataIndex: "layout", valueType: "layout" },

      { title: "主题", dataIndex: "主题", valueType: "title" },
      { title: "主题色", dataIndex: "primary", valueType: "color" },
      { title: "深色模式", dataIndex: "isDark", valueType: "switch" },

      { title: "菜单", dataIndex: "菜单", valueType: "title" },
      { title: "菜单背景", dataIndex: "menuBar", valueType: "color" },
      { title: "菜单字体颜色", dataIndex: "menuBarColor", valueType: "color" },
      { title: "菜单高亮背景", dataIndex: "menuBarActiveColor", valueType: "color" },

      { title: "界面", dataIndex: "界面", valueType: "title" },
      { title: "菜单水平折叠", dataIndex: "isCollapse", valueType: "switch" },
      { title: "侧边栏Logo", dataIndex: "isShowLogo", valueType: "switch" },
      { title: "开启Tags", dataIndex: "isTagsView", valueType: "switch" },
      { title: "开启Tags图标", dataIndex: "isTagsViewIcon", valueType: "switch" },
      // { title: "开启Tags缓存", dataIndex: "isTagsViewCache" , valueType: "switch"},
      { title: "开启Tags拖拽", dataIndex: "isTagsViewDrag", valueType: "switch" },
      { title: "开启灰色模式", dataIndex: "isGray", valueType: "switch" },
      { title: "开启色弱模式", dataIndex: "isInvert", valueType: "switch" },
      { title: "开启水印", dataIndex: "isWatermark", valueType: "switch" },
      //
      {
        title: "语言",
        dataIndex: "locale",
        valueType: "select",
        formFieldProps: {
          options: [
            { label: "中文", value: "zh" },
            { label: "英语", value: "en" },
          ],
        },
      },
    ];

    const layoutList = [
      { key: "compose", child: ["top", "left"] },
      { key: "vertical", child: ["top"] },
      { key: "horizontal", child: ["left"] },
      { key: "horizontal-v", child: ["left"] },
    ];

    const columns = computed(() => {
      return map(props.columns || list, (item) => {
        if (item.valueType === "title") {
          return {
            ...pick(item, "dataIndex"),
            formItemProps: { class: "pro-app-config_form_title" },
            inputRender: () => item.title,
          };
        }
        if (item.valueType === "layout") {
          return {
            ...pick(item, "dataIndex"),
            inputRender: () => {
              return (
                <div class={"pro-app-config_form_layout"}>
                  {map(layoutList, (item) => {
                    const isSelected = appConfig.layout === item.key;
                    return (
                      <div class={isSelected ? "selected" : undefined} onClick={() => updateLayout(item.key)}>
                        {map(item.child, (subItem) => (
                          <div class={subItem} />
                        ))}
                      </div>
                    );
                  })}
                </div>
              );
            },
          };
        }
        return item;
      });
    });

    const handleReset = () => {
      delAppConfig();
      handleClose();
    };

    const getComp = useGetCompByKey();
    const Drawer = getComp(ElementKeys.DrawerKey);
    const ProForm = getComp(ElementKeys.ProFormKey);

    return () => {
      return (
        <Drawer title={"设置"} size={"260px"} footer={false}>
          <ProForm class={"pro-app-config_form"} model={formState} columns={columns.value} />

          {slots.default?.()}

          <div class={"pro-app-config_btm"}>
            <pro-button type={"primary"} onClick={handleReset}>
              恢复默认配置
            </pro-button>
          </div>
        </Drawer>
      );
    };
  },
});
