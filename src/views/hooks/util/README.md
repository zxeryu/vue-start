# util

## generateId

生成唯一 id

```ts
const generateId: () => string;
```

```ts
// eg：
const id = generateId();
```

## decimalLen

获取小数位数

```ts
const decimalLen: (value: number | string) => number;
```

```ts
// eg：
decimalLen(12.123);
//=> 3
```

## decimalFixed

保留小数位数

```ts
const decimalFixed = (
  value: number | string,
  length?: number, //默认保留 2 位
) => string;
```

```ts
// eg：
const v = decimalFixed(12.123);
//=> 12.12
```

## thousandDivision

千分位处理

```ts
const thousandDivision = (value: string | number) => string | number;
```

```ts
// eg
const v = thousandDivision(1234567.123);
//=> 1,234,567.123
```

## enumToOptions

object 对象转 options

```ts
const enumToOptions: (enumObj: Record<string, string>, displayEnumObj: (v: string) => string) => TOptions;
```

```ts
//eg：
const enumObj = {
  YES: "YES",
  NO: "NO",
};
const displayEnumObj = (v) => {
  return {
    YES: "是",
    NO: "否",
  }[v];
};
enumToOptions(enumObj, displayEnumObj);
//=>
// [
//   { value: "YES", label: "是" },
//   { value: "NO", label: "否" },
// ];
```

## listToOptions

list 转 options

```ts
const listToOptions: (
  list: Record<string, any>[], //数据列表
  fieldNames?: FieldNames, //对应属性名称
  rewriteProps?: TRewriteProps, //额外属性
) => TOptions;
```

```ts
//eg：
const list = [
  { id: "YES", name: "是", extra: "1" },
  { id: "NO", name: "否", extra: "2" },
];
listToOptions(list, { value: "id", label: "name" });
//=>
// [
//   { value: "YES", label: "是" },
//   { value: "NO", label: "否" },
// ]

listToOptions(list, { value: "id", label: "name" }, (item) => ({ disabled: item.extra === "1" }));
//=>
// [
//   { value: "YES", label: "是", disabled: true },
//   { value: "NO", label: "否", disabled: false },
// ];
```

## listToOptionsMap

list 转键值对

```ts
const listToOptionsMap: (
  list: Record<string, any>[], //数据列表
  fieldNames?: FieldNames, //对应属性名称
  isItemObj?: boolean, // true，值为对象；false，值为label
) => Record<string, any>;
```

```ts
//eg：
const list = [
  { id: "YES", name: "是", extra: "1" },
  { id: "NO", name: "否", extra: "2" },
];
listToOptionsMap(list, { value: "id", label: "name" });
//=>
// {
//   YES: "是",
//   NO: "否",
// };

listToOptionsMap(list, { value: "id", label: "name" }, true);
//=>
// {
//   YES: { id: "YES", name: "是", extra: "1" },
//   NO: { id: "NO", name: "否", extra: "2" },
// };
```

## treeToOptions

tree 数据转 options

```ts
const treeToOptions: (
  treeData: Record<string, any>[], //tree数据
  fieldNames?: FieldNames,
  rewriteProps?: TRewriteProps,
) => TreeOptions;
```

```ts
//eg：
const treeData = [
  {
    id: "1",
    name: "菜单",
    child: [
      { id: "1-1", name: "子菜单一" },
      { id: "1-2", name: "子菜单二" },
    ],
  },
  {
    id: "2",
    name: "菜单二",
  },
];
treeToOptions(treeData, { value: "id", label: "name", children: "child" });
//=>
// [
//   {
//     value: "1",
//     label: "菜单",
//     children: [
//       { value: "1-1", label: "子菜单一" },
//       { value: "1-2", label: "子菜单二" },
//     ],
//   },
//   {
//     value: "2",
//     label: "菜单二",
//   },
// ];
```

## treeToOptionsMap

tree 数据转键值对

```ts
const treeToOptionsMap: (
  treeData: Record<string, any>[], //tree数据
  fieldNames: FieldNames | undefined,
  mapObj: Record<string, string | number> | undefined = {}, //键值对 对象 值为label
  itemMapObj?: Record<string, any> | undefined, //键值对 对象 值为对象
) => Record<string, any>;
```

```ts
//eg：
const treeData = [
  {
    id: "1",
    name: "菜单",
    child: [
      { id: "1-1", name: "子菜单一" },
      { id: "1-2", name: "子菜单二" },
    ],
  },
  {
    id: "2",
    name: "菜单二",
  },
];
const mapObj = {};
const itemMapObj = {};
treeToOptionsMap(treeData, { value: "id", label: "name", children: "child" }, mapObj, itemMapObj);
//=> mapObj
// {
//   "1": "菜单",
//   "1-1": "子菜单一",
//   "1-2": "子菜单二",
//   "2": "菜单二",
// };

//=> itemMapObj
// {
//   "1": { id: "1", name: "菜单" },
//   "1-1": { id: "1-1", name: "子菜单一" },
//   "1-2": { id: "1-2", name: "子菜单二" },
//   "2": { id: "2", name: "菜单二" },
// };
```
