import { isElementPlus } from "@/common/platform";

if (isElementPlus()) {
  import("./platform-element-plus");
} else {
  import("./platform-ant-design-vue");
}
