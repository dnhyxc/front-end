<!--
 * new page
 * @author: dnhyxc
 * @since: 2023-09-12
 * index.vue
-->
<template>
  <div type="primary" @click="changeLanguage">切换语言</div>

  <div class="monaco-editor-wrap" ref="editorRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import * as monaco from "monaco-editor";

const editorRef = ref<any>();
const content = ref<any>();

let editor: monaco.editor.IStandaloneCodeEditor;

// @ts-ignore
self.MonacoEnvironment = {
  getWorker(_: string, label: string) {
    if (label === "json") {
      return new jsonWorker();
    }
    if (label === "css" || label === "scss" || label === "less") {
      return new cssWorker();
    }
    if (label === "html" || label === "handlebars" || label === "razor") {
      return new htmlWorker();
    }
    if (["typescript", "javascript"].includes(label)) {
      return new tsWorker();
    }
    return new EditorWorker();
  },
};

const editorInit = () => {
  nextTick(() => {
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: false,
    });
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2016,
      allowNonTsExtensions: true,
    });

    if (!editor) {
      editor = monaco.editor.create(editorRef.value, {
        value: content.value, // 编辑器初始显示文字
        language: "javascript", // 语言支持自行查阅demo
        automaticLayout: true, // 自适应布局
        theme: "vs", // 官方自带三种主题vs, hc-black, or vs-dark
        foldingStrategy: "indentation",
        renderLineHighlight: "all", // 行亮
        selectOnLineNumbers: true, // 显示行号
        minimap: {
          enabled: false, // 是否启用预览图
        },
        readOnly: false, // 只读
        fontSize: 14, // 字体大小
        scrollBeyondLastLine: true, // 取消代码后面一大段空白
        overviewRulerBorder: false, // 不要滚动条的边框
        tabSize: 2,
        colorDecorators: true, // 呈现内联色彩装饰器和颜色选择器
      });
    } else {
      editor.setValue("");
    }

    // 监听值的变化
    editor.onDidChangeModelContent(() => {
      console.log(editor.getValue(), "editor.getValue()");
      content.value = editor.getValue();
    });
  });
};

onMounted(() => {
  editorInit();
});

//切换语言
const changeLanguage = () => {
  monaco.editor.setModelLanguage(editor?.getModel()!, "html");
};

onUnmounted(() => {
  // editor.dispose();
});
</script>

<style scoped lang="less">
.monaco-editor-wrap {
  height: 500px;
}
</style>
