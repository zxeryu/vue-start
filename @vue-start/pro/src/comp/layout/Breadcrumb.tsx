import { computed, defineComponent, ExtractPropTypes } from "vue";
import { TLayoutMenu, useProLayout } from "./ctx";
import { findTreeItem } from "@vue-start/hooks";
import { useProRouter } from "../../core";
import { map, size } from "lodash";

const breadcrumbProps = () => ({
  separator: { type: String, default: "/" },
  onItemClick: { type: Function },
  renderSeparator: { type: Function },
  renderStart: { type: Function },
  renderEnd: { type: Function },
});

export type LayoutBreadcrumbProps = Partial<ExtractPropTypes<ReturnType<typeof breadcrumbProps>>>;

export const LayoutBreadcrumb = defineComponent<LayoutBreadcrumbProps>({
  props: {
    ...breadcrumbProps(),
  } as any,
  setup: (props) => {
    const { router, route } = useProRouter();
    const { menus, convertName } = useProLayout();

    const routes = computed(() => {
      //菜单树
      const { parentList } = findTreeItem(menus.value, (item) => item.value === convertName(route), undefined, []);
      return parentList || [];
    });

    const handleItemClick = (item: TLayoutMenu, isLast: boolean) => {
      if (props.onItemClick) {
        props.onItemClick(item, isLast);
      }

      if (isLast) return;

      router.openMenu(item);
    };

    return () => {
      return (
        <div class={"pro-layout-breadcrumb"}>
          {props.renderStart?.()}
          {map(routes.value, (item: TLayoutMenu, index: number) => {
            const isLast = index === size(routes.value) - 1;
            const cls = ["breadcrumb-item"];
            if (!isLast) {
              cls.push("a");
            }
            return (
              <>
                <span class={cls} onClick={() => handleItemClick(item, isLast)}>
                  {item.label}
                </span>
                {!isLast && (
                  <span class={"breadcrumb-separator"}>{props.renderSeparator?.(item) || props.separator || "/"}</span>
                )}
              </>
            );
          })}
          {props.renderEnd?.()}
        </div>
      );
    };
  },
});
