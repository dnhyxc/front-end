### 什么是 WPS 加载项

WPS 加载项是一套基于 Web 技术用来扩展 WPS 应用程序的解决方案。每个 WPS 加载项都对应打开了一个网页，并通过调用网页中 JavaScript 方法来完成其功能逻辑。 WPS 加载项打开的网页可以直接与 WPS 应用程序进行交互，同时一个 WPS 加载项中的多个网页形成了一个整体， 相互之间可以进行数据共享。 开发者不必关注浏览器兼容的问题，因为 WPS 加载项的底层是以 Chromium 开源浏览器项目为基础进行的优化扩展。 WPS 加载项具备快速开发、轻量化、跨平台的特性，目前已针对 Windows/Linux 操作系统进行适配。 WPS 加载项功能特点如下:

- 完整的功能：可通过多种不同的方法对文档、电子表格和演示文稿进行创作、格式设置和操控；通过鼠标、键盘执行的操作几乎都能通过 WPS 加载项完成，可以轻松地执行重复任务，实现自动化。

- 三种交互方式：自定义功能区，采用公开的 CustomUI 标准，快速组织所有功能；任务窗格，展示网页，内容更丰富，Web 对话框，结合事件监听，实现自由交互。

- 标准化集成：不影响 JavaScript 语言特性，网页运行效果和在浏览器中完全一致；WPS 加载项开发文档完整，接口设计符合 JavaScript 语法规范，避免不必要的学习成本，缩短开发周期。

