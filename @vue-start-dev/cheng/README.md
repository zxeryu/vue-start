# cheng node server

> 一个提供读写的 node 服务，为前端工程本地研发提供读写文件支持。

## 技术栈

- Node.js
- Express
- Lodash
- TypeScript

## 项目特点

1. RESTful API 设计
2. API 返回统一的结构体
3. 以函数为主，不体现类（class）概念

## 工具功能

- 文件读写

## 快速开始

```bash
# 安装依赖
npm install

# 启动服务
npm run dev
```

## API 说明

| API       | 方法     | 参数             | 说明           |
| --------- | -------- | ---------------- | -------------- |
| fileList  | `GET`    |                  | 获取文件列表   |
| file      | `GET`    | `filePath`           | 获取文件内容   |
| file      | `POST`   | `filePath`, `content`| 保存文件内容   |
| file      | `DELETE` | `filePath`           | 删除文件       |

### 统一返回结构体

所有 API 返回如下结构体：

```json
{
  "code": 0,
  "msg": "success",
  "data": {}
}
```

- `code`：0 表示成功，非 0 表示失败
- `msg`：提示信息
- `data`：返回数据内容

### 请求示例

#### 获取文件列表

```
GET /api/fileList
```

#### 获取文件内容

```
GET /api/file?filePath=xxx.txt
```

#### 保存文件内容

```
POST /api/file
Content-Type: application/json

{
  "filePath": "xxx.txt",
  "content": "文件内容"
}
```

#### 删除文件

```
DELETE /api/file?filePath=xxx.txt
```
