#### 何为 Web Components

desc：Web Components 是一套不同的技术，允许您创建可重用的定制元素（它们的功能封装在您的代码之外）并且在您的 web 应用中使用它们。

Web Components 是一套不同的技术，允许您创建可重用的定制元素（它们的功能封装在您的代码之外）并且在您的 web 应用中使用它们。

Web Components 由三项主要技术组成，它们可以一起使用来创建封装功能的定制元素，可以在你喜欢的任何地方重用，不必担心代码冲突。

1. Custom elements（自定义元素）：一组 JavaScript API，允许您定义 custom elements 及其行为，然后可以在您的用户界面中按照需要使用它们。

2. Shadow DOM（影子 DOM）：一组 JavaScript API，用于将封装的“影子”DOM 树附加到元素（与主文档 DOM 分开呈现）并控制其关联的功能。通过这种方式，您可以保持元素的功能私有，这样它们就可以被脚本化和样式化，而不用担心与文档的其他部分发生冲突。

3. HTML templates（HTML 模板）： `<template>` 和 `<slot>` 元素使您可以编写不在呈现页面中显示的标记模板。然后它们可以作为自定义元素结构的基础被多次重用。

#### Web Components 的创建方式

使用 class 类进行自定义元素定义：

```js
class CompanyCard extends HTMLElement {
  constructor() {
    super();
    ...
  }
}
```

使用 **Element.attachShadow()** 方法将一个 shadow DOM 附加到自定义元素上。使用通常的 DOM 方法向 shadow DOM 中添加子元素、事件监听器等等：

```js
this._shadowRoot = this.attachShadow({ mode: "open" });
this._shadowRoot.appendChild(template.content.cloneNode(true));
```

使用 **CustomElementRegistry.define()** 方法注册您的新自定义元素 ，并向其传递要定义的元素名称、指定元素功能的类、以及可选的其所继承自的元素。

```js
window.customElements.define("company-card", CompanyCard);
```

使用 `<template>` 和 `<slot>` 定义一个 HTML 模板。再次使用常规 DOM 方法克隆模板并将其附加到您的 shadow DOM 中。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CompanyCard</title>
  </head>
  <body>
    <template id="companyCard">
      <div class="container">...</div>
    </template>
  </body>
</html>
```

#### 生命周期回调

**connectedCallback**( )：customElement (company-card 元素) 第一次被插入到 DOM 时被调用，通常用来初始化状态，事件监听，创建影子 DOM。

**disconnectedCallback**( )：当 customElement (company-card 元素) 从 DOM 移除时执行，通常用来做清理工作，例如取消事件监听和定时器。

**attributeChangedCallback**(**name, oldValue, newValue**)：当 customElement (company-card 元素) 增加、删除、修改自身属性时被调用。

- 需要注意的是，如果需要在元素属性变化后，触发 attributeChangedCallback() 回调函数，你必须监听这个属性。需要通过定义 **get observedAttributes**( ) 函数来实现，observedAttributes() 函数体内包含一个 return 语句，返回一个数组，包含了需要监听的属性名称：

```js
static get observedAttributes() {
  return ['attribute1', 'attribute2'];
}
```

**adoptedCallback**( )：当 customElement (company-card 元素) 通过 **document.adoptNode()** 方法将这个自定义元素实例移动到新文档时被调用。

#### 基本使用示例

index.html 内容：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CompanyCard</title>
  </head>
  <body>
    <template id="companyCard">
      <style>
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 20px;
          padding: 0 20px;
          width: 500px;
          height: auto;
          border: 1px solid #ccc;
          font-size: 16px;
          box-sizing: border-box;
        }

        img {
          width: 200px;
          height: auto;
        }

        .btn,
        .btn_del,
        .btn_modName,
        .btn_modDesc,
        .btn_modType,
        .btn_move {
          height: 32px;
          width: auto;
          margin: 20px 0;
          outline: none;
          border: 1px solid #ccc;
          background-color: #fff;
          font-size: 16px;
          cursor: pointer;
        }
      </style>

      <div class="container">
        <p class="name"></p>
        <p class="desc"></p>
        <p class="use_slot">
          <slot name="slot1">slot default text</slot>
        </p>
        <img src="" alt="啊！我裂开了呀" />
        <div class="actions">
          <button class="btn">快点我试试！</button>
          <button class="btn_del">快点我删除我自己！</button>
          <button class="btn_modName">快点我修改name属性！</button>
          <button class="btn_modDesc">快点我修改desc属性！</button>
          <button class="btn_modType">快点我修改type属性！</button>
          <button class="btn_move">快点我移到别的文档中!</button>
        </div>
      </div>
    </template>

    <company-card
      image="./images/1.jpg"
      name="dnhyxc"
      desc="行到水穷处，坐看云起时"
      type="text"
      id="company_card"
    >
      <span slot="slot1">
        我大抵是不愿上班的，横竖都不想上，起来打开电脑，这忧伤没由来的，默默然看着那两个需求，一个是我的，另一个也是我的，我向来是不屑于做这点事的。而如今却生出了偷懒的念头。也罢，大概是很久没涨工资了吧！
      </span>
    </company-card>

    <company-card
      image="./images/2.jpg"
      name="WebComponents"
      desc="爱你"
      type="text"
      id="company_card"
    >
      <p slot="slot1">
        我对着人脸打卡机一扫，这张脸没有生气，瞳孔里倒印着诸如奋斗，拼搏，诚信之类密密麻麻的小词，我死活看不清楚，凑极近了仔细看了几分钟，才从像素上看出字来，满屏幕都上都闪烁着两个字，是“迟到！”
      </p>
      <ul slot="slot1">
        <li>
          我对着人脸打卡机一扫，这张脸没有生气，瞳孔里倒印着诸如奋斗，拼搏，诚信之类密密麻麻的小词，我死活看不清楚，凑极近了仔细看了几分钟，才从像素上看出字来，满屏幕都上都闪烁着两个字，是“迟到！”
        </li>
        <li>
          我大抵是不想搬砖了，横竖都搬不动。坐在旁边，这eom不由的来。拿起手机，看着自己这两只手，一只不想搬，另一只也不想搬。也罢，我想我是搬累了。
        </li>
      </ul>
    </company-card>

    <iframe
      src="http://127.0.0.1:5500/example/WebComponents/CompanyCard.html"
      frameborder="0"
      width="500"
      height="350"
      id="iframe"
    >
    </iframe>

    <script src="./CompanyCard.js"></script>
  </body>
</html>
```

