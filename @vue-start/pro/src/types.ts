import { VNode } from "vue";

export type TDefaultValueType =
  | "text"
  | "textarea"
  | "password"
  | "digit"
  | "date"
  | "dateRange"
  | "time"
  | "timeRange"
  | "select"
  | "treeSelect"
  | "checkbox"
  | "radio"
  | "slider"
  | "switch"
  | "rate"
  | "cascader";

export type TValueType = TDefaultValueType | string;

export type TOption = {
  label?: string;
  value: string | number;
  disabled?: boolean;
};

export type TOptions = TOption[];

export type TColumn = {
  title?: string | VNode;
  dataIndex?: string | number;
  valueType?: TValueType; //展示组件类型
  formValueType?: TValueType; //录入组件类型 如不存在，默认取valueType的值
  showProps?: Record<string, any>; //文字展示组件的props
  formItemProps?: { name?: string; label?: string }; //FormItem props
  formFieldProps?: Record<string, any>; //录入组件 props
  search?: boolean; //是否加入搜索
  hideInTable?: boolean; //在table中隐藏
  hideInForm?: boolean; //在form中隐藏
  hideInDetail?: boolean; //在desc中隐藏
  searchSort?: boolean; //SearchForm中排序
  tableSort?: boolean; //Table columns中排序
  formSort?: boolean; //Form中排序
  descSort?: boolean; //Desc中排序
  //拓展属性
  extra?: {
    desc?: any; //DescriptionsItem props
  };
};

export type TColumns = TColumn[];

/**
 * 发送事件对象
 */
export type TActionEvent = {
  //事件名称
  type: string;
  //数据or对象
  payload?: any;
  //备用
  extra?: Record<string, any>;
};

export type TActionState = {
  //属性名称
  type: string;
  //string boolean number object
  payload: any;
  //备用
  extra?: Record<string, any>;
};
