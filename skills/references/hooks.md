# @vue-start/hooks 使用指南

`@vue-start/hooks` 是一套基于 Vue3 Composition API 的 Hooks 工具库，提供了一系列常用的响应式状态管理和 DOM 操作 Hooks。

## 安装

```bash
pnpm add @vue-start/hooks
```

## 核心 Hooks

### 状态管理类

#### useToggle

状态切换 Hook，支持双向切换。

```ts
const [state, { toggle, setLeft, setRight }] = useToggle();
const [state, actions] = useToggle(true);
const [state, actions] = useToggle('open', 'close');
```

#### useBoolean

布尔值状态管理，基于 useToggle 封装。

```ts
const [isVisible, { toggle, setTrue, setFalse }] = useBoolean(false);
```

#### useState

响应式状态管理，解决 ref 的 .value 访问问题。

```ts
const [state, setState] = useState({ name: '' });
const setReactiveValue = (r, obj) => void; // 快速为reactive对象赋值
```

#### useSet

Set 数据结构的状态管理。

```ts
const [set, { add, remove, reset, has }] = useSet(['a', 'b']);
```

#### useStorageState

localStorage 状态持久化。

```ts
const [state, setState] = useStorageState('key', 'defaultValue');
```

#### useMemo

计算缓存，依赖变化时重新计算。

```ts
const result = useMemo(() => expensiveComputation(a, b), [a, b]);
```

### 副作用类

#### useEffect

结合 watch、onMounted、onBeforeUnmount 的生命周期 Hook。

```ts
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
useWatch((newVal, oldVal) => { /* ... */ }, () => state.count);
```

### DOM 操作类

#### useClickAway

检测点击目标外部。

```ts
useClickAway(() => { /* ... */ }, ref.value, 'click');
```

#### useEventListener

事件监听封装。

```ts
useEventListener('resize', handleResize, { target: window, passive: true });
```

#### useHover

检测元素 hover 状态。

```ts
const [isHover, startHover, endHover] = useHover(elementRef);
```

#### useResizeObserver

监听元素尺寸变化。

```ts
useResizeObserver(containerRef, (entries) => {
  const { width, height } = entries[0].contentRect;
});
```

#### useDocumentVisibility

监听页面可见性。

```ts
const visibility = useDocumentVisibility(); // 'visible' | 'hidden'
```

### 工具类

#### useUpdateKey

生成唯一 key，用于刷新图表、组件。

```ts
const [key, updateKey] = useUpdateKey();
```

#### useRuleState

根据规则自动计算状态。

```ts
const state = useRuleState(formData, {
  valid: (record) => record.name && record.age,
  canSubmit: (record) => record.name && record.age > 18,
});
```

## 工具函数 (util)

### 基础工具 (base)

```ts
const generateId = () => string;                    // 生成唯一id
const strToJson = (v: string) => any;                // JSON字符串转对象
const jsonToStr = (obj: Object) => string;           // 对象转JSON字符串
const isValidInRules = (target, rules) => boolean;   // 判断是否满足规则
const isSame = (a, b, opts?) => boolean;            // 判断两个值是否相等
const isSameNum = (num1, num2) => boolean;           // 数值比较
```

### 数据转换 (collection)

```ts
// list 数据转 Map
const listToMap = (data, convert, fieldNames?) => Record<string, any>;

// tree 数据查找
const findTreeItem = (data, rules, fieldNames?, parent?) => TFindTarget;
const findTreeItem2 = (data, value[], fieldNames?) => TFindTarget;

// tree 数据转 Map
const treeToMap = (data, convert, fieldNames?, onlyLeaf?) => Record<string, any>;

// 综合转换（替代 listToOptions 和 treeToOptions）
const convertCollection = (data, convert, fieldNames?) => any[];
// fieldNames: { children: "children", childrenName: "children" }

// 数据过滤
const filterCollection = (data, verify, fieldNames?) => any[];

// 数据合并
const mergeStateToData = (data, state, value, fieldNames?) => any[];
const assignStateToData = (data, state, value, fieldNames?) => any[];

// 表格合并标记
const signTableMerge = (data, opts) => void;
const getNameMapByMergeOpts = (opts) => Record<string, any>;
```

### Options 工具 (options)

```ts
const getFieldNames = (fieldNames?) => { labelName, valueName, childrenName };

// 枚举转 options
const enumToOptions = (enumObj, displayEnumObj) => TOptions;

// list 相关
const listToOptions = (list, fieldNames?, rewriteProps?) => TOptions;
const listToOptionsMap = (list, fieldNames?, isItemObj?) => Record<string, any>;

// value 解析与格式化
const parseValue = (v, opts: TValueOpts) => any;
const formatValue = (v, opts: TValueOpts) => any;
const findValueRecord = (v, opts: TLabelOpts) => any;
const findValueLabel = (r, opts: TLabelOpts) => string;
```

### 数值处理 (number)

```ts
const decimalLen = (value) => number;              // 获取小数位数
const decimalFixed = (value, length?) => string;   // 保留小数位，默认2位
const thousandDivision = (value) => string;        // 千分位处理
const toNum = (num, def?) => number | null;        // 转换为number
const showNum = (num, def?) => number | string;    // 展示数字
```

### 菜单工具 (menu)

```ts
const findFirstValidMenu = (menus, rules, fieldNames?) => TMenu;
const getMenuTopNameMap = (menus, fieldNames?) => Record<string, any>;
```

### Vue3 工具 (vue3)

```ts
const createExposeObj = (targetRef, methods?, opts?) => Record<string, any>;
const toValue = <T>(r: T | Ref<T> | (() => T)) => T;
const unrefElement = <T>(elRef) => HTMLElement | SVGElement | undefined;
const useSafeActivated = (cb: () => void) => void; // 安全执行 onActivated
```

### 定时器工具 (timer)

```ts
const formatCountStr = (time: number, format?) => string;  // 秒转字符串
const useCountDown = (time?, format?) => { count, str, stop, start };
```

### 文件工具 (file)

```ts
const isValidFileType = (accept, fileName) => boolean;  // 验证文件类型
const convertFileSize = (sizeInBytes) => string;        // 文件大小转换
```

### Path 工具 (path)

```ts
const restorePath = (path: string, obj) => string;   // 还原path中的描述性下标
const isValidPath = (path: string) => boolean;        // 是否是合法path
const isPathHasParent = (path: string, obj) => boolean; // 父级对象是否存在
```

### 正则常量 (pattern)

```ts
const mobilePhoneReg = RegExp;     // 手机号
const telephoneReg = RegExp;       // 电话
const idCardReg = RegExp;          // 身份证
const creditCodeReg = RegExp;      // 统一社会信用码
const floatNumberReg = RegExp;     // 小数点后两位数字
const emailPhoneReg = RegExp;      // 邮箱
```
