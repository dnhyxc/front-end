### Media Source Extensions

desc: 2016 年 11 月 17 日，W3C 的 HTML 媒体扩展工作组（HTML Media Extensions Working Group）发布了媒体源扩展（Media Source Extensions）的正式推荐标准。

#### Media Source Extensions 概述

2016 年 11 月 17 日，W3C 的 HTML 媒体扩展工作组（HTML Media Extensions Working Group）发布了媒体源扩展（Media Source Extensions）的正式推荐标准。

该规范允许通过 JavaScript 为 `<audio>` 和 `<video>` 动态构造媒体源，它定义了 MediaSource 对象，作为 HTML5 中 HTMLMediaElement 的媒体数据源。**MediaSource 对象可以有一个或多个 SourceBuffer 对象**。应用程序可以向 SourceBuffer 对象动态添加数据片段，并可以根据系统系能及其他因素自适应调整所添加媒体数据的数据质量。来自 SourceBuffer 对象的数据可以解码为音频、视频或文本数据，并由浏览器或播放器处理。与媒体源扩展一同使用，还是包括媒体原扩展字节流格式注册表及一组预定义的字节流格式规范。

#### 为什么需要 MSE

随着 HTML5 的普及，web 逐渐淘汰 flash 开始使用 `<audio>/<video>` 标签进行视频播放。但在没有 MSE 标准出现之前，前端对于 video 的操作仅限于`<video>` 标签提供的一些能力，不能对视频流进行做任何操作。

假设我们需要开发一个切换清晰度的功能，很容易就能想到动态更改 `<video>` 标签 src 的方案。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div id="container">
      <video
        id="video"
        controls="controls"
        width="800"
        src="./xxx.mp4"
        type="video/mp4"
      />
    </div>
    <div id="extras">切换清晰度</div>
    <script>
      const switchButton = document.querySelector("#extras");
      const video = document.querySelector("#video");
      const handleClick = () => {
        const currentTime = video.currentTime;
        const src = video.src;
        video.src = src === "./hd.mp4" ? "./sd.mp4" : "./hd.mp4";
        video.currentTime = currentTime;
        video.play();
      };
      switchButton.addEventListener("click", handleClick);
    </script>
  </body>
</html>
```

> 通过这种方式存在两个缺点：切换 src 必然导致视频中断、无法做出平滑切换的效果。这显然不符合无缝播放的要求。

为了解决平滑切换的效果，可以用 Blob URL 指向一个视频二进制数据，然后不断将下一段视频的二进制数据添加拼接进去。这样就可以在不影响播放的情况下，不断的更新视频内容并播放下去。要实现这个功能就需要通过 MediaSource 来实现，MediaSource 接口功能也很纯粹，作为一个媒体数据容器可以和 HTMLMediaElement 进行绑定。基本流程就是通过 URL.createObjectURL 创建容器的 BLob URL，设置到 video 标签的 src 上，在播放过程中，我们仍然可以通过 MediaSource.appendBuffer 方法往容器里添加数据，达到更新视频内容的目的。实现代码如下：

```js
const video = document.querySelector("video");
//视频资源存放路径，假设下面有5个分段视频 video1.mp4 ~ video5.mp4，第一个段为初始化视频init.mp4
const assetURL = "http://www.demo.com";
//视频格式和编码信息，主要为判断浏览器是否支持视频格式，但如果信息和视频不符可能会报错
const mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
if ("MediaSource" in window && MediaSource.isTypeSupported(mimeCodec)) {
  const mediaSource = new MediaSource();
  video.src = URL.createObjectURL(mediaSource); //将video与MediaSource绑定，此处生成一个Blob URL
  mediaSource.addEventListener("sourceopen", sourceOpen); //可以理解为容器打开
} else {
  //浏览器不支持该视频格式
  console.error("Unsupported MIME type or codec: ", mimeCodec);
}

