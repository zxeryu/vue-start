# demo 中使用的公共数据

```js
export const options = [
  { label: "Man", value: "man" },
  { label: "Woman", value: "woman" },
  { label: "Other", value: "other" },
];

export const treeOptions = [
  {
    key: "v-1",
    value: "v-1",
    label: "l-1",
    children: [
      {
        key: "v-1-1",
        value: "v-1-1",
        label: "l-1-1",
      },
      {
        key: "v-1-2",
        value: "v-1-2",
        label: "l-1-2",
      },
    ],
  },
];

export const columns = [
  {
    title: "name",
    dataIndex: "name",
    formItemProps: {
      rules: [{ required: true, message: "请输入name" }],
    },
    formFieldProps: {},
    search: true,
    formExtra: true,
  },
  {
    title: "age",
    dataIndex: "age",
    valueType: "digit",
    formItemProps: {
      rules: [{ required: true, message: "请输入年龄" }],
    },
    formFieldProps: {},
  },
  {
    title: "gender",
    dataIndex: "gender",
    valueType: "select",
    formFieldProps: {
      options,
    },
    search: true,
  },
  {
    title: "treeSelect",
    dataIndex: "treeOperate",
    valueType: "treeSelect",
    formFieldProps: {
      data: treeOptions,
    },
  },
  {
    title: "cascader",
    dataIndex: "treeOperate",
    valueType: "cascader",
    formFieldProps: {
      options: treeOptions,
    },
  },
  {
    title: "birthday",
    dataIndex: "birthday",
    valueType: "date",
    formFieldProps: {},
  },
  {
    title: "checkbox",
    dataIndex: "checkbox",
    valueType: "checkbox",
    formFieldProps: {
      options,
    },
  },
  {
    title: "radio",
    dataIndex: "radio",
    valueType: "radio",
    formFieldProps: {
      options,
    },
  },
  {
    title: "digitRange",
    dataIndex: "digitRange",
    valueType: "digitRange",
  },
];

export const dataSource = [
  {
    id: "1",
    name: "aaa",
    age: 18,
    gender: "man",
    treeOperate: "v-1-1",
    birthday: "2020-01-01",
    dateRange: ["2020-01-01", "2020-02-02"],
    time: "12:12:12",
    timeRange: ["00:00:00", "12:59:59"],
    checkbox: ["man", "other"],
    radio: "other",
    digitRange: [1, 10],
  },
  { id: "2", name: "bbb", age: 18, gender: "woman" },
];
```
