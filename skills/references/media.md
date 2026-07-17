# @vue-start/media 使用指南

`@vue-start/media` 提供媒体文件预览功能，支持图片、视频、音频、PDF、Office 文档等多种格式。

## 安装

```bash
pnpm add @vue-start/media
```

## 支持的文件类型

| fileType | 支持格式 | 说明 |
|----------|---------|------|
| `image` | jpg, jpeg, png, gif, bmp, webp, svg | 图片预览 |
| `video` | mp4, webm, ogg, mov | 视频播放 |
| `audio` | mp3, wav, ogg, flac | 音频播放 |
| `pdf` | pdf | PDF 文档预览 |
| `doc` | doc, docx, xls, xlsx, ppt, pptx | Office 文档预览（依赖 docx-preview） |

## 预览组件

### ProPreview

文件预览组件。

```tsx
import { defineComponent, ref } from "vue";
import { ProPreview } from "@vue-start/media";

export default defineComponent({
  setup() {
    const visible = ref(false);
    const filePath = ref("");
    const fileType = ref<"image" | "video" | "audio" | "pdf" | "doc">("image");

    const handlePreview = (path: string, type: string) => {
      filePath.value = path;
      fileType.value = type as any;
      visible.value = true;
    };

    return () => (
      <ProPreview
        visible={visible.value}
        filePath={filePath.value}
        fileType={fileType.value}
        onClose={() => (visible.value = false)}
      />
    );
  },
});
```

### Props

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `visible` | `boolean` | 是 | 是否显示预览 |
| `filePath` | `string` | 是 | 文件路径或 URL |
| `fileType` | `'image' \| 'video' \| 'audio' \| 'pdf' \| 'doc'` | 是 | 文件类型 |
| `onClose` | `() => void` | 否 | 关闭回调 |

### 事件

| 事件 | 说明 |
|------|------|
| `onClose` | 预览关闭时触发 |

### 错误处理

如果文件路径无效或格式不支持，组件内部会显示错误提示。建议在调用前进行校验：

```tsx
import { getFileType } from "@vue-start/media/utils";

const handlePreview = (filePath: string) => {
  const type = getFileType(filePath);
  if (!type) {
    ElMessage.error("不支持的文件格式");
    return;
  }
  // 打开预览
  fileType.value = type;
  visible.value = true;
};
```

## 文件类型自动检测

```ts
import { getFileType } from "@vue-start/media/utils";

getFileType("photo.jpg");       // "image"
getFileType("video.mp4");       // "video"
getFileType("audio.mp3");       // "audio"
getFileType("document.pdf");    // "pdf"
getFileType("report.docx");     // "doc"
getFileType("sheet.xlsx");      // "doc"
getFileType("unknown.xyz");     // undefined
```
