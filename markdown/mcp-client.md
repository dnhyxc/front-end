### MCP 简介

[MCP](https://modelcontextprotocol.io/introduction) 全称（Model Context Protocol），即「模型上下文协议」。简单来说 MCP 其实就是大模型的一个标准工具箱，大模型可以通过这些工具与外界进行交互，获取数据等等。

![mcp-use.png](http://dnhyxc.cn/image/__ARTICLE_IMG__df627302ca1f6630f71afe08d36350883n66efe5c8d80d0da837a3e600h1744731268278.webp)

大部分的 MCP 协议都是通过本地 node 或者 python 启动的。

### Resources, Prompts 和 Tools

在 MCP 客户端协议中，有三个非常重要的能力类别，分别是：

1. Resources: 定制化地请求和访问本地的资源，可以是文件系统、数据库、当前代码编辑器中的文件等等原本网页端的 app 无法访问到的 静态资源。额外的 resources 会丰富发送给大模型的上下文，使得 AI 给我们更加精准的回答。

2. Prompts: 定制化一些场景下可供 AI 进行采纳的 prompt，比如如果需要 AI 定制化地返回某些格式化内容时，可以提供自定义的 prompts。

3. Tools: 可供 AI 使用的工具，它必须是一个函数，比如预定酒店、打开网页、关闭台灯这些封装好的函数就可以是一个 tool，大模型会通过 function calling 的方式来使用这些 tools。 Tools 将会允许 AI 直接操作我们的电脑，甚至和现实世界发生交互。

### MCP 的作用

要知道，大模型本身只有问答功能，并不具备调用外部工具的能力。而 MCP 就能让大模型拥有调用外部工具的能力。

核心价值：

1. 避免数据孤岛：打通了本地/云端数据源。

2. 避免重复开发：开发者只需要适配 MCP 协议。

3. 避免生态割裂：形成统一工具市场。

### MCP 工作流程

![mcp server.png](http://dnhyxc.cn/image/__ARTICLE_IMG__ddd419c47b6bd5411ed308fe79b1d4d4bn66efe5c8d80d0da837a3e600h1744729822676.webp)

### MCP 使用

要使用 MCP，需要电脑具备 node 或者 Python 执行环境，因为 MCP 服务多半是通过 `npx` 或者 `uvx` 执行的。

1. 配置 **npx** 环境：可下载 `nvm` 进行 node 版本的管理，或者直接下载对应版本的 nodejs 安装后即可具备 npx 运行环境。

2. 配置 **uvx** 环境：可以使用官方提供的安装脚本，也可以通过 pip 来安装。

```json
# On macOS and Linux.
curl -LsSf https://astral.sh/uv/install.sh | sh

# On Windows.
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"

# With pip.
pip install uv
```

### 在 Trae 中或者 Cline 插件中使用

Trae 目前，只有国际版支持 MCP，如果不想使用国际版，也可以安装 Cursor 或者 Cline 插件进行使用，配置方式都是相同的，只需要找到 MCP 配置，Cline 找到 **Configure MCP Servers**、Trae 找到 **MCP 手动配置**，点击打开 **mcp json** 将如下文件配置放入即可：

- mac 电脑：

```json
{
	"mcpServers": {
		"github.com/modelcontextprotocol/servers/tree/main/src/github": {
			"command": "npx",
			"args": ["-y", "@modelcontextprotocol/server-github"],
			"env": {
				"GITHUB_PERSONAL_ACCESS_TOKEN": "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"
			}
		},
		"mcp-atlassian": {
			"command": "uvx",
			"args": [
				"mcp-atlassian",
				"--confluence-url=https://wiki.dnhyxc.com",
				"--confluence-personal-token=MjY1Njg2MTY5Njg4OjNNbBJDW9krlyuSuOH9f/E873VW",
				"--jira-url=https://jira.dnhyxc.com",
				"--jira-personal-token=MDgyNTcxMDYwNTE1Opb/e1xCMAMXNY0V7mDQQokaHvzW"
			]
		}
	}
}
```

!!! info 安装了 uvx，但还是无法找到
如果已经安装了 uxv，但是还是现实无法找到，可以通过 which uvx 找到 uvx 的安装位置，之后将 "command": "uvx" 改为 "command": "/Users/dnhyxc/.local/bin/uvx"（即通过 which uvx 找到的安装目录）。
!!!

- windows：

```json
{
  "mcpServers": {
    "github.com/modelcontextprotocol/servers/tree/main/src/github": {
      "command": "cmd",
      "/c",
      "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "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"
      },
    },
    "mcp-atlassian": {
      "command": "cmd",
      "args": [
        "/c",
        "uvx",
        "mcp-atlassian",
        "--confluence-url=https://wiki.dnhyxc.com",
        "--confluence-personal-token=MjY1Njg2MTY5Njg4OjNNbBJDW9krlyuSuOH9f/E873VW",
        "--jira-url=https://jira.dnhyxc.com",
        "--jira-personal-token=MDgyNTcxMDYwNTE1Opb/e1xCMAMXNY0V7mDQQokaHvzW"
      ]
    }
  }
}
```

!!! abstract 配置的区别
区别在于 command 和 args，windows 系统需要将 command 的值改为 cmd，然后在 args 中增加 /c 和 npx。
!!!

### MCP Server 实现

实现一个 mongodb 数据库查询文章以及 ai 聊天历史记录的 MCP Server，具体如下：

```ts
import {
	McpServer,
	ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { MongoClient } from "mongodb";

// MongoDB连接配置
const MONGO_URI = "mongodb://localhost:27017";
const DB_NAME = "blog_web";
const ARTICLES_COLLECTION = "articles";
const USERS_COLLECTION = "ais";

// 创建MCP服务器实例
const server = new McpServer({
	name: "mongo-mcp-server",
	version: "1.0.0",
});

// 初始化MongoDB客户端
const mongoClient = new MongoClient(MONGO_URI);

// 文章查询工具
server.tool(
	"query-articles",
	{
		// 支持多种查询条件
		title: z.string().nullish().optional(),
		authorName: z.string().nullish().optional(),
		createTime: z.string().nullish().optional(),
		limit: z.number().optional().default(99999),
	},
	async ({ title, authorName, createTime, limit = 99999 }) => {
		try {
			await mongoClient.connect();
			const db = mongoClient.db(DB_NAME);
			const collection = db.collection(ARTICLES_COLLECTION);
			// 构建查询条件
			const query: any = {};
			if (title) query.title = { $regex: title, $options: "i" };
			if (authorName) query.authorName = authorName;
			if (createTime) query.createTime = createTime;
			// 执行查询
			const articles = await collection.find(query).limit(limit).toArray();
			// 格式化结果
			const formatted = articles.map((article) => ({
				title: article.title,
				author: article.author,
				content: article.content,
				createTime: article.createTime,
				url: article.url || `articles://${article._id}`,
			}));

			return {
				content: [
					{
						type: "text",
						text: JSON.stringify(formatted, null, 2),
					},
				],
			};
		} catch (error) {
			return {
				content: [
					{
						type: "text",
						text: `查询失败: ${(error as Error).message}`,
					},
				],
			};
		} finally {
			await mongoClient.close();
		}
	}
);

