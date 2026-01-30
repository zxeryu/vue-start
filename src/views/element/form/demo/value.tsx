/*---
title: value格式定义、label配置
desc: 选择类组件（options）支持label配置，在onFinish中添加
---*/
import { defineComponent } from "vue";

export default defineComponent(() => {
  const options = [
    { label: "Man", value: "man" },
    { label: "Woman", value: "woman" },
    { label: "Other", value: "other" },
  ];

  const treeOptions = [
    {
      key: "v-1",
      value: "v-1",
      label: "l-1-label",
      children: [
        { key: "v-1-1", value: "v-1-1", label: "l-1-1-label" },
        { key: "v-1-2", value: "v-1-2", label: "l-1-2-label" },
      ],
    },
    {
      value: "v-2",
      label: "v-2-label",
      children: [
        { value: "v-2-1", label: "v-2-1-label" },
        { value: "v-2-2", label: "v-2-2-label" },
      ],
    },
  ];

  const columns = [
    {
      title: "gender",
      dataIndex: "gender",
      valueType: "select",
      formFieldProps: { options, multiple: true, separator$: "," },
      formExtra: {
        label: { name: "genderName", opts: {} },
      },
    },
    {
      title: "treeSelect",
      dataIndex: "treeOperate",
      valueType: "treeSelect",
      formFieldProps: { options: treeOptions, multiple: true, separator$: ",", itemSeparator$: "/" },
      formExtra: {
        label: { name: "treeOperateName", opts: {} },
      },
    },
    {
      title: "cascader",
      dataIndex: "treeOperate2",
      valueType: "cascader",
      formFieldProps: { options: treeOptions, emitPath: true, multiple: true, separator$: ",", itemSeparator$: "/" },
      formExtra: {
        label: { name: "treeOperate2Name", opts: { showAllPath: true } },
      },
    },
    {
      title: "checkbox",
      dataIndex: "checkbox",
      valueType: "checkbox",
      formFieldProps: { options, separator$: "," },
      formExtra: {
        label: { name: "checkboxName", opts: { multiple: true } },
      },
    },
    {
      title: "radio",
      dataIndex: "radio",
      valueType: "radio",
      formFieldProps: { options },
      formExtra: {
        label: { name: "radioName", opts: {} },
      },
    },
  ];

  return () => (
    <pro-form
      columns={columns}
      operate={{}}
      onFinish={(values: Record<string, any>) => {
        console.log("values", values);
      }}
    />
  );
});
