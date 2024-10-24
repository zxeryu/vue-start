import { defineComponent, ref } from "vue";
import { useEffect } from "@vue-start/hooks";
import { ProLayout, useProRouter } from "@vue-start/pro";
import { HeaderLeft, HeaderRight } from "@/layout/Header";
import { css } from "@emotion/css";
import { menus } from "@/common/menus";
import { useConfigStore } from "@/store/StoreCurrent";
// @ts-ignore
import Sortable from "sortablejs";

export const BasicLayout = defineComponent(() => {
  const { router } = useProRouter();

  const [config, setConfig] = useConfigStore();

  const layoutOptions = [
    { label: "compose", value: "compose" },
    { label: "vertical", value: "vertical" },
    { label: "horizontal", value: "horizontal" },
    { label: "horizontal-v", value: "horizontal-v" },
  ];

  const handleLayoutChange = (v: string) => {
    setConfig({ layout: v });
  };

  useEffect(() => {
    if (location.pathname === "/") {
      router.replace({ name: "OverviewIndexMd" });
    }
  }, []);

  const collapseRef = ref(false);

  const handleCollapse = () => {
    collapseRef.value = !collapseRef.value;
  };

  // element-plus 中 collapse模式 使用
  const elCollapseSlots = {
    "menu-default": (menu: any) => {
      return <span>icon</span>;
    },
    "menu-title": (menu: any) => {
      if (menu.children && menu.children.length > 0) {
        return (
          <>
            <i>sub</i>
            <span>{menu.label}</span>
          </>
        );
      }
      return <span>{menu.label}</span>;
    },
  };

  // ant-design-vue 中 collapse模式 使用
  const antCollapseSlots = {
    "menu-icon": (menu: any) => {
      if (menu.children && menu.children.length > 0) {
        return <span>sub</span>;
      }
      return <span>icon</span>;
    },
  };

  let sortable: any;

  const onDragRegister = ({ dom, dataIdAttr, onDragEnd }: any) => {
    if (sortable) {
      sortable.destroy();
      sortable = null;
    }
    sortable = Sortable.create(dom, {
      animation: 300,
      dataIdAttr,
      disabled: false,
      onEnd: () => {
        onDragEnd(sortable.toArray());
      },
    });
  };

  return () => {
    return (
      <ProLayout
        class={css({
          ".el-menu--horizontal": {
            borderBottom: "unset",
          },
        })}
        layout={config.layout as any}
        tabs={{
          onDragRegister,
        }}
        menus={menus as any}
        fieldNames={{ value: "name", label: "title", hide: "hide", children: "children" }}
        collapse={collapseRef.value}
        v-slots={{
          "header-start": () => <HeaderLeft />,
          "header-end": () => (
            <>
              <HeaderRight />
              <pro-select
                class={css({ width: 120, marginLeft: 16 })}
                value={config.layout}
                modelValue={config.layout}
                options={layoutOptions}
                onChange={handleLayoutChange}
              />
            </>
          ),
          "menu-start": () => <div class={css({ lineHeight: "30px" })}>start</div>,
          "menu-end": () => (
            <div class={css({ lineHeight: "30px", textAlign: "center" })} onClick={handleCollapse}>
              {collapseRef.value ? "展开" : "合并"}
            </div>
          ),
        }}
      />
    );
  };
});
