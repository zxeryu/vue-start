import { ColumnProps } from "ant-design-vue/lib/table/Column";
import { TextProps } from "ant-design-vue/lib/typography/Text";
import { FormItemProps } from "ant-design-vue/lib/form/FormItem";
import { DescriptionsItemProp } from "ant-design-vue/lib/descriptions";

export type TColumn = ColumnProps & {
  valueType?: TValueType; //展示组件类型
  formValueType?: TValueType; //录入组件类型 如不存在，默认取valueType的值
  showProps?: TextProps; //Typography.Text作为文字展示组件的props
  formItemProps?: FormItemProps; //FormItem props
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
    desc?: DescriptionsItemProp; //DescriptionsItem props
  };
};

export type TColumns = TColumn[];

export type BooleanObjType = {
  [key: string]: boolean;
};

export type BooleanRulesObjType = {
  [key: string]: (record: any) => boolean;
};

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
