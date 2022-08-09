/**
 * list:              search + table
 * detail add edit:   form or desc
 */
import { computed, defineComponent, ExtractPropTypes, PropType, reactive, VNode } from "vue";
import { filter, get, keys, omit, pick, sortBy } from "lodash";
import { UnwrapNestedRefs } from "@vue/reactivity";
import { ProModule, ProModuleProps, useProModule } from "../core";
import { TColumns } from "../../types";
import { provideProCurdModule } from "./ctx";
import { ITableOperate } from "../table";
import { ProCurdListProps } from "./CurdList";
import { ProCurdFormProps } from "./CurdForm";
import { ModalProps } from "./CurdModal";
import { DescriptionsProps } from "./CurdDesc";

/**
 * curd 操作模式
 */
export enum CurdCurrentMode {
  ADD = "ADD",
  EDIT = "EDIT",
  DETAIL = "DETAIL",
}

export type ICurdCurrentMode = keyof typeof CurdCurrentMode;

/**
 * curd add 模式下 标记 "确定" "确定并继续" 触发
 */
export enum CurdAddAction {
  NORMAL = "NORMAL",
  CONTINUE = "CONTINUE",
}

export type ICurdAddAction = keyof typeof CurdAddAction;

export interface IListData extends Record<string, any> {
  total: number;
  dataSource: Record<string, any>[];
}

export interface ICurdState extends Record<string, any> {
  //list
  listLoading?: boolean; //列表加载状态
  listData?: IListData;
  //mode
  mode?: ICurdCurrentMode;
  //detail add edit
  detailLoading?: boolean; //详情加载状态
  detailData?: Record<string, any>; //详情数据
  //add edit
  operateLoading?: boolean; //修改、保存 等等
  addAction?: ICurdAddAction; //
}

type BooleanOrFun = boolean | ((record: Record<string, any>) => boolean);

/**
 * `on${Action}Bobble`: 冒泡
 */
export interface IOperate {
  //list
  onList?: (values: Record<string, any>) => void; //触发列表刷新
  //detail
  detail?: BooleanOrFun;
  detailLabel?: string | VNode;
  onDetail?: (record: Record<string, any>) => void; //触发详情
  //edit
  edit?: BooleanOrFun;
  editLabel?: string | VNode;
  onEdit?: (record: Record<string, any>) => void; //触发编辑
  onEditExecute?: (values: Record<string, any>) => void; //编辑完成触发
  //add
  add?: BooleanOrFun;
  addLabel?: string | VNode;
  onAdd?: () => void; //触发添加
  onAddExecute?: (values: Record<string, any>) => void; //添加完成触发
  //delete
  delete?: BooleanOrFun;
  deleteLabel?: string | VNode;
  onDelete?: (record: Record<string, any>) => void; //触发删除

  tableOperate?: ITableOperate;
}

const proCurdModuleProps = () => ({
  /**
   * 状态
   */
  curdState: { type: Object as PropType<UnwrapNestedRefs<ICurdState>> },
  /**
   * 操作配置
   */
  operate: { type: Object as PropType<IOperate> },
  /**
   * 列表 或 详情 的唯一标识
   */
  rowKey: { type: String, default: "id" },
  /************************* 子组件props *******************************/
  listProps: { type: Object as PropType<ProCurdListProps> },
  formProps: { type: Object as PropType<ProCurdFormProps> },
  descProps: { type: Object as PropType<DescriptionsProps> },
  modalProps: { type: Object as PropType<ModalProps> },
});

type CurdModuleProps = Partial<ExtractPropTypes<ReturnType<typeof proCurdModuleProps>>>;

const CurdModule = defineComponent<CurdModuleProps>({
  props: {
    ...(proCurdModuleProps() as any),
  },
  setup: (props, { slots }) => {
    const { columns } = useProModule();

    const curdState = props.curdState || reactive({ detailData: {} });

    /**
     * 排序
     * @param list
     * @param propName
     */
    const dealSort = (list: TColumns, propName: string): TColumns => {
      return sortBy(list, (item) => get(item, propName));
    };

    /**
     * 非 hideInForm columns
     */
    const formColumns = computed(() => {
      return dealSort(
        filter(columns.value, (item) => !item.hideInForm),
        "formSort",
      );
    });

    /**
     * 非 hideInDetail columns
     */
    const descColumns = computed(() => {
      return dealSort(
        filter(columns.value, (item) => !item.hideInDetail),
        "descSort",
      );
    });

    /**
     *  非 hideInTable columns
     */
    const tableColumns = computed(() => {
      return dealSort(
        filter(columns.value, (item) => !item.hideInTable),
        "tableSort",
      );
    });

    /**
     * search columns
     */
    const searchColumns = computed(() => {
      return dealSort(
        filter(columns.value, (item) => !!item.search),
        "searchSort",
      );
    });

    const operate = {
      detailLabel: "详情",
      editLabel: "编辑",
      addLabel: "添加",
      deleteLabel: "删除",
      ...props.operate,
    };

    provideProCurdModule({
      rowKey: props.rowKey!,
      curdState,
      formColumns,
      descColumns,
      tableColumns,
      searchColumns,
      operate,
      //
      listProps: props.listProps,
      formProps: props.formProps,
      descProps: props.descProps,
      modalProps: props.modalProps,
    });

    return () => {
      return slots.default?.();
    };
  },
});

export type ProCurdModuleProps = CurdModuleProps & ProModuleProps;

export const ProCurd = defineComponent<ProCurdModuleProps>({
  props: {
    ...ProModule.props,
    ...proCurdModuleProps(),
  },
  setup: (props, { slots }) => {
    const moduleKeys = keys(ProModule.props);
    return () => {
      return (
        <ProModule {...pick(props, moduleKeys)}>
          <CurdModule {...omit(props, moduleKeys)}>{slots.default?.()}</CurdModule>
        </ProModule>
      );
    };
  },
});