function sourceOpen() {
  const mediaSource = this;
  const sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
  let i = 1;
  function getNextVideo(url) {
    //ajax代码实现翻看上文，数据请求类型为arraybuffer
    ajax(url, function (buf) {
      //往容器中添加请求到的数据，不会影响当下的视频播放。
      sourceBuffer.appendBuffer(buf);
    });
  }
  //每次appendBuffer数据更新完之后就会触发
  sourceBuffer.addEventListener("updateend", function () {
    if (i === 1) {
      //第一个初始化视频加载完就开始播放
      video.play();
    }
    if (i < 6) {
      //一段视频加载完成后，请求下一段视频
      getNextVideo(`${assetURL}/video${i}.mp4`);
    }
    if (i === 6) {
      //全部视频片段加载完关闭容器
      mediaSource.endOfStream();
      URL.revokeObjectURL(video.src); //Blob URL已经使用并加载，不需要再次使用的话可以释放掉。
    }
    i++;
  });
  //加载初始视频
  getNextVideo(`${assetURL}/init.mp4`);
}
```

#### MSE 的作用

- 动态清晰度切换。

- 进行视频拼接。

- 音频语言切换。

- 动态控制视频加载。

### MediaSource

#### MediaSource 概述

MediaSource 是 Media Source Extensions API 表示媒体资源 HTMLMediaElement 对象的接口。MediaSource 对象可以附着在 HTMLMediaElement 在客户端进行播放。

#### MediaSource()

MediaSource() 是 MediaSource 的构造函数 返回一个没有分配 source buffers 新的 MediaSource 对象。

MediaSource() 语法：

```js
const mediaSource = new MediaSource();
```

使用实例：

```js
const video = document.querySelector("video");

const assetURL = "frag_bunny.mp4";
const mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';

if ("MediaSource" in window && MediaSource.isTypeSupported(mimeCodec)) {
  const mediaSource = new MediaSource();
  video.src = URL.createObjectURL(mediaSource);
  mediaSource.addEventListener("sourceopen", sourceOpen);
} else {
  console.error("Unsupported MIME type or codec: ", mimeCodec);
}
```

#### MediaSource 的实例属性 - duration

该属性用来获取或者设置当前媒体展示的时长，该值是以秒为单位的双精度浮点数。

语法：

```js
// 设置时长
mediaSource.duration = 9.2;

// 获取时长
const myDuration = mediaSource.duration;
```

基本使用实例：

```js
function sourceOpen() {
  console.log(this.readyState); // open
  const mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
  const mediaSource = this;
  const sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);

  sourceBuffer.appendBuffer(buf);

  fetchAB(assetURL, function (buf) {
    sourceBuffer.addEventListener("updateend", function () {
      mediaSource.endOfStream();

      mediaSource.duration = 120;

      video.play();
      console.log(mediaSource.readyState); // ended
    });
  });
}
```

#### MediaSource 的实例属性 - readyState

readyState 是 MediaSource 接口的一个只读属性。它返回一个集合表明当前 MediaSource 的状态。它有三种可能的返回值：

- **open**: 当前源已附着到一个 media 元素并准备好接收 SourceBuffer 对象。

- **closed**: 当前源并未附着到一个 media 元素上。

- **ended**: 当前源已附着到一个 media 元素，但流已被 MediaSource.endOfStream() 结束。

语法：

```js
const myReadyState = mediaSource.readyState;
```

具体使用示例：

```js
const mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';

if ("MediaSource" in window && MediaSource.isTypeSupported(mimeCodec)) {
  const mediaSource = new MediaSource();

  console.log(mediaSource.readyState); // closed

  video.src = URL.createObjectURL(mediaSource);

  mediaSource.addEventListener("sourceopen", () => {
    console.log(this.readyState); // open

    const sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);

    fetchAB(assetURL, function (buf) {
      sourceBuffer.appendBuffer(buf);

      sourceBuffer.addEventListener("updateend", () => {
        mediaSource.endOfStream();

        video.play();

        console.log(mediaSource.readyState); // ended
      });
    });
  });
} else {
  console.error("Unsupported MIME type or codec: ", mimeCodec);
}
```

#### MediaSource 的实例属性 - sourceBuffers

sourceBuffers 是 mediaSource 实例上的一个属性，它返回的是一个 **SourceBufferList** 的对象，里面可以获取当前 mediaSource 上挂载的所有 sourceBuffer。不过，只有当 mediaSource 为 open 状态的时候，它才可以访问。

语法：

```js
const sourceBuffers = mediaSource.sourceBuffers;
```

可以通过 index（索引）来获取 sourceBuffers 中具体的某个 sourceBuffer 对象：

```js
const sourceBuffers = mediaSource.sourceBuffers;

