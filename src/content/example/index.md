# AI 云存储项目

[AI_CunChu_Agent](https://github.com/2Rui88/AI_CunChu_Agent) 是一个带对话式文件助手的私有云文件管理项目。用户上传文件后，系统异步提取并索引内容，随后可以用自然语言查找相关文件。

## 产品范围

| 能力 | 使用场景 |
| --- | --- |
| 文件管理 | 上传、下载、分享及管理自己的文件。 |
| 对话式搜索 | 根据文件内容或文件名描述查找文件。 |
| 文件助手 | 查看文件信息、读取内容以及发起需确认的操作。 |

## 系统入口

示例资料以 [上游提交 4103c22](https://github.com/2Rui88/AI_CunChu_Agent/tree/4103c22c4578604bfc2b14f5f9f85b816c5e0396) 为基线。

| 入口 | 用途 |
| --- | --- |
| `frontend/` | React 界面，包括文件列表和助手对话。 |
| `backend/` | FastAPI 服务、助手工具注册和检索逻辑。 |
| `docker/` | 业务系统的部署配置。 |
| `backend/tests/` | 工具注册、检索和队列等业务测试。 |

WorkTeam 的文档站可独立运行。业务服务的启动方式见 [示例项目 README](https://github.com/2Rui88/AI_CunChu_Agent/blob/4103c22c4578604bfc2b14f5f9f85b816c5e0396/README.md)。
