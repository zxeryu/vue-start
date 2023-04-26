# @vue-start/media

媒体文件处理,暂时只支持预览功能

## Preview

> 文件预览组件，支持格式： .docx,.xls,.xlsx,.pdf,.png,.jpg,.jpeg 等

## API

### 属性

| 名称              | 说明                                                | 类型                     | 默认值 |
| ----------------- | --------------------------------------------------- | ------------------------ | ------ |
| `name`            | 文件名称（根据后缀区分类型类型）                    | `string`                 | --     |
| `actor`           | 文件 url 或 RequestActor                            | `string` `IRequestActor` | --     |
| `downloadOptions` | 下载 options，详见 @vue-start/request download 方法 | `TDownloadOptions`       | --     |
| `Loading`         | Loading 组件                                        | `Component`              | --     |
| `loadingOpts`     | Loading 组件参数                                    | `LoadingProps`           | --     |
| `subProps`        | 子组件(Image,Pdf,Word,Excel)参数                    | `object`                 | --     |

```ts
export type TDownloadOptions = {
  onSuccess: (res: AxiosResponse) => void;
  onFail?: (err: Error) => void;
  onStart?: () => void;
  //转换请求参数
  convertConfig?: (config: AxiosRequestConfig) => AxiosRequestConfig;
  //判断内容是否是错误消息
  isErrorContent?: (content: Record<string, any>) => boolean;
};
```

```ts
// subProps 属性在不同文件预览组件中的值类型

// Pdf
const PdfSubProps = {
  //转换iframe url方法
  convertFrameUrl: (url: string) => string,
};

// Excel

const ExcelSubProps = {
  //x-data-spreadsheet 库的实例化方法
  spreadsheetOptions: object,
};
```

### 事件

--

### 插槽

| 名称         | 说明                 | 类型  |
| ------------ | -------------------- | ----- |
| `notSupport` | 自定义不支持展示内容 | VNode |
| `start`      | --                   | VNode |
| `default`    | --                   | VNode |
