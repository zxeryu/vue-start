import { Ref, UnwrapRef } from "vue";
import { TColumn, TColumns } from "../types";
import { convertCollection, mergeStateToData, mergeStateToData2 } from "@vue-start/hooks";
import { getColumnFormItemName } from "./core";
import { forEach, map, set, size } from "lodash";
import { TMetaKey } from "./request";

export const getColumnsOpts = (columns: TColumns): { storeKeys: string[]; metaKeys: TMetaKey[] } => {
  const storeKeys: string[] = [];
  const metaKeys: TMetaKey[] = [];

  forEach(columns, (item) => {
    if (!item.setData || size(item.setData) <= 0) {
      return;
    }
    forEach(item.setData, (setData) => {
      if (setData.type === "store") {
        storeKeys.push(setData.storeName);
      } else if (setData.type === "meta") {
        metaKeys.push({ actorName: setData.actorName, params: setData.params });
      }
    });
  });

  return { storeKeys, metaKeys };
};

export type TSetDataOpts = {
  stores?: Record<string, Ref<UnwrapRef<any>>>;
  metas?: Record<string, Ref<UnwrapRef<any>>>;
  getMetaStoreName?: (actorName: string, params?: Record<string, any>) => string | undefined;
};

export const setColumnsData = (columns: TColumns, opts: TSetDataOpts) => {
  return map(columns, (item) => {
    const nextItem = { ...item };
    //设置补充数据
    if (item.setData && size(item.setData) > 0) {
      forEach(item.setData, (setData) => {
        const path = setData.path;
        if (setData.type === "store") {
          set(nextItem, path, opts.stores?.[setData.storeName]?.value);
        }
        if (setData.type === "meta" && opts.getMetaStoreName) {
          const storeName = opts.getMetaStoreName(setData.actorName, setData.params);
          if (storeName) {
            set(nextItem, path, opts.metas?.[storeName]?.value);
          }
        }
      });
    }
    //处理children
    if (item.children && item.children.length > 0) {
      nextItem.children = setColumnsData(item.children, opts);
    }
    return nextItem;
  });
};

export const mergeState = (
  columns: TColumns,
  columnState?: Record<string, any>,
  columnState2?: Record<string, any>,
  opts?: TSetDataOpts & {
    convertColumnPre?: (t: TColumn) => TColumn;
    convertColumn?: (t: TColumn) => TColumn;
  },
) => {
  let list = columns;
  //转换column，发生在补充数据前
  if (opts?.convertColumnPre) {
    list = convertCollection(list, opts.convertColumnPre);
  }
  //补充数据
  if (columnState) {
    list = mergeStateToData(list, columnState, (item) => getColumnFormItemName(item) as string);
  }
  //补充数据
  if (columnState2) {
    list = mergeStateToData2(list, columnState2, (item) => getColumnFormItemName(item) as string);
  }
  //补充数据
  if (opts?.metas || opts?.stores) {
    list = setColumnsData(list, opts);
  }
  //转换column，发生在补充数据后
  if (opts?.convertColumn) {
    list = convertCollection(list, opts.convertColumn);
  }

  return list;
};
