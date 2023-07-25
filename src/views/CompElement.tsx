import { defineComponent, reactive } from "vue";
import { CurdAction, ProCurd, ProModule, useModuleEvent, useProModule, ProConfig } from "@vue-start/pro";
import { ProFormSelect, ProFormText } from "@vue-start/element-pro";
import { ProCurdListConnect, ProForm, ProSearchForm, ProTable } from "@vue-start/pro";
import "element-plus/dist/index.css";
import { size } from "lodash";
import { useEffect } from "@vue-start/hooks";

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
      <ProConfig formElementMap={{ text: ProFormText, select: ProFormSelect }}>
        <div>
          content
          <ProForm
            operate={{}}
            onFinish={(values) => {
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
          </ProForm>
          <ProForm
            onFinish={(values: any) => {
              console.log("######", values);
            }}
            columns={columns as any}
            operate={{}}
          />
          <ProSearchForm
            onFinish={(values: any) => {
              console.log("######search", values);
            }}
            columns={columns as any}
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
            columns={
              [
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
                  children: [
                    { title: "Address1", dataIndex: "address1" },
                    { title: "Address2", dataIndex: "address2" },
                  ],
                },
              ] as any
            }
            dataSource={[
              {
                date: "2016-05-03",
                name: "Tom",
                address1: "No. 189, Grove St, Los Angeles",
                address2: "No. 189, Grove St, Los Angeles222",
              },
              {
                date: "2016-05-02",
                name: "Tom",
                address1: "No. 189, Grove St, Los Angeles",
              },
              {
                date: "2016-05-04",
                name: "Tom",
                address2: "No. 189, Grove St, Los Angeles",
              },
              {
                date: "2016-05-01",
                name: "Tom",
                address1: "No. 189, Grove St, Los Angeles",
              },
            ]}
          />
          <CurdTest />
          <ModuleTest />
        </div>
      </ProConfig>
    );
  };
});

const ModuleTestEvent = defineComponent(() => {
  const { state, dispatch } = useProModule();
  useEffect(() => {
    dispatch({ type: "label", payload: "sub-2-init" });
    setTimeout(() => {
      dispatch({ type: "label", payload: "sub-2-update" });
    }, 3000);
  }, []);
  useModuleEvent((event) => {
    console.log("#########", event.type, event.payload);
  });
  return () => {
    return (
      <button
        onClick={() => {
          dispatch({ type: "secShow", payload: !state.secShow });
        }}>
        显示/隐藏第二个组件
      </button>
    );
  };
});

const ModuleTest = defineComponent(() => {
  return () => {
    return (
      <ProModule
        elementMap={{
          Test1,
          Test2,
          Test3,
        }}
        elementConfigs={[
          {
            elementType: "Test1",
            elementId: "Test1",
          },
          {
            elementType: "Test2",
            elementId: "Test2",
            elementProps: {
              style: "color:red",
            },
            children: [
              {
                elementType: "Test3",
                elementId: "Test2-Test3",
                elementProps: {
                  label: {
                    elementType: "Test3",
                    elementId: "Test2-Test3-sub-1",
                    elementProps: {
                      label: "属性转换",
                    },
                  },
                },
                slots: {
                  text: () => "text-1",
                },
                highConfig$: {
                  registerPropsTrans: [
                    {
                      name: "label",
                    },
                  ],
                },
              },
              {
                elementType: "Test3",
                elementId: "Test2-Test3-2",
                elementProps: {
                  style: "color:pink;cursor:pointer",
                },
                slots: {
                  text: {
                    elementType: "Test3",
                    elementId: "Test2-Test3-2-slot",
                    elementProps: {
                      style: "color:blue;cursor:pointer",
                      label: "插槽转换",
                    },
                  },
                },
                highConfig$: {
                  registerStateList: [{ name: "label" }, { name: "secShow", mapName: "show$" }],
                  registerEventList: [{ name: "onClick" }],
                },
              },
              {
                elementType: "Test3",
                elementId: "Test2-Test3-3",
                elementProps: {
                  label: "sub-3",
                },
              },
            ],
          },
        ]}>
        <ModuleTestEvent />
      </ProModule>
    );
  };
});

const Test1 = defineComponent(() => {
  return () => {
    return <div>Test1</div>;
  };
});
const Test2 = defineComponent((_, { slots }) => {
  return () => {
    return (
      <div>
        Test2 default:
        {slots.default?.()}
        list:
        {slots.list?.()}
      </div>
    );
  };
});

const Test3 = defineComponent({
  props: {
    label: [String, Object],
  },
  setup: (props, { slots }) => {
    return () => {
      return (
        <span>
          {props.label}
          {slots?.text?.()}
        </span>
      );
    };
  },
});