// 用户信息查询工具
server.tool(
	"query-ai-history",
	{
		chatId: z.string().nullish().optional(),
		userId: z.string().nullish().optional(),
		role: z.string().nullish().optional(),
		limit: z.number().nullish().optional(99999),
	},
	async ({ chatId, role, userId, limit = 99999 }) => {
		try {
			await mongoClient.connect();
			const db = mongoClient.db(DB_NAME);
			const collection = db.collection(USERS_COLLECTION);

			// 构建查询条件
			const query: any = {};
			if (chatId) query.chatId = chatId;
			if (userId) query.userId = userId;
			if (role) query.role = role;

			// 执行查询
			const ais = await collection.find(query).limit(limit).toArray();

			// 格式化结果
			const formatted = ais.map((ai) => ({
				chatId: ai.chatId,
				role: ai.role,
				title: ai.title,
				userId: ai.userId,
				messages: ai.messages,
				createTime: ai.createTime,
			}));

			return {
				content: [
					{
						type: "text",
						text: JSON.stringify(formatted, null, 2),
					},
				],
			};
		} catch (error) {
			return {
				content: [
					{
						type: "text",
						text: `查询失败: ${(error as Error).message}`,
					},
				],
			};
		} finally {
			await mongoClient.close();
		}
	}
);

