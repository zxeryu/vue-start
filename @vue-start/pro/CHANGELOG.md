# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 0.5.44

- feat：Page 新增 sub 属性， 返回按钮展示状态添加 sub 判断
- feat：useProRouter 中 router 的 back 方法在 tabs 模式下，会关闭当前 tab 并且返回

# 0.5.42

- fix：Layout tabs 子页面 query 判断 bug
- perf：show 组件添加 render 重写方法、添加 class
- perf：refresh 当前路由方法提取到 layout provide 中
- feat：page 新增 layoutTabsBackMode 属性，开启后，在 layout 中的 page showBack 设置为 false

# 0.5.41

- 更新主题渐变色计算方法
- Layout tabs bug 修复（tabs 切换参数丢失、hide 页面缓存更新、layout 初始化 tab）
- Layout tabs 拖动钩子 onDragRegister

# 0.5.40

- 新增 theme 模式
- Layout css 变量位置由:root 迁移到.pro-layout
- Layout menu 新增 hide 模式
- Layout 新增 tabs 组件，可通过配置处理

# 0.5.39

- bug 修复；

# 0.5.38

- 新增 ProTip 组件
- ProFormItem label 新增 tip 提示配置
- ProOperate items 新增 tip 提示配置
- ProTable operate element 方法参数换为 item 重写后的对象
- ProForm class 新增 empty 标记

# 0.5.37

- ProPage class 新增 has-header has-footer 标记
- ProForm 新增 userOpe 属性：标记用户是否操作过 Form

# 0.5.36

- ProTable 新增 toolbar 高度计算，值为 css 变量：--pro-table-toolbar-hei；
- ProLayout Scroll 组件支持（element-plus）；
- ProPage Scroll 组件支持（element-plus）；pro-page-sub 模式（支持 PageCurd 场景）

# 0.5.33

- ProTable 新增 mergeOpts 属性，支持行、列合并

# [0.4.0](https://github.com/zxeryu/vue-start/compare/@vue-start/pro@0.3.2...@vue-start/pro@0.4.0) (2022-09-02)

### Bug Fixes

- **pro:** curd columns sign ([19ca887](https://github.com/zxeryu/vue-start/commit/19ca887b2f0826c64a0cae7b6abe093ab6d1f525))
- **pro:** dispatch support fun ([9c9528c](https://github.com/zxeryu/vue-start/commit/9c9528cf305e6e3bf1daebc57afb5d5ac9d9fd21))

### Features

- module render ([1e14e95](https://github.com/zxeryu/vue-start/commit/1e14e956e8712db277d2e9020b392243b454a846))

### Performance Improvements

- props/slots convert ([06c9655](https://github.com/zxeryu/vue-start/commit/06c9655f0622278e18770699b1d643fe10cbbdca))

## [0.3.2](https://github.com/zxeryu/vue-start/compare/@vue-start/pro@0.3.1...@vue-start/pro@0.3.2) (2022-08-29)

### Bug Fixes

- bug ([766cfc0](https://github.com/zxeryu/vue-start/commit/766cfc00c621bc4a9b30087540043a96db2df9be))

## [0.3.1](https://github.com/zxeryu/vue-start/compare/@vue-start/pro@0.3.0...@vue-start/pro@0.3.1) (2022-08-23)

### Bug Fixes

- **pro:** merge bug ([1155218](https://github.com/zxeryu/vue-start/commit/115521827bc31c11091c23d16a596bd825aedcf1))

# [0.3.0](https://github.com/zxeryu/vue-start/compare/@vue-start/pro@0.2.0...@vue-start/pro@0.3.0) (2022-08-22)

### Bug Fixes

- **element-pro:** loading ([c512f63](https://github.com/zxeryu/vue-start/commit/c512f638f06acab64242bf85b2475b860097061e))
- **element-pro:** serial number for table ([32e12aa](https://github.com/zxeryu/vue-start/commit/32e12aa6bdd494464bc2839eaaed5d8ce66330a5))
- **pro:** ts error ([2daa4e9](https://github.com/zxeryu/vue-start/commit/2daa4e95031a52526860fbc863087aaedd30e3ff))

### Features

- **pro:** modal/page curd ([07b696c](https://github.com/zxeryu/vue-start/commit/07b696cf2a327d4ec083ec75f3d5b73c870bfcb3))

### Performance Improvements

- **pro:** columnState for table,form ([7f4431e](https://github.com/zxeryu/vue-start/commit/7f4431ebf2d426b93a24e381712d705700561ec9))

# [0.2.0](https://github.com/zxeryu/vue-start/compare/@vue-start/pro@0.1.0...@vue-start/pro@0.2.0) (2022-08-17)

### Bug Fixes

- **element-pro:** bug ([2e4c694](https://github.com/zxeryu/vue-start/commit/2e4c69469a3babd4d08ea13c934a71a31df5b743))
- **element-pro:** grid ([6b435c7](https://github.com/zxeryu/vue-start/commit/6b435c796890dc1e253f35f7b622bb14041c01cf))
- **pro:** curd sub action ([f389009](https://github.com/zxeryu/vue-start/commit/f389009b9890844d51c6ad92279ac308e7686517))
- **pro:** refresh list ([d07ff48](https://github.com/zxeryu/vue-start/commit/d07ff484918271516db2aeca7727eb83dfad63ff))
- **request:** support provide ([212a41b](https://github.com/zxeryu/vue-start/commit/212a41b3c056c3acf38d65c3f1e7a8e388bc9052))

### Features

- **pro:** abstract form ([f848aab](https://github.com/zxeryu/vue-start/commit/f848aabe5bec62600f7eb3575c85654ed778b3c6))
- **pro:** abstract table ([3c26fde](https://github.com/zxeryu/vue-start/commit/3c26fde0f72e541bf3d2176c91748c7d8105341d))

# 0.1.0 (2022-08-12)

### Bug Fixes

- **element-pro:** curd schema form ([175f9e7](https://github.com/zxeryu/vue-start/commit/175f9e70482009afd118573be6e716535f584043))
- **pro:** curd request props ([daf2fca](https://github.com/zxeryu/vue-start/commit/daf2fca7876c2a9f4c155400edb3fdd99fa9f825))

### Features

- **pro:** pro 组件抽象层重构 ([0ba27c5](https://github.com/zxeryu/vue-start/commit/0ba27c591c7a6eebce2c1986908e295194a6f326))

### Performance Improvements

- **pro:** requests to operates ([9b69165](https://github.com/zxeryu/vue-start/commit/9b6916582a4c15a7012c3267126b00c065b32d23))
