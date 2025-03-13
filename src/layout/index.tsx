import { computed, defineComponent } from "vue";
import { useEffect } from "@vue-start/hooks";
import { ProLayout, useAppConfig, useProRouter } from "@vue-start/pro";
import { HeaderLeft, HeaderRight } from "@/layout/Header";
import { css } from "@emotion/css";
import { menus } from "@/common/menus";
// @ts-ignore
import Sortable from "sortablejs";

export const BasicLayout = defineComponent(() => {
  const { router } = useProRouter();

  const { appConfig, setAppConfig } = useAppConfig();

  useEffect(() => {
    if (location.pathname === "/") {
      router.replace({ name: "OverviewIndexMd" });
    }
  }, []);

  const handleCollapse = () => {
    setAppConfig((prev) => ({ ...prev, isCollapse: !appConfig.isCollapse }));
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

  const tabs = computed(() => {
    if (appConfig.isTagsView) {
      return {
        key: appConfig.isTagsViewDrag,
        onDragRegister: appConfig.isTagsViewDrag ? onDragRegister : undefined,
      };
    }
    return undefined;
  });

  const watermark = computed(() => {
    if (appConfig.isWatermark) {
      return { str: "水印" };
    }
    return undefined;
  });

  return () => {
    return (
      <ProLayout
        class={css({
          ".el-menu--horizontal": {
            borderBottom: "unset",
          },
        })}
        layout={appConfig.layout as any}
        tabs={tabs.value}
        menus={menus as any}
        fieldNames={{ value: "name", label: "title", hide: "hide", children: "children" }}
        collapse={appConfig.isCollapse}
        watermark={watermark.value}
        routeOpts={{
          // tagsCache: false,
        }}
        v-slots={{
          "header-start": () => <HeaderLeft />,
          "header-end": () => <HeaderRight />,
          "menu-start": () => <div class={css({ lineHeight: "30px" })}>start</div>,
          "menu-end": () => (
            <div class={css({ lineHeight: "30px", textAlign: "center" })} onClick={handleCollapse}>
              {appConfig.isCollapse ? "展开" : "合并"}
            </div>
          ),
        }}
      />
    );
  };
});
