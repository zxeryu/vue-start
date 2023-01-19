import { DefineComponent } from "vue";
import { createPage, ProPageProps as ProPagePropsOrigin } from "@vue-start/pro";
import { ProLoading, ProLoadingProps } from "./Loading";

export type ProPageProps = Omit<ProPagePropsOrigin, "loadingOpts"> & {
  loadingOpts?: ProLoadingProps;
};

export const ProPage: DefineComponent<ProPageProps> = createPage(ProLoading);