// 文章资源
server.resource(
	"article",
	new ResourceTemplate("articles://{authorName}", { list: undefined }),
	async (uri, { authorName }) => {
		try {
			await mongoClient.connect();
			const db = mongoClient.db(DB_NAME);
			const collection = db.collection(ARTICLES_COLLECTION);

			const articles = await collection.find({ authorName }).toArray();
			if (!articles || articles.length === 0) {
				return {
					contents: [
						{
							uri: uri.href,
							text: "未找到指定文章",
						},
					],
				};
			}

			const formatted = articles.map((article) => ({
				title: article.title,
				id: article._id,
				author: article.author,
				content: article.content,
				createTime: article.createTime,
				url: article.url || `articles://${article._id}`,
			}));

			return {
				contents: [
					{
						uri: uri.href,
						text: JSON.stringify(formatted, null, 2),
					},
				],
			};
		} catch (error) {
			return {
				contents: [
					{
						uri: uri.href,
						text: `获取文章失败: ${(error as Error).message}`,
					},
				],
			};
		} finally {
			await mongoClient.close();
		}
	}
);

// 启动服务器
const transport = new StdioServerTransport();
server.connect(transport).then(() => {
	console.log("MongoDB MCP服务器已启动");
});
```

### MCP Client 实现

使用 MCP Client 和 DeepSeek 接入 MCP server，具体实现如下：

```ts
import OpenAI from "openai";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

const client = new OpenAI();

// 初始化 MCP 客户端
let mcpClient: Client | null = null;

// 连接到 MCP 服务器
async function connectToMcpServer(serverName: string = "exa") {
	try {
		const transport = new StdioClientTransport({
			command: "npx",
			args: ["-y", "exa-mcp-server"],
		});

		mcpClient = new Client({
			name: "openai-mcp-client",
			version: "1.0.0",
		});

		mcpClient.connect(transport);

		const toolsResult = await mcpClient.listTools();
		console.log(
			"已连接到 MCP 服务器，可用工具：",
			toolsResult.tools.map((tool) => tool.name)
		);

		return toolsResult.tools;
	} catch (error) {
		console.error("连接 MCP 服务器失败：", error);
		throw error;
	}
}

// 调用 MCP 工具
async function callMcpTool(toolName: string, args: any) {
	if (!mcpClient) {
		throw new Error("MCP 客户端未初始化");
	}

	try {
		const result = await mcpClient.callTool({
			name: toolName,
			arguments: args,
		});

		return result;
	} catch (error) {
		console.error(`调用 MCP 工具 ${toolName} 失败：`, error);
		throw error;
	}
}

// 主函数
async function main() {
	// 连接到 Exa MCP 服务器
	const mcpTools = await connectToMcpServer("exa");
	console.log("mcpTools", mcpTools);

	// 维护整个对话历史消息数组
	const messages: ChatCompletionMessageParam[] = [
		{
			role: "user",
			content: "明天杭州的天气怎么样",
		},
	];

	// 第一次调用 API
	const response = await client.chat.completion.create({
		model: "deepseek-chat",
		messages,
		tools: mcpTools.map((tool) => ({
			type: "function",
			function: {
				name: tool.name,
				description: tool.description || "",
				parameters: tool.inputSchema,
			},
		})),
	});

	console.log("response", response.choices[0]?.message);

	// 将 AI 回复添加到历史会话中
	messages.push(response.choices[0]?.message);

	// 处理工具调用
	if (response.choices[0]?.message?.tool_calls) {
		const toolCalls = response.choices[0]?.message.tool_calls;

		// 如果有工具调用，发送第二次请求获取最终回复
		if (toolCalls.length > 0) {
			for (const toolCall of toolCalls) {
				const args = JSON.parse(toolCall.function.arguments);
				const mcpResult = await callMcpTool(toolCall.function.name, args);
				console.log("mcpResult", mcpResult);

				// 将工具调用结果添加到历史会话中
				messages.push({
					tool_call_id: toolCall.id,
					role: "tool",
					content:
						typeof mcpResult.content === "string"
							? mcpResult.content
							: JSON.stringify(mcpResult.content),
				});
			}

			const secondResponse = await client.chat.completions.create({
				model: "deepseek-chat",
				messages,
			});

			// 将最终回复添加到历史消息中
			messages.push(secondResponse.choices[0]?.message);

			console.log("最终回复：", secondResponse.choices[0]?.message.content);
		} else {
			console.log("AI回复：", response.choices[0]?.message.content);
		}

		// 关闭 MCP 客户端
		if (mcpClient) {
			await mcpClient.close();
		}

		// 打印完成历史对话
		console.log("\n完成历史对话内容：");
		messages.forEach((msg, index) => {
			const contentPreview = msg.content
				? typeof msg.content === "string"
					? msg.content.substring(0, 50) +
					  (msg.content.length > 50 ? "..." : "")
					: JSON.stringify(msg.content).substring(0, 50) + "..."
				: "(无内容)";
			console.log(`[${index}] ${msg.role}: ${contentPreview}`);
		});
	}
}

