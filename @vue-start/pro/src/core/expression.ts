import { get, isArray, isString, map, size, some, endsWith, forEach, pick, set } from "lodash";

/**
 * eg:
 * arguments:[{id:'111',name:'zx',age:18}]
 * {name$:"arguments",namePath$:"0.id"}
 * 转换后
 * '111'
 */
export type TDataType = {
  /**
   * 取值源对象
   * state:      当前module的state对象；
   * data：      当前module的data（普通obj，仅存储数据使用）对象；
   * arguments： 当前方法中的参数；缺省取该值
   */
  name$: "state" | "data" | "arguments";
  namePath$?: string; //data中属性path
};
export type TParamItem = any | TDataType;

/**
 * arguments:[{id:'111',name:'zx',age:18}]
 * eg1:
 {
   "name$": "obj",
   "query$": [
     "pick$",
     {
       "name$": "arguments",
       "namePath$": "0"
     },
     "id"
   ],
   "name": "QuotaDetail"
 }
 *
 * eg2:
 {
    "name$": "obj",
    "query.id$": {
      "name$": "arguments",
      "namePath$": "0.id"
    },
    "name": "QuotaDetail"
  }
 *
 * eg1 和 eg2 转换后的结果都为：
 * {
 *   name:"QuotaDetail",
 *   query:{
 *     id:'111
 *   }
 * }
 */
export type TObjItem = {
  name$: "obj";
  /**
   * 以"$"符结尾的属性可以设置为 TFunItem | TDataType | TObjItem，最终将为去除$的属性赋值
   */
  [key: string]: TParamItem | TFunItem;
};

/**
 * 第一个项：调用模块的方法名称，以"$"结尾
 * eg:
 * ["pick$", {"id":"111", "name":"name"}, "id"]
 * 转换后的结果
 * {id:"111"}
 */
export type TFunItem = (string | TParamItem | TObjItem)[];

/**
 * 是否是合法的 Fun 描述
 * @param funEx
 */
const isValidFunEx = (funEx: TFunItem) => {
  //不是数组
  if (!isArray(funEx) || size(funEx) <= 0) return false;
  //不是合法方法名称
  const funName = funEx[0];
  if (!isString(funName)) return false;
  return endsWith(funName, "$");
};

const DataTypeArr: TDataType["name$"][] = ["state", "data", "arguments"];
/**
 * 是否是标记 数据类型 的描述
 * @param ex
 */
const isValidDataTypeEx = (ex: TParamItem) => {
  if (typeof ex !== "object") return false;
  if (!ex.name$) return false;
  return some(DataTypeArr, (type) => type === ex.name$);
};

/**
 * 是否是 TObjItem 描述
 * @param ex
 */
const isValidObjEx = (ex: TObjItem) => {
  if (typeof ex !== "object") return false;
  if (!ex.name$) return false;
  return ex.name$ === "obj";
};

const defaultMethodObj = { get, pick };

//执行表达式
export const executeEx = (
  ex: TParamItem | TFunItem | TObjItem,
  p: {
    methodObj: any;
    state: any;
    data: any;
    arguments: any[];
  },
): any => {
  if (isValidDataTypeEx(ex)) {
    const data = get(p, ex.name$);
    return ex.namePath$ ? get(data, ex.namePath$) : data;
  } else if (isValidObjEx(ex)) {
    const obj: any = {};
    forEach(ex, (v, k) => {
      if (k === "name$") return;
      if (endsWith(k, "$")) {
        const value = executeEx(v, p);
        set(obj, k.replace("$", ""), value);
      } else {
        obj[k] = v;
      }
    });
    return obj;
  } else if (isValidFunEx(ex)) {
    const [funName, ...params] = ex;
    const methodObj = p.methodObj || defaultMethodObj;
    const fun = get(methodObj, funName.replace("$", ""));
    //方法不存在
    if (!fun) {
      console.log("ex", "未找到对应的方法", ex);
      return;
    }
    const paramValues = map(params, (param) => executeEx(param, p));
    return fun(...paramValues);
  }
  return ex;
};
