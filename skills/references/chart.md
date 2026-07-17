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
| `theme` | `string \| Object` | - | ECharts 主题 |
| `opts` | `EChartsInitOpts` | - | 初始化配置 |
| `basicOption` | `Object` | - | 基础配置，会与 option 合并 |
| `option` | `Object` | - | 图表配置 |
| `optionOpts` | `Object` | - | setOption 配置 |
| `mergeOptionData` | `Function` | `mergeOptionData` | 自定义合并函数 |
| `resize` | `boolean \| Object` | `true` | 是否自动响应尺寸变化 |
| `loading` | `boolean` | `false` | 是否显示 loading |
| `loadingOpts` | `Object` | - | loading 配置 |
| `events` | `Array<{ eventName: string; handler: Function }>` | - | 绑定的事件列表 |

### useChart

获取图表实例。

```tsx
import { useChart } from '@vue-start/chart';

const { chartRef } = useChart();

// 访问 ECharts 实例方法
chartRef.value?.resize();
chartRef.value?.setOption(option);
chartRef.value?.dispose();
```

## 常用图表类型示例

### 柱状图

```tsx
import { ProChart } from "@vue-start/chart";

const barOption = {
  xAxis: { type: "category", data: ["Mon", "Tue", "Wed", "Thu", "Fri"] },
  yAxis: { type: "value" },
  series: [{ data: [120, 200, 150, 80, 70], type: "bar" }],
};

<ProChart option={barOption} />
```

### 折线图

```tsx
const lineOption = {
  xAxis: { type: "category", data: ["Jan", "Feb", "Mar", "Apr"] },
  yAxis: { type: "value" },
  series: [{ data: [820, 932, 901, 1290], type: "line" }],
};

<ProChart option={lineOption} />
```

### 饼图

```tsx
const pieOption = {
  series: [{
    type: "pie",
    data: [
      { value: 1048, name: "Search Engine" },
      { value: 735, name: "Direct" },
      { value: 580, name: "Email" },
    ],
  }],
};

<ProChart option={pieOption} />
```

### 使用 basicOption 合并

```tsx
// 基础配置（颜色、图例、网格等）
const basicOption = {
  color: ["#409eff", "#67c23a", "#e6a23c", "#f56c6c"],
  legend: { show: true },
  grid: { left: 50, right: 20, top: 40, bottom: 30 },
};

// 具体图表配置
const option = {
  xAxis: { type: "category", data: ["Mon", "Tue", "Wed"] },
  yAxis: { type: "value" },
  series: [{ data: [120, 200, 150], type: "bar" }],
};

// basicOption 与 option 会自动合并
<ProChart basicOption={basicOption} option={option} />
```

### 响应式数据更新

```tsx
import { defineComponent, ref } from "vue";
import { ProChart } from "@vue-start/chart";

export default defineComponent({
  setup() {
    const chartData = ref([120, 200, 150]);
    const loading = ref(false);

    const option = computed(() => ({
      xAxis: { type: "category", data: ["A", "B", "C"] },
      yAxis: { type: "value" },
      series: [{ data: chartData.value, type: "bar" }],
    }));

    const handleRefresh = async () => {
      loading.value = true;
      const newData = await fetchChartData();
      chartData.value = newData;
      loading.value = false;
    };

    return () => (
      <div>
        <el-button onClick={handleRefresh}>刷新</el-button>
        <ProChart option={option.value} loading={loading.value} />
      </div>
    );
  },
});
```

### 事件交互

```tsx
<ProChart
  option={option}
  events={[
    {
      eventName: "click",
      handler: (params) => {
        console.log("点击了:", params.name, params.value);
      },
    },
    {
      eventName: "legendselectchanged",
      handler: (params) => {
        console.log("图例切换:", params.selected);
      },
    },
  ]}
/>
```

## 工具函数

### mergeOptionData

合并图表配置。

```ts
import { mergeOptionData } from '@vue-start/chart/util';

const merged = mergeOptionData(basicOption, option);
```
