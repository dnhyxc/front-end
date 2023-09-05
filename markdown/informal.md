### 实现禁止代码调试

```js
(() => {
  function block() {
    if (
      window.outerHeight - window.innerHeight > 200 ||
      window.outerWidth - window.innerWidth > 200
    ) {
      document.body.innerHTML = "检测到非法调试,请关闭后刷新重试!";
    }
    setInterval(() => {
      (function () {
        return false;
      })
        ["constructor"]("debugger")
        ["call"]();
    }, 50);
  }
  try {
    block();
  } catch (err) {}
})();
```

### 策略模式的应用

```js
export function transferAction(/* 参数 */) {
  /**
   * @description 处理字段显示和隐藏
   */
  const handleShowAndHide = ({ opType, relativeGroupCode, relativeCode }) => {};

  /**
   * @description // 启用、禁用字段（支持表格行字段的联动）
   */
  const handleEnableAndDisable = ({
    opType,
    relativeGroupCode,
    relativeCode,
  }) => {};

  /**
   * @description 必填 / 非必填字段（支持表格行字段的联动）
   */
  const handleRequiredAndUnrequired = ({
    opType,
    relativeGroupCode,
    relativeCode,
  }) => {};

  /**
   * @description 清空字段值
   */
  const handleClear = ({ opType, relativeGroupCode, relativeCode }) => {};

  // 联动策略
  const strategyMap = {
    // 显示、隐藏
    [OP_TYPE_KV.SHOW]: handleShowAndHide,
    [OP_TYPE_KV.HIDE]: handleShowAndHide,
    // 禁用、启用
    [OP_TYPE_KV.ENABLE]: handleEnableAndDisable,
    [OP_TYPE_KV.DISABLE]: handleEnableAndDisable,
    // 必填、非必填
    [OP_TYPE_KV.REQUIRED]: handleRequiredAndUnrequired,
    [OP_TYPE_KV.UN_REQUIRED]: handleRequiredAndUnrequired,
    // 清空字段值
    [OP_TYPE_KV.CLEAR]: handleClear,
  };

  // 遍历执行联动策略
  actions.forEach((action) => {
    const { opType, relativeGroupCode, relativeCode, value } = action;

    if (strategyMap[opType]) {
      strategyMap[opType]({
        /* 入参 */
      });
    }
  });
}
```