index.js 内容：

```js
class CompanyCard extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "closed" });
    const template = document.getElementById("companyCard");
    // cloneNode() 方法克隆所有属性以及它们的值。如果需要克隆所有后代，需要把 deep 参数设置为 true，否则设置为 false。
    const content = template.content.cloneNode(true);
    const name = content.querySelector(".name");
    const desc = content.querySelector(".desc");
    const img = content.querySelector("img");
    const iframe = document.querySelector("#iframe");

    img.setAttribute("src", this.getAttribute("image"));
    name.innerText = this.getAttribute("name");
    desc.innerText = this.getAttribute("desc");

    shadow.appendChild(content);

    const actions = shadow.querySelector(".actions");
    const buttons = actions.querySelectorAll("button");

    buttons.forEach((i) => {
      i.addEventListener("click", () => {
        switch (i.className) {
          case "btn":
            desc.innerText = "我被点了，救救我~~~";
            break;
          case "btn_del":
            document.body.removeChild(document.querySelector("company-card"));
            break;
          case "btn_modName":
            document
              .querySelector("company-card")
              .setAttribute("name", "new_dnhyxc");
            break;
          case "btn_modDesc":
            document
              .querySelector("company-card")
              .setAttribute("desc", "行到水穷处，坐看云起时");
            break;
          case "btn_modType":
            document
              .querySelector("company-card")
              .setAttribute("type", "button");
            console.log(iframe, "iframe");
            iframe.contentWindow.document.adoptNode(
              document.querySelector("company-card")
            );
            break;
          case "btn_move":
            iframe.contentWindow.document.adoptNode(
              document.querySelector("company-card")
            );
            break;
          default:
            break;
        }
      });
    });
  }

  /*
   * 在 Class 内部可以使用 get 和 set 关键字，对某个属性设置存值函数和取值函数，拦截该属性的存取行为。
   */
  static get observedAttributes() {
    return ["name", "desc"]; // 监听 company-card 自身上的 name 属性
  }

  // customElement 第一次被插入到 DOM 时被调用，通常用来初始化状态，事件监听，创建影子 DOM
  connectedCallback() {
    console.log(
      "当 customElement (company-card 元素) 第一次被插入到DOM时被调用，通常用来初始化状态，事件监听，创建影子DOM"
    );
  }

  // 当 customElement 从 DOM 移除时执行，通常用来做清理工作，例如取消事件监听和定时器
  disconnectedCallback() {
    console.log(
      "当 customElement (company-card 元素) 从 DOM 移除时执行，通常用来做清理工作，例如取消事件监听和定时器"
    );
  }

  // 当 customElement 被移动到新的文档时被调用
  adoptedCallback() {
    console.log(
      "当 customElement (company-card 元素) 被移动到新的文档时被调用"
    );
  }

  /**
   * 需要注意的是，如果需要在元素属性变化后，
   * 触发 attributeChangedCallback() 回调函数，你必须监听这个属性。
   * 这可以通过定义 observedAttributes() get 函数来实现，
   * observedAttributes() 函数体内包含一个 return 语句，返回一个数组，
   * 包含了需要监听的属性名称：
   *   - static get observedAttributes() {return ['name', 'desc']; }
   */

  // 当 customElement 增加、删除、修改自身属性时被调用
  attributeChangedCallback(name, oldValue, newValue) {
    console.log(name, oldValue, newValue, "name, oldValue, newValue");
    console.log(
      "当 customElement (company-card 元素) 增加、删除、修改自身属性时被调用"
    );
  }
}

window.customElements.define("company-card", CompanyCard);
```