const firstSourceBuffer = sourceBuffers[0];
```

SourceBufferList 对象还提供了 **addsourcebuffer** 和 **removesourcebuffer** 事件，如果你想监听 sourceBuffer 的变化，可以直接通过 SourceBufferList 来做。这也是为什么 mediaSource 没有提供监听事件的一个原因。所以，删除某一个 sourceBuffer 就可以通过 SourceBufferList 查找，然后，利用 removesourcebuffer 方法移除即可：

```js
const sourceBuffers = mediaSource.sourceBuffers;

const firstSourceBuffer = sourceBuffers[0];

mediaSource.removeSourceBuffer(firstSourceBuffer);
```

#### MediaSource 的实例属性 - activeSourceBuffers

activeSourceBuffers 实际上是 sourceBuffers 的子集，返回的同样也是 SourceBufferList 对象。为什么说也是子集呢？

- activeSourceBuffers 包含的是当前正在使用的 sourceBuffer。因为前面说了，每个 sourceBuffer 实际上都可以具体代表一个 track，比如，video track，audio track，text track 等等。那怎么标识正在使用的 sourceBuffer 呢？很简单，不用标识啊，因为控制哪一个 sourceBuffer 正在使用是你来决定的。如果非要标识，就需要使用到 HTML 中的 video 和 audio 节点。

- activeSourceBuffers 的使用方式与 sourceBuffers 类似，参照 sourceBuffers 进行使用即可。

#### MediaSource 的方法 - isTypeSupported()

isTypeSupported 主要是用来检测 MediaSource 是否支持某个特定的编码和容器盒子。例如：

```js
MediaSource.isTypeSupported('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
```

具体的 mimeType 参考列表，[请戳这里查看](https://wiki.whatwg.org/wiki/Video_type_parameters#Browser_Support "mimeType")。

#### MediaSource 的方法 - addSourceBuffer()

addSourceBuffer() 方法会根据给定的 MIME 类型创建一个新的 SourceBuffer 对象，然后会将它追加到 MediaSource 的 SourceBuffers 列表中。

语法：

```js
const sourceBuffer = mediaSource.addSourceBuffer(mimeType);
```

- mimeType：创建的 source buffer 的 MIME 类型，如：`'video/mp4; codecs="avc1.42E01E, mp4a.40.2"'`。

具体使用示例：

```js
const assetURL = "frag_bunny.mp4";
// ./mp4info frag_bunny.mp4 | grep Codec
const mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';

if ("MediaSource" in window && MediaSource.isTypeSupported(mimeCodec)) {
  const mediaSource = new MediaSource();

  console.log(mediaSource.readyState); // closed

  video.src = URL.createObjectURL(mediaSource);

  mediaSource.addEventListener("sourceopen", () => {
    console.log(this.readyState); // open

    const sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);

    fetchAB(assetURL, (buf) => {
      sourceBuffer.appendBuffer(buf);

      sourceBuffer.addEventListener("updateend", () => {
        mediaSource.endOfStream();

        video.play();

        console.log(mediaSource.readyState); // ended
      });
    });
  });
} else {
  console.error("Unsupported MIME type or codec: ", mimeCodec);
}
```

#### MediaSource 的方法 - removeSourceBuffer()

用来移除某个 sourceBuffer。比如当前流已经结束，就没必要再保留当前 sourceBuffer，可以直接移除，防止占用多余的空间，具体方式为：

```js
mediaSource.removeSourceBuffer(sourceBuffer);
```

#### MediaSource 的方法 - endOfStream()

endOfStream() 方法的调用就意味着流的结束，注意，这里**并不是断开**，相当于只是下好了一部分视频，可以进行播放。此时，mediaSource 的状态将变为 ended。

```js
const sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
fetchAB(assetURL, function (buf) {
  sourceBuffer.addEventListener("updateend", () => {
    mediaSource.endOfStream(); // 结束当前的流
    video.play(); // 可以播放当前获得的流
  });
  sourceBuffer.appendBuffer(buf);
});
```

#### mediaSource 的事件 - sourceopen

当状态变为 open 时触发。常常在 mediaSource 和 HTMLMedia 绑定时触发。

sourceopen 事件相同于是一个总领事件，只有当 sourceopen 时间触发后，后续对于 mediaSource 来说，才是一个可操作的对象。通常来说，只有当 mediaSource 和 video 元素成功绑定时，才会正常触发：

```js
const mediaSource = new MediaSource();
// mediaSource 和 video 元素进行绑定
vidElement.src = URL.createObjectURL(mediaSource);
```

#### mediaSource 的事件 - sourceended

当状态变为 ended 时触发。

sourceended 的触发条件其实很简单，当调用 endOfStream 的时候就会触发。

#### mediaSource 的事件 - sourceclose

sourceclose 当状态变为 closed 时触发。即在 media 元素和 mediaSource 断开的时候，才会触发。

如果要手动触发 sourceclose 事件，需要进行如下步骤：

- 将 readyState 设置为 closed。

- 将 mediaSource.duration 设置为 NaN。

- 移除 activeSourceBuffers 上的所有 Buffer。通过触发 activeSourceBuffers 的 removesourcebuffer 事件。

- 移除 sourceBuffers 上的 SourceBuffer。通过触发 sourceBuffers 的 removesourcebuffer 事件。

- 通过以上步骤，最终才会触发 MediaSource 的 sourceclose 事件。

### sourceBuffer

#### sourceBuffer 简介

sourceBuffer 是由 mediaSource 创建的，并直接和 HTMLMediaElement 接触。简单来说，它就是一个流的容器，里面提供的 append() 和 remove() 方法来对流进行操作，它可以包含一个或者多个 media segments（就是每次通过 append 添加进去的流片段）。

```ts
interface SourceBuffer : EventTarget {
           attribute AppendMode          mode;
  readonly attribute boolean             updating;
  readonly attribute TimeRanges          buffered;
           attribute double              timestampOffset;
  readonly attribute AudioTrackList      audioTracks;
  readonly attribute VideoTrackList      videoTracks;
  readonly attribute TextTrackList       textTracks;
           attribute double              appendWindowStart;
           attribute unrestricted double appendWindowEnd;
           attribute EventHandler        onupdatestart;
           attribute EventHandler        onupdate;
           attribute EventHandler        onupdateend;
           attribute EventHandler        onerror;
           attribute EventHandler        onabort;
  void appendBuffer(BufferSource data);
  void abort();
  void remove(double start, unrestricted double end);
};
```

#### sourceBuffer 的方法 - appendBuffer

可以动态地向 MediaSource 中添加视频/音频片段（对于一个 MediaSource，可以同时存在多个 SourceBuffer）。

如果视频很长，存在多个 chunk 的话，就需要不停地向 SourceBuffer 中加入新的 chunk。这里就需要注意一个问题了，即 appendBuffer 是异步执行的，在完成前，不能 append 新的 chunk，而是应该监听 SourceBuffer 上的 updateend 事件，确定空闲后，再加入新的 chunk。

- 错误示例：

```js
sourceBuffer.appendBuffer(buffer1)
sourceBuffer.appendBuffer(buffer2)
// Uncaught DOMException:
Failed to set the 'timestampOffset' property on 'SourceBuffer':
This SourceBuffer is still processing
an 'appendBuffer' or 'remove' operation.
```

- 正确示例：

```js
sourceBuffer.addEventListener('updateend', () => {
  // 这个时候才能加入新 chunk
  // 先设定新chunk加入的位置，比如第20秒处
  sourceBuffer.timestampOffset = 20
  // 然后加入
  sourceBuffer.append(newBuffer)
}
```

#### sourceBuffer 的方法 - mode

mode：有两种格式：

- segments: 乱序排放。通过 timestamps 来标识其具体播放的顺序。比如：20s 的 buffer，30s 的 buffer 等。

  - segments 表示 A/V 的播放时根据你视频播放流中的 pts 来决定，该模式也是最常使用的。因为音视频播放中，最重要的就是 pts 的排序。因为，pts 可以决定播放的时长和顺序，如果一旦 A/V 的 pts 错开，有可能就会造成 A/V sync drift。

- sequence: 按序排放。通过 appendBuffer 的顺序来决定每个 mode 添加的顺序。timestamps 根据 sequence 自动产生。

  - sequence 则是根据空间上来进行播放的。每次通过 appendBuffer 来添加指定的 Buffer 的时候，实际上就是添加一段 A/V segment。此时，播放器会根据其添加的位置，来决定播放顺序。还需要注意，在播放的同时，你需要告诉 sourceBuffer，这段 segment 有多长，也就是该段 Buffer 的实际偏移量。而该段偏移量就是由 timestampOffset 决定的。整个过程用代码描述一下就是：

```js
sourceBuffer.appendBuffer(media.segment);
sourceBuffer.timestampOffset += media.duration;
```

一般情况下，我们不用管 mode 的值。不过可以在后面将 segments 设置为 sequence。但是如果将 sequence 设置为 segments 就会出现问题。

```js
const bufferMode = sourceBuffer.mode;
if (bufferMode == "segments") {
  sourceBuffer.mode = "sequence";
}
```

#### sourceBuffer 的方法 - buffered

返回一个 timeRange 对象。用来表示当前被存储在 sourceBuffer 中的 buffer。

- timeRange：当加载一个 `<audio>` 或 `<video>` 元素使用的媒体资源时，该 timeRange 接口用于表示已缓冲的媒体资源的时间范围、已播放的时间范围以及可查找的时间范围。

#### sourceBuffer 的方法 - updating

返回布尔值，表示当前 sourceBuffer 是否正在被更新。例如: sourceBuffer.appendBuffer()，sourceBuffer.appendStream()，sourceBuffer.remove() 调用时。

- true：当前 sourceBuffer 正在处理添加或者移除的 segment。

- false：当前 sourceBuffer 处于空闲状态。当且仅当 updating = false 的时候，才可以对 sourceBuffer 进行额外的操作。

#### sourceBuffer 的事件 - updatestart

当 updating 由 false 变为 true 时会被触发。

使用方式如下：

```js
sourceBuffer.addEventListener("updatestart", function (e) {
  // ...
});
```

#### sourceBuffer 的事件 - update

当 append()/remove() 方法被成功调用完成时被触发，此时 updating 将由 true 变为 false。

使用方式如下：

```js
sourceBuffer.addEventListener("update", function (e) {
  // 当指定的 buffer 加载完后，就可以开始播放
  mediaSource.endOfStream();
  video.play();
});
```

#### sourceBuffer 的事件 - updateend

当 append()/remove() 已经结束时被触发。

注意：update 和 updateend 都是表示处理的结束，不同的是，update 比 updateend 先触发。

```js
sourceBuffer.addEventListener("updateend", function (e) {
  // 当指定的 buffer 加载完后，就可以开始播放
  mediaSource.endOfStream();
  video.play();
});
```

#### sourceBuffer 的事件 - error

在 append() 过程中发生错误时被触发，此时 updating 将由 true 变为 false。

使用方式如下：

```js
sourceBuffer.addEventListener("error", function (e) {
  // ...
});
```

#### sourceBuffer 的事件 - abort

当 append()/remove() 过程中，使用 abort() 方法终止时，会被触发。此时 updating 将由 true 变为 false。

使用方式如下：

```js
sourceBuffer.addEventListener("abort", function (e) {
  // ...
});
```

#### 添加/移除 buffer

在添加 Buffer 的时候，需要知道你所采用的 mode 是哪种类型，sequence 或者 segments。这两种是完全两种不同的添加方式。

- segments：这种方式是直接根据 MP4 文件中的 pts 来决定播放的位置和顺序，它的添加方式极其简单，只需要判断 updating === false，然后，直接通过 appendBuffer 添加即可。

```js
if (!sourceBuffer.updating) {
  let mediaSource = this._mergeBuffer(media.tmpBuffer);

  sourceBuffer.appendBuffer(mediaSource);

  media.duration += lib.duration;
  media.tmpBuffer = [];
}
```

- sequence：如果你是采用这种方式进行添加 Buffer 进行播放的话，那么你也就没必要了解 FMP4 格式，而是了解 MP4 格式。因为，该模式下，sourceBuffer 是根据具体添加的位置来进行播放的。所以，如果你是 FMP4 的话，有可能就有点不适合了。针对 sequence 来说，每段 buffer 都必须有自己本身的指定时长，每段 buffer 不需要参考的 baseDts，即，他们直接可以毫无关联。那 sequence 具体怎么操作呢？简单来说，就是在每一次添加过后，都需要根据指定 sourceBuffer 上的 timestampOffset。该属性，是用来控制具体 Buffer 的播放时长和位置的。

```js
if (!sourceBuffer.updating) {
  let mediaSource = this._mergeBuffer(media.tmpBuffer);

  sourceBuffer.appendBuffer(mediaSource);

  sourceBuffer.timestampOffset += lib.duration;
  media.tmpBuffer = [];
}
```

#### 控制播放片段

如果要在 video 标签中控制指定片段的播放，一般是不可能的。因为，在加载整个视频 buffer 的时候，视频长度就已经固定的，剩下的只是你如果在 video 标签中控制播放速度和音量大小。而在 mediaSourceE 中，如何在已获得整个视频流 Buffer 的前提下，完成底层视频 Buffer 的切割和指定时间段播放呢？这里，需要利用 sourceBuffer 下的 **appendWindowStart** 和 **appendWindowEnd** 这两个属性。

- 这两个属性主要是为了设置当有视频 Buffer 添加时，只有符合在 `[start, end]` 之间的 media frame 才能 append，否则，无法 append。例如：

```js
sourceBuffer.appendWindowStart = 2.0;
sourceBuffer.appendWindowEnd = 5.0;
```

> 设置添加 Buffer 的时间戳为 `[2s, 5s]` 之间。appendWindowStart 和 appendWindowEnd 的基准单位为 s。该属性值通常需要在添加 Buffer 之前设置。

#### sourceBuffer 内存释放

sourceBuffer 内存释放其实就和在 JS 中，将一个变量指向 null 一样的过程。

```js
const a = new ArrayBuffer(1024 * 1000);
a = null; // start garbage collection
```

在 sourceBuffer 中，简单的来说，就是移除指定的 time ranges’ buffer。需要用到的 API 为：

```js
remove(double start, unrestricted double end);
```

具体的步骤为：

- 找到具体需要移除的 segment。

- 得到其开始（start）的时间戳（以 s 为单位）。

- 得到其结束（end）的时间戳（以 s 为单位）。

- 此时，updating 为 true，表明正在移除。

- 完成之后，触发 updateend 事件。

如果想直接清空 Buffer 重新添加的话，可以直接利用 abort() 方法来实现。它的工作是清空当前 sourceBuffer 中所有的 segment，使用方法也很简单，不过就是需要注意不要和 remove 操作一起执行。更保险的做法就是直接，通过 updating===false 来完成：

```js
if (sourceBuffer.updating === false) {
  sourceBuffer.abort();
}
```

这时候，abort 的主要流程为：

- 确保 mediaSource.readyState 是否为 open 状态。

- 将 appendWindowStart 设置为 pts 原始值，比如：0。

- 将 appendWindowEnd 设置为正无限大，即，Infinity。

> 用来放弃当前 append 流的操作。不过，该方法的业务场景也比较有限。它只能用在当 sourceBuffer 正在更新流的时候。即，此时通过 fetch，已经接受到新流，并且使用 appendBuffer 添加，此为开始的时间。然后到 updateend 事件触发之前，这段时间之内调用 abort()。有一个业务场景是，当用户移动进度条快进时，而此时 fetch 已经获取前一次的 media segments，那么可以使用 abort 放弃该操作，转而请求新的 media segments。
