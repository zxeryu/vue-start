import { computed, defineComponent, ExtractPropTypes, PropType, ref, VNode } from "vue";
import { ElUpload, UploadFiles, UploadFile, UploadRawFile, UploadProps, useFormItem, ElLoading } from "element-plus";
import { createExposeObj, TFile, useProConfig } from "@vue-start/pro";
import { filter, isArray, isBoolean, isNumber, keys, map, omit, size } from "lodash";
import { isValidFileType, convertFileSize, useWatch, useEffect } from "@vue-start/hooks";

const uploadProps = () => ({
  //支持Form使用
  modelValue: { type: Array as PropType<TFile[]>, default: undefined },
  //文件大小限制
  maxSize: { type: Number },
  //转换上传成功后服务端返回的数据
  convertResponseData: { type: Function as PropType<(res: any) => Record<string, any>> },
  //转换展示数据，拼接url
  convertItemData: {
    type: Function as PropType<(item: any) => UploadFile>,
    default: (item: any) => {
      return { ...item, status: item.status || "success" };
    },
  },
  //错误提示方法
  onErrorMsg: Function as PropType<(type: string, msg: string) => void>,
  //文件开始上传
  onStart: Function as PropType<(file: any) => void>,
  //重写
  beforeUpload: { type: Function },
  //上传过程中 全局loading
  globalLoading: { type: [Boolean, Object], default: undefined },
  //
  renderDom: { type: Function as PropType<() => VNode>, default: undefined },
});

export type ProUploadProps = Partial<ExtractPropTypes<ReturnType<typeof uploadProps>>> & Omit<UploadProps, "fileList">;

export const UploadMethods = ["abort", "submit", "clearFiles", "handleStart", "handleRemove"];

export const ProUploader = defineComponent<ProUploadProps>({
  props: {
    ...omit(ElUpload.props, "fileList"),
    ...uploadProps(),
  } as any,
  setup: (props, { slots, expose, emit }) => {
    const { showMsg, t } = useProConfig();

    const uploadRef = ref();
    expose(createExposeObj(uploadRef, UploadMethods));

    //取出当前的formItem属性（如果存在form中），内容变化的时候触发验证
    const { formItem } = useFormItem();

    //fileList赋modelValue的值
    const convertValue = (): UploadFile[] => {
      if (isArray(props.modelValue)) {
        return map(props.modelValue, (item) => props.convertItemData?.(item) || (item as any));
      }
      return [];
    };

    //绑定ElUpload的fileList对象
    const fileList = ref<UploadFile[]>(convertValue());

    //标记是否是内部操作引起的变化
    let changeByInside = false;

    const updateModelValue = () => {
      changeByInside = true;
      const validList = filter(fileList.value, (item) => item.status === "success");
      emit(
        "update:modelValue",
        map(validList, (item) => props.convertResponseData?.(item) || item),
      );
      //form validate
      formItem?.validate?.("change");
    };

    useWatch(
      () => {
        if (!changeByInside) {
          fileList.value = convertValue();
          changeByInside = false;
        }
      },
      () => props.modelValue,
    );

    /*********************** globalLoading ********************************/
    let loadingInstance: undefined | { close: () => void };
    const showLoading = () => {
      if (props.globalLoading) {
        loadingInstance = ElLoading.service({
          lock: true,
          text: t.value("uploadingWatting"),
          ...(isBoolean(props.globalLoading) ? {} : props.globalLoading),
        });
      }
    };
    const hideLoading = () => {
      if (props.globalLoading) {
        loadingInstance?.close();
      }
    };

    //组件卸载，关闭loading
    useEffect(() => {
      return () => {
        hideLoading();
      };
    }, []);

    /*********************** 回调 ********************************/

    const onMsg = (type: string, msg: string, opts?: any) => {
      if (props.onErrorMsg) {
        props.onErrorMsg(type, msg);
        return;
      }
      showMsg({ type: "error", message: msg });
    };

    const handleBeforeUpload = (file: UploadRawFile) => {
      if (props.beforeUpload) {
        return props.beforeUpload(file);
      }
      //类型校验
      if (props.accept) {
        if (!isValidFileType(props.accept, file.name)) {
          onMsg("FileTypeError", `请上传正确格式（${props.accept.replace(/,/g, "，")}）的文件`, {
            accept: props.accept.replace(/,/g, "，"),
          });
          return false;
        }
      }
      //大小校验
      if (isNumber(file.size)) {
        if (file.size <= 0) {
          onMsg("FileSizeError-Zero", `上传文件内容不能为空`);
          return false;
        }
        if (isNumber(props.maxSize) && file.size > props.maxSize) {
          onMsg("FileSizeError-MaxSize", `请上传小于${convertFileSize(props.maxSize)}的文件`, {
            maxSize: convertFileSize(props.maxSize),
          });
          return false;
        }
      }

      // @ts-ignore
      props.onStart?.(file);
      showLoading();

      return true;
    };

    const handleSuccess = (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
      props.onSuccess?.(response, uploadFile, uploadFiles);
      updateModelValue();
      hideLoading();
    };

    const handleError = (error: Error, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
      props.onError?.(error, uploadFile, uploadFiles);
      hideLoading();
      onMsg("UploadError", "上传失败");
    };

    const handleRemove = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
      fileList.value = filter(fileList.value, (item) => {
        if (uploadFile.uid === item.uid && uploadFile.name === item.name) return false;
        return true;
      });
      props.onRemove?.(uploadFile, uploadFiles);
      updateModelValue();
    };

    //是否展示触发dom
    const showDefault = computed(() => {
      if (!isNumber(props.limit)) return true;
      return props.limit > size(fileList.value);
    });

    const customKeys = keys(uploadProps());

    return () => {
      return (
        <div class={`pro-uploader ${showDefault.value ? "" : "pro-uploader-limit"}`}>
          {slots.start?.()}
          <ElUpload
            ref={uploadRef}
            v-model:fileList={fileList.value}
            {...omit(props, "fileList", "onSuccess", "onError", "onRemove", "beforeUpload", ...customKeys)}
            beforeUpload={handleBeforeUpload}
            onSuccess={handleSuccess}
            onError={handleError}
            onRemove={handleRemove}
            v-slots={omit(slots, "default")}>
            {showDefault.value && <>{slots.default?.() || props.renderDom?.()}</>}
          </ElUpload>
          {slots.end?.()}
        </div>
      );
    };
  },
});
