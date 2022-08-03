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
