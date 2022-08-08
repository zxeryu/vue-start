import { defineComponent } from "vue";
import {
  ProForm,
  ProFormText,
  ProSubmitButton,
  ProFormSelect,
  ProSearchForm,
  ProSchemaForm,
} from "@vue-start/element-pro";
import "element-plus/dist/index.css";

export default defineComponent(() => {
  const columns = [
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
        content
        <ProForm
          onFinish={(values: Record<string, any>) => {
            console.log("##########", values);
          }}
          onFinishFailed={(invalidFields: any) => {
            console.log("##########", invalidFields);
          }}>
          <ProFormText name={"name"} label={"Name"} rules={[{ required: true, message: "required" }]} />
          <ProFormText name={"area"} label={"Area"} fieldProps={{ type: "textarea" }} />
          <ProFormSelect
            name={"select"}
            label={"Select"}
            rules={[{ required: true, message: "required" }]}
            fieldProps={{
              options: [
                { value: "aaa", label: "aaa" },
                { value: "bbb", label: "bbb" },
              ],
            }}
          />

          <ProSubmitButton>提交</ProSubmitButton>
        </ProForm>
        <ProSchemaForm
          onFinish={(values: any) => {
            console.log("######", values);
          }}
          columns={columns}
          formElementMap={{ text: ProFormText, select: ProFormSelect }}>
          <ProSubmitButton>submit</ProSubmitButton>
        </ProSchemaForm>
        <ProSearchForm
          onFinish={(values: any) => {
            console.log("######search", values);
          }}
          columns={columns as any}
          formElementMap={{ text: ProFormText, select: ProFormSelect }}
          debounceKeys={["aaa"]}
        />
      </div>
    );
  };
});
