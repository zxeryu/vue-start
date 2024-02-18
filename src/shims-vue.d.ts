import { Events } from "@vue/runtime-dom";
import { CSSInterpolation } from "@emotion/serialize";

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}


declare module "vue" {
  export interface HTMLAttributes extends AriaAttributes, EventHandlers<Events> {
    css?: CSSInterpolation;
  }
}
