import { computed, defineComponent, ExtractPropTypes, PropType, ref } from "vue";
import { Upload, UploadProps, UploadFile } from "ant-design-vue";
import { FileType } from "ant-design-vue/lib/upload/interface";
import { filter, isArray, isNumber, keys, map, omit, size } from "lodash";
import { createExposeObj, TFile } from "@vue-start/pro";
import { convertFileSize, isValidFileType, useWatch } from "@vue-start/hooks";

const uploadProps = () => ({
  //支持Form使用
  value: { type: Array as PropType<TFile[]>, default: undefined },
  //文件大小限制
  maxSize: { type: Number },
  //转换上传成功后服务端返回的数据
  convertResponseData: { type: Function as PropType<(res: any) => Record<string, any>> },
  //转换展示数据，拼接url
  convertItemData: {
    type: Function as PropType<(item: any) => UploadFile>,
    default: (item: any) => {
      return { ...item, status: item.status || "done" };
    },
  },
  //错误提示方法
  onErrorMsg: Function as PropType<(type: string, msg: string) => void>,
  //文件开始上传
  onStart: Function as PropType<(file: any) => void>,
});

export type ProUploadProps = Partial<ExtractPropTypes<ReturnType<typeof uploadProps>>> & Omit<UploadProps, "fileList">;

export const Uploader = defineComponent<ProUploadProps>({
  props: {
    ...omit(Upload.props, "fileList"),
    ...uploadProps(),
  } as any,
  setup: (props, { slots, expose, emit }) => {
    const uploadRef = ref();
    expose(createExposeObj(uploadRef, []));

    //fileList赋value的值
    const convertValue = (): UploadFile[] => {
      if (isArray(props.value)) {
        return map(props.value, (item) => props.convertItemData?.(item) || (item as any));
      }
      return [];
    };

    //绑定ElUpload的fileList对象
    const fileList = ref<UploadFile[]>(convertValue());

    //标记是否是内部操作引起的变化
    let changeByInside = false;

    const updateValue = () => {
      changeByInside = true;
      const validList = filter(fileList.value, (item) => item.status === "done");
      emit(
        "update:value",
        map(validList, (item) => props.convertResponseData?.(item) || item),
      );
      //form validate
    };

    useWatch(
      () => {
        if (!changeByInside) {
          fileList.value = convertValue();
          changeByInside = false;
        }
      },
      () => props.value,
    );

    const handleBeforeUpload = (file: FileType, fileList: FileType[]) => {
      if (props.beforeUpload) {
        return props.beforeUpload(file, fileList);
      }
      //类型校验
      if (props.accept) {
        if (!isValidFileType(props.accept, file.name)) {
          // @ts-ignore
          props.onErrorMsg?.("FileTypeError", `请上传正确格式（${props.accept.replace(/,/g, "，")}）的文件`);
          return false;
        }
      }
      //大小校验
      if (isNumber(file.size)) {
        if (file.size <= 0) {
          // @ts-ignore
          props.onErrorMsg?.("FileSizeError-Zero", `上传文件内容不能为空`);
          return false;
        }
        if (isNumber(props.maxSize) && file.size > props.maxSize) {
          // @ts-ignore
          props.onErrorMsg?.("FileSizeError-MaxSize", `请上传小于${convertFileSize(props.maxSize)}的文件`);
          return false;
        }
      }

      // @ts-ignore
      props.onStart?.(file);

      return true;
    };

    const showDefault = computed(() => {
      if (!isNumber(props.maxCount)) return true;
      return props.maxCount > size(fileList.value);
    });

    const customKeys = keys(uploadProps());

    return () => {
      return (
        <div>
          {slots.start?.()}
          <Upload
            v-model:fileList={fileList.value}
            {...omit(props, "fileList", "beforeUpload", "onChange", ...customKeys)}
            beforeUpload={handleBeforeUpload}
            onChange={(e: { file: UploadFile; fileList: UploadFile[] }) => {
              // @ts-ignore
              props.onChange?.(e);
              if (e.file.status === "done") {
                updateValue();
              }
            }}
            v-slots={omit(slots, "default")}>
            {showDefault.value && slots.default?.()}
          </Upload>
          {slots.end?.()}
        </div>
      );
    };
  },
});
