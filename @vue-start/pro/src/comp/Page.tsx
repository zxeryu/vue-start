import { computed, defineComponent, ExtractPropTypes, PropType, VNode } from "vue";
import { keys, omit, pick } from "lodash";
import { ElementKeys, useGetCompByKey } from "./comp";
import { isValidNode, useProConfig, useProRouter } from "../core";
import { useProLayout } from "./layout";

const proPageHeaderProps = () => ({
  title: { type: String },
  subTitle: { type: String },
  showBack: Boolean,
  //没有history的时候隐藏back
  hideWhileNoHistory: { type: Boolean, default: true },
  onBackClick: { type: Function },
  //render dom
  renderBackIcon: { type: Function as PropType<() => VNode> },
});

export type PageHeaderProps = Partial<ExtractPropTypes<ReturnType<typeof proPageHeaderProps>>>;

export const PageHeader = defineComponent({
  props: {
    ...proPageHeaderProps(),
  },
  setup: (props, { slots }) => {
    const { t } = useProConfig();
    const { router } = useProRouter();

    const handleOnBackClick = () => {
      if (props.onBackClick) {
        props.onBackClick?.();
        return;
      }
      router.back();
    };

    const renderBackIcon = () => t.value("back");

    return () => {
      const isShowBackHis =
        (props.hideWhileNoHistory && window.history?.state?.back) || props.hideWhileNoHistory === false;
      return (
        <div class={"pro-page-header"}>
          {props.showBack && isShowBackHis && (
            <div class={"pro-page-header-back"} onClick={handleOnBackClick}>
              {slots.backIcon ? slots.backIcon() : props.renderBackIcon?.() || renderBackIcon()}
            </div>
          )}
          <div class={"pro-page-header-title"}>{slots.title ? slots.title() : props.title}</div>
          <div class={"pro-page-header-sub-title"}>{slots.subTitle ? slots.subTitle() : props.subTitle}</div>
          <div class={"pro-page-header-space"}>{slots.space?.()}</div>
          <div class={"pro-page-header-extra"}>{slots.extra?.()}</div>
        </div>
      );
    };
  },
});

const proPageProps = () => ({
  loading: { type: Boolean, default: false },
  loadingOpts: Object,
  //是否启用填充模式，即："pro-page-content"高度铺满"pro-page"中除header、footer的其他高度
  fillMode: { type: Boolean, default: true },
  //根作为什么元素渲染
  as: { type: String },
  //开启的话，在layout tabs模式下，不展示showBack
  layoutTabsBackMode: { type: Boolean },
  //作为子页面（在layout中无对应的菜单）
  sub: { type: Boolean },
});

export type ProPageProps = Partial<ExtractPropTypes<ReturnType<typeof proPageProps>>> & PageHeaderProps;

export const ProPage = defineComponent<ProPageProps>({
  props: {
    ...PageHeader.props,
    ...proPageProps(),
  },
  setup: (props, { slots }) => {
    const layoutProvide = useProLayout();

    const showBack = computed(() => {
      //不开启
      if (!props.layoutTabsBackMode) {
        return props.showBack;
      }
      //非路由页面（子页面）
      if (props.sub) {
        return props.showBack;
      }
      //不在layout中
      if (!layoutProvide) {
        return props.showBack;
      }
      const { showTabs } = layoutProvide;
      //未开启tabs
      if (!showTabs.value) {
        return props.showBack;
      }
      //不展示showBack
      return false;
    });

    const getComp = useGetCompByKey();
    const Loading = getComp(ElementKeys.LoadingKey);
    const RComp = props.as || getComp(ElementKeys.ScrollKey) || "div";

    const renderLoading = () => {
      if (!Loading) {
        return null;
      }
      return (
        <Loading loading {...props.loadingOpts}>
          <div class={"pro-loading-dom"} />
        </Loading>
      );
    };

    const headerKeys = keys(PageHeader.props).filter((item) => item !== "showBack");

    return () => {
      const hasHeader = props.title || slots.title || props.subTitle || slots.subTitle || slots.extra;

      const footer = slots.footer?.();
      const hasFooter = !props.loading && isValidNode(footer);

      const cls = ["pro-page"];
      if (props.sub) cls.push("pro-page-sub");
      if (props.fillMode) cls.push("pro-page-fill");
      if (hasHeader) cls.push("has-header");
      if (hasFooter) cls.push("has-footer");

      return (
        <RComp class={cls}>
          {slots.start?.()}
          {hasHeader && (
            <PageHeader
              {...pick(props, headerKeys)}
              showBack={showBack.value}
              v-slots={omit(slots, "start", "default", "footer")}
            />
          )}

          <div class={"pro-page-content"}>{props.loading ? renderLoading() : slots.default?.()}</div>

          {hasFooter && <div class={"pro-page-footer"}>{footer}</div>}
        </RComp>
      );
    };
  },
});
