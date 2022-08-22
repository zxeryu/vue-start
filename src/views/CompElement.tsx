import { defineComponent, reactive } from "vue";
import { CurdAction, ProCurd } from "@vue-start/pro";
import {
  ProCurdListConnect,
  ProForm,
  ProFormSelect,
  ProFormText,
  ProSearchForm,
  ProSubmitButton,
  ProTable,
} from "@vue-start/element-pro";
import "element-plus/dist/index.css";
import { size } from "lodash";

const CurdTest = defineComponent(() => {
  const curdState = reactive({
    listData: {
      total: 5,
      dataSource: [
        {
          name: "@vue-start/hooks",
          scope: "vue-start",
          version: "0.2.5",
          description: "> TODO: description",
        },
        {
          name: "@vue-start/pro",
          scope: "vue-start",
          version: "0.2.0",
          description: "> TODO: description",
        },
        {
          name: "@vue-start/store",
          scope: "vue-start",
          version: "0.1.3",
          description: "> TODO: description",
        },
        {
          name: "@vue-start/request",
          scope: "vue-start",
          version: "0.1.9",
          description: "> TODO: description",
        },
        {
          name: "@vue-start/element-pro",
          scope: "vue-start",
          version: "0.1.2",
          description: "> TODO: description",
        },
      ],
    },
  });

  const columns = [
    {
      title: "name",
      dataIndex: "name",
      search: true,
    },
    {
      title: "version",
      dataIndex: "version",
    },
    {
      title: "description",
      dataIndex: "description",
    },
  ];

  return () => {
    return (
      <ProCurd
        curdState={curdState}
        formElementMap={{ text: ProFormText, select: ProFormSelect }}
        columns={columns}
        operates={[
          {
            action: CurdAction.LIST,
            convertParams: () => {
              return { q: "vue-start" };
            },
            convertData: (actor) => {
              const data = actor.res?.data;
              return {
                dataSource: data,
                total: size(data),
              };
            },
          },
          {
            action: CurdAction.ADD,
            show: true,
          },
          {
            action: CurdAction.DETAIL,
            show: true,
          },
          {
            action: CurdAction.EDIT,
            show: true,
          },
        ]}
        listProps={{
          tableProps: {
            // style: "height:300px",
            serialNumber: true,
            operate: {
              items: [{ show: true, value: "delay", label: "延期" }],
            },
          },
        }}>
        <ProCurdListConnect />
      </ProCurd>
    );
  };
});

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
          serialNumber
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
        <CurdTest />
      </div>
    );
  };
});
