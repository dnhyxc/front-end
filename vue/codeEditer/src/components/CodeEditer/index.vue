<!--
 * code 编辑器
 * @author: dnhyxc
 * @since: 2023-09-11
 * index.vue
-->
<template>
  <div class="code-editer-wrap">
    <Codemirror
      v-model:value="code"
      :options="cmOptions"
      ref="cmRef"
      @change="onChange"
      @input="onInput"
      @ready="onReady"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import Codemirror from "codemirror-editor-vue3";
// 编辑器代码格式
import "codemirror/mode/javascript/javascript.js";
// 自动刷新
import "codemirror/addon/display/autorefresh";
// placeholder
import "codemirror/addon/display/placeholder.js";
// language
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/javascript-hint";
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/addon/hint/html-hint';
import 'codemirror/addon/hint/xml-hint';
import 'codemirror/addon/hint/css-hint';
import 'codemirror/mode/vue/vue';

// 主题
import "codemirror/theme/dracula.css";

const cmRef = ref();
const code = ref(`
  var i = 0;
  for (; i < 9; i++) {
    console.log(i);
    // more statements
  }
`);

const cmOptions = reactive({
  autorefresh: true, // 是否自动刷新
  smartIndent: true, // 自动缩进
  tabSize: 2, // 缩进单元格为 2 个空格
  mode: "text/x-vue", //编辑器的编程语言，比如：'javascript'
  // mode: "javascript", //编辑器的编程语言，比如：'javascript'
  // mode: "application/javascript", //编辑器的编程语言，比如：'javascript'
  theme: "dracula", // 主题，使用主体需要引入相应的 css 文件
  line: true, // 是否显示行数
  viewportMargin: Infinity, // 高度自适应
  highlightDifferences: true,
  autofocus: false,
  indentUnit: 2,
  // readOnly: true, // 只读
  showCursorWhenSelecting: true,
  firstLineNumber: 1,
  matchBrackets: true, //括号匹配
  lineWrapping: true,
  lineWiseCopyCut: true, // 启用时，如果在复制或剪切时没有选择文本，那么就会自动操作光标所在的整行。
  extraKeys: { "Alt": "autocomplete" },
});

const onReady = (e: Event) => {
  console.log(e, "onReady");
};

const onChange = (e: Event) => {
  console.log(e, "onChange");
};

const onInput = (e: Event) => {
  console.log(e, "onInput");
};
</script>

<style scoped lang="less"></style>
