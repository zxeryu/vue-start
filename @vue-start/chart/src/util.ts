import { isArray, isObject, mergeWith, omit, map, reduce, get } from "lodash";

/**
 *  merge规则
 *  1、basicOption 中的series为不同type的公共属性，会merge到 option 中对应的 series 中
 *  2、其他属性
 *    1）basicOption[prop] 为 object，option[prop] 为 array。覆盖；
 *    2）basicOption[prop] 为 array。                        覆盖；
 *    3）其他情况，lodash merge 规则；
 *
 * @param basicOption  基础(公共)配置
 * @param option       动态配置
 */
export const mergeOptionData = (basicOption: any, option: any) => {
  const composeData = mergeWith(omit(basicOption, "series"), omit(option, "series"), (objValue, srcValue) => {
    if (!objValue) return srcValue;
    if (!srcValue) return objValue;
    //basic 为对象
    if (isObject(objValue) && !isArray(objValue)) {
      if (isArray(srcValue)) {
        // option 为数组
        return srcValue;
      }
    }
    //basic 为数组
    if (isArray(objValue)) {
      //直接覆盖
      return srcValue || objValue;
    }
  });
  //series merge规则
  let seriesMap: Record<string, any> | undefined;
  if (isArray(basicOption.series)) {
    seriesMap = reduce(
      basicOption.series,
      (pair, item) => {
        if (!item.type) return pair;
        return { ...pair, [item.type]: item };
      },
      {},
    );
  } else if (isObject(basicOption.series) && basicOption.series?.type) {
    seriesMap = { [basicOption.series.type]: basicOption.series };
  }
  const series = map(option.series, (item) => {
    if (!seriesMap) return item;
    const baseSeries = get(seriesMap, item.type);
    if (!baseSeries) return item;
    return { ...baseSeries, ...item };
  });
  return { ...composeData, series };
};
