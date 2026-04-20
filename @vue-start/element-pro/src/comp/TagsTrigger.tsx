import { computed, defineComponent, PropType, VNode } from "vue";
import { size } from "lodash";
import { ElTag } from "element-plus";
import { ElementKeys, useGetCompByKey } from "@vue-start/pro";

/******************************** TagsList 组件 *********************************/

const tagsListProps = () => ({
  // 选项数据: {label, value}
  options: { type: Array as PropType<Array<{ label: string; value: any }>> },
  // collapse-tags 配置 (参考 el-select)
  collapseTags: { type: Boolean, default: false },
  collapseTagsTooltip: { type: Boolean, default: false },
  maxCollapseTags: { type: Number, default: 1 },
  // 单个 tag 可关闭
  closable: { type: Boolean, default: true },
  // 是否禁用
  disabled: { type: Boolean, default: false },
  // 删除回调
  onRemove: { type: Function as PropType<(value: any) => void> },
});

export const TagsList = defineComponent({
  props: {
    ...tagsListProps(),
  },
  setup(props) {
    const getComp = useGetCompByKey();
    const Tooltip = getComp(ElementKeys.TooltipKey);

    // 缓存 options size 计算
    const optionSize = computed(() => size(props.options));
    const hasValue = computed(() => optionSize.value > 0);

    // collapseTags 模式下，计算显示数量
    const overflowCount = computed(() => {
      if (!hasValue.value || !props.collapseTags) return 0;
      return Math.max(0, optionSize.value - props.maxCollapseTags);
    });

    // 显示的标签
    const visibleOptions = computed(() => {
      if (!hasValue.value) return [];
      const options = props.options || [];
      // collapseTags 模式：只显示 maxCollapseTags 个标签
      if (props.collapseTags && optionSize.value > props.maxCollapseTags) {
        return options.slice(0, props.maxCollapseTags);
      }
      return options;
    });

    // 隐藏的标签（用于 Tooltip 展示）
    const hiddenOptions = computed(() => {
      if (!hasValue.value || !props.collapseTags) return [];
      const options = props.options || [];
      if (optionSize.value <= props.maxCollapseTags) return [];
      return options.slice(props.maxCollapseTags);
    });

    // Tooltip 内容缓存
    const tooltipContent = computed(() => (
      <div class="pro-tags-list">
        {hiddenOptions.value.map((item) => (
          <ElTag
            key={item.value}
            type={"info"}
            closable={props.closable && !props.disabled}
            onClose={(e: any) => {
              e.stopPropagation();
              props.onRemove?.(item.value);
            }}>
            {item.label}
          </ElTag>
        ))}
      </div>
    ));

    const handleRemove = (value: any, e: Event) => {
      e.stopPropagation();
      if (props.disabled) return;
      props.onRemove?.(value);
    };

    return () => {
      if (!hasValue.value) return null;

      return (
        <div class="pro-tags-list">
          {visibleOptions.value.map((item) => (
            <ElTag
              key={item.value}
              type={"info"}
              closable={props.closable && !props.disabled}
              onClose={(e) => handleRemove(item.value, e as any)}>
              {item.label}
            </ElTag>
          ))}
          {overflowCount.value > 0 &&
            (props.collapseTagsTooltip && Tooltip ? (
              <Tooltip v-slots={{ content: () => tooltipContent.value }} placement="top" effect="light">
                <ElTag class="pro-tags-overflow" type={"info"}>
                  +{overflowCount.value}
                </ElTag>
              </Tooltip>
            ) : (
              <ElTag class="pro-tags-overflow" type={"info"}>
                +{overflowCount.value}
              </ElTag>
            ))}
        </div>
      );
    };
  },
});

/******************************** TagsTrigger 组件 *********************************/

const tagsTriggerProps = () => ({
  ...tagsListProps(),
  // TagsTrigger 独有
  label: { type: String, default: "" },
  placeholder: { type: String, default: "" },
  // 是否聚焦（外部控制）
  isFocused: { type: Boolean, default: false },
  clearable: { type: Boolean, default: false },
  onClick: { type: Function as PropType<() => void> },
  onClear: { type: Function as PropType<() => void> },
  // 自定义渲染
  renderClose: { type: Function as PropType<() => VNode> },
  renderArrow: { type: Function as PropType<() => VNode> },
});

export const TagsTrigger = defineComponent({
  props: {
    ...tagsTriggerProps(),
  },
  setup(props) {
    const optionSize = computed(() => size(props.options));
    const hasValue = computed(() => optionSize.value > 0);

    const handleClear = (e: Event) => {
      e.stopPropagation();
      props.onClear?.();
    };

    const handleRemoveTag = (value: any) => {
      props.onRemove?.(value);
    };

    // 有值且非禁用时显示 clearable
    const showClearable = computed(() => {
      if (!props.clearable) return false;
      return hasValue.value;
    });

    const cls = "pro-tags-trigger";

    return () => {
      return (
        <div
          class={[cls, "el-input", { "is-disabled": props.disabled }]}
          onClick={props.disabled ? undefined : props.onClick}>
          <div class={["el-input__wrapper", { "is-focus": props.isFocused }]}>
            {hasValue.value ? (
              <TagsList
                options={props.options}
                collapseTags={props.collapseTags}
                collapseTagsTooltip={props.collapseTagsTooltip}
                maxCollapseTags={props.maxCollapseTags}
                closable={props.closable}
                disabled={props.disabled}
                onRemove={handleRemoveTag}
              />
            ) : props.label ? (
              <span class={`${cls}-label el-input__inner`}>{props.label}</span>
            ) : (
              <span class={`${cls}-placeholder el-input__inner`}>{props.placeholder}</span>
            )}
            <div class={`${cls}-arrow el-input__suffix`}>
              {hasValue.value && !props.disabled && showClearable.value ? (
                <>
                  <span class={`${cls}-close-icon`} onClick={handleClear}>
                    {props.renderClose?.()}
                  </span>
                  <span class={`${cls}-arrow-icon`}>{props.renderArrow?.()}</span>
                </>
              ) : (
                <span>{props.renderArrow?.()}</span>
              )}
            </div>
          </div>
        </div>
      );
    };
  },
});
