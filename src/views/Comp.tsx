import { defineComponent, ref } from "vue";
import { ProForm, ProFormText, ProFormTextArea, ProFormSelect, ProFormList } from "@vue-start/antd-pro";
import { Button } from "ant-design-vue";

export const Comp = defineComponent(() => {
  const formRef = ref();

  return () => {
    console.log("##########", formRef.value);
    return (
      <div>
        <ProForm
          ref={formRef}
          onFinish={(values) => {
            console.log("###", values);
          }}>
          <ProFormText name={"name"} label={"Name"} rules={[{ required: true }]} />
          <ProFormTextArea name={"area"} label={"Area"} />
          <ProFormSelect
            name={"select"}
            label={"Select"}
            fieldProps={{
              options: [
                { value: "aaa", label: "aaa" },
                { value: "bbb", label: "bbb" },
              ],
            }}
          />
          <ProFormList name={"list"}>
            <div style={{ display: "flex" }}>
              <ProFormText name={"a"} label={"a"} rules={[{ required: true }]} />
              <ProFormText name={"b"} label={"b"} />
              <ProFormText name={"c"} label={"c"} />
            </div>
          </ProFormList>

          <Button type={"primary"} htmlType={"submit"}>
            submit
          </Button>
        </ProForm>
      </div>
    );
  };
});

export default Comp;
