import { computed, defineComponent, PropType, ref, watch } from "vue";
import { filter, forEach, get, includes, isArray, isString, map } from "lodash";
import { ElementKeys, useGetCompByKey, useProConfig, ProCurdModule } from "@vue-start/pro";
import { TOptions } from "@vue-start/pro";
import { listToMap, parseValue, formatValue } from "@vue-start/hooks";
import { TagsList, TagsTrigger } from "./TagsTrigger";

/******************************** ProTableSelect 主组件 *********************************/

export const ProTableSelect = defineComponent({
  props: {
    // v-model
    modelValue: { type: [Array, String, Number] as PropType<any> },
    // 是否多选
    multiple: { type: Boolean, default: false },
    // 是否禁用
    disabled: { type: Boolean, default: false },
    // 占位符
    placeholder: { type: String },
    // 是否显示清除按钮
    clearable: { type: Boolean, default: false },
    // 字段映射配置
    fieldNames: { type: Object as PropType<{ label?: string; value?: string }> },
    // curdModule 配置
    curdModuleProps: { type: Object as PropType<Record<string, any>> },
    // 弹出类型
    popupType: { type: String as PropType<"modal" | "popover">, default: "modal" },
    // 弹窗配置
    modalProps: { type: Object as PropType<Record<string, any>> },
    // 弹窗配置
    popoverProps: { type: Object as PropType<Record<string, any>> },
    // collapse-tags 配置
    collapseTags: { type: Boolean, default: false },
    collapseTagsTooltip: { type: Boolean, default: false },
    maxCollapseTags: { type: Number, default: 3 },
    // 是否在弹出层中显示 TagsList（仅多选生效）
    showPopupTags: { type: Boolean, default: false },
    // options 属性，用于回显
    options: { type: Array as PropType<TOptions | Record<string, any>[]> },
    // **************** value 格式自定义 **********************
    separator$: { type: String },
    parseValue$: { type: Function as PropType<(value: any, props: any) => any> },
    formatValue$: { type: Function as PropType<(value: any, props: any) => any> },
    // 变化回调
    onChange: { type: Function as PropType<(value: any, rows: any) => void> },
  },
  setup(props, { emit, slots }) {
    const { t } = useProConfig();
    const visible = ref(false);

    const modelValues = computed<any[]>(() => {
      const val = props.modelValue;
      if (val === undefined || val === null) return [];

      if (props.parseValue$) {
        const parsed = props.parseValue$(val, props);
        return isArray(parsed) ? parsed : [parsed];
      }

      if (isArray(val)) return val;

      // 字符串情况，使用 separator$ 解析
      if (isString(val) && props.separator$) {
        return val.split(props.separator$);
      }

      return [val];
    });

    // 字段配置
    const valueKey = computed(() => props.fieldNames?.value || "value");
    const labelKey = computed(() => props.fieldNames?.label || "label");

    // 回显时的选项（保持原始数据格式）
    const showOptions = ref<any[]>([...(props.options || [])]);

    // watch options 变化，合并到 showOptions
    watch(
      () => props.options,
      (newOptions) => {
        if (!newOptions?.length) return;
        const existingValues = new Set(map(showOptions.value, (o) => get(o, valueKey.value)));
        const newItems = filter(newOptions || [], (o) => !existingValues.has(get(o, valueKey.value)));
        showOptions.value = [...showOptions.value, ...newItems];
      },
    );

    // showOptions Map，用于快速查找 label（key 是 value，value 是 label）
    const showOptionsMap = computed(() =>
      listToMap(showOptions.value, (item) => get(item, labelKey.value), { value: valueKey.value }),
    );

    // 占位符
    const placeholder = computed(() => props.placeholder || t.value("pleaseSelect"));

    // 打开弹窗
    const handleOpen = () => {
      if (props.disabled) return;
      visible.value = true;
    };

    // 清空选择
    const handleClear = () => {
      emit("update:modelValue", undefined);
      props.onChange?.(undefined, []);
    };

    // 单个 tag 移除
    const handleRemoveTag = (value: any) => {
      const index = modelValues.value.indexOf(value);
      if (index > -1) {
        const newValues = [...modelValues.value];
        newValues.splice(index, 1);
        const newValue = props.multiple ? newValues : undefined;
        emit("update:modelValue", newValue);
        props.onChange?.(
          newValue,
          filter(showOptions.value, (o) => includes(newValues, get(o, valueKey.value))),
        );
      }
    };

    // 从弹出层 TagsList 中移除
    const handleRemoveFromPopup = (value: any) => {
      handleRemoveTag(value);
    };

    // 清空所有选择
    const handleClearAll = () => {
      emit("update:modelValue", []);
      props.onChange?.([], []);
    };

    /* ********************** 弹出内容 curd-module ************************* */

    // 表格选择变化
    // 单选时 keys 是单个值，多选时是数组
    const handleSelectionChange = (keys: string | string[], rows: Record<string, any> | Record<string, any>[]) => {
      const isMulti = props.multiple;
      const keyArr = isMulti ? (keys as string[]) : ([keys] as string[]);
      const rowArr = isMulti ? (rows as Record<string, any>[]) : ([rows] as Record<string, any>[]);

      // 将选中行添加到 showOptions
      const existingValues = new Set(map(showOptions.value, (o) => get(o, valueKey.value)));
      forEach(rowArr, (r) => {
        const value = get(r, valueKey.value);
        if (!existingValues.has(value)) {
          showOptions.value = [...showOptions.value, r];
        }
      });

      // 直接触发选择（无需确认按钮）
      if (!isMulti) {
        // 单选：直接更新并关闭
        let finalValue = keyArr[0];
        if (props.formatValue$) {
          finalValue = props.formatValue$(keyArr, props);
        } else if (props.separator$) {
          finalValue = formatValue(keyArr, { multiple: false, separator: props.separator$ });
        }
        emit("update:modelValue", finalValue);
        props.onChange?.(finalValue, rows);
        visible.value = false;
      } else {
        // 多选：直接更新
        let finalValue = keyArr;
        if (props.formatValue$) {
          finalValue = props.formatValue$(keyArr, props);
        } else if (props.separator$) {
          finalValue = formatValue(keyArr, { multiple: true, separator: props.separator$ });
        }
        emit("update:modelValue", finalValue);
        props.onChange?.(
          finalValue,
          filter(showOptions.value, (o) => includes(keyArr, get(o, valueKey.value))),
        );
      }
    };

    // 获取 rowSelection 配置
    const rowSelection = computed(() => {
      return {
        ...props.curdModuleProps?.listProps?.tableProps?.rowSelection,
        type: props.multiple ? "multi" : "single",
        onChange: handleSelectionChange,
        selectedRowKeys: modelValues.value,
      };
    });

    const curdProps = computed(() => {
      const c = props.curdModuleProps;
      return {
        ...c,
        rowKey: valueKey.value,
        listType: "list",
        listProps: {
          ...c?.listProps,
          tableProps: {
            ...c?.listProps?.tableProps,
            rowKey: valueKey.value,
            rowSelection: rowSelection.value,
            selectedRowKeys: modelValues.value,
          },
          slots: {
            start: () => {
              if (!props.multiple || !props.showPopupTags) {
                return null;
              }
              return (
                <div class="pro-table-select-popup-header">
                  <TagsList
                    options={triggerOptions.value}
                    closable={true}
                    disabled={props.disabled}
                    onRemove={handleRemoveFromPopup}
                  />
                  {props.clearable && modelValues.value.length > 0 && (
                    <span class="pro-table-select-clear-icon" onClick={handleClearAll}>
                      {slots.clearIcon?.() || t.value("clear")}
                    </span>
                  )}
                </div>
              );
            },
            ...c?.listProps?.slots,
          },
        },
      };
    });

    // 获取组件
    const getComp = useGetCompByKey();
    const Modal = getComp(ElementKeys.ModalKey);
    const Popover = getComp(ElementKeys.PopoverKey);

    // trigger options（多选时）
    const triggerOptions = computed(() =>
      props.multiple
        ? modelValues.value.map((v) => ({
            label: get(showOptionsMap.value, v, v),
            value: v,
          }))
        : undefined,
    );

    // 单选时显示 label
    const triggerLabel = computed(() =>
      !props.multiple && modelValues.value[0] !== undefined
        ? get(showOptionsMap.value, modelValues.value[0], modelValues.value[0])
        : undefined,
    );

    // 传递给 trigger 插槽的参数
    const triggerProps = computed(() => ({
      options: triggerOptions.value,
      label: triggerLabel.value,
      disabled: props.disabled,
      placeholder: placeholder.value,
      clearable: props.clearable,
      isFocused: visible.value,
      collapseTags: props.collapseTags,
      collapseTagsTooltip: props.collapseTagsTooltip,
      maxCollapseTags: props.maxCollapseTags,
      onClick: handleOpen,
      onClear: handleClear,
      onRemove: handleRemoveTag,
    }));

    return () => {
      // 定义触发器节点
      const triggerNode = slots.trigger ? slots.trigger(triggerProps.value) : <TagsTrigger {...triggerProps.value} />;

      // modal 模式
      if (props.popupType === "modal" && Modal) {
        return (
          <>
            {triggerNode}
            <Modal
              class="pro-table-select-modal"
              title={t.value("pleaseSelect")}
              destroyOnClose
              footer={false}
              {...props.modalProps}
              v-model={visible.value}>
              <div class="pro-table-select-popup-content">
                <ProCurdModule {...(curdProps.value as any)} />
              </div>
            </Modal>
          </>
        );
      }

      // popover 模式
      if (props.popupType === "popover" && Popover) {
        return (
          <Popover
            class="pro-table-select-popover"
            trigger="click"
            disabled={props.disabled}
            {...props.popoverProps}
            v-model={visible.value}>
            {{
              default: () => triggerNode,
              content: () => (
                <div class="pro-table-select-popup-content">
                  <ProCurdModule {...(curdProps.value as any)} />
                </div>
              ),
            }}
          </Popover>
        );
      }

      // 默认触发器
      return triggerNode;
    };
  },
});
