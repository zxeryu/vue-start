# @vue-start/hooks 使用指南

`@vue-start/hooks` 是一套基于 Vue3 Composition API 的 Hooks 工具库，提供了一系列常用的响应式状态管理和 DOM 操作 Hooks。

## 安装

```bash
pnpm add @vue-start/hooks
```

## 文档组织

Hooks 和工具函数按功能域分为以下几类：

| 类别 | 说明 |
|------|------|
| 状态管理类 | useState、useToggle、useBoolean、useMemo 等 |
| 副作用类 | useEffect、useWatch 等 |
| DOM 操作类 | useClickAway、useEventListener、useHover 等 |
| 工具类 | useUpdateKey、useRuleState 等 |
| 工具函数 | base、collection、options、number、menu、vue3、timer、file、path、pattern |

## 核心 Hooks

### 状态管理类

#### useToggle

状态切换 Hook，支持双向切换。

```ts
import { useToggle } from "@vue-start/hooks";

// 默认 boolean 切换
const [state, { toggle, setLeft, setRight }] = useToggle(): [
  Ref<boolean>,
  { toggle: () => void; setLeft: () => void; setRight: () => void }
];

// 指定初始值
const [state, actions] = useToggle(true): [Ref<boolean>, ToggleActions];

// 指定两个值切换
const [state, actions] = useToggle<T1, T2>(left: T1, right: T2): [Ref<T1 | T2>, ToggleActions<T1, T2>];
```

#### useBoolean

布尔值状态管理，基于 useToggle 封装。

```ts
import { useBoolean } from "@vue-start/hooks";

const [isVisible, { toggle, setTrue, setFalse }] = useBoolean(false): [
  Ref<boolean>,
  { toggle: () => void; setTrue: () => void; setFalse: () => void }
];
```

#### useState

响应式状态管理，解决 ref 的 .value 访问问题。

```ts
import { useState } from "@vue-start/hooks";

const [state, setState] = useState<T>(initialValue: T): [Ref<T>, (value: T) => void];

// 快速为 reactive 对象赋值
const setReactiveValue = (r: Record<string, any>, obj: Record<string, any>) => void;
```

#### useSet

Set 数据结构的状态管理。

```ts
import { useSet } from "@vue-start/hooks";

const [set, { add, remove, reset, has }] = useSet<T>(initial?: T[]): [
  Ref<Set<T>>,
  {
    add: (item: T) => void;
    remove: (item: T) => void;
    reset: (items?: T[]) => void;
    has: (item: T) => boolean;
  }
];
```

#### useStorageState

localStorage 状态持久化。

```ts
import { useStorageState } from "@vue-start/hooks";

const [state, setState] = useStorageState<T>(key: string, defaultValue: T): [Ref<T>, (v: T) => void];
```

#### useMemo

计算缓存，依赖变化时重新计算。

```ts
import { useMemo } from "@vue-start/hooks";

const result = useMemo<T>(factory: () => T, deps: WatchSource[]): Ref<T>;
```

### 副作用类

#### useEffect

结合 watch、onMounted、onBeforeUnmount 的生命周期 Hook。

```ts
import { useEffect } from "@vue-start/hooks";

// 组件挂载和卸载时执行
useEffect(() => {
  console.log('mounted');
  return () => console.log('unmounted');
}, []);

// 监听依赖变化
useEffect(() => { /* ... */ }, () => [dep1, dep2]);
```

#### useWatch

监听响应式数据变化，自动在组件卸载时停止监听。

```ts
import { useWatch } from "@vue-start/hooks";

useWatch(
  (newVal, oldVal) => { /* ... */ },
  () => state.count
);
```

### DOM 操作类

#### useClickAway

```ts
import { useClickAway } from "@vue-start/hooks";

useClickAway(callback: () => void, target: Ref<HTMLElement>, eventName?: string): void;
```

#### useEventListener

```ts
import { useEventListener } from "@vue-start/hooks";

useEventListener(
  event: string,
  handler: (e: Event) => void,
  options?: { target?: EventTarget; passive?: boolean }
): void;
```

#### useHover

```ts
import { useHover } from "@vue-start/hooks";

const [isHover, startHover, endHover] = useHover(elementRef: Ref<HTMLElement>): [
  Ref<boolean>,
  () => void,
  () => void
];
```

#### useResizeObserver

```ts
import { useResizeObserver } from "@vue-start/hooks";

useResizeObserver(
  target: Ref<HTMLElement>,
  callback: (entries: ResizeObserverEntry[]) => void
): void;
```

#### useDocumentVisibility

```ts
import { useDocumentVisibility } from "@vue-start/hooks";

const visibility = useDocumentVisibility(): Ref<"visible" | "hidden">;
```

### 工具类

#### useUpdateKey

```ts
import { useUpdateKey } from "@vue-start/hooks";

const [key, updateKey] = useUpdateKey(): [Ref<string>, () => void];
```

#### useRuleState

