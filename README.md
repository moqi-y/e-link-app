# E-Link 设备管理 App

一款基于 uniapp + Vue3 + Pinia 开发的蓝牙设备管理应用，支持通过蓝牙连接和管理设备。

## 技术栈

- **框架**: uniapp
- **前端框架**: Vue 3
- **状态管理**: Pinia
- **Node 版本**: v22.21.1
- **UI 组件库**: vue-icons-plus

## 项目预览

预览效果保存在 `/static/img-view/` 目录下：
![首页界面预览](https://github.com/moqi-y/e-link-app/blob/master/static/img-view/image-1.png)           
![蓝牙搜索界面](https://github.com/moqi-y/e-link-app/blob/master/static/img-view/image-2.jpg)           
![设备异常提示](https://github.com/moqi-y/e-link-app/blob/master/static/img-view/image-3.png)           
![设备停止界面](https://github.com/moqi-y/e-link-app/blob/master/static/img-view/image-4.png)           
![设备详情页](https://github.com/moqi-y/e-link-app/blob/master/static/img-view/image-5.png)     
![设备控制界面](https://github.com/moqi-y/e-link-app/blob/master/static/img-view/image-6.png)           
![设备控制界面](https://github.com/moqi-y/e-link-app/blob/master/static/img-view/image-7.png)               
![设备控制界面](https://github.com/moqi-y/e-link-app/blob/master/static/img-view/image-8.png)           

## 项目结构

```
├── pages/                    # 页面目录
│   ├── index/               # 首页 - 设备列表展示
│   ├── addDevice/          # 添加设备页面
│   └── deviceDetail/       # 设备详情页面
├── components/              # 公共组件
│   ├── DeviceError.vue     # 设备异常组件
│   └── DeviceStop.vue      # 设备停止组件
├── store/                    # Pinia 状态管理
│   └── blueTooth.js        # 蓝牙设备状态管理
├── static/                   # 静态资源
│   └── img-view/           # 预览图片
├── App.vue                  # 应用根组件
├── main.js                  # 应用入口
├── pages.json               # 页面路由配置
├── manifest.json            # 应用配置文件
└── uni.scss                 # uniapp 样式变量
```

## 功能特性

1. **蓝牙设备搜索**: 扫描周围可用蓝牙设备
2. **设备连接管理**: 连接/断开蓝牙设备
3. **设备列表展示**: 展示已连接的设备，支持去重
4. **设备详情查看**: 查看单个设备的详细信息
5. **设备状态监控**: 监控设备运行状态（正常/异常/停止）

## 运行项目

### 环境要求

- Node.js v22.21.1
- HBuilderX (uniapp 推荐开发工具)

### 安装依赖

```bash
npm install
```

### 运行项目

使用 HBuilderX 打开项目，选择运行到对应平台（微信小程序/App/H5等）。

## 页面说明

### 首页 (pages/index/index)
- 展示已连接的蓝牙设备列表
- 支持设备搜索和筛选

### 添加设备 (pages/addDevice/addDevice)
- 蓝牙设备搜索
- 设备配对和连接

### 设备详情 (pages/deviceDetail/deviceDetail)
- 设备详细信息展示
- 设备控制操作
- 设备状态监控

## 状态管理

使用 Pinia 管理蓝牙设备状态，主要功能：

- `connectedDevices`: 已连接设备列表
- `uniqueConnectedDevices`: 去重后的设备列表
- `connectedCount`: 已连接设备数量
- `addDevice()`: 添加设备
- `removeDevice()`: 移除设备
- `clearDevices()`: 清空所有设备

## 相关链接

- [uniapp 官方文档](https://uniapp.dcloud.io/)
- [Vue 3 文档](https://v3.vuejs.org/)
- [Pinia 文档](https://pinia.vuejs.org/)