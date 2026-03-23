# @vue-start/chart 使用指南

`@vue-start/chart` 是基于 ECharts 的图表封装组件，支持响应式、自动 resize、loading 等功能。

## 安装

```bash
pnpm add @vue-start/chart echarts
```

## 核心组件

### ProChart

图表组件。

```tsx
import { ProChart } from '@vue-start/chart';

<ProChart
  option={chartOption}
  basicOption={baseOption}
  resize={true}
  loading={isLoading}
  events={[
    { eventName: 'click', handler: (params) => console.log(params) }
  ]}
/>
```

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| theme | string \| Object | - | ECharts 主题 |
| opts | EChartsInitOpts | - | 初始化配置 |
| basicOption | Object | - | 基础配置，会与 option 合并 |
| option | Object | - | 图表配置 |
| optionOpts | Object | - | setOption 配置 |
| mergeOptionData | Function | mergeOptionData | 配置合并函数 |
| resize | boolean \| Object | true | 是否自动响应尺寸变化 |
| loading | boolean | false | 是否显示 loading |
| loadingOpts | Object | - | loading 配置 |
| events | Array | - | 绑定的事件列表 |

### useChart

获取图表实例。

```tsx
import { useChart } from '@vue-start/chart';

const { chartRef } = useChart();

// 访问 ECharts 实例方法
chartRef.value.resize();
chartRef.value.setOption(option);
chartRef.value.dispose();
```

## 工具函数

### mergeOptionData

合并图表配置。

```ts
import { mergeOptionData } from '@vue-start/chart/util';

const merged = mergeOptionData(basicOption, option);
```