```ts
import { useRuleState } from "@vue-start/hooks";

const state = useRuleState<T, R extends Record<string, (record: T) => any>>(
  data: T,
  rules: R
): { [K in keyof R]: ReturnType<R[K]> };
```

---

## 工具函数 (util)

工具函数按功能域组织，从 `@vue-start/hooks` 导入。

### 基础工具 (base)

```ts
import { generateId, strToJson, jsonToStr, isValidInRules, isSame, isSameNum } from "@vue-start/hooks";

const generateId = (): string;
const strToJson = (v: string): any;
const jsonToStr = (obj: Object): string;
const isValidInRules = (target: any, rules: Record<string, any>): boolean;
const isSame = (a: any, b: any, opts?: object): boolean;
const isSameNum = (num1: number, num2: number): boolean;
```

### 数据转换 (collection)

```ts
import { listToMap, findTreeItem, treeToMap, convertCollection, filterCollection, mergeStateToData, signTableMerge } from "@vue-start/hooks";

const listToMap = (data: any[], convert: (item: any) => any, fieldNames?: { key?: string }): Record<string, any>;
const findTreeItem = (data: any[], rules: Record<string, any>, fieldNames?: object, parent?: any): TFindTarget;
const treeToMap = (data: any[], convert: (item: any) => any, fieldNames?: object, onlyLeaf?: boolean): Record<string, any>;
const convertCollection = (data: any[], convert: (item: any) => any, fieldNames?: object): any[];
const filterCollection = (data: any[], verify: (item: any) => boolean, fieldNames?: object): any[];
const mergeStateToData = (data: any[], state: any, value: any, fieldNames?: object): any[];
const assignStateToData = (data: any[], state: any, value: any, fieldNames?: object): any[];
const signTableMerge = (data: any[], opts: object): void;
```

### Options 工具 (options)

```ts
import { enumToOptions, listToOptions, parseValue, formatValue, findValueRecord, findValueLabel } from "@vue-start/hooks";

const enumToOptions = (enumObj: Record<string, any>, displayEnumObj?: Record<string, any>): TOptions;
const listToOptions = (list: any[], fieldNames?: TFieldNames, rewriteProps?: Record<string, any>): TOptions;
const parseValue = (v: any, opts: TValueOpts): any;
const formatValue = (v: any, opts: TValueOpts): any;
const findValueRecord = (v: any, opts: TLabelOpts): any;
const findValueLabel = (r: any, opts: TLabelOpts): string;
```

### 数值处理 (number)

```ts
import { decimalLen, decimalFixed, thousandDivision, toNum, showNum } from "@vue-start/hooks";

const decimalLen = (value: number): number;
const decimalFixed = (value: number, length?: number): string;
const thousandDivision = (value: number): string;
const toNum = (num: any, def?: number): number | null;
const showNum = (num: any, def?: number | string): number | string;
```

### 菜单工具 (menu)

```ts
import { findFirstValidMenu, getMenuTopNameMap } from "@vue-start/hooks";

const findFirstValidMenu = (menus: TMenu[], rules: Record<string, any>, fieldNames?: object): TMenu;
const getMenuTopNameMap = (menus: TMenu[], fieldNames?: object): Record<string, any>;
```

### Vue3 工具 (vue3)

```ts
import { createExposeObj, toValue, unrefElement, useSafeActivated } from "@vue-start/hooks";

const createExposeObj = (targetRef: Ref, methods?: string[], opts?: object): Record<string, any>;
const toValue = <T>(r: T | Ref<T> | (() => T)): T;
const unrefElement = <T>(elRef: any): HTMLElement | SVGElement | undefined;
const useSafeActivated = (cb: () => void): void;
```

### 定时器工具 (timer)

```ts
import { formatCountStr, useCountDown } from "@vue-start/hooks";

const formatCountStr = (time: number, format?: string): string;
const useCountDown = (time?: number, format?: string): {
  count: Ref<number>;
  str: Ref<string>;
  stop: () => void;
  start: () => void;
};
```

### 文件工具 (file)

```ts
import { isValidFileType, convertFileSize } from "@vue-start/hooks";

const isValidFileType = (accept: string, fileName: string): boolean;
const convertFileSize = (sizeInBytes: number): string;
```

### Path 工具 (path)

```ts
import { restorePath, isValidPath, isPathHasParent } from "@vue-start/hooks";

const restorePath = (path: string, obj: object): string;
const isValidPath = (path: string): boolean;
const isPathHasParent = (path: string, obj: object): boolean;
```

### 正则常量 (pattern)

```ts
import { mobilePhoneReg, telephoneReg, idCardReg, creditCodeReg, floatNumberReg, emailPhoneReg } from "@vue-start/hooks";

const mobilePhoneReg: RegExp;
const telephoneReg: RegExp;
const idCardReg: RegExp;
const creditCodeReg: RegExp;
const floatNumberReg: RegExp;
const emailPhoneReg: RegExp;
```
