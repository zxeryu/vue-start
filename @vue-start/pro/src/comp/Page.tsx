import { defineComponent, ExtractPropTypes, ref } from "vue";
import { keys, pick } from "lodash";
import { useResizeObserver } from "@vue-start/hooks";
import { ElementKeys, useGetCompByKey } from "./comp";

const proPageHeaderProps = () => ({
  title: { type: String },
  subTitle: { type: String },
  showBack: Boolean,
  hideWhileNoHistory: { type: Boolean, default: true },
});

export type PageHeaderProps = Partial<ExtractPropTypes<ReturnType<typeof proPageHeaderProps>>>;

export const PageHeader = defineComponent({
  props: {
    ...proPageHeaderProps(),
  },
  setup: (props, { slots, emit }) => {
    return () => {
      const isShowBackHis =
        (props.hideWhileNoHistory && window.history?.state?.back) || props.hideWhileNoHistory === false;
      return (
        <div class={"pro-page-header"}>
          {props.showBack && isShowBackHis && (
            <div
              class={"pro-page-header-back"}
              onClick={() => {
                emit("back");
              }}>
              {slots.backIcon ? slots.backIcon() : "返回"}
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
  setup: (props, { slots, emit }) => {
    const getComp = useGetCompByKey();
    const Loading = getComp(ElementKeys.LoadingKey);

    const domRef = ref();
    const domHeiRef = ref(0);

    useResizeObserver(domRef, (entries) => {
      const rect = entries[0]?.contentRect;
      domHeiRef.value = rect?.height;
    });

    const headerKeys = keys(PageHeader.props);

    return () => {
      const hasHeader = props.title || slots.title || props.subTitle || slots.subTitle || slots.extra;
      const hasFooter = !!slots.footer;

      return (
        <div class={"pro-page"}>
          {hasHeader && (
            <PageHeader
              {...pick(props, headerKeys)}
              // @ts-ignore
              onBack={() => {
                emit("back");
              }}
              v-slots={pick(slots, "backIcon", "title", "subTitle", "space", "extra")}
            />
          )}
          {props.loading && Loading ? (
            <Loading loading {...props.loadingOpts}>
              <div class={"pro-loading-dom"} />
            </Loading>
          ) : (
            <div
              ref={domRef}
              style={domHeiRef.value > 0 ? `height:${domHeiRef.value > 0}` : ""}
              class={"pro-page-content"}>
              {props.fillMode ? <>{domHeiRef.value > 0 && slots.default?.()}</> : slots.default?.()}
            </div>
          )}
          {!props.loading && hasFooter && <div class={"pro-page-footer"}>{slots.footer?.()}</div>}
        </div>
      );
    };
  },
});