#### TODO LIST DEMO

index.html 内容：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>todo list demo</title>
  </head>
  <body>
    <todo-app></todo-app>
    <script src="todoItem.js"></script>
    <script src="todoList.js"></script>
  </body>
</html>
```

todoList 内容：

```js
(function () {
  const template = document.createElement("template");
  template.innerHTML = `
  <style>
    :host {
      display: block;
      font-family: sans-serif;
      text-align: center;
    }
    button {
      border: none;
      cursor: pointer;
    }
    ul {
      list-style: none;
      padding: 0;
    }
  </style>
  <h3>Raw web components</h3>
  <br>
  <h1>todo list</h1>
    <input type="text" placeholder="Add a new to do"></input>
    <button>添加</button>
  <ul id="todos"></ul>
`;

  class TodoApp extends HTMLElement {
    constructor() {
      super();

      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));

      this.$todoList = this._shadowRoot.querySelector("ul");
      this.$input = this._shadowRoot.querySelector("input");

      this.todos = [];

      this.$submitButton = this._shadowRoot.querySelector("button");
      this.$submitButton.addEventListener("click", this._addTodo.bind(this));
    }

    _removeTodo(e) {
      this.todos.splice(e.detail, 1);
      this._renderTodoList();
    }

    _toggleTodo(e) {
      const todo = this.todos[e.detail];
      this.todos[e.detail] = Object.assign({}, todo, {
        checked: !todo.checked,
      });
      this._renderTodoList();
    }

    _addTodo() {
      if (this.$input.value.length > 0) {
        this.todos.push({ text: this.$input.value, checked: false });
        this._renderTodoList();
        this.$input.value = "";
      }
    }

    _renderTodoList() {
      this.$todoList.innerHTML = "";

      this.todos.forEach((todo, index) => {
        let $todoItem = document.createElement("to-do-item");
        $todoItem.setAttribute("text", todo.text);

        if (todo.checked) {
          $todoItem.setAttribute("checked", "");
        }

        $todoItem.setAttribute("index", index);

        $todoItem.addEventListener("onRemove", this._removeTodo.bind(this));
        $todoItem.addEventListener("onToggle", this._toggleTodo.bind(this));

        this.$todoList.appendChild($todoItem);
      });
    }
  }

  window.customElements.define("todo-app", TodoApp);
})();
```

todoItem 内容：

```js
(function () {
  const template = document.createElement("template");
  template.innerHTML = `
    <style>
        :host {
            display: block;
            font-family: sans-serif;
        }
        .completed {
            text-decoration: line-through;
        }
        button {
            border: none;
            cursor: pointer;
        }
    </style>
    <li class="item">
        <input type="checkbox">
        <label></label>
        <button>删除</button>
    </li>
`;

  class TodoItem extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));

      this.$item = this._shadowRoot.querySelector(".item");
      this.$removeButton = this._shadowRoot.querySelector("button");
      this.$text = this._shadowRoot.querySelector("label");
      this.$checkbox = this._shadowRoot.querySelector("input");

      this.$removeButton.addEventListener("click", (e) => {
        this.dispatchEvent(new CustomEvent("onRemove", { detail: this.index }));
      });

      this.$checkbox.addEventListener("click", (e) => {
        this.dispatchEvent(new CustomEvent("onToggle", { detail: this.index }));
      });
    }

    connectedCallback() {
      if (!this.hasAttribute("text")) {
        this.setAttribute("text", "placeholder");
      }

      this._renderTodoItem();
    }

    static get observedAttributes() {
      return ["text", "checked", "index"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
      switch (name) {
        case "text":
          this._text = newValue;
          break;
        case "checked":
          this._checked = this.hasAttribute("checked");
          break;
        case "index":
          this._index = parseInt(newValue);
          break;
      }
    }

    _renderTodoItem() {
      if (this.hasAttribute("checked")) {
        this.$item.classList.add("completed");
        this.$checkbox.setAttribute("checked", "");
      } else {
        this.$item.classList.remove("completed");
        this.$checkbox.removeAttribute("checked");
      }

      this.$text.innerHTML = this._text;
    }

    set index(val) {
      this.setAttribute("index", val);
    }

    get index() {
      return this._index;
    }

    get checked() {
      return this.hasAttribute("checked");
    }

    set checked(val) {
      if (val) {
        this.setAttribute("checked", "");
      } else {
        this.removeAttribute("checked");
      }
    }
  }
  window.customElements.define("to-do-item", TodoItem);
})();
```

#### 参考文档

[Web Components | MDN](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components)