> 具体可查看 [WPS 开发者文档](https://open.wps.cn/docs/client/wpsLoad)。

### 具体项目中能用 WPS OA 助手做什么？

在实际项目中，我们可以使用 WPS OA 助手实现如下需求：

- 点击页面中的按钮唤起本地 WPS 进行文档的创建、编辑。

- 打开 WPS 进行文档创建或编辑时，默认开启修订、修订记录等功能。

- 为文档进行套红操作（给文档套上用户传入的指定红头模板，下文将会介绍）。还能将收集到的用户填写的表单内容插入到模板对应的标签中，这个下文也将着重介绍。

- 文档自动排版，即为新建或编辑的文档设置字体样式、字体大小、首行缩进、清除复制内容原有的格式（如：复制有底色文本，会将底色带入到正在编辑的文档中）等等格式设置。

- 还能自定义 WPS 加载项的按钮、增加按钮对应的弹窗页面，同时还能禁用、隐藏加载项按钮。具体将在下文中介绍。

目前，在实际项目中，主要实现了上述功能，下面将详细介绍如何实现上述功能，具体如下图所示：

![WPS OA 助手](http://101.43.50.15:9216/image/f728d69b55b32e6a66b94810cf8d6e44_66055fcdcfd5e134cd001cef.png)

### WPS 本地调试

如果想要在正式环境或者本地开发环境进行调试，需要下载 [在 oa 云盘下载 WPS_OA_Assistant-demo 压缩包](https://saas.uban360.com/portal/#/portal/web-clouddisk/newCloudDriver/company/10136/4/80257/0) 这个包，然后在本地起一下该项目 server 服务。项目启动完成之后，就会在 WPS 加载项中出现「JavaScript 调试器」按钮，点击该按钮就能打开控制台进行调试了。

#### WPS_OA_Assistant-demo 的启动步骤

在解压完成 WPS_OA_Assistant-demo 之后，其中会有一个 `server` 文件夹，首先在 `server` 文件目录下运行 `npm i` 安装所需要的包。安装好之后使用 `node StartupServer.js` 启动项目。启动完成之后即可开启 WPS 加载项中的 JS 调试按钮。

### 使用加载项套红

WPS 套红指的是使用 WPS 给文档套用指定的红头模板。当前 demo 的实现方式是在文档编辑完成保存时自动为文档套用红头。

![红头模板](http://101.43.50.15:9216/image/91a49816f3f19c5e901eb11dab6be416_66055fcdcfd5e134cd001cef.png)

要给文档套红，用户只需在 **_WpsInvoke()** 方法下的 **OpenDoc** 属性中传入如下属性：

```js
const bookMarksStart = "正文内容B";
const bookMarksEnd = "正文内容E";

_WpsInvoke(
	[
		{
			// OpenDoc方法对应于OA助手dispatcher支持的方法名，我们不需要关心
			OpenDoc: {
				insertFileUrl: "http://xxxurl", // 套红模板
				bkInsertFileStart: bookMarksStart, // 套红开始标签
				bkInsertFileEnd: bookMarksEnd, // 套红结束标签
			},
		},
	],
	true // 控制着通过页面执行WPS加载项方法，WPS的界面是否在执行时在前台显示
);
```

> 注意：bookMarksStart 和 bookMarksEnd 的属性值必须是 **正文内容 B**、**正文内容 E**。因为模板中设置的就是这两个值，如果模板中设置的书签名称不同，则需要修改这里的属性值。

#### 双正文标签套红

双正文标签套红，就是 doc 模版中会为正文内容设置一个开始标签和一个结束标签，在套红时，会识别出这两个标签，然后为正文套上红头，具体实现源码如下：

```js
function InsertRedHead(params) {
	const wpsApp = wps.WpsApplication();
	const activeDoc = wpsApp.ActiveDocument;
	if (!activeDoc) {
		alert("文档不存在，请先新建一个文档!");
		return;
	}

	// 获取起始标签
	const bookmarkStart = GetDocParamsValue(doc, constStrEnum.bkInsertFileStart);
	// 获取结束标签
	const bookmarkEnd = GetDocParamsValue(doc, constStrEnum.bkInsertFileEnd);
	const strFile = GetParamsValue(params, constStrEnum.insertFileUrl);
	if (strFile == "") {
		alert("未获取到传入的红头模板URL路径，不能正常套红");
		return;
	}

	if (bookmarkStart == "" || bookmarkEnd == "") {
		alert("未获取到传入的正文书签，不能正常套红");
		return;
	}
	pInsertRInedHead(activeDoc, strFile, bookmarkStart, bookmarkEnd);
}

function pInsertRInedHead(doc, strFile, bookmarkStart, bookmarkEnd) {
	const bookMarks = doc.Bookmarks;
	if (bookMarks.Item("quanwen")) {
		// 当前文档存在"quanwen"书签时候表示已经套过红头
		// alert("当前文档已套过红头，请勿重复操作!");
		pInsertRInedField(doc); // 自定义增加该方法
		return;
	}

	const wpsApp = wps.WpsApplication();
	const activeDoc = wpsApp.ActiveDocument;
	const selection = wpsApp.ActiveWindow.Selection;
	// 准备以非批注的模式插入红头文件(剪切/粘贴等操作会留有痕迹,故先关闭修订)
	activeDoc.TrackRevisions = false;
	selection.WholeStory(); //选取全文
	bookMarks.Add("quanwen", selection.Range);
	selection.Cut();
	selection.InsertFile(strFile);

	if (bookMarks.Exists(bookmarkStart) && bookMarks.Exists(bookmarkEnd)) {
		const insertRang = [];
		// 计算开始位置
		const bookmarkStartItem = bookMarks.Item(bookmarkStart);
		insertRang[0] = bookmarkStartItem.Range.End;

		// 计算结束位置
		const bookmarkEndItem = bookMarks.Item(bookmarkEnd);
		insertRang[1] = bookmarkEndItem.Range.Start;

		selection.Start = insertRang[0];
		selection.End = insertRang[1];
		selection.Select();

		const s = activeDoc.ActiveWindow.Selection;
		s.Paste();

		// 标识插入红头成功
		wps.PluginStorage.setItem(constStrEnum.InsertReding, 2);
	} else {
		alert(
			"套红头失败，您选择的红头模板没有对应书签：" +
				bookmarkStart +
				", " +
				bookmarkEnd
		);
	}

	// 该方法用于给红头模板中插入对应的书签内容
	pInsertRInedField(doc);

	// 恢复修订模式(根据传入参数决定)
	var l_revisionCtrl = GetDocParamsValue(activeDoc, constStrEnum.revisionCtrl);
	activeDoc.TrackRevisions =
		l_revisionCtrl == "" ? false : l_revisionCtrl.bOpenRevision;
	//取消WPS关闭时的提示信息
	wps.WpsApplication().DisplayAlerts = (wps.Enum && wps.Enum.wdAlertsNone) || 0;
}
```

#### 单正文标签套红

单正文标签套红，指的是在 doc 模版中只给正文设置一个标签，只要识别到这个标签就认为是正文内容，具体实现源码如下：

```js
function pInsertRInedHeadAsOneBk(doc, strFile, bkInsertFile) {
	const bookMarks = doc.Bookmarks;
	if (bookMarks.Item("quanwen")) {
		// 当前文档存在"quanwen"书签时候表示已经套过红头
		// alert("当前文档已套过红头，请勿重复操作!");
		pInsertRInedFieldAsOneBk(doc); // 自定义增加该方法
		return;
	}
	const wpsApp = wps.WpsApplication();
	const activeDoc = wpsApp.ActiveDocument;
	const selection = wpsApp.ActiveWindow.Selection;

	activeDoc.TrackRevisions = false;
	selection.WholeStory(); // 选取全文
	bookMarks.Add("quanwen", selection.Range);
	selection.Cut();
	selection.InsertFile(strFile);

	if (bookMarks.Exists(bkInsertFile)) {
		const bookmark = bookMarks.Item(bkInsertFile);
		bookmark.Range.Select(); // 获取指定书签位置
		const s = activeDoc.ActiveWindow.Selection;
		s.Paste();
		// 标识插入红头成功
		wps.PluginStorage.setItem(constStrEnum.InsertReding, 2);
	} else {
		alert(`套红头失败，您选择的红头模板没有对应书签：${bkInsertFile}`);
	}

	// 该方法用于给红头模板中插入对应的书签内容
	pInsertRInedFieldAsOneBk(doc);

	// 恢复修订模式(根据传入参数决定)
	const l_revisionCtrl = GetDocParamsValue(
		activeDoc,
		constStrEnum.revisionCtrl
	);
	activeDoc.TrackRevisions =
		l_revisionCtrl == "" ? false : l_revisionCtrl.bOpenRevision;
	// 取消WPS关闭时的提示信息
	wps.WpsApplication().DisplayAlerts = (wps.Enum && wps.Enum.wdAlertsNone) || 0;
}

/**
 * 单正文标签字段补全
 * @param {*} doc
 */
function pInsertRInedFieldAsOneBk(doc) {
	try {
		const bookMarks = doc.Bookmarks;
		const initEmptyReg = /formtext/gi;
		const l_params = GetDocParamsValue(doc, "params");
		if (!l_params) {
			return;
		}
		const fieldObj = GetParamsValue(l_params, constStrEnum.FieldObj);

		Object.keys(fieldObjEnum).forEach((key) => {
			const currentValue = fieldObj[fieldObjEnum[key]];
			if (!currentValue) {
				return;
			}

			if (!bookMarks.Exists(key)) {
				return;
			}

			const bookmark = bookMarks.Item(key);
			const range = bookmark.Range;
			const bookMarkName = bookmark.Name;

			if (initEmptyReg.test(bookmark.Range.Text) && !currentValue) {
				return;
			}

			if (bookmark.Range.Text === currentValue) {
				return;
			}

			if (key === "fj") {
				try {
					const enclosure = JSON.parse(currentValue);
					const res = enclosure.map((i, index) => {
						const lastIndex = i.name.lastIndexOf(".");
						const fileName = i.name.substring(0, lastIndex);
						if (index !== 0) {
							return `      ${fileName}\n`;
						}
						return `${fileName}\n`;
					});
					bookmark.Range.Text = res && res.join("");
				} catch (error) {
					throw new Error(error);
				}
			} else {
				bookmark.Range.Text = currentValue;
			}

			const isHead = [].includes(key);

			const rangeStart = isHead ? range.Start - 1 : range.Start;
			const rangeEnd = range.Start + currentValue.length;

			range.SetRange(rangeStart, rangeEnd);
			range.Select();

			if (!bookMarks.Item(bookMarkName)) {
				bookMarks.Add(bookMarkName, range);
			}
		});
	} catch (error) {
		throw new Error(error);
	}
}
```

### 向 WPS 红头模板中插入对应标签值

由于红头模板中可能会配置各种标签属性，套这些标签属性就需要在用红头模板时将标签对应的标签值插入到对应的标签位置。上图灰色块就是各个标签所在的位置。当插入对应的标签值时，灰色块就会被插入的标签值所替换。比如：**标签 1** 灰色块就会替换成 **特急**，如下图所示。

![标签有值的红头模板](http://101.43.50.15:9216/image/d337234d3599028e5dc5c727e136f4c3_66055fcdcfd5e134cd001cef.jpg)

模版中设置的标签值，可以在 WPS 的书签中查看到，如下图所示：

![bookmark.png](http://101.43.50.15:9216/image/d14b6493d6ef34951c494f1d87cd05db_66055fcdcfd5e134cd001cef.png)

当需要插入新的标签属性时，用户只需要找到 `WpsOAAssist/js/commom/enum.js` 文件，添加需要新插入的标签值、并且需要在 **_WpsInvoke()** 方法下的 **OpenDoc** 属性中在传入套红属性的基础上添加 **fieldObj** 属性：

- WpsOAAssist/js/commom/enum.js 内容：

```js
const fieldObjEnum = {
	标题: "title",
	文号: "refNo",
	// 紧急程度
	缓急: "urgencyLevel",
	// 密级
	密级: "secretClass",
	// 主送
	主送: "mainSend",
	// 抄送
	抄送: "copySend",
	签发人: "issUer",
	落款单位: "signingUnit",
	署名单位: "signatureUnit",
	签发日期: "issueDate",
	印发日期: "printDate",
	// 附件
	附件: "enclosure",
	// 起草人
	起草人: "creatPerson",
	// 部门
	部门: "department",
	// 发文单位
	发文单位: "units",
};
```

- fieldObj 传参方式：

```js
_WpsInvoke(
	[
		{
			OpenDoc: {
				insertFileUrl: "http://xxxurl", // 套红模板url
				bkInsertFileStart: bookMarksStart, // 套红开始标签
				bkInsertFileEnd: bookMarksEnd, // 套红结束标签
				// 自定义传入wps中的参数
				params: {
					fieldObj, // 需要插入的各种标签属性
				},
			},
		},
	],
	true
);
```

- fieldObj 就是在 doc 模版中配置各个标签属性：

```js
const fieldObj = {
	copySend: "区公司各部门，各市公司，FF融安公司，FF人力资源部",
	creatPerson: "李芙蓉",
	enclosure: [
		// 需要插入的附件数组
		{
			downloadUrl: "xxxurl",
			key: "0dsad1",
			mimeType: "xxx",
			name: "xxx",
			size: 29191,
			url: "xxxurl",
		},
	],
	fileDepartment: '{"id":530051,"name":"区公司/人力资源部"}',
	issUer: "xxx",
	issueDate: "2022/04/14",
	mainSend: "区公司各部门，FF融安公司，各市公司，FF人力资源部",
	outsideRefNo: "测试机关代字20226817号",
	printDate: "签发日期",
	refNo: "测试机关代字20226817号",
	secretClass: "普通商密",
	signatureUnit: "xxx",
	signingUnit: "署名区公司人力资源部",
	title: "取个名字真的难",
	urgencyLevel: "特急",
};
```

具体实现代码如下：

```js
// 向红头模板中插入对应的书签内容
function pInsertRInedField(doc) {
	const bookMarks = doc.Bookmarks;
	const initEmptyReg = /formtext/gi;
	const l_params = GetDocParamsValue(doc, "params");
	if (!l_params) {
		return;
	}

	// 获取自定义传入的标签属性
	const fieldObj = GetParamsValue(l_params, constStrEnum.FieldObj);

	Object.keys(fieldObjEnum).forEach((key) => {
		const currentValue = fieldObj[fieldObjEnum[key]];
		if (!currentValue) {
			return;
		}

		// 处理向文档中插入附件的情况
		if (key === "附件") {
			let insertIndex = 1;
			const temp = (currentValue && JSON.parse(currentValue)) || [];
			temp.forEach((item) => {
				if (!item || !item.downloadUrl) {
					return;
				}

				const currentKey = key + insertIndex;
				if (!bookMarks.Exists(currentKey)) {
					return;
				}

				insertIndex++;

				const bookmark = bookMarks.Item(currentKey);
				const range = bookmark.Range;
				const bookMarkName = bookmark.Name;

				if (bookmark.Range.Text === item.name) {
					return;
				}
				bookmark.Range.Text = item.name;

				const rangeStart = range.Start;
				const rangeEnd = range.Start + item.name.length;

				range.SetRange(rangeStart, rangeEnd);
				bookmark.Range.Select();

				if (!bookMarks.Item(bookMarkName)) {
					bookMarks.Add(bookMarkName, range);
				}

				// 附件 url
				const linkUrl = `${item.downloadUrl}&filename=${item.name}`;
				// 向文档中中插入附件链接
				doc.Hyperlinks.Add(range, linkUrl);
			});
			return;
		}

		if (!bookMarks.Exists(key)) {
			return;
		}

		// 获取对应的标签
		const bookmark = bookMarks.Item(key);
		const range = bookmark.Range;
		const bookMarkName = bookmark.Name;

		if (initEmptyReg.test(bookmark.Range.Text) && !currentValue) {
			return;
		}

		if (bookmark.Range.Text === currentValue) {
			return;
		}

		// 插入标签值
		bookmark.Range.Text = currentValue;

		// var isHead = ['密级'].includes(key)
		const isHead = [].includes(key);

		const rangeStart = isHead ? range.Start - 1 : range.Start;
		const rangeEnd = range.Start + currentValue.length;

		range.SetRange(rangeStart, rangeEnd);
		range.Select();

		if (!bookMarks.Item(bookMarkName)) {
			bookMarks.Add(bookMarkName, range);
		}
	});
}
```

### 设置 WPS 页边距

设置页边距需要通过如下方式进行设置：

```js
const wpsApp = wps.WpsApplication();
const selection = wpsApp.ActiveWindow.Selection;
selection.Range.PageSetup.LeftMargin = 71.999428; // 设置左边距为 2.54
selection.Range.PageSetup.RightMargin = 71.999428; // 设置左边距为 2.54
```

设置页边距具体用法：

- 唤起 WPS 新建文档时设置左右页边距：

```js
function NewFile(params) {
	const wpsApp = wps.WpsApplication();
	wps.PluginStorage.setItem(constStrEnum.IsInCurrOADocOpen, true); // 设置OA打开文档的临时状态
	let doc;
	if (params.isOfficialDocument) {
		wps.Application.GetApplicationEx().NewOfficialDocument(); // 新增使用公文写作打开的公文
		doc = wpsApp.ActiveDocument;
	} else {
		doc = wpsApp.Documents.Add(); // 新增OA端文档
	}

	// 新建时更改页边距
	const selection = wpsApp.ActiveWindow.Selection;
	selection.Range.PageSetup.LeftMargin = 71.999428; // 设置左边距为 2.54
	selection.Range.PageSetup.RightMargin = 71.999428; // 设置左边距为 2.54

	// 以下代码省略...
}
```

- 唤起 WPS 编辑文档时设置左右页边距：

```js
function OpenFile(params) {
	// 以上代码省略...

	// 更新正文时更改页边距
	const wpsApp = wps.WpsApplication();
	const selection = wpsApp.ActiveWindow.Selection;
	selection.Range.PageSetup.LeftMargin = 71.999428; // 设置左边距为 2.54
	selection.Range.PageSetup.RightMargin = 71.999428; // 设置左边距为 2.54

	// 以下代码省略...
}
```

> 说明：设置页边距时必须确保此时 **doc** 对象已经存在。

### 进入 WPS 编辑自动开启修订

只需在 **_WpsInvoke()** 方法下的 **OpenDoc** 属性中传入如下参数即可：

- _WpsInvoke 和 OpenDoc 是 WPS 源码暴露出来的方法，开发者无需关心。

```js
_WpsInvoke(
	[
		{
			OpenDoc: {
				// 默认开启修订
				revisionCtrl: {
					bOpenRevision: true,
					bShowRevision: true,
				},
			},
		},
	],
	true
);
```

wps 会在打开文档时调用 `pDoOpenOADocProcess()` 方法，实现修订模式的开启或则关闭：

```js
function pDoOpenOADocProcess(params, TempLocalFile) {
	let l_ProtectType = -1; // 默认文档保护类型 -1 为不启用保护
	let l_ProtectPassword = ""; // 默认文档密码为空

	let l_strDocPassword = ""; // 打开文档密码参数
	let l_bOpenRevision = false; // 初始化关闭修订模式
	let l_bShowRevision = false; // 初始化不显示修订气泡样式
	for (const key in params) {
		switch (key.toUpperCase()) {
			case "userName".toUpperCase(): // 修改当前文档用户名
				wps.WpsApplication().UserName = params[key];
				break;
			case "openType".toUpperCase():
				l_ProtectType = params[key].protectType; // 获取OA传来的文档保护类型
				l_ProtectPassword = params[key].password; // 获取OA传来的保护模式下的文档密码
				break;
			case "revisionCtrl".toUpperCase(): // 限制修订状态
				l_bOpenRevision = params[key].bOpenRevision;
				l_bShowRevision = params[key].bShowRevision;
				break;
			case "buttonGroups".toUpperCase(): // 按钮组合
				break;
			case "docPassword".toUpperCase(): // 传入打开文件的密码
				l_strDocPassword = params[key].docPassword;
				break;

			default:
				break;
		}
	}

	// Open方法的参数说明如下
	// Function Open(FileName, [ConfirmConversions], [ReadOnly], [AddToRecentFiles],
	//  [PasswordDocument], [PasswordTemplate], [Revert], [WritePasswordDocument],
	//  [WritePasswordTemplate], [Format], [Encoding], [Visible],
	//  [OpenAndRepair], [DocumentDirection], [NoEncodingDialog], [XMLTransform]) As Document
	const l_Doc = wps
		.WpsApplication()
		.Documents.Open(TempLocalFile, false, false, false, l_strDocPassword);

	// 设置文档修订状态
	DoOADocOpenRevision(l_Doc, l_bOpenRevision, l_bShowRevision);

	// 打开文档后，根据保护类型设置文档保护
	if (l_ProtectType > -1)
		// -1 :不设置文档保护
		SetOADocProtect(l_Doc, l_ProtectType, l_ProtectPassword);
	return l_Doc;
}
```

### 禁用加载项中的按钮

只需要在 **_WpsInvoke()** 方法下的 **OpenDoc** 属性中传入如下参数即可：

- disabledBtns：该字段用于设置哪些加载项按钮需要被禁用。如果不传则所有按钮都不禁用。

```js
_WpsInvoke(
	[
		{
			OpenDoc: {
				// 按钮id
				disabledBtns:
					"btnOpenRevision,btnCloseRevision,btnAcceptAllRevisions,btnRejectAllRevisions",
			},
		},
	],
	true
);
```

> disabledBtns 字段必须传入字符串形式，其中每个字段之间必须以逗号(,)相隔。

### 隐藏加载项按钮

只需要在 **_WpsInvoke()** 方法下的 **OpenDoc** 属性中传入如下参数即可：

- buttonGroups：该字段用于设置哪些加载项按钮需要被隐藏。如果不传则所有按钮都显示。

```js
_WpsInvoke(
	[
		{
			OpenDoc: {
				// 按钮id
				buttonGroups:
					"btnOpenRevision,btnCloseRevision,btnAcceptAllRevisions,btnRejectAllRevisions",
			},
		},
	],
	true
);
```

> buttonGroups 字段必须传入字符串形式，其中每个字段之间必须以逗号(,)相隔。

上述 `buttonGroups` 传入的参数均为 `/src/WpsOAAssist/ribbon.xml` 文件中声明的按钮 id。

```xml
<customUI xmlns="http://schemas.microsoft.com/office/2006/01/customui" onLoad="OnWPSWorkTabLoad">
    <ribbon startFromScratch="false">
        <tabs>
            <tab id="WPSWorkExtTab" label="MOA助手" getVisible="OnGetVisible" insertBeforeMso="TabHome">
                <group id="grpWPSWork" label="OA助手文档操作功能组" getVisible="OnGetVisible">
                    <button id="btnSaveToServer" label="保存并关闭" onAction="OnAction" getEnabled="OnGetEnabled" getImage="GetImage" size="large"/>
                    <separator id="sepWPSWork" getVisible="OnGetVisible" />
                </group>
                <group id="grpRevision" label="排版功能组" getVisible="OnGetVisible">
                    <button id="btnCompose" label="自动排版" onAction="OnAction" getLabel="OnGetLabel" getEnabled="OnGetEnabled" getVisible="OnGetVisible" getImage="GetImage" size="large" />
                    <separator id="sepWPSRevision" getVisible="OnGetVisible" />
                </group>
                <group id="grpRevision" label="OA修订功能按钮组" getVisible="OnGetVisible">
                    <box id="boxRevsion1" boxStyle="horizontal" visible="true">
                        <button id="btnOpenRevision" label="打开修订" onAction="OnAction" getLabel="OnGetLabel" getEnabled="OnGetEnabled" getVisible="OnGetVisible" getImage="GetImage" size="large" />
                        <button id="btnCloseRevision" label="关闭修订" onAction="OnAction" getLabel="OnGetLabel" getEnabled="OnGetEnabled" getVisible="OnGetVisible" getImage="GetImage" size="large" />
                    </box>
                    <box id="boxRevsion2" boxStyle="horizontal" visible="true">
                        <button id="btnAcceptAllRevisions" label="接收修订" getLabel="OnGetLabel" getEnabled="OnGetEnabled" getVisible="OnGetVisible" onAction="OnAction" getImage="GetImage" size="large" />
                        <button id="btnRejectAllRevisions" label="拒绝修订" getLabel="OnGetLabel" getEnabled="OnGetEnabled" getVisible="OnGetVisible" onAction="OnAction" getImage="GetImage" size="large" />
                    </box>
                    <separator id="sepWPSRevision" getVisible="OnGetVisible" />
                </group>
                <!-- ...省略其他代码 -->
            </tab>
        </tabs>
    </ribbon>
</customUI>
```

### WPS 保存输出不同的文件格式

使用 WPS 可以保存后可以一次性输出多个不同格式的文件，比如我们可以保存出 pdf、doc、html 等文件格式。同时可以输出套过红的和没套过红得到文件。而要使 WPS 能保存出对应的文件格式就需要设置如下属性：

- 保存输出 pdf 及 doc 时，只需要在 **_WpsInvoke()** 方法下的 **OpenDoc** 属性中传入如下参数：

```js
_WpsInvoke(
	[
		{
			OpenDoc: {
				suffix: ".pdf",
				uploadWithAppendPath: "1",
			},
		},
	],
	true
); // OpenDoc方法对应于OA助手dispatcher支持的方法名
```

- 保存输出 html 时，相对比较麻烦，需要将 `handleFileAndUpload()` 方法中的 `doc.SaveAs2()` 方法的第二个参数设置为 **8**，同时也需要在 **_WpsInvoke()** 方法下的 **OpenDoc** 属性中传入 `suffix: ".html"` 参数。

```js
_WpsInvoke(
	[
		{
			OpenDoc: {
				suffix: ".html",
				uploadWithAppendPath: "1",
			},
		},
	],
	true
);
```

`handleFileAndUpload` 用于保存出各个类型的文件，并且上传到文件服务器，生成对应格式的 url 地址。[具体代码可以查看](https://git.shinemo.com/projects/BAAS/repos/wps-oaassist/browse/src/WpsOAAssist/js/common/func_docProcess.js#649)：

`OnUploadToServerSuccess` 用于保存出各个类型对应的套红和为套红的文件，[具体代码可以查看](https://git.shinemo.com/projects/BAAS/repos/wps-oaassist/browse/src/WpsOAAssist/js/common/func_tabcontrol.js#898)

### 增加自定义加载项按钮

- 在 ribbon.xml 中增加自定义按钮，具体如下：

```html
<group id="grpOAExtend" label="扩展功能组" getVisible="OnGetVisible">
	<button
		id="customBtn"
		label="自定义按钮"
		getLabel="OnGetLabel"
		onAction="OnAction"
		getEnabled="OnGetEnabled"
		getVisible="OnGetVisible"
		getImage="GetImage"
		size="large"
	/>
	<separator id="sepOAExtend" getVisible="OnGetVisible" />
</group>
```

- 并且需要在 `WpsOAAssist` 中增加自定义加载项对应的页面 `custom.html`。同时可以在该页面进行接口请求、页面交互等。

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>自定义弹窗</title>
		<meta charset="UTF-8" />
		<script type="text/javascript" src="js/main.js"></script>
		<script type="text/javascript" src="otherslib/lib/vue.min.js"></script>
		<style type="text/css">
			* {
				box-sizing: border-box;
			}

			/*清除浮动*/
			.clear:after {
				content: "";
				display: block;
				clear: both;
			}

			html,
			body,
			#template {
				margin: 0;
				padding: 0;
				width: 100%;
				height: 100%;
			}

			.row {
				width: 100%;
				border-top: 2px solid #e7e7e7;
			}

			.row > div {
				height: 100%;
			}

			#file_select {
				width: 100%;
				padding-left: 5%;
			}

			.def_control {
				height: 55%;
				width: 100%;
				font-size: 18px;
			}

			.btn_box {
				width: 16%;
				float: right;
				line-height: 4.5em;
				margin-right: 3%;
			}
		</style>
	</head>

	<body>
		<div id="template">
			<div class="row" style="height: 50%; padding-top: 3%">
				<div id="file_select">我是自定义弹窗，想做什么自己定</div>
			</div>
			<div class="row" style="height: 50%">
				<div class="btn_box">
					<button class="def_control" type="button" @click="cancel()">
						取消
					</button>
				</div>
				<div class="btn_box">
					<button class="def_control" type="button" @click="onCustomClick()">
						确定
					</button>
				</div>
			</div>
		</div>
	</body>
</html>
<script>
	function onCustomClick() {
		window.opener = null;
		window.open("", "_self", "");
		window.close();
	}

	function cancel() {
		// 取消按钮
		window.close();
	}

	var vm = new Vue({
		el: "#template",
		data: {
			templateItem: -1,
			templates: {},
		},
		methods: {},
		mounted: function () {
			this.onCustomClick();
		},
	});
</script>
```

- 设置自定义按钮图标需要找到 `commom/func_tabcontrol.js` 中的 **GetImage()** 方法进行设置。

- 设置自定义按钮文本需要找到 `commom/func_tabcontrol.js` 中的 **OnGetLabel()** 方法进行设置。

- 唤起自定义页面需要找到 `commom/func_tabcontrol.js` 中的 **OnAction()** 方法进行设置。

### 导入正文模板实现示例

ribbon.xml：

```html
<group id="grpOAExtend" label="扩展功能组" getVisible="OnGetVisible">
	<button
		id="btnImportTemplate"
		label="导入模板"
		getLabel="OnGetLabel"
		onAction="OnAction"
		getEnabled="OnGetEnabled"
		getVisible="OnGetVisible"
		getImage="GetImage"
		size="large"
	/>
	<separator id="sepOAExtend" getVisible="OnGetVisible" />
</group>
```

在 WpsOAAssist 目录下新增 importTemplate.html 文件，内容如下：

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>导入正文模板</title>
		<meta charset="UTF-8" />
		<script type="text/javascript" src="js/main.js"></script>
		<script type="text/javascript" src="otherslib/lib/vue.min.js"></script>
		<style type="text/css">
			* {
				box-sizing: border-box;
			}

			/*清除浮动*/
			.clear:after {
				content: "";
				display: block;
				clear: both;
			}

			html,
			body,
			#template {
				margin: 0;
				padding: 0;
				width: 100%;
				height: calc(100% - 10px);
			}

			.row {
				width: 100%;
				height: 100%;
				margin-top: 10px;
				padding-top: 20px;
				border-top: 1px solid #e7e7e7;
			}

			.action {
				position: absolute;
				bottom: 2px;
				right: 0;
				width: 100%;
				border-top: 1px solid #e7e7e7;
			}

			.row > div {
				height: 100%;
			}

			#file_select {
				display: flex;
				align-items: center;
				justify-content: flex-start;
				width: 100%;
				padding: 0 20px;
				height: 32px;
			}

			.def_control {
				flex: 1;
				height: 32px;
				font-size: 16px;
				color: #333;
			}

			.placeholder {
				color: #9c9c9c;
			}

			.btn_box {
				width: 88px;
				float: right;
				line-height: 4.5em;
				margin-right: 20px;
			}

			.action_btn {
				width: 100%;
				height: 32px;
				background: #fff;
				outline: none;
				border: 1px solid #ccc;
				cursor: pointer;
				border-radius: 4px;
			}

			.require {
				background: #1e90ff;
				color: #fff;
			}
		</style>
	</head>

	<body>
		<div id="template">
			<div class="row" style="height: 50%; padding-top: 3%">
				<div id="file_select">
					<span>文件名：</span>
					<select
						class="def_control"
						style="width: 100%"
						v-model="templateItem"
					>
						<option value="-1" class="placeholder">请选择模板</option>
						<option
							v-for="(item, key) in templates"
							:value="item.tempId"
							:key="key"
						>
							{{item.name}}
						</option>
					</select>
				</div>
			</div>
			<div class="action">
				<div class="btn_box">
					<button class="action_btn" type="button" @click="cancel()">
						取消
					</button>
				</div>
				<div class="btn_box">
					<button
						class="action_btn require"
						type="button"
						@click="OnImportTemplate()"
					>
						导入
					</button>
				</div>
			</div>
		</div>
	</body>
</html>
<script>
	/**
	 * 导入公文模板，并替换当前文档全部内容
	 * @param templateURL  模板路径
	 */
	function importTemplateFile(templateURL) {
		const wpsApp = wps.WpsApplication();
		const activeDoc = wpsApp.ActiveDocument;
		if (!activeDoc) {
			alert("文档不存在");
			return;
		}
		const selection = wpsApp.ActiveWindow.Selection;
		selection.WholeStory(); //选取全文
		selection.Delete(); // 删除选中内容
		selection.InsertFile(templateURL);
		if (activeDoc.Revisions.Count > 0) {
			// 文档或区域中的修订
			activeDoc.AcceptAllRevisions(); // 接受对指定文档的所有修订
		}
	}

	const mimeTypeMap = {
		doc: "application/msword",
		docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	};

	// 获取选中项，拼接模板Url进行导入模板
	function OnImportTemplate() {
		const templateId = vm.templateItem;
		const curTemp = vm.templates[templateId];
		if (templateId == -1) {
			alert("请选中模板!!");
			return;
		}
		if (!curTemp.url) {
			alert("请选中模板!!");
			return;
		}
		const [_, type] = curTemp.name.match(/.([^.]+)$/i) || [];

		// 当后端返回的url为：http://xxxxjsnhgxv 这种类型的url时需要拼接contenttype
		// const templateUrl = `${curTemp.url}&contenttype=${mimeTypeMap[type]}`;

		importTemplateFile(curTemp.url);
		window.opener = null;
		window.open("", "_self", "");
		window.close();
		wps.OAAssist.ShellExecute("ksowebstartupwps://");
	}

	function cancel() {
		// 取消按钮
		window.close();
		wps.OAAssist.ShellExecute("ksowebstartupwps://"); // 将WPS程序置前
	}

	const vm = new Vue({
		el: "#template",
		data: {
			templateItem: -1,
			templates: [],
		},
		methods: {
			GetTemplatePath(templateDataUrl) {
				const url = document.location.host;
				return document.location.protocol + "//" + url + templateDataUrl;
			},

			getAllTemplate: function () {
				const _this = this;
				// 通过接口拉取模板列表
				const p_Doc = wps.WpsApplication().ActiveDocument;
				const l_params = GetDocParamsValue(p_Doc, "params");
				const templateDataUrl = GetDocParamsValue(p_Doc, "templateDataUrl");
				if (!templateDataUrl) {
					alert("获取正文模板失败！");
					return;
				}
				$.ajax({
					url: templateDataUrl,
					async: false,
					method: "post",
					dataType: "json",
					success: function (res) {
						_this.templates = res.data;
					},
					error: function (res) {
						alert("获取响应失败");
						_this.templates = [];
					},
				});
			},
		},
		mounted: function () {
			this.getAllTemplate();
		},
	});
</script>
```

node 模拟服务端接口代码如下：

```js
app.post("/getTemplateData", function (request, response) {
	const luxun = path.join(
		__dirname,
		"./wwwroot/file/bodyFileTemplate/luxun.doc"
	);
	const lizhi = path.join(
		__dirname,
		"./wwwroot/file/bodyFileTemplate/lizhi.doc"
	);
	const weimei = path.join(
		__dirname,
		"./wwwroot/file/bodyFileTemplate/weimei.doc"
	);
	response.send({
		data: [
			{
				tempId: 1,
				name: "当代周树人.doc",
				url: luxun,
			},
			{
				tempId: 2,
				name: "励志.doc",
				url: lizhi,
			},
			{
				tempId: 1,
				name: "唯美.doc",
				url: weimei,
			},
		],
	});
});
```

在 resource/wps.js 中的 **_WpsInvoke** 方法中需要传入 **templateDataUrl** 参数：

```js
function insertRedHead() {
	// 省略代码...
	_WpsInvoke(
		[
			{
				OpenDoc: {
					// 省略代码...
					templateDataUrl: "/getTemplateData", // 接口地址
				},
			},
		],
		true
	);
}
```

### 自动排版实现

在 `ribbon.xml` 中增加一个自定义的自动排版按钮，具体实现如下：

```html
<group id="grpRevision" label="自动排版功能组" getVisible="OnGetVisible">
	<button
		id="formatDoc"
		label="自动排版"
		onAction="OnAction"
		getLabel="OnGetLabel"
		getEnabled="OnGetEnabled"
		getVisible="OnGetVisible"
		getImage="GetImage"
		size="large"
	/>
	<separator id="sepWPSRevision" getVisible="OnGetVisible" />
</group>
```

> 上述 `OnAction`、`OnGetLabel`、`OnGetEnabled`、`OnGetVisible`、`GetImage` 事件需要在 `func_tabcontrol.js` 中实现具体逻辑。

在 `func_tabcontrol.js` 中的 **OnAction** 方法中实现自动排版的点击事件：

```js
function OnAction(control) {
	// 省略代码...
	switch (
		eleId // eleId 要与 ribbon.xml 中设置的按钮id保持一致
	) {
		case "formatDoc": // 自动排版，
			OnFormatClick();
			break;
		// 省略代码...
	}
}
```

> [具体代码可点击此处查看](https://git.shinemo.com/projects/BAAS/repos/wps-oaassist/browse/src/WpsOAAssist/js/common/func_tabcontrol.js#1499)

实现自动排版逻辑的宏：

- 清除文档原有格式、文档首行缩进、字符大小、字体格式等：

```js
/**
 * Selection.WholeStory();全选文档
 * Selection.SetRange(0, 0);选中起始位置
 * Selection.EndKey(wps.Enum.wdStory, wps.Enum.wdMove);选中结束位置
 */
function Macro() {
	const wpsApp = wps.WpsApplication();
	const { Selection } = wpsApp.ActiveWindow;

	Selection.WholeStory();
	// 首先清除原来的格式
	Selection.ClearFormatting();
	Selection.Font.Name = "仿宋_GB2312";
	// Selection.Font.ColorIndex = wps.Enum.wdAuto; // 设置字体颜色为自动
	// Selection.Range.HighlightColorIndex = wps.Enum.wdAuto; // 设置字体底色未自动
	((obj) => {
		obj.Size = 16;
		obj.SizeBi = 16;
	})(Selection.Font);

	((obj) => {
		obj.CharacterUnitFirstLineIndent = 2;
		obj.FirstLineIndent = 0;
		obj.CharacterUnitFirstLineIndent = 2;
		obj.FirstLineIndent = 0;
		obj.ReadingOrder = wps.Enum.wdReadingOrderLtr;
		obj.DisableLineHeightGrid = 0;
		obj.AutoAdjustRightIndent = -1;
		obj.WidowControl = 0;
		obj.KeepWithNext = 0;
		obj.KeepTogether = 0;
		obj.PageBreakBefore = 0;
		obj.FarEastLineBreakControl = -1;
		obj.WordWrap = -1;
		obj.HangingPunctuation = -1;
		obj.HalfWidthPunctuationOnTopOfLine = 0;
		obj.AddSpaceBetweenFarEastAndAlpha = -1;
		obj.AddSpaceBetweenFarEastAndDigit = -1;
		obj.BaseLineAlignment = wps.Enum.wdBaselineAlignAuto;
	})(Selection.ParagraphFormat);
	Selection.SetRange(0, 0);
	wpsApp.ActiveDocument.AcceptAllRevisions();
	// 判断是否开启了文档网格，如果开启了则设置网格对应的格式、否则去除网格的格式
	if (!wpsApp.Options.DisplayGridLines) {
		// 调用取消设置网格的宏
		DisplayGridMacro(wpsApp);
	} else {
		// 调用网格格式的宏
		GridMacro(wpsApp);
	}
}
```

- 取消网格格式的宏：

```js
function DisplayGridMacro(wpsApp) {
	wpsApp.Options.DisplayGridLines = false;
	wpsApp.ActiveWindow.Selection.Range.PageSetup.LayoutMode =
		wps.Enum.wdLayoutModeLineGrid;
	((obj) => {
		obj.MirrorMargins = 0;
		((obj) => {
			obj.SetCount(1);
			obj.EvenlySpaced = -1;
			obj.LineBetween = 0;
			obj.SetCount(1);
			obj.Spacing = 0;
		})(obj.TextColumns);
		obj.Orientation = wps.Enum.wdOrientPortrait;
		obj.GutterPos = wps.Enum.wdGutterPosLeft;
		obj.TopMargin = 71.999428;
		obj.BottomMargin = 71.999428;
		obj.Gutter = 0;
		obj.PageWidth = 595.270813;
		obj.PageHeight = 841.883057;
		obj.FirstPageTray = wps.Enum.wdPrinterDefaultBin;
		obj.OtherPagesTray = wps.Enum.wdPrinterDefaultBin;
		obj.Orientation = wps.Enum.wdOrientPortrait;
		obj.GutterPos = wps.Enum.wdGutterPosLeft;
		obj.TopMargin = 71.999428;
		obj.BottomMargin = 71.999428;
		obj.Gutter = 0;
		obj.PageWidth = 595.270813;
		obj.PageHeight = 841.883057;
		obj.FirstPageTray = wps.Enum.wdPrinterDefaultBin;
		obj.OtherPagesTray = wps.Enum.wdPrinterDefaultBin;
		obj.FooterDistance = 49.605999;
		obj.OddAndEvenPagesHeaderFooter = 0;
		obj.DifferentFirstPageHeaderFooter = 0;
		obj.LayoutMode = wps.Enum.wdLayoutModeLineGrid;
	})(wpsApp.ActiveDocument.PageSetup);
	((obj) => {
		obj.MeasurementUnit = wps.Enum.wdCentimeters;
		obj.UseCharacterUnit = true;
	})(wpsApp.Options);
}
```

- 设置网格格式的宏：

```js
/**
 * 网格格式
 * wpsApp.Options.DisplayGridLines：是否开启网格，true:开启，false：关闭
 */
function GridMacro(wpsApp) {
	wpsApp.ActiveWindow.Selection.Range.PageSetup.LayoutMode =
		wps.Enum.wdLayoutModeGenko;
	((obj) => {
		obj.MirrorMargins = 0;
		((obj) => {
			obj.SetCount(1);
			obj.EvenlySpaced = -1;
			obj.LineBetween = 0;
			obj.SetCount(1);
			obj.Spacing = 0;
		})(obj.TextColumns);
		obj.Orientation = wps.Enum.wdOrientPortrait;
		obj.GutterPos = wps.Enum.wdGutterPosLeft;
		obj.TopMargin = 71.999428;
		obj.BottomMargin = 71.999428;
		obj.Gutter = 0;
		obj.PageWidth = 595.270813;
		obj.PageHeight = 841.883057;
		obj.FirstPageTray = wps.Enum.wdPrinterDefaultBin;
		obj.OtherPagesTray = wps.Enum.wdPrinterDefaultBin;
		obj.Orientation = wps.Enum.wdOrientPortrait;
		obj.GutterPos = wps.Enum.wdGutterPosLeft;
		obj.TopMargin = 71.999428;
		obj.BottomMargin = 71.999428;
		obj.Gutter = 0;
		obj.PageWidth = 595.270813;
		obj.PageHeight = 841.883057;
		obj.FirstPageTray = wps.Enum.wdPrinterDefaultBin;
		obj.OtherPagesTray = wps.Enum.wdPrinterDefaultBin;
		obj.FooterDistance = 49.605999;
		obj.OddAndEvenPagesHeaderFooter = 0;
		obj.DifferentFirstPageHeaderFooter = 0;
		obj.LayoutMode = wps.Enum.wdLayoutModeGenko;
	})(wpsApp.ActiveDocument.PageSetup);

	((obj) => {
		obj.MeasurementUnit = wps.Enum.wdCentimeters;
		obj.UseCharacterUnit = true;
	})(wpsApp.Options);
}
```

> 如果想要得到其他类型的宏，可以通过 wps 进行录制宏，录制完成之后，就能得到具体的宏。

### 通过 WPS 录制宏得到相应宏

在 WPS 中点击**开发工具**这个加载项，点击录制新宏。开启录制之后在 WPS 中执行你需要的操作，比如：换行、按 tab 进行缩进、另存为 html 格式等操作。操作完成之后点击**停止录制**按钮。停止录制之后点击 **WPS 宏编辑器** 按钮，此时在编辑器中就能看到所有录制的操作调用的 API 了，如下：

- 按 tab 进行缩进并且输入文本：

```js
function Macro() {
	Selection.SetRange(0, 0);
	Selection.Range.Paragraphs.Item(1).Indent();
	Selection.TypeText("按 tab 进行缩进并且输入文本");
	Selection.SetRange(6, 6);
}
```

- 换行之后进行 tab 缩进：

```js
function Macro() {
	Selection.SetRange(3, 3);
	Selection.TypeParagraph();
	Selection.TypeParagraph();
	Selection.Range.Paragraphs.Item(1).Indent();
}
```

- 设置左右边距为 2.54 cm：

```js
function Macro() {
	Selection.Range.PageSetup.LeftMargin = 71.999428;
	Selection.Range.PageSetup.RightMargin = 71.999428;
	Selection.SetRange(0, 1);
}
```

### WPS OA DEMO

#### demo 压缩包下载

如果自己想要玩一下加载项，可以下载 WPS_OA_Assistant-demo，之后在其中实现自己想要的功能。

[在 oa 云盘下载 WPS_OA_Assistant-demo 压缩包及 WPS 2019](https://saas.uban360.com/portal/#/portal/web-clouddisk/newCloudDriver/company/10136/4/80257/0)

> 为了调试顺畅，建议下载 WPS 2019 版本，其他版本进过测试，调试起来非常卡顿。

#### 加载项（WpsOAAssist）文件结构说明

- icon：图标文件。

- js：WPS 加载项功能逻辑的 js 代码。

- otherslib：vue 等第三方库。

- template：示例模板文件。

- importTemplate.html：导入模板页面。

- index.html：加载项的默认加载页面。

- qrcode.html：插入二维码页面。

- redhead.html：插入红头页面。

- selectBookmark.html：插入标签页面。

- selectSeal.html：插入签章页面。

- setUserName.html：修改默认用户名页面。

- ribbon.xml：自定义选项卡配置，即自定义功能区配置。

#### 交互逻辑部分（wwwroot）结构说明

- file：所需要的各种文件模板。

- resource：web 页面相关页面及交互资源。

  - wps.js：唤起 wps 创建、编辑等交互逻辑所在区。

  - wpsjsrpcsdk.js：wps 开发者提供的通用 sdk。

  - index.html：web 端页面入口。

- uploaded：node 保存生成的 word 文档所在区。

#### 如何启动项目

在 `server` 文件目录下运行 `npm i` 安装所需要的包。安装好之后使用 `node StartupServer.js` 启动项目。

### 参考文档

1、[WPS 加载项是什么](https://zhuanlan.zhihu.com/p/148803031)

2、[怎么能快速体验 WPS 加载项](https://zhuanlan.zhihu.com/p/158963727)

3、[怎么将 WPS 加载项和业务系统结合起来](https://zhuanlan.zhihu.com/p/161755083)

4、[怎么把 WPS 加载项部署起来](https://zhuanlan.zhihu.com/p/164336341)

5、[金山文档 publish 自动安装加载项.docx](https://kdocs.cn/l/cpOfxONhn8Yg)

6、[利用 WPS 做业务系统的超级编辑器](https://zhuanlan.zhihu.com/p/177076379)

7、[WPS 加载项案例应用回顾](https://zhuanlan.zhihu.com/p/208117631)

8、[金山文档 WPS 产品矩阵集成解决方案-WPS 二次开发集成篇 V1.1.pptx](https://kdocs.cn/l/cyKkDebda)

9、[金山文档 JSAPI 的特点和优势.docx](https://kdocs.cn/l/ssYE4VWBB)

10、[Microsoft Build API 文档](https://docs.microsoft.com/zh-cn/office/vba/api/overview/word)
