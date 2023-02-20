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
//=> [{value:"YES",label:"是"},{value:"NO",label:"否"}]
```

## enumToOptions

list 转 options

```ts
const listToOptions: (
  list: Record<string, any>[], //原始列表
  fieldNames?: FieldNames, //key对应名称
  rewriteProps?: TRewriteProps, //额外属性
) => TOptions;
```

```ts
//eg：
const list = [
  { id: "YES", name: "是", extra: "1" },
  { id: "NO", name: "否", extra: "2" },
];
listToOptions(list, { value: "value", label: "label" });
//=> [{value:"YES",label:"是"},{value:"NO",label:"否"}]

listToOptions(list, { value: "value", label: "label" }, (item) => ({ disabled: item.extra === "1" }));
//=> [{value:"YES",label:"是",disabled:true},{value:"NO",label:"否",disabled:false}]
```
