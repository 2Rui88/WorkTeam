# 仓库配置

为当前电脑登记业务仓库，并选择你在项目里承担的角色。共享仓库信息在 `code/repositories.json`，本机路径和角色在 Git 忽略的 `code/projects.local.json`。

## 生成本地配置

<script setup>
import RepositorySettings from '../.vitepress/theme/RepositorySettings.vue'
</script>

<RepositorySettings />

将导出的文件保存到 WorkTeam 的 `code/projects.local.json`。已有配置可先导入再编辑。

## 检查本机仓库

如果本地还没有业务仓库，可以在 WorkTeam 根目录旁边检出：

```sh
git clone https://github.com/2Rui88/AI_CunChu_Agent.git ../AI_CunChu_Agent
```

命令行也可以生成配置。已有配置时，`workspace:init` 会保留原文件。

```sh
npm run workspace:init
npm run workspace:check
```

检查会输出本地仓库的提交号、工作区状态和所选角色，并验证 Git 根目录、`origin` 和登记的模块目录。相对路径从 WorkTeam 根目录解析，也支持绝对路径和 `~/`。浏览器页面校验配置格式，本机目录由命令行检查。角色选择用于展示协作范围，仓库访问由 Git 权限管理。
