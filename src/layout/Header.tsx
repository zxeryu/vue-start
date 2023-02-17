import { defineComponent, ref } from "vue";
import DemoData from "@/views/column/index-md";
import { useConfig } from "@vue-start/config";

const DemoDataModal = defineComponent(() => {
  const visibleRef = ref(false);

  return () => {
    return (
      <>
        <pro-modal v-model:visible={visibleRef.value} title={"demo数据"}>
          <DemoData />
        </pro-modal>
        <el-button
          onClick={() => {
            visibleRef.value = !visibleRef.value;
          }}>
          demo数据
        </el-button>
      </>
    );
  };
});

export const Header = defineComponent(() => {
  const { VITE_APP_TITLE } = useConfig();

  return () => {
    return (
      <header class="shadow flex items-center px-5" style="height:var(--header-hei)">
        {VITE_APP_TITLE} &nbsp;
        <DemoDataModal />
      </header>
    );
  };
});
