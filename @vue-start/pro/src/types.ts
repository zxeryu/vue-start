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

export type TreeOption = {
  label?: string;
  value: string | number;
  disabled?: boolean;
  children?: TreeOption[];
};

export type TreeOptions = TreeOption[];

export type TRender = (opts: { value: any; record: any; column?: TColumn }) => VNode | string | number;

export type TColumn = {
  title?: string | VNode;
  dataIndex?: string | number;
  valueType?: TValueType; //展示组件类型
  formValueType?: TValueType; //录入组件类型 如不存在，默认取valueType的值
  showProps?: Record<string, any>; //文字展示组件的props
  formItemProps?: { name?: string; label?: string }; //FormItem props
  formFieldProps?: Record<string, any>; //录入组件 props
  search?: boolean; //同extra中的search

  descRender?: string | TRender; //desc
  formRender?: string | TRender; //form
  formReadRender?: string | TRender; //form readonly
  // tableRender?: string | TRender; //table

  //拓展属性
  extra?: {
    //DescriptionsItem props
    desc?: Record<string, any>;
    //Col props
    col?: Record<string, any>;
    /**
     * 自定义标记，对columns进行筛选 和 排序
     * 默认支持：search、form、table、detail
     * 比如： search：标记搜索条件；searchSort：搜索项的顺序
     * 在Curd组件中可使用getSignColumns方法获取标记的Columns
     * [sign]：              boolean 标记
     * [`${sign}Sort`]：     标记的columns排序
     */
  } & Record<string, any>;
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
  /**
   * 发送事件源
   * 公共组件（如：Curd）只处理source为undefined的事件
   * 业务组件可以传入该参数覆盖之前的默认行为
   */
  source?: string;
  //备用
  extra?: Record<string, any>;
};

/**
 * 发送state对象
 */
export type TActionState = {
  //属性名称
  type: string;
  //string boolean number object
  payload: any;
  //备用
  extra?: Record<string, any>;
};

/**
 * 组件Map
 */
export type TElementMap = Record<string, any>;

export type BooleanObjType = {
  [key: string]: boolean;
};

export type BooleanRulesObjType = Record<string, (record: Record<string, any>) => boolean>;

/**
 *
 */
export interface FieldNames {
  value?: string;
  label?: string;
  children?: string;
}
