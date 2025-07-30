export const noDnhyxcVars = {
  meta: {
    messages: {
      noDnhyxcVars: "请勿使用 dnhyxc 变量"
    }
  },
  create(context) {
    // 访问者模式
    return {
      Identifier(node) {
        if (node.name === "dnhyxc") {
          context.report({
            node,
            messageId: "noDnhyxcVars",
            data: {
              name: node.name
            }
          });
        }
      }
    }
  }
}