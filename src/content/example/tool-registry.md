# 文件助手工具注册

| 文档状态 | 依据 |
| --- | --- |
| 已核对上游基线 | [AI_CunChu_Agent 4103c22](https://github.com/2Rui88/AI_CunChu_Agent/tree/4103c22c4578604bfc2b14f5f9f85b816c5e0396) |

## 产品要求

用户可以通过文件助手搜索或读取文件。请求分享或删除文件时，系统需要先要求用户确认。新增助手工具时，研发应能在一处登记工具定义、执行函数和危险操作标记。

## 技术入口

| 资料 | 对应内容 |
| --- | --- |
| [工具注册表](https://github.com/2Rui88/AI_CunChu_Agent/blob/4103c22c4578604bfc2b14f5f9f85b816c5e0396/backend/app/tool_registry.py) | 管理工具名称、参数、能力描述、处理函数和确认标记。 |
| [助手路由](https://github.com/2Rui88/AI_CunChu_Agent/blob/4103c22c4578604bfc2b14f5f9f85b816c5e0396/backend/app/routers/agent.py) | 从注册表读取工具定义、处理函数和确认标记。 |
| [回归测试](https://github.com/2Rui88/AI_CunChu_Agent/blob/4103c22c4578604bfc2b14f5f9f85b816c5e0396/backend/tests/test_tool_registry.py) | 校验注册表、危险操作分类和路由对注册表的依赖。 |

## 验收

[WT-001](../guide/tasks.md#wt-001) 记录了适用提交、检查项和实际验证结果。端到端文件分享与删除需在业务运行环境单独验证。
