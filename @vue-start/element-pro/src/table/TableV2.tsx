import { computed, defineComponent, ExtractPropTypes, PropType, reactive, ref } from "vue";
import { ElTableV2, TableV2Props } from "element-plus";
import { useResizeObserver, useUpdateKey } from "@vue-start/hooks";
import { map, omit, pick } from "lodash";
import { TColumns } from "@vue-start/pro";
import { TableColumnCtx } from "../../types";

export type ProTableV2ColumnProps<T = Record<string, any>> = TableColumnCtx<T>;

const proTableV2Props = () => ({
  fixed: { type: Boolean, default: true },
  dataSource: Array,
  columns: { type: Array as PropType<TColumns> },
  /**
   * 默认启用动态计算行高度 estimatedRowHeight
   */
  dynamicHei: { type: Boolean, default: true },
  //
  minWidth: { type: Number, default: 100 },
});

export type ProTableV2Props<T = Record<string, any>> = Partial<ExtractPropTypes<ReturnType<typeof proTableV2Props>>> &
  TableV2Props;

export const ProTableV2 = defineComponent<ProTableV2Props>({
  inheritAttrs: false,
  props: {
    ...omit(ElTableV2.props, ["class"]),
    ...proTableV2Props(),
  } as any,
  setup: (props, { attrs }) => {
    const domRef = ref();

    const [key, updateKey] = useUpdateKey();

    const state = reactive({
      width: 0,
      height: 0,
    });

    useResizeObserver(domRef, (entries) => {
      const rect = entries[0]?.contentRect;
      state.width = rect.width;
      state.height = rect.height;
      //重新渲染
      updateKey();
    });

    /**
     * 计算默认宽度
     * 1、column中如果存在width，则使用column的width
     * 2、column中不存在width，则使用table的宽度-存在width集合/不存在width的column的个数 默认宽度
     * 3、最终取值不小于100
     */
    const defColWid = computed(() => {
      const cols = props.columns?.filter((item) => item.width || item.minWidth) || [];
      const colsWid = cols.reduce((acc, cur) => acc + (cur.width || cur.minWidth || 0), 0);
      const noCols = (props.columns?.length || 0) - cols.length;
      if (noCols > 0 && state.width > 0) {
        return Math.max((state.width - colsWid - (props.vScrollbarSize || 0)) / noCols, props.minWidth || 0);
      }
      return props.minWidth;
    });

    const columns = computed(() => {
      return map(props.columns, (item) => {
        const dataIndex = item.dataIndex || item.key;

        const nextItem = {
          ...item,
          width: item.width || item.minWidth || defColWid.value,
          key: dataIndex,
          dataKey: dataIndex,
        };

        if (item.customRender) {
          nextItem.cellRenderer = ({ cellData: value, rowData: record, rowIndex: index, column }) => {
            return item.customRender!({ value, text: value, record, column, index });
          };
        }

        return nextItem;
      });
    });

    //动态行高
    const estimatedRowHeight = computed(() => {
      if (!props.estimatedRowHeight && props.dynamicHei) {
        return 50;
      }
      return props.estimatedRowHeight;
    });

    // class
    const cls = computed(() => {
      const arr = ["el-table"];
      if (estimatedRowHeight.value) {
        arr.push("dynamic-hei");
      }
      return arr;
    });

    return () => {
      return (
        <div
          //@ts-ignore
          class={"pro-table-v2-wrapper"}
          style={{ "--estimated-hei": `${estimatedRowHeight.value || 0}px` }}
          ref={domRef}
          {...pick(attrs, ["class"])}>
          {state.width > 0 && state.height > 0 && (
            <ElTableV2
              key={key.value}
              //@ts-ignore
              class={cls.value}
              {...omit(attrs, ["class", "className"])}
              {...omit(props, "dataSource", "data", "columns", "estimatedRowHeight", "width", "height")}
              estimatedRowHeight={estimatedRowHeight.value}
              columns={columns.value as any}
              data={props.dataSource || props.data || []}
              width={state.width}
              height={state.height}
            />
          )}
        </div>
      );
    };
  },
});
