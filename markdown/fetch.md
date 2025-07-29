## fetch 请求封装

```ts
import fetch from "isomorphic-fetch";
import { stringify } from "query-string";
import { addGatewayPattern } from "./urlTool";
import { ssnSetItem, locGetItem } from "./storage";
import { EventBus, message } from "@/utils";

export interface ICheckStatusProps {
	response: Response;
	options?: any;
	url?: string;
}

interface ErrorWithResponse extends Error {
	response?: Response;
}

// 设置重定向路径
function setRedirectPath(value: string) {
	ssnSetItem("redirectUrl", JSON.stringify(value));
}

function checkRedirection(response: Response): boolean {
	const url = response.headers.get("location");
	if (!url) return false;
	try {
		const redirectUrl = new URL(url);
		if (redirectUrl.hostname !== window.location.hostname) {
			window.location.href = url;
			return true;
		}
	} catch (err) {
		message({
			title: "redirect url error",
			type: "error",
		});
	}

	return false;
}

function getErrorWithResponse(response: Response): ErrorWithResponse {
	const error: ErrorWithResponse = new Error(response.statusText);
	error.response = response;
	error.message = JSON.stringify(response);
	return error;
}

function checkStatus({ response, url, options }: ICheckStatusProps): Response {
	if (checkRedirection(response)) {
		throw getErrorWithResponse(response);
	} else if (response.status >= 200 && response.status < 300) {
		return response;
	} else {
		// 特别兼容发布系统服务器重启的功能
		const isPublish =
			url?.includes("publishProject") &&
			options &&
			options.body &&
			JSON.parse(options.body || {})?.isServer;

		if (
			(url?.includes("restartServer") || isPublish) &&
			response.status === 502
		) {
			return {
				status: 502,
				statusText: "Bad Gateway",
				json: () => {
					return Promise.resolve({
						code: 502,
						status: 502,
					});
				},
			} as Response;
		} else {
			throw getErrorWithResponse(response);
		}
	}
}

/**
 * 给 URL 加上 _t=时间戳
 * @param {string} url 完整 url 或者 path
 */
function addTimestamp(url: string): string {
	const t = `_t=${Date.now()}`;
	const sep = url.includes("?") ? "&" : "?";
	return url + sep + t;
}

function parseJSON(response: Response) {
	return response.json();
}

function onRedirect(pathname: string, search: string) {
	if (pathname !== "/login") {
		location.href = "/login";
	}
}

export type FetchResult = Promise<{ err: Error | null; data: any }>;

// 新增进度回调类型
type ProgressCallback = (loaded: number, total: number) => void;

/**
 * Requests a URL, returning a promise.
 * @param  {string} url The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {Promise<{ data: any, err: Error }>} An object containing either "data" or "err"
 */
export default function request(
	_url: string,
	options?: any,
	onProgress?: ProgressCallback // 新增进度回调参数
): FetchResult {
	const url = addTimestamp(
		_url?.startsWith("http") ? _url : addGatewayPattern(_url)
	);
	const defaultOptions = {
		credentials: "include",
	};
	const newOptions = { ...defaultOptions, ...options };

	let timer: ReturnType<typeof setTimeout> | null = null;

	// 处理请求头和请求体
	if (
		newOptions.method === "POST" ||
		newOptions.method === "PUT" ||
		newOptions.method === "GET"
	) {
		if (!(newOptions.body instanceof FormData)) {
			newOptions.headers = {
				Accept: "application/json",
				"Content-Type": "application/json; charset=utf-8",
				Authorization: `Bearer ${locGetItem("token") || options?.body?.token}`,
				...newOptions.headers,
			};
			// 判断是否传了token，如果传了，则删除
			if (newOptions.body.token) {
				delete newOptions.body.token;
			}
			newOptions.body = JSON.stringify(newOptions.body);
		} else {
			// NewOptions.body is FormData
			newOptions.headers = {
				Accept: "application/json",
				Authorization: `Bearer ${locGetItem("token")}`,
				...newOptions.headers,
			};
		}
	}

	// 添加进度处理逻辑
	const fetchWithProgress = async () => {
		const response = await fetch(url, newOptions);

		// 检查响应状态
		const checkedResponse = await checkStatus({
			response,
			options: newOptions,
			url: _url,
		});

		// 获取内容长度
		const contentLength = response.headers.get("Content-Length");

		const total = parseInt(contentLength || "0", 10);

		// 没有进度回调或无法获取长度时直接返回
		if (!onProgress || !contentLength) {
			// 将文本内容转换为Response对象
			const textResponse = new Response(await checkedResponse.text());
			return parseJSON(textResponse);
		}

		// 使用 ReadableStream 读取进度
		const reader = checkedResponse.body?.getReader();
		if (!reader) return parseJSON(new Response(await checkedResponse.text()));

		let receivedLength = 0;
		const chunks = [];

		while (true) {
			const { done, value } = await reader.read();
			if (done) break;

			chunks.push(value);
			receivedLength += value.length;

			// 更新进度
			onProgress(receivedLength, total);
		}

		// 合并数据块
		const chunksAll = new Uint8Array(receivedLength);
		let position = 0;
		for (const chunk of chunks) {
			chunksAll.set(chunk, position);
			position += chunk.length;
		}

		// 转换为文本并解析
		const text = new TextDecoder().decode(chunksAll);
		return parseJSON(new Response(text));
	};

	return fetchWithProgress()
		.then((data) => ({ data, err: null }))
		.catch((err: any) => {
			const { pathname, search } = window.location;
			if (err && err.response) {
				return err.response.json().then((data: any) => {
					if (err.response.status === 401 || err.response.status === 403) {
						setRedirectPath(`${pathname}${search}`);
						onRedirect(pathname, search);
						return {
							err: new Error(data.message || "系统异常"),
							code: err.response.status,
						};
					}
					if (err.response.status === 409) {
						message({
							title: "登录已失效，请重新登录！",
							type: "error",
						});
						// 判断是否是子窗口，如果是子窗口，则延迟2秒方便给出提示，之后退出
						if (location.pathname === "/compile") {
							if (timer) {
								clearTimeout(timer);
								timer = null;
							}
							timer = setTimeout(() => {
								EventBus.emit("quit");
							}, 2000);
						} else {
							EventBus.emit("quit");
						}
						setRedirectPath(`${pathname}${search}`);
						throw new Error(data.message || "系统异常");
						// return {
						//   err: new Error(data.message || '系统异常'),
						//   code: err.response.status,
						// };
					}
					if (err.response.status === 406) {
						return {
							err: new Error(data.message || "系统异常"),
							code: err.response.status,
						};
					}
					if (err.response.status === 200) {
						return null;
					}
					return {
						err: new Error(data.message || "系统异常"),
					};
				});
			}
			return {
				err: new Error("系统异常"),
			};
		});
}

export function get(
	url: string,
	params: any = {},
	onProgress?: ProgressCallback
) {
	const newUrl = `${url}?${stringify(params, {
		arrayFormat: "comma",
		skipEmptyString: true,
	})}`;
	return request(
		newUrl,
		{
			method: "GET",
		},
		onProgress
	);
}

export function post(
	url: string,
	params: any = {},
	form = false,
	onProgress?: ProgressCallback
) {
	let body;
	if (form) {
		const formData = new FormData();
		Object.keys(params).forEach(
			(key) => params[key] && formData.append(key, params[key])
		);
		body = formData;
	} else {
		body = params;
	}
	return request(
		url,
		{
			method: "POST",
			body,
		},
		onProgress
	);
}

export function put(
	url: string,
	params: any = {},
	onProgress?: ProgressCallback
) {
	return request(
		url,
		{
			method: "PUT",
			body: params,
		},
		onProgress
	);
}

export function del(
	url: string,
	params: any = {},
	onProgress?: ProgressCallback
) {
	const newUrl = `${url}?${stringify(params, { arrayFormat: "comma" })}`;

	return request(
		newUrl,
		{
			method: "DELETE",
		},
		onProgress
	);
}
```
