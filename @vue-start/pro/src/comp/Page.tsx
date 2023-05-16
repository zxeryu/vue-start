import { defineComponent, ExtractPropTypes, PropType, VNode } from "vue";
import { keys, omit, pick } from "lodash";
import { ElementKeys, useGetCompByKey } from "./comp";
import { useRouter } from "vue-router";

const proPageHeaderProps = () => ({
  title: { type: String },
  subTitle: { type: String },
  showBack: Boolean,
  //没有history的时候隐藏back
  hideWhileNoHistory: { type: Boolean, default: true },
  onBackClick: { type: Function },
  //render dom
  renderBackIcon: { type: Function as PropType<() => VNode>, default: () => "返回" },
});

export type PageHeaderProps = Partial<ExtractPropTypes<ReturnType<typeof proPageHeaderProps>>>;

const PageHeader = defineComponent({
  props: {
    ...proPageHeaderProps(),
  },
  setup: (props, { slots }) => {
    const router = useRouter();

    const handleOnBackClick = () => {
      if (props.onBackClick) {
        props.onBackClick?.();
        return;
      }
      router.back();
    };

    return () => {
      const isShowBackHis =
        (props.hideWhileNoHistory && window.history?.state?.back) || props.hideWhileNoHistory === false;
      return (
        <div class={"pro-page-header"}>
          {props.showBack && isShowBackHis && (
            <div class={"pro-page-header-back"} onClick={handleOnBackClick}>
              {slots.backIcon ? slots.backIcon() : props.renderBackIcon?.()}
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
});

export type ProPageProps = Partial<ExtractPropTypes<ReturnType<typeof proPageProps>>> & PageHeaderProps;

export const ProPage = defineComponent<ProPageProps>({
  props: {
    ...PageHeader.props,
    ...proPageProps(),
  },
  setup: (props, { slots }) => {
    const getComp = useGetCompByKey();
    const Loading = getComp(ElementKeys.LoadingKey);

    const headerKeys = keys(PageHeader.props);

    return () => {
      const hasHeader = props.title || slots.title || props.subTitle || slots.subTitle || slots.extra;
      const hasFooter = !!slots.footer;

      return (
        <div class={`pro-page ${props.fillMode ? "pro-page-fill" : ""}`}>
          {slots.start?.()}
          {hasHeader && <PageHeader {...pick(props, headerKeys)} v-slots={omit(slots, "start", "default", "footer")} />}
          <div class={"pro-page-content"}>
            {props.loading ? (
              Loading ? (
                <Loading loading {...props.loadingOpts}>
                  <div class={"pro-loading-dom"} />
                </Loading>
              ) : null
            ) : (
              slots.default?.()
            )}
          </div>
          {!props.loading && hasFooter && <div class={"pro-page-footer"}>{slots.footer?.()}</div>}
        </div>
      );
    };
  },
});
