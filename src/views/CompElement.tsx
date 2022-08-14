import { defineComponent } from "vue";
import { ProForm, ProFormText, ProSubmitButton, ProFormSelect, ProSearchForm, ProTable } from "@vue-start/element-pro";
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
            console.log("##########onFinish", values);
          }}
          onFinishFailed={(invalidFields: any) => {
            console.log("##########onFinishFailed", invalidFields);
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
        <ProForm
          onFinish={(values: any) => {
            console.log("######", values);
          }}
          columns={columns as any}
          formElementMap={{ text: ProFormText, select: ProFormSelect }}>
          <ProSubmitButton>submit</ProSubmitButton>
        </ProForm>
        <ProSearchForm
          onFinish={(values: any) => {
            console.log("######search", values);
          }}
          columns={columns as any}
          formElementMap={{ text: ProFormText, select: ProFormSelect }}
          debounceKeys={["aaa"]}
        />
        <ProTable
          loading
          operate={{
            items: [
              {
                value: "detail",
                label: "detail",
                onClick: (record) => {
                  console.log("###detail", record);
                },
              },
              {
                value: "edit",
                label: "edit",
                onClick: (record) => {
                  console.log("###edit", record);
                },
              },
              {
                value: "delete",
                label: "delete",
                onClick: (record) => {
                  console.log("###delete", record);
                },
              },
            ],
          }}
          columns={[
            {
              title: "Date",
              dataIndex: "date",
              width: "180",
            },
            {
              title: "Name",
              dataIndex: "name",
              width: "180",
            },
            {
              title: "Address",
              dataIndex: "address",
            },
          ]}
          data={[
            {
              date: "2016-05-03",
              name: "Tom",
              address: "No. 189, Grove St, Los Angeles",
            },
            {
              date: "2016-05-02",
              name: "Tom",
              address: "No. 189, Grove St, Los Angeles",
            },
            {
              date: "2016-05-04",
              name: "Tom",
              address: "No. 189, Grove St, Los Angeles",
            },
            {
              date: "2016-05-01",
              name: "Tom",
              address: "No. 189, Grove St, Los Angeles",
            },
          ]}
        />
      </div>
    );
  };
});
