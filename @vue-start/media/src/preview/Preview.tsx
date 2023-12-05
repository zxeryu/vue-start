import { computed, defineComponent, ExtractPropTypes, PropType, reactive, ref } from "vue";
import { endsWith, some, toLower } from "lodash";
import { IRequestActor, download as downloadOrigin, TDownloadOptions } from "@vue-start/request";
import { useEffect } from "@vue-start/hooks";
import { AxiosResponse } from "axios";
import { Image } from "./Image";
import { Word } from "./Word";
import { Excel } from "./Excel";
import { Pdf } from "./Pdf";

const ImageType = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".jfif", ".bmp", ".ico"];
const ExcelType = [".xls", ".xlsx"];
const WordType = [".docx"];
const PdfType = [".pdf"];

const isValidType = (types: string[], name: string) => {
  if (!name) return false;
  const lowerName = toLower(name);
  return some(types, (item) => endsWith(lowerName, item));
};

export const isImageType = (name: string) => isValidType(ImageType, name);
export const isExcelType = (name: string) => isValidType(ExcelType, name);
export const isWordType = (name: string) => isValidType(WordType, name);
export const isPdfType = (name: string) => isValidType(PdfType, name);

const previewProps = () => ({
  //文件名称 或 `.${fileType}`
  name: String,
  //展示的文件名称，缺省为 name 值
  showName: String,
  /************ 下载相关 *************/
  actor: { type: [String, Object as PropType<IRequestActor>] },
  downloadOptions: { type: Object as PropType<TDownloadOptions> },
  /********** loading相关 *********/
  //组件
  Loading: { type: Object },
  loadingOpts: Object,
  /********** 子组件参数 *********/
  subProps: Object,
});

export type ProPreviewProps = Partial<ExtractPropTypes<ReturnType<typeof previewProps>>>;

export const ProPreview = defineComponent<ProPreviewProps>({
  props: {
    ...previewProps(),
  } as any,
  setup: (props, { slots, expose }) => {
    /*********************** download **************************/

    const state = reactive({
      loading: false,
      isSuccess: false,
    });

    const isSupport = computed(() => {
      const name = props.name;
      if (!name) return false;
      return isImageType(name) || isExcelType(name) || isWordType(name) || isPdfType(name);
    });

    const handleStart = () => {
      state.loading = true;
      props.downloadOptions?.onStart?.();
    };

    const handleFail = (err: Error) => {
      state.loading = false;
      state.isSuccess = false;
      props.downloadOptions?.onFail?.(err);
    };

    let originRes: AxiosResponse;

    const handleSuccess = (res: AxiosResponse) => {
      props.downloadOptions?.onSuccess?.(res);
      state.loading = false;
      state.isSuccess = true;

      originRes = res;
    };

    const download = () => {
      if (!props.actor) return;
      downloadOrigin(props.actor, {
        ...props.downloadOptions,
        onStart: handleStart,
        onFail: handleFail,
        onSuccess: handleSuccess,
      });
    };

    useEffect(() => {
      if (!isSupport.value) return;
      //下载文件
      download();
    }, isSupport);

    /*********************** print **************************/

    const imageRef = ref();
    const wordRef = ref();
    const excelRef = ref();
    const pdfRef = ref();

    //print
    const printOrigin = (innerHTML?: string) => {
      if (!innerHTML) return;
      const frame = document.createElement("iframe");
      frame.src = `${window.location.origin}/print$`;

      frame.style.position = "fixed";
      frame.style.bottom = "0px";
      frame.style.right = "0px";
      frame.style.display = "none";

      document.body.appendChild(frame);
      const win = frame.contentWindow;

      frame.onload = () => {
        win!.document.head.innerHTML = document.head.innerHTML;
        win!.document.title = props.name || "";
        win!.document.body.innerHTML = innerHTML;
        win!.print();
        setTimeout(() => {
          document.body.removeChild(frame);
        }, 0);
      };
    };

    const print = () => {
      if (isPdfType(props.name!)) {
        pdfRef.value?.print?.();
      } else if (isWordType(props.name!)) {
        printOrigin(wordRef.value?.domRef?.innerHTML);
      } else if (isImageType(props.name!)) {
        printOrigin(imageRef.value?.domRef?.innerHTML);
      }
    };

    expose({ download, print });

    const Loading: any = props.Loading;

    return () => {
      return (
        <div class={"pro-preview"}>
          {slots.start?.()}

          {!isSupport.value && (
            <div class={"pro-preview-not-support"}>
              {slots.notSupport ? slots.notSupport() : <span>暂不支持该格式文件预览</span>}
            </div>
          )}

          {state.loading ? (
            <>
              {Loading ? (
                <Loading loading {...props.loadingOpts}>
                  <div class={"pro-preview-loading-dom"} />
                </Loading>
              ) : (
                <div class={"pro-preview-loading-dom"} />
              )}
            </>
          ) : (
            <>
              {state.isSuccess ? (
                <>
                  {isImageType(props.name!) && (
                    <Image ref={imageRef} class={"pro-preview-image"} data={originRes!.data} {...props.subProps} />
                  )}
                  {isWordType(props.name!) && (
                    <Word ref={wordRef} class={"pro-preview-word"} data={originRes!.data} {...props.subProps} />
                  )}
                  {isExcelType(props.name!) && (
                    <Excel ref={excelRef} class={"pro-preview-excel"} data={originRes!.data} {...props.subProps} />
                  )}
                  {isPdfType(props.name!) && (
                    <Pdf ref={pdfRef} class={"pro-preview-pdf"} data={originRes!.data} {...props.subProps} />
                  )}
                </>
              ) : null}
            </>
          )}

          {slots.default?.()}
        </div>
      );
    };
  },
});
