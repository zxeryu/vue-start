# @vue-start/media 使用指南

`@vue-start/media` 提供媒体文件预览功能，支持图片、视频、音频、PDF 等多种格式。

## 安装

```bash
pnpm add @vue-start/media
```

## 预览组件

### ProPreview

文件预览组件。

```tsx
import { ProPreview } from '@vue-start/media';

<ProPreview
  visible={true}
  filePath="/path/to/file"
  fileType="image"
  onClose={() => {}}
/>
```

### Props

| 属性 | 类型 | 说明 |
|------|------|------|
| visible | boolean | 是否显示 |
| filePath | string | 文件路径 |
| fileType | 'image' \| 'video' \| 'audio' \| 'pdf' \| 'doc' | 文件类型 |
| onClose | () => void | 关闭回调 |

## 文件类型自动检测

```ts
import { getFileType } from '@vue-start/media/utils';

getFileType('test.jpg'); // 'image'
getFileType('video.mp4'); // 'video'
getFileType('document.pdf'); // 'pdf'
```
