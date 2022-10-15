import { IRequestActor, useDirectRequest } from "@vue-start/request";
import {
  listToOptions,
  listToOptionsMap,
  treeToOptions,
  treeToOptionsMap,
  TRewriteProps,
  useMemo,
} from "@vue-start/hooks";
import { get, isFunction } from "lodash";
import { FieldNames } from "../types";

export const createOptionsRequest = <TRequestActor extends IRequestActor>(
  actor: TRequestActor,
  fieldNames: FieldNames,
  dataPath: ((res: any) => Record<string, any>[]) | string | string[],
) => {
  return (params: TRequestActor["req"], opts?: { rewriteProps?: TRewriteProps }) => {
    const [data] = useDirectRequest(actor, { ...params }, []);
    return useMemo(() => {
      const list = isFunction(dataPath) ? dataPath(data) : get(data, dataPath);
      return {
        data: list,
        options: listToOptions(list, fieldNames, opts?.rewriteProps),
        optionsMap: listToOptionsMap(list, fieldNames),
      };
    }, data);
  };
};

export const createTreeOptionsRequest = <TRequestActor extends IRequestActor>(
  actor: TRequestActor,
  fieldNames: FieldNames,
  dataPath: ((res: any) => Record<string, any>[]) | string | string[],
) => {
  return (params: TRequestActor["req"], opts?: { optionsMap?: boolean; rewriteProps?: TRewriteProps }) => {
    const [data] = useDirectRequest(actor, { ...params }, []);
    return useMemo(() => {
      const list = isFunction(dataPath) ? dataPath(data) : get(data, dataPath);
      const optionsMap = opts?.optionsMap ? {} : undefined;
      if (optionsMap) {
        treeToOptionsMap(list, fieldNames, optionsMap);
      }
      return {
        data: list,
        options: treeToOptions(list, fieldNames, opts?.rewriteProps),
      };
    }, data);
  };
};
