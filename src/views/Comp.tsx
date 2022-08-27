import { defineComponent, ref } from "vue";
import { ProForm, ProFormText, ProFormTextArea, ProFormSelect, ProFormList, ProSearchForm } from "@vue-start/antd-pro";
import { Button } from "ant-design-vue";

import "ant-design-vue/dist/antd.css";

export const Comp = defineComponent(() => {
  const formRef = ref();

  const columns: any = [
    { title: "aaa", dataIndex: "aaa", valueType: "text" },
    {
      title: "select",
      dataIndex: "select",
      valueType: "select",
      formItemProps: {
        rules: [{ required: true }],
      },
      formFieldProps: {
        options: [
          { value: "aaa", label: "aaa" },
          { value: "bbb", label: "bbb" },
        ],
      },
    },
  ];

  return () => {
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
        <ProForm
          onFinish={(values) => {
            console.log("######", values);
          }}
          columns={columns}
          formElementMap={{ text: ProFormText, select: ProFormSelect }}>
          <div>
            <Button type={"primary"} htmlType={"submit"}>
              submit
            </Button>
          </div>
        </ProForm>
        <ProSearchForm
          onFinish={(values) => {
            console.log("######search", values);
          }}
          columns={columns}
          formElementMap={{ text: ProFormText, select: ProFormSelect }}
          debounceKeys={["aaa"]}
        />
      </div>
    );
  };
});

export default Comp;
