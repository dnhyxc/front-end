<!--
 * 文本转语音
 * @author: dnhyxc
 * @since: 2023-09-08
 * index.vue
-->
<template>
  <div class="modal-wrap">
    <div class="content">
      <div class="inp-wrap">
        <div class="label">输入文本转换</div>
        <el-input
          v-model="keyword"
          :autosize="{ minRows: 5, maxRows: 10 }"
          type="textarea"
          maxlength="800"
          resize="none"
          show-word-limit
          placeholder="请输入需要转换的文本"
        />
      </div>
    </div>
    <div class="footer">
      <el-button type="primary" :disabled="!keyword.trim()" @click="onConvert"
        >播放</el-button
      >
      <el-button
        type="info"
        :disabled="!keyword.trim() || !speech"
        @click="onPause"
        >暂停</el-button
      >
      <el-button
        type="success"
        :disabled="!keyword.trim() || !speech"
        @click="onResume"
        >恢复</el-button
      >
      <el-button type="warning" :disabled="!keyword.trim()" @click="onRefresh"
        >重置</el-button
      >
      <el-popover placement="top" trigger="hover">
        <div class="content">
          <el-slider
            v-model="sliderValue"
            vertical
            :show-tooltip="false"
            height="200px"
            size="small"
            input-size="small"
            :show-stops="false"
          />
        </div>
        <template #reference>
          <el-button type="success">倍速</el-button>
        </template>
      </el-popover>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import { SpeechPlayer, wavToMp3 } from "@/utils";

// 输入的文本
const keyword = ref<string>("");
const sliderValue = ref<number>(0);
// 语音播放实例
const speech = ref<SpeechPlayer | null>(null);

onUnmounted(() => {
  if (speech.value) {
    speech.value.cancel();
    speech.value = null;
  }
});

// 转换
const onConvert = () => {
  if (!keyword.value.trim()) {
    ElMessage({
      message: "请先输入需要转换的文本",
      type: "warning",
      offset: 80,
    });
    return;
  }

  // 播放结束事件
  const endEvent = async () => {
    speech.value = null;
    // const blob = new Blob([keyword.value.trim()], { type: "audio/wav" }); // 将转换的文本保存为 WAV 音频文件
    // const url = URL.createObjectURL(blob);

    // const res = await wavToMp3(url);
    // console.log(url, "url", res);
  };

  const onboundaryEvent = (
    event: { target: { getVoices: () => any[] } },
    utterance: any
  ) => {
    let chunks: BlobPart[] | undefined = [];
    const voices = speechSynthesis.getVoices();
    const findVoice = voices.find((i) => i.name.includes("Kangkang"));
    console.log(findVoice, "audioData");

    if (findVoice) {
      const mediaRecorder = new MediaRecorder(findVoice as any);
      console.log(mediaRecorder, "mediaRecorder");

      mediaRecorder.ondataavailable = (event) => {
        chunks?.push(event.data);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/mp3" });
        const url = URL.createObjectURL(blob);
        console.log(url, "url");
        // const link = document.createElement("a");
        // link.href = url;
        // link.download = "output.mp3"; // 设置下载文件的文件名
        // link.click();
        // chunks = [];
      };
      mediaRecorder.start();
    }
  };

  speech.value = new SpeechPlayer({
    text: keyword.value.trim(),
    rate: 1.5,
    endEvent,
    // onboundaryEvent,
  });

  // 每次播放前，清除播放列表
  speech.value?.cancel();
  speech.value?.start();
};

// 暂停
const onPause = () => {
  if (speech.value) {
    speech.value.pause();
  }
};

// 恢复
const onResume = () => {
  if (speech.value) {
    speech.value.resume();
  }
};

// 重置
const onRefresh = () => {
  keyword.value = "";
  if (speech.value) {
    speech.value.cancel();
    speech.value = null;
  }
};
</script>
