export const options = [
  { label: "Man", value: "man" },
  { label: "Woman", value: "woman" },
  { label: "Other", value: "other" },
];

export const treeOptions = [
  {
    key: "v-1",
    value: "v-1",
    label: "l-1-label",
    children: [
      {
        key: "v-1-1",
        value: "v-1-1",
        label: "l-1-1-label",
      },
      {
        key: "v-1-2",
        value: "v-1-2",
        label: "l-1-2-label",
      },
    ],
  },
  {
    value: "v-2",
    label: "v-2-label",
    children: [
      {
        value: "v-2-1",
        label: "v-2-1-label",
      },
      {
        value: "v-2-2",
        label: "v-2-2-label",
      },
    ],
  },
];

export const columns = [
  {
    title: "name",
    dataIndex: "name",
    formItemProps: {
      required: true,
      tip: "这是name",
    },
    formFieldProps: {
      showWordLimit: true,
      showCount: true,
      maxlength: 10,
    },
    search: true,
    formExtra: true,
  },
  {
    title: "age",
    dataIndex: "age",
    valueType: "digit",
    formItemProps: {
      rules: [{ required: true }],
      tip: "这是一个区间，自定义了placement:right",
      tipProps: { placement: "right" },
    },
    formFieldProps: {},
  },
  {
    title: "gender",
    dataIndex: "gender",
    valueType: "select",
    formItemProps: {
      required: true,
    },
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
    dataIndex: "treeOperate2",
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

export const columnStr = `
<pre class="hljs language-js"><code><span class="hljs-keyword">export</span> <span class="hljs-keyword">const</span> options = [
  { <span class="hljs-attr">label</span>: <span class="hljs-string">"Man"</span>, <span class="hljs-attr">value</span>: <span class="hljs-string">"man"</span> },
  { <span class="hljs-attr">label</span>: <span class="hljs-string">"Woman"</span>, <span class="hljs-attr">value</span>: <span class="hljs-string">"woman"</span> },
  { <span class="hljs-attr">label</span>: <span class="hljs-string">"Other"</span>, <span class="hljs-attr">value</span>: <span class="hljs-string">"other"</span> },
];

<span class="hljs-keyword">export</span> <span class="hljs-keyword">const</span> treeOptions = [
  {
    <span class="hljs-attr">key</span>: <span class="hljs-string">"v-1"</span>,
    <span class="hljs-attr">value</span>: <span class="hljs-string">"v-1"</span>,
    <span class="hljs-attr">label</span>: <span class="hljs-string">"l-1"</span>,
    <span class="hljs-attr">children</span>: [
      {
        <span class="hljs-attr">key</span>: <span class="hljs-string">"v-1-1"</span>,
        <span class="hljs-attr">value</span>: <span class="hljs-string">"v-1-1"</span>,
        <span class="hljs-attr">label</span>: <span class="hljs-string">"l-1-1"</span>,
      },
      {
        <span class="hljs-attr">key</span>: <span class="hljs-string">"v-1-2"</span>,
        <span class="hljs-attr">value</span>: <span class="hljs-string">"v-1-2"</span>,
        <span class="hljs-attr">label</span>: <span class="hljs-string">"l-1-2"</span>,
      },
    ],
  },
];

<span class="hljs-keyword">export</span> <span class="hljs-keyword">const</span> columns = [
  {
    <span class="hljs-attr">title</span>: <span class="hljs-string">"name"</span>,
    <span class="hljs-attr">dataIndex</span>: <span class="hljs-string">"name"</span>,
    <span class="hljs-attr">formItemProps</span>: {
      <span class="hljs-attr">rules</span>: [{ <span class="hljs-attr">required</span>: <span class="hljs-literal">true</span>, <span class="hljs-attr">message</span>: <span class="hljs-string">"请输入name"</span> }],
    },
    <span class="hljs-attr">formFieldProps</span>: {},
    <span class="hljs-attr">search</span>: <span class="hljs-literal">true</span>,
    <span class="hljs-attr">formExtra</span>: <span class="hljs-literal">true</span>,
  },
  {
    <span class="hljs-attr">title</span>: <span class="hljs-string">"age"</span>,
    <span class="hljs-attr">dataIndex</span>: <span class="hljs-string">"age"</span>,
    <span class="hljs-attr">valueType</span>: <span class="hljs-string">"digit"</span>,
    <span class="hljs-attr">formItemProps</span>: {
      <span class="hljs-attr">rules</span>: [{ <span class="hljs-attr">required</span>: <span class="hljs-literal">true</span>, <span class="hljs-attr">message</span>: <span class="hljs-string">"请输入年龄"</span> }],
    },
    <span class="hljs-attr">formFieldProps</span>: {},
  },
  {
    <span class="hljs-attr">title</span>: <span class="hljs-string">"gender"</span>,
    <span class="hljs-attr">dataIndex</span>: <span class="hljs-string">"gender"</span>,
    <span class="hljs-attr">valueType</span>: <span class="hljs-string">"select"</span>,
    <span class="hljs-attr">formFieldProps</span>: {
      options,
    },
    <span class="hljs-attr">search</span>: <span class="hljs-literal">true</span>,
  },
  {
    <span class="hljs-attr">title</span>: <span class="hljs-string">"treeSelect"</span>,
    <span class="hljs-attr">dataIndex</span>: <span class="hljs-string">"treeOperate"</span>,
    <span class="hljs-attr">valueType</span>: <span class="hljs-string">"treeSelect"</span>,
    <span class="hljs-attr">formFieldProps</span>: {
      <span class="hljs-attr">data</span>: treeOptions,
    },
  },
  {
    <span class="hljs-attr">title</span>: <span class="hljs-string">"cascader"</span>,
    <span class="hljs-attr">dataIndex</span>: <span class="hljs-string">"treeOperate"</span>,
    <span class="hljs-attr">valueType</span>: <span class="hljs-string">"cascader"</span>,
    <span class="hljs-attr">formFieldProps</span>: {
      <span class="hljs-attr">options</span>: treeOptions,
    },
  },
  {
    <span class="hljs-attr">title</span>: <span class="hljs-string">"birthday"</span>,
    <span class="hljs-attr">dataIndex</span>: <span class="hljs-string">"birthday"</span>,
    <span class="hljs-attr">valueType</span>: <span class="hljs-string">"date"</span>,
    <span class="hljs-attr">formFieldProps</span>: {},
  },
  {
    <span class="hljs-attr">title</span>: <span class="hljs-string">"checkbox"</span>,
    <span class="hljs-attr">dataIndex</span>: <span class="hljs-string">"checkbox"</span>,
    <span class="hljs-attr">valueType</span>: <span class="hljs-string">"checkbox"</span>,
    <span class="hljs-attr">formFieldProps</span>: {
      options,
    },
  },
  {
    <span class="hljs-attr">title</span>: <span class="hljs-string">"radio"</span>,
    <span class="hljs-attr">dataIndex</span>: <span class="hljs-string">"radio"</span>,
    <span class="hljs-attr">valueType</span>: <span class="hljs-string">"radio"</span>,
    <span class="hljs-attr">formFieldProps</span>: {
      options,
    },
  },
  {
    <span class="hljs-attr">title</span>: <span class="hljs-string">"digitRange"</span>,
    <span class="hljs-attr">dataIndex</span>: <span class="hljs-string">"digitRange"</span>,
    <span class="hljs-attr">valueType</span>: <span class="hljs-string">"digitRange"</span>,
  },
];

<span class="hljs-keyword">export</span> <span class="hljs-keyword">const</span> dataSource = [
  {
    <span class="hljs-attr">id</span>: <span class="hljs-string">"1"</span>,
    <span class="hljs-attr">name</span>: <span class="hljs-string">"aaa"</span>,
    <span class="hljs-attr">age</span>: <span class="hljs-number">18</span>,
    <span class="hljs-attr">gender</span>: <span class="hljs-string">"man"</span>,
    <span class="hljs-attr">treeOperate</span>: <span class="hljs-string">"v-1-1"</span>,
    <span class="hljs-attr">birthday</span>: <span class="hljs-string">"2020-01-01"</span>,
    <span class="hljs-attr">dateRange</span>: [<span class="hljs-string">"2020-01-01"</span>, <span class="hljs-string">"2020-02-02"</span>],
    <span class="hljs-attr">time</span>: <span class="hljs-string">"12:12:12"</span>,
    <span class="hljs-attr">timeRange</span>: [<span class="hljs-string">"00:00:00"</span>, <span class="hljs-string">"12:59:59"</span>],
    <span class="hljs-attr">checkbox</span>: [<span class="hljs-string">"man"</span>, <span class="hljs-string">"other"</span>],
    <span class="hljs-attr">radio</span>: <span class="hljs-string">"other"</span>,
    <span class="hljs-attr">digitRange</span>: [<span class="hljs-number">1</span>, <span class="hljs-number">10</span>],
  },
  { <span class="hljs-attr">id</span>: <span class="hljs-string">"2"</span>, <span class="hljs-attr">name</span>: <span class="hljs-string">"bbb"</span>, <span class="hljs-attr">age</span>: <span class="hljs-number">18</span>, <span class="hljs-attr">gender</span>: <span class="hljs-string">"woman"</span> },
];
</code></pre>
`;
