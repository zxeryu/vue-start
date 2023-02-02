# Curd

基于 provide/inject 实现的一种模式，旨在实现基础的 CURD 功能，但又不仅限于此。

```
整体思路：
- 将定义好的配置或状态存放在 provide 中
- 在不同的场景中修改 provide 中的状态
- 在组件中根据状态或配置展示相对应的视图状态
```

- 支持通用配置
- 支持网络请求
- 支持网络状态（请求发起、请求结果等）配置
- 满足列表场景（搜索、分页、删除等功能）

```
1、LIST-EXECUTE：
   发起列表请求
2、ADD-EXECUTE：
   发起添加请求
3、EDIT-EXECUTE：
   发起添加请求
4、DELETE-EXECUTE：
   发起删除请求
```

## API

### 属性

| 名称             | 说明        | 类型                 | 默认值 |
| ---------------- | ----------- | -------------------- | ------ |
| `curdState`      | 状态        | `ICurdState`         | --     |
| `columns`        | 通用项配置  | `TColumns`           | --     |
| `columnState`    | 通用项拓展  | `object`             | --     |
| `elementMap`     | 展示组件集  | `object`             | --     |
| `formElementMap` | 录入组件集  | `object`             | --     |
| `rowKey`         | 唯一 id     | `string`             | --     |
| `operates`       | 操作配置    | `ICurdOperateOpts[]` | --     |
| `listProps`      | 列表 props  | `object`             | --     |
| `formProps`      | form props  | `object`             | --     |
| `descProps`      | desc props  | `object`             | --     |
| `modalProps`     | modal props | `object`             | --     |

```ts
export interface ICurdState extends Record<string, any> {
  //list
  listLoading?: boolean; //列表加载状态
  listData?: IListData;
  //mode
  mode?: ICurdCurrentMode;
  //detail add edit
  detailLoading?: boolean; //详情加载状态
  detailData?: Record<string, any>; //详情数据
  //add edit
  operateLoading?: boolean; //修改、保存 等等
  addAction?: ICurdAddAction;
}

/**
 * curd 5种基础Action
 */
export enum CurdAction {
  LIST = "LIST",
  DETAIL = "DETAIL",
  ADD = "ADD",
  EDIT = "EDIT",
  DELETE = "DELETE",
}

export type ICurdAction = keyof typeof CurdAction | string;

/**
 * CurdAction 的子事件
 */
export enum CurdSubAction {
  EMIT = "EMIT", //事件触发
  EXECUTE = "EXECUTE", //add、edit完成提交 发起网络请求
  PAGE = "PAGE", //Page模式下事件
  SUCCESS = "SUCCESS", //请求成功
  FAIL = "FAIL", //请求失败
}

export type ICurdSubAction = keyof typeof CurdSubAction;

/**
 * curd 操作模式
 */
export enum CurdCurrentMode {
  ADD = "ADD",
  EDIT = "EDIT",
  DETAIL = "DETAIL",
}

export type ICurdCurrentMode = keyof typeof CurdCurrentMode | string;

export interface ICurdOperateOpts {
  action: ICurdAction; //类型，由当前程序赋值
  //网络请求相关
  actor?: IRequestActor;
  stateName?: string; //如果设置，将在curdState中维护[stateName]数据 请求返回数据
  loadingName?: string; //如果设置，将在curdState中维护[loadingName]数据 请求状态 boolean类型
  convertParams?: (...params: any[]) => Record<string, any>; //请求参数转换
  convertData?: (actor: IRequestActor) => Record<string, any>; //请求结果转换
  onSuccess?: (actor?: IRequestActor) => void; //请求成功回调
  onFailed?: (actor?: IRequestActor) => void; //请求失败回调
  // table operate相关 （生效模式 DETAIL EDIT DELETE）
  // 详见 ProTable IOperateItem
}
```

### 方法

