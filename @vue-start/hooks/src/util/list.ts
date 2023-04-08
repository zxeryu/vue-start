import { TConvert } from "./base";
import { get, reduce } from "lodash";

type TData = Record<string, any>;

/**
 * list数据转化为Map对象
 * @param data
 * @param convert
 * @param fieldNames
 */
export const listToMap = (
  data: TData,
  convert: TConvert,
  fieldNames: { value: string } | undefined = { value: "value" },
) => {
  return reduce(
    data,
    (pair, item) => {
      return { ...pair, [get(item, fieldNames?.value)]: convert(item) };
    },
    {},
  );
};
