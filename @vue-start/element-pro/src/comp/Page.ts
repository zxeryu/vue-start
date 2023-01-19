import { createPage, ProPageProps as ProPagePropsOrigin } from "@vue-start/pro";
import { ProLoading, ProLoadingProps } from "./Loading";
import { DefineComponent } from "vue";

export type ProPageProps = Omit<ProPagePropsOrigin, "loadingOpts"> & {
  loadingOpts?: ProLoadingProps;
};

export const ProPage: DefineComponent<ProPageProps> = createPage(ProLoading);
