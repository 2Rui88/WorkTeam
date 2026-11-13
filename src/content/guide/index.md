# 开始阅读

WorkTeam 提供项目知识、代码仓库入口和研发交接。网页由仓库里的 Markdown 生成，团队和 Agent 可以引用同一份资料。

## 本地打开

```sh
npm ci
npm run dev
```

使用终端打印的地址进入站点。运行 `npm run build` 可验证文档和内部链接，运行 `npm run preview` 可查看构建结果。

## 维护文档

在 `src/content/guide/` 维护使用说明，在 `src/content/example/` 维护 AI 云存储项目资料。每篇文档用一个一级标题命名，页面地址对应文件名，侧栏从一级标题生成。引用其他文档时使用相对路径。

## 开始了解示例

从 [AI 云存储项目](../example/index.md) 了解产品目标、源码位置和示例范围。