// 执行主函数
main().catch((error) => {
	console.error("程序执行出错", error);
});
```

![image.png](http://dnhyxc.cn/image/__ARTICLE_IMG__d91ada3d4e477019d4c1cc1f7d29e349dn66efe5c8d80d0da837a3e600h1745800526604.webp)

![image.png](http://dnhyxc.cn/image/__ARTICLE_IMG__dd859ac558cd40173cbc36435852397e6n66efe5c8d80d0da837a3e600h1745800581061.webp)

![image.png](http://dnhyxc.cn/image/__ARTICLE_IMG__d8141883cc6f6efabf5d407d42c9a3023n66efe5c8d80d0da837a3e600h1745800605282.webp)

![image.png](http://dnhyxc.cn/image/__ARTICLE_IMG__d7113915a3ec19041be3678c46388e4bdn66efe5c8d80d0da837a3e600h1745800684774.webp)

![image.png](http://dnhyxc.cn/image/__ARTICLE_IMG__d71236989dbe660942afae8dad13c75b6n66efe5c8d80d0da837a3e600h1745800735394.webp)

![image.png](http://dnhyxc.cn/image/__ARTICLE_IMG__d16192ada0c65cf298c6a29609ff83319n66efe5c8d80d0da837a3e600h1745800754378.webp)

### MCP 调试

官方提供了一个 `inspector` 调试器，只要在项目目录下运行：

```yaml
npx @modelcontextprotocol/inspector
```

运行完上述命令之后，就会在终端中启动一个本服务，如：`http://127.0.0.1:6274`，点击在浏览器中打开，就能进行调试了。

#### 参考

[https://llmstxt.org/](https://llmstxt.org/)

[https://modelcontextprotocol.io/llms.txt](https://modelcontextprotocol.io/llms.txt)

[https://modelcontextprotocol.io/quickstart/client.md](https://modelcontextprotocol.io/quickstart/client.md)

[https://modelcontextprotocol.io/quickstart/server.md](https://modelcontextprotocol.io/quickstart/server.md)

[https://modelcontextprotocol.io/introduction](https://modelcontextprotocol.io/introduction)

[https://github.com/modelcontextprotocol/typescript-sdk](https://github.com/modelcontextprotocol/typescript-sdk)

[https://zhuanlan.zhihu.com/p/16934783594](https://zhuanlan.zhihu.com/p/16934783594)

[https://zhuanlan.zhihu.com/p/30869685315](https://zhuanlan.zhihu.com/p/30869685315)

[https://zhuanlan.zhihu.com/p/32593727614](https://zhuanlan.zhihu.com/p/32593727614)

[https://github.com/punkpeye/fastmcp/blob/main/src/examples/addition.ts](https://github.com/punkpeye/fastmcp/blob/main/src/examples/addition.ts)

[https://pypi.org/project/mcp-atlassian/0.1.11/](https://pypi.org/project/mcp-atlassian/0.1.11/)

### MCP 市场

[https://mcp.so](https://mcp.so)

[https://mcpmarket.com](https://mcpmarket.com)

[https://smithery.ai](https://smithery.ai/)