| 名称            | 说明           | 类型                                                      |
| --------------- | -------------- | --------------------------------------------------------- |
| `sendCurdEvent` | 发送 curd 事件 | `(event: TCurdActionEvent) => void`                       |
| `refreshList`   | 刷新列表       | `(extra?: Record<string, any>) => void`                   |
| `sendRequest`   | 发送网络请求   | `(requestNameOrAction: string, ...params: any[]) => void` |

### useProCurd

```ts
export interface IProCurdProvide {
  columns: Ref<TColumns>;
  getSignColumns: (signName: string) => TColumns; //获取标记的column
  elementMap: TElementMap;
  formElementMap: TElementMap;
  //
  rowKey: string;
  curdState: UnwrapNestedRefs<ICurdState>;
  formColumns: Ref<TColumns>;
  descColumns: Ref<TColumns>;
  tableColumns: Ref<TColumns>;
  searchColumns: Ref<TColumns>;
  //发送curd事件
  sendCurdEvent: (event: TCurdActionEvent) => void;
  //获取配置的operate
  getOperate: (action: ICurdAction) => ICurdOperateOpts | undefined;
  //刷新列表
  refreshList: (extra?: Record<string, any>) => void;
  /******************子组件参数*******************/
  listProps?: ComputedRef<Record<string, any> | undefined>;
  formProps?: ComputedRef<Record<string, any> | undefined>;
  descProps?: ComputedRef<Record<string, any> | undefined>;
  modalProps?: ComputedRef<Record<string, any> | undefined>;
}
```

## ModalCurd

- 基于 Curd
- 单页面弹窗操作场景适用
- 处理了添加、编辑触发事件；添加、编辑、删除请求成功事件

```
1、DETAIL-EMIT：
    curdState.mode = CurdCurrentMode.DETAIL
    发起详情接口请求（若未配置，使用table record作为详情数据）
2、ADD-EMIT：
    curdState.mode = CurdCurrentMode.ADD
    curdState.detailData = props.defaultAddRecord || {}
3、ADD-SUCCESS：
    列表刷新到第一页
    curdState.mode = undefined
4、EDIT-EMIT：
    curdState.mode = CurdCurrentMode.EDIT
    发起详情接口请求（若未配置，使用table record作为详情数据）
5、EDIT-SUCCESS：
    列表刷新当前页
    curdState.mode = undefined
6、DELETE-SUCCESS：
    列表刷新当前页
```

## Curd 组件

根据 provide 中提供的配置和状态 处理不同的逻辑 或 展示不同的组件。

### CurdList

SearchForm Table Pagination 三个组件组合成的复合组件

#### 属性

| 名称              | 说明                          | 类型      | 默认值 |
| ----------------- | ----------------------------- | --------- | ------ |
| `searchProps`     | SearchForm props              | `object`  | --     |
| `tableProps`      | Table props                   | `object`  | --     |
| `paginationProps` | Pagination props              | `object`  | --     |
| `showPagination`  | 是否展示分页                  | `boolean` | true   |
| `pageState`       | 分页状态                      | `object`  | --     |
| `extraInSearch`   | extra 插槽是否放入 SearchForm | `boolean` | false  |

#### 插槽

| 名称         | 说明                  |
| ------------ | --------------------- |
| `start`      | start                 |
| `search`     | 覆盖默认的 SearchForm |
| `divide`     | SearchForm 之后渲染   |
| `table`      | 覆盖默认的 Table      |
| `divide2`    | Table 之后渲染        |
| `pagination` | 覆盖默认的 Pagination |
| `end`        | end                   |

### CurdForm

继承 Form 的所有配置。

#### 属性

| 名称        | 说明                              | 类型     | 默认值     |
| ----------- | --------------------------------- | -------- | ---------- |
| `signName`  | column 中标记的属性名             | `string` | --         |
| `modelName` | model 取值， curdState 中的属性名 | `string` | detailData |

### CurdDesc

### CurdModal
