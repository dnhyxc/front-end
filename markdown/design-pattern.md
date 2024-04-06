### 构造器模式

desc: 本文主要讲述 JS 中主要的一些设计模式。看完本文，你将比较全面的了解 JS 中各种设计模式及其使用场景。

构造器模式，将一个复杂对象的构建与其表示分离，使得同样的构建过程可以创建不同的表示。通俗的话来讲，就是把成员变量的初始化与构造函数进行分离。

#### 适用场景

1. 隔离复杂对象的创建和使用，同样的方法不同的执行顺序，从而产生不同事件的结果。

2. 初始化对象时，参数很多或者很多参数都具有默认值

3. 不适合创建差异化很大的产品类，如果产品内部变化负责时，会导致定义很多建造者来实现变化，增加类的数量，增加了运行成本

#### 实现方式

```js
function CreateObject(name, age) {
  this.name = name;
  this.age = age;

  this.say = function () {
    console.log(this.name, this.age);
  };
}

const obj1 = new CreateObject("hmhm", 28);
const obj2 = new CreateObject("snsn", 29);

console.log(obj1);
console.log(obj2);

obj1.say();
obj2.say();
```

#### 构造器模式的优缺点

优点：

1. 各个具体的构建器都是相互独立的，利于系统的扩展。

2. 不必知道具体产品内部的实现。

缺点：

1. 如果对象结构中有某些相同的方法，那么每次通过构造器创建一个对象时，都会重复创建这个方法。

2. 产品组成部分必须要相同，限制了使用范围。

3. 假如产品内部变化复杂，会增加更多的建造者类。

### 原型模式

函数中不对属性进行定义，利用 prototype 属性对属性进行定义，可以让所有对象实例共享它所包含的属性及方法。

#### 适用场景

1. 对象之间相同或相似，只是个别的几个属性不同的时候。

2. 创建对象成本较大，比如初始化时间长，占用 CPU 资源多，占用网络资源多等，需要优化资源。

3. 创建一个对象需要繁琐的数据准备或访问权限等，需要提高性能或者提高安全性。

4. 系统中大量使用该类对象，需要各个调用者给它的属性重新赋值。

5. 当一个对象需要提供给其他对象访问，并且各个调用者都需要修改其值时。

#### 实现方式

使用构造函数的方式实现：

```js
function CreateObject(name, age) {
  this.name = name;
  this.age = age;
}

CreateObject.prototype.say = function () {
  console.log(this.name, this.age);
};

const obj1 = new CreateObject("hmhm", 28);
const obj2 = new CreateObject("snsn", 29);

console.log(obj1);
console.log(obj2);

obj1.say();
obj2.say();
```

使用 Class 实现：

```js
class Create {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  say() {
    console.log(this.name, this.age);
  }
}

const person1 = new Create("hmhm", 29);
const person2 = new Create("snsn", 30);

console.log(person1);
console.log(person2);

person1.say();
person2.say();
```

#### 具体使用场景

用于构建每个页面各自的 tab 选项卡：

- html 内容：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>原型链模式</title>
  </head>
  <body>
    <div id="prototype">
      <span>原型链模式</span>
      <div id="page1"></div>
      <div id="page2"></div>
      <div id="page3"></div>
    </div>
  </body>
</html>
```

- js 内容：

```js
class Tabs {
  constructor(el, type) {
    this.el = el;
    this.type = type;
  }

  // 创建元素
  createElement() {
    return `
      <div class="container">
        <span>${this.el}</span>
        <ul class="header">
          <li class="active">1</li>
          <li>2</li>
          <li>3</li>
          <li>4</li>
          <li>5</li>
          <li>6</li>
        </ul>
        <ul class="box">
          <li class="active">111</li>
          <li>222</li>
          <li>333</li>
          <li>444</li>
          <li>555</li>
          <li>666</li>
        </ul>
      </div>
    `;
  }

  // 渲染元素
  render() {
    const element = this.createElement();
    const el = document.querySelector(this.el);
    el.innerHTML = element;
    this.init();
  }

  // 操作元素，改变元素样式
  init() {
    const element = document.querySelector(this.el);
    this.container = element.querySelector(".container");
    this.headerItems = this.container.querySelectorAll(".header li");
    this.boxItems = this.container.querySelectorAll(".box li");
    this.change();
  }

  change() {
    for (let i = 0; i < this.headerItems.length; i++) {
      this.headerItems[i].addEventListener(
        this.type,
        () => {
          for (let j = 0; j < this.headerItems.length; j++) {
            this.headerItems[j].classList.remove("active");
            this.boxItems[j].classList.remove("active");
          }
          this.headerItems[i].classList.add("active");
          this.boxItems[i].classList.add("active");
        },
        false
      );
    }
  }
}

const tab1 = new Tabs("#page1", "click");
const tab2 = new Tabs("#page2", "mouseover");
const tab3 = new Tabs("#page3", "dblclick");

tab1.render();
tab2.render();
tab3.render();
```

### 工厂模式

由一个工厂对象决定创建某一种产品对象的实例，主要用来创建同一类对象。

#### 适用场景

简单工厂模式，只能作用于创建的对象数量较少，对象的创建逻辑不复杂时使用。

#### 实现方式

使用构造函数的方式实现：

```js
function UserFactory(role) {
  function User(role, pages) {
    this.role = role;
    this.pages = pages;
  }

  switch (role) {
    case "superadmin":
      return new User("superadmin", ["home", "classify", "create", "setting"]);
    case "admin":
      return new User("admin", ["home", "classify", "create"]);
    case "editor":
      return new User("editor", ["home", "create"]);

    default:
      throw new Error("参数异常，只能传入 superadmin 或 admin 或 editor");
  }
}

const superadmin = new UserFactory("superadmin");
const editor = new UserFactory("editor");

console.log(superadmin, "superadmin");
console.log(editor, "editor");
```

采用 Class 实现：

```js
class Auth {
  constructor(role, pages) {
    this.role = role;
    this.pages = pages;
  }

  static AuthFactory(role) {
    switch (role) {
      case "superadmin":
        return new Auth("superadmin", [
          "home",
          "classify",
          "create",
          "setting",
        ]);
      case "admin":
        return new Auth("admin", ["home", "classify", "create"]);
      case "editor":
        return new Auth("editor", ["home", "create"]);

      default:
        throw new Error("参数异常，只能传入 superadmin 或 admin 或 editor");
    }
  }
}

const superAuth = Auth.AuthFactory("superadmin");
const editorAuth = Auth.AuthFactory("editor");

console.log(superAuth, "superAuth");
console.log(editorAuth, "editorAuth");
```

#### 工厂模式的优缺点

优点：

- 只需要一个正确的参数，就可以获取到你所需要的对象，而无需知道其创建的具体细节。

缺点：

- 在函数内包含了所有对象的创建逻辑和判断逻辑代码，每增加新的构造函数就需要修改逻辑代码，当对象不是上面的 3 个而是 10 个或者更多时，这个函数就会成为一个庞大的超级函数，变得难以维护。

### 抽象工厂模式

抽象工厂模式并不直接生成实例，而是用于对产品类的创建。实际就是实现子类继承父类，再通过条件判断，返回对应的类。

#### 适用场景

1. 一个系统不应当依赖于产品类实例如何被创建、组合和表达的细节。

2. 系统中有多个产品族，而每次只使用其中某一产品族。

3. 属于同一个产品族的产品将在一起使用。

4. 系统提供一个产品类的库，所有的产品以同样的接口出现，从而使客户端不依赖于具体实现。

#### 实现方式

```js
// 父类实现公共的方法
class User {
  constructor(name, role, pages) {
    this.name = name;
    this.role = role;
    this.pages = pages;
  }

  getAuthInfo() {
    console.log(`${this.name}是${this.role}权限，具有访问${this.pages}的权限`);
  }

  dataShow() {
    throw new Error("抽象方法需要被子类实现");
  }
}

// 继承父类
class SuperAdmin extends User {
  constructor(name) {
    super(name, "superadmin", ["home", "classify", "create", "setting"]);
  }

  dataShow() {
    console.log("superadmin-dataShow");
  }

  editAuth() {
    console.log("编辑权限");
  }

  addUser() {
    console.log("增加用户");
  }

  createArticle() {
    console.log("增加权限");
  }
}

class Admin extends User {
  constructor(name) {
    super(name, "admin", ["home", "classify", "create"]);
  }

  dataShow() {
    console.log("admin-dataShow");
  }

  addUser() {
    console.log("增加用户");
  }

  createArticle() {
    console.log("创建文章");
  }
}

class Editor extends User {
  constructor(name) {
    super(name, "editor", ["home", "create"]);
  }

  createArticle() {
    console.log("创建文章");
  }

  dataShow() {
    console.log("admin-dataShow");
  }
}

// 返回对应的类
function getAbstractUserFactory(role) {
  switch (role) {
    case "superadmin":
      return SuperAdmin;

    case "admin":
      return Admin;

    case "editor":
      return Editor;

    default:
      throw new Error("参数异常，只能传入 superadmin 或 admin 或 editor");
  }
}

const SuperAdminUser = getAbstractUserFactory("superadmin");
const AdminUser = getAbstractUserFactory("admin");
const EditorUser = getAbstractUserFactory("editor");

const superadmin = new SuperAdminUser("dnhyxc");
const admin = new AdminUser("夏陌");
const editor = new EditorUser("墨客");

superadmin.getAuthInfo();
superadmin.dataShow();

admin.getAuthInfo();
admin.dataShow();

editor.getAuthInfo();
editor.dataShow();

console.log(superadmin.pages, "superadmin pages");
console.log(admin.pages, "admin pages");
console.log(editor.pages, "editor pages");
```

### 建造者模式

建造者模式属于创建型模式的一种，提供一种创建复杂对象的方式。它将一个复杂的对象的构建与它的表示分离，使得同样的构建过程可以创建不同的表示。

建造者模式是一步一步的创建一个复杂的对象，它允许用户指通过指定复杂的对象的类型和内容就可以构建它们，用户不需要指定内部的具体构造细节。

建造者模式将一个复杂对象的构建层相互分离，同样的构建过程可采用不同的表示。工厂模式主要是为了创建对象实例或者类族（抽象工厂），它关心的是最终产出（创建）的是什么，而不关心创建的过程，而建造者模式关心的是创建这个对象的整个过程，甚至创建对象的每个细节。

#### 适用场景

1. 需要生成的对象具有复杂的内部结构时。

2. 相同的方法，不同的执行顺序，产生不同的结果。

3. 多个部件或零件，都可以装配到一个对象中，但是产生的结果又不相同。

#### 实现方式

```js
class Navbar {
  constructor() {
    this.data = [];
  }

  init() {
    console.log("Navbar init");
  }

  getData() {
    console.log("Navbar getDate");
    return new Promise((resolve) => {
      setTimeout(() => {
        this.data = ["首页", "分类", "标签"];
        resolve(["首页", "分类", "标签"]);
      }, 2000);
    });
  }

  render() {
    console.log("Navbar data", this.data);
  }
}

class List {
  constructor() {
    this.data = [];
  }

  init() {
    console.log("List init");
  }

  getData() {
    console.log("List getDate");
    // this.data = ["test1", "test2", "test3"];
    // return ["test1", "test2", "test3"]
    return new Promise((resolve) => {
      setTimeout(() => {
        this.data = ["test1", "test2", "test3"];
        resolve(["test1", "test2", "test3"]);
      }, 2500);
    });
  }

  render() {
    console.log("List data", this.data);
  }
}

class Builder {
  async build(builder) {
    await builder.init();
    const res = await builder.getData();
    console.log(res, "res");
    await builder.render();
  }
}

const builder = new Builder();

const navbar = new Navbar();
const list = new List();

builder.build(navbar);
builder.build(list);
```

#### 建造者模式的优缺点

优点：

1. 具有封装性，使客户端不必知道产品内部组成的细节。

2. 建造者独立，易扩展。

3. 便于控制细节风险。可以对建造过程逐步细化，而不对其他模块产生任何影响。

缺点：

1. 产品必须有共同点，范围有限制。

2. 如果内部变化复杂，会有很多建造类。

### 单例模式

保证一个类仅仅只有一个实例，并提供一个访问它的全局访问点。它主要解决一个全局使用的类频繁地创建和销毁，占用内存。

#### 适用场景

1. 引用第三方库（多次引用只会使用一个库引用）。

2. 弹窗（登录框，信息提升框）。

3. 购物车 (一个用户只有一个购物车)。

4. 全局态管理 store (Vuex / Redux)。

#### 实现方式

利用闭包的方式实现：

```js
const singleton = (function () {
  let instance = null;

  function User(name, age) {
    this.name = name;
    this.age = age;
  }

  return function (name, age) {
    if (!instance) {
      instance = new User(name, age);
    }
    return instance;
  };
})();

const user1 = singleton("dnhyxc", 18);
const user2 = singleton("hmhm", 28);

console.log(user1, user2);
console.log(user1 === user2);
```

通过 Class 实现：

```js
class Single {
  constructor(name, age) {
    if (!Single.instance) {
      this.name = name;
      this.age = age;
      Single.instance = this;
    }

    return Single.instance;
  }

  getName() {
    return this.name;
  }

  getAge() {
    return this.age;
  }
}

const dnhyxc = new Single("dnhyxc", 18);
const hmhm = new Single("hmhm", 28);

console.log(dnhyxc, "dnhyxc");
console.log(hmhm, "hmhm");
console.log(hmhm === dnhyxc);
console.log(dnhyxc.getName());
console.log(dnhyxc.getAge());
```

#### 单例模式的优缺点

优点：

- 适用于单一对象，只生成一个对象实例，避免频繁创建和销毁实例，减少内存占用。

缺点：

- 不适用动态扩展对象，或需创建多个相似对象的场景。

### 装饰器模式

装饰器模式能够很好的对已有功能进行拓展，这样不会更改原有的代码，对其他的业务产生影响，这方便我们在较少的改动下对软件功能进行拓展。

#### 适用场景

1. 当需要动态地给对象添加新的行为，同时又需要保持原始对象的不变性时。

2. 当需要在运行时动态地添加或移除对象的功能时。

3. 当需要通过组合不同的装饰器来实现不同的效果时。

#### 实现方式

使用 Class 实现：

```js
class Component {
  operation() {
    console.log("基类 operation");
  }
}

// 定义一个装饰器类，它包含一个原始对象，并实现了与原始对象相同的接口
class Decorator {
  constructor(component) {
    this.component = component;
  }

  operation() {
    this.component.operation();
    console.log("装饰器类 operation");
  }
}

// 定义一个具体的装饰器类，它在原始对象的基础上添加了新的行为
class ConcreteDecoratorA extends Decorator {
  operation() {
    console.log("ConcreteDecoratorA operation");
    super.operation();
  }
}

// 定义另一个具体的装饰器类，它在原始对象的基础上添加了另一个新的行为
class ConcreteDecoratorB extends Decorator {
  operation() {
    super.operation();
    console.log("ConcreteDecoratorB operation");
  }
}

// 使用装饰器模式来扩展组件对象的功能
let component = new Component();
let decoratorA = new ConcreteDecoratorA(component);
let decoratorB = new ConcreteDecoratorB(decoratorA);
component.operation();
console.log("----------------decoratorA----------------");
decoratorA.operation();
console.log("----------------decoratorB----------------");
decoratorB.operation();
```

使用构造函数原型实现：

```js
Function.prototype.before = function (beforeFn) {
  const _this = this;
  return function () {
    // 先进行前置函数调用
    beforeFn.apply(this, arguments);
    // 执行原来的函数
    return _this.apply(this, arguments);
  };
};

Function.prototype.after = function (afterFn) {
  const _this = this;
  return function () {
    // 先执行原来的函数
    const res = _this.apply(this, arguments);
    // 后进行前置函数调用
    afterFn.apply(this, arguments);
    return res;
  };
};

function test() {
  console.log("test 调用");
  return "test";
}

const decoratorFn = test
  .before(function () {
    console.log("前置装饰方法调用");
  })
  .after(function () {
    console.log("后置装饰方法调用");
  });

decoratorFn();
```

#### 装饰器模式的优缺点

优点：

1. 装饰类和被装饰类可以独立发展，不会相互耦合。

2. 装饰模式是继承的一个替代模式。

3. 装饰模式可以动态扩展一个实现类的功能，而不必担心影响实现类。

缺点：

1. 如果管理不当会极大增加系统复杂度，降低代码的可读性和可维护性。

2. 如果装饰器的使用不当，可能会导致对象状态的混乱和不一致。

### 适配器模式

适配器模式：将一个类（对象）的接口（方法或属性）转化成客户希望的另外一个接口（方法或属性），使得原本由于接口不兼容而不能一起工作的那些类（对象）可以正常协作。简单理解就是为兼容而生的 “转换器”。

适配器不会改变实现层，它只是干涉了抽象的过程，使外部接口的适配能够让同一个方法适配与多种系统。

#### 适用场景

1. 使用一个已经存在的对象，但其方法或属性不符合我们的要求。

2. 统一多个类的接口设计。

3. 适配不同格式的数据。

4. 兼容老版本的接口。

#### 实现方式

```js
class Api1 {
  show() {
    console.log("调用API1中的方法");
  }
}

class Api2 {
  display() {
    console.log("调用API2中的方法");
  }
}

// 实现适配器
class Api2Adapater extends Api2 {
  constructor() {
    super();
  }

  show() {
    this.display();
  }
}

function useApi(api) {
  api.show();
}

useApi(new Api1());
useApi(new Api2Adapater());
```

#### 适配器模式的优缺点

优点：

1. 可以将接口或数据转换代码从程序主要业务逻辑中分离。

2. 已有的功能如果只是接口不兼容，使用适配器适配已有功能，可以使原有逻辑得到更好的复用，有助于避免大规模改写现有代码。

3. 灵活性好，适配器并没有对原有对象的功能有所影响，不想使用适配器时直接删掉适配器代码即可，不会对使用原有对象的代码有影响。

缺点：

1. 过多使用适配器，会使系统非常零乱，代码复杂度增加。

### 策略模式

策略模式定义了一系列算法，并将每个算法封装起来，使它们可以相互替换，且算法的变化不会影响使用算法的客户。策略模式属于行为模式，它通过对算法进行封装，把使用算法的责任和算法的实现分割开来，并委派给不同的对象对这些算法进行管理。

策略模式主要解决在有多种算法相似的情况下，使用 `if...else` 所带来的复杂和难以维护的问题。

#### 适用场景

1. 多种校验规则封装。

2. js 不同动画效果封装。

#### 实现方式

```js
const strategy = {
  A: (salary) => {
    return salary * 3;
  },
  B: (salary) => {
    return salary * 2;
  },
  C: (salary) => {
    return salary * 1;
  },
};

function calBonus(level, salary) {
  return strategy[level](salary);
}

const level1 = calBonus("A", 30000);
const level2 = calBonus("B", 20000);
const level3 = calBonus("C", 10000);
console.log(level1);
console.log(level2);
console.log(level3);
```

#### 策列模式的优缺点

优点：

1. 多重条件语句 `if...else` 不易维护，策略模式利用组合、委托和多态等技术和思想，可以有效地避免多重条件选择语句。

2. 在策略模式中利用组合和委托来让环境类拥有执行算法的能力，这也是继承的一种更轻便的替代方案。

3. 策略模式可以提供相同行为的不同实现，更容易满足需求的多变。

4. 策略模式提供了对开放、封闭原则的完美支持，将算法封装在独立的策略类中，使得它们易于切换，易于理解，易于扩展。

5. 策略模式把算法的使用放到环境类中，而算法的实现移到具体策略类中，实现了二者的分离。

缺点：

1. 使用策略模式会在程序中增加许多策略类或者策略对象，但实际上这比把它们负责的逻辑堆砌在环境类中要好。

2. 使用者需要理解所有策略算法的区别，以便使用合适的策略算法。（比如，我们要选择一种合适的旅游出行路线，必须先了解选择飞机、火车、自行车等方案的细节。此时策略类要向使用者暴露它的所有实现，这是违反最少知识原则的）。

#### 具体使用场景

根据不同的类型展示对应的状态：

- html 内容：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>策略模式</title>
  </head>
  <body>
    <div id="strategyWrap"></div>
  </body>
</html>
```

- js 内容：

```js
const data = [
  {
    title: "test1",
    type: 1,
  },
  {
    title: "test2",
    type: 2,
  },
  {
    title: "test3",
    type: 1,
  },
  {
    title: "test4",
    type: 3,
  },
  {
    title: "test5",
    type: 2,
  },
];

const TYPE_CONFIG = {
  1: {
    text: "驳回",
    class: "redType",
  },
  2: {
    text: "未通过",
    class: "orangeType",
  },
  3: {
    text: "通过",
    class: "greenType",
  },
};

function renderElement(data) {
  strategyWrap.innerHTML = `${data
    .map((i) => {
      return `
        <div class='item'>
          <span class="title">${i.title}</span>
          <span class='${TYPE_CONFIG[i.type].class}'>${
        TYPE_CONFIG[i.type].text
      }</span>
        </div>
      `;
    })
    .join("")}`;
}

renderElement(data);
```

### 代理模式

代理模式为其它对象提供一种代理以控制对这个对象的访问。

代理模式使得代理对象控制具体对象的引用。代理几乎可以是任何对象：文件，资源，内存中的对象，或者是一些难以复制的东西。

#### 适合场景

1. 延迟初始化 （虚拟代理）。如果你有一个偶尔使用的重量级服务对象，一直保持该对象运行会消耗系统资源时，可使用代理模式。

2. 访问控制（保护代理）。如果你只希望特定客户端使用服务对象，这里的对象可以是操作系统中非常重要的部分，而客户端则是各种已启动的程序（包括恶意程序），此时可使用代理模式。

3. 本地执行远程服务（远程代理）。适用于服务对象位于远程服务器上的情形。

4. 缓存请求结果 （缓存代理）。

#### 代理模式 - 虚拟代理

前端比较常用的虚拟代理有：图片懒加载、预加载。下面将使用虚拟代理实现一个图片预加载的例子：

- 使用 Class 实现：

```js
class PreloadImage {
  constructor(defaultUrl, loadUrl) {
    this.defaultUrl = defaultUrl;
    this.loadUrl = loadUrl;
    this.renderImage();
  }

  renderImage() {
    this.imgNode = document.createElement("img");
    this.imgNode.className = "proxyImg";
    document.body.appendChild(this.imgNode);
  }

  setDefaultUrl(url) {
    this.imgNode.src = url;
  }

  loadImageUrl() {
    const img = new Image();
    img.onload = () => {
      this.setDefaultUrl(img.src);
    };
    this.setDefaultUrl(this.defaultUrl);
    img.src = this.loadUrl;
  }
}

const defaultUrl =
  "https://picx.zhimg.com/80/v2-ed74c1b3160299096f2a7b838fb79147_720w.webp?source=1940ef5c";
const loadUrl = "http://43.143.27.249/image/c7ea4f4412954b4a91f5cab06.jpg";

const preloadImage = new PreloadImage(defaultUrl, loadUrl);

preloadImage.loadImageUrl();
```

- 使用立即执行函数实现：

```js
const renderImage = (function () {
  const imgNode = document.createElement("img");
  imgNode.className = "proxyImg";
  document.body.appendChild(imgNode);
  return {
    setSrc: function (src) {
      imgNode.src = src;
    },
  };
})();

const loadImage = (function () {
  const img = new Image();
  img.onload = function () {
    renderImage.setSrc(img.src);
  };

  return {
    setSrc: function (src) {
      renderImage.setSrc(
        "https://picx.zhimg.com/80/v2-ed74c1b3160299096f2a7b838fb79147_720w.webp?source=1940ef5c"
      );
      img.src = src;
    },
  };
})();

loadImage.setSrc("http://43.143.27.249/image/c7ea4f4412954b4a91f5cab06.jpg");
```

#### 代理模式 - 保护代理

假设产品经理为前端工程师的代理，不仅可以帮助程序员接需求，同时还有帮助程序员过滤需求的职责，比如说，客户要更改某个需求，但是成本太大，需要拒绝。这种情况，就相当于是保护代理。具体实现方式如下：

```js
class Programmer {
  coding() {
    console.log("需求可做，但得价钱");
  }
}

class ProductManager {
  constructor() {
    this.programmer = new Programmer();
  }

  talkNeeds(needs) {
    if (needs === "easy") {
      this.programmer.coding();
    } else {
      console.log("需求太难，做不了");
    }
  }
}

const productManager = new ProductManager();

// productManager.talkNeeds("difficulty");
productManager.talkNeeds("easy");
```

#### 代理模式 - 缓存代理

使用缓存代理实现求和：

```js
function Add() {
  let res = 0;

  for (let i = 0; i < arguments.length; i++) {
    res += arguments[i];
  }

  return res;
}

const addProxy = (function () {
  const cache = {};

  return function () {
    const args = Array.prototype.join.call(arguments, ",");

    if (args in cache) {
      return cache[args];
    }

    return (caches[args] = Add.apply(this, arguments));
  };
})();

const res1 = addProxy(1, 2, 3);
const res2 = addProxy(2, 3, 4, 5, 6);

console.log(res1, "res1");
console.log(res2, "res2");
```

使用缓存代理实现请求数据的缓存：

```js
class ProxyTabData {
  static catchData = {};
  constructor(target) {
    if (!ProxyTabData.catchData[target]) {
      ProxyTabData.catchData[target] = this.getData(target);
    }
  }

  getData(target) {
    return fetch("/xxx", {
      method: "POST",
      body: { id: target },
    });
  }
}

function handleClick(e) {
  new ProxyTabData(e.target);
}
```

### 观察者模式

当一个对象的状态发生改变时，所有依赖于它的对象都会得到通知并自动更新，解决了主体对象与观察者之间功能的耦合，即一个对象状态改变给其它对象通知的问题。

观察者模式包含观察目标和观察者两类对象：一个目标可以有任意数目的与之相依赖的观察者。一旦观察目标的状态发生改变，所有的观察者都将得到通知。

#### 适用场景

1. 当一个对象的状态发生变化时需要通知其他多个对象进行更新。

2. 当一个对象需要在状态变化时执行一些操作，但这些操作和对象本身无关时。

3. 当一个对象需要通知其他对象，但又希望它们能够自由地添加或移除自己时。

#### 实现方式

```js
// 观察者
class Observer {
  constructor(name, fn = () => {}) {
    this.name = name;
    this.fn = fn;
  }
}

// 被观察者
class Subject {
  constructor(state) {
    this.state = {
      name: state.name || "",
      action: state.action || "",
    };
    this.observers = [];
  }

  // 设置状态
  setState(val) {
    this.state = { ...this.state, ...val };
    this.observers.forEach((i) => {
      i.fn(val);
    });
  }

  // 获取状态
  getState() {
    return this.state;
  }

  // 添加观察者
  addObserver(obs) {
    if (!this.observers.includes(obs)) {
      this.observers.push(obs);
    }
  }

  // 删除观察者
  delObserver(obs) {
    if (this.observers.includes(obs)) {
      this.observers = this.observers.filter((i) => i !== obs);
    }
  }

  // 清除所有观察者
  delAll() {
    this.observers = [];
  }
}

const snsn = new Observer("snsn", (data) => {
  console.log(`嘻嘻！snsn发现${data.name || "你"}${data.action || ""}了`);
});

const hmhm = new Observer("hmhm", (data) => {
  console.log(`哈哈！hmhm发现${data.name || "你"}${data.action || ""}了`);
});

const sub1 = new Subject({ name: "dnhyxc", action: "code" });
const sub2 = new Subject({ action: "code" });
sub1.addObserver(snsn);
sub1.addObserver(hmhm);
sub1.setState({ action: "看电影" });
sub1.setState({ name: "听音乐的dnhyxc" });

sub2.addObserver(snsn);
sub2.addObserver(hmhm);
sub2.setState({ action: "听音乐" });
console.log(sub1);
console.log(sub2);
sub2.delObserver(hmhm);
sub2.setState({ action: "听音乐" });
console.log(sub2);

sub1.delAll();
sub1.setState({ action: "发现不了了吧" });
const res = sub1.getState();
console.log(res);
console.log(sub1);
```

#### 观察者的优缺点

优点：

- 目标者与观察者，功能耦合度降低，专注自身功能逻辑，观察者被动接受更新，时间上解耦，实时接受目标者的更新状态。

缺点：

- 观察者模式虽然实现了对象间依赖关系的低耦合，但却不能对事件通知进行细分管控，如 “筛选通知”、“指定主题事件通知” 等。

### 发布订阅模式

发布订阅模式的特点：观察者和目标要相互知道，发布者和订阅者不用相互知道，通过第三方实现调度，属于经过解耦的观察者模式。

#### 实现方式

```js
class SubPub {
  constructor() {
    this.observers = {};
    // 使用单例模式控制每次创建的实例始终是相同的
    if (!SubPub.instance) {
      SubPub.instance = this;
    } else {
      return SubPub.instance;
    }
  }

  // 监听
  on(type, fn) {
    if (!this.observers[type]) {
      this.observers[type] = [fn];
    } else {
      this.observers[type].push(fn);
    }
  }

  // 发布
  emit(type, data) {
    if (!this.observers[type]) return;
    this.observers[type].forEach((i) => i(data));
  }

  // 清除订阅
  remove(type, fn) {
    if (!this.observers[type]) return;
    if (fn) {
      // 清除监听的type类型中的fn事件
      this.observers[type] = this.observers[type].filter((i) => i !== fn);
    } else {
      // 如果没有传入fn，则清空监听的type类型中所有的事件
      this.observers[type] = [];
    }
  }

  // 清除所有订阅
  clear() {
    this.observers = {};
  }
}
```

使用示例：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>发布订阅模式</title>
  </head>
  <body>
    <button id="emit1">发布msg1</button>&nbsp;
    <button id="emit2">发布msg2</button>&nbsp;
    <button id="remove1">清除msg1订阅</button>&nbsp;
    <button id="remove2">清除msg2订阅</button>&nbsp;
    <button id="clear">清除所有订阅</button>&nbsp;
    <button id="sub">重新增加监听</button>

    <script>
      class SubPub {
        constructor() {
          this.observers = {};
          // 使用单例模式控制每次创建的实例始终是相同的
          if (!SubPub.instance) {
            SubPub.instance = this;
          } else {
            return SubPub.instance;
          }
        }

        // 监听
        on(type, fn) {
          if (!this.observers[type]) {
            this.observers[type] = [fn];
          } else {
            this.observers[type].push(fn);
          }
        }

        // 发布
        emit(type, data) {
          if (!this.observers[type]) return;
          this.observers[type].forEach((i) => i(data));
        }

        // 清除订阅
        remove(type, fn) {
          if (!this.observers[type]) return;
          if (fn) {
            // 清除监听的type类型中的fn事件
            this.observers[type] = this.observers[type].filter((i) => i !== fn);
          } else {
            // 如果没有传入fn，则清空监听的type类型中所有的事件
            this.observers[type] = [];
          }
        }

        // 清除所有订阅
        clear() {
          this.observers = {};
        }
      }

      const subPub = new SubPub();
      const subPub1 = new SubPub();

      console.log(subPub, subPub1);
      console.log(subPub === subPub1);

      const sub1 = (data) => {
        console.log("sub1", data);
      };

      const sub2 = (data) => {
        console.log("sub2", data);
      };

      const sub3 = (data) => {
        console.log("sub2", data);
      };

      // 订阅
      subPub.on("msg1", sub1);
      subPub.on("msg1", sub2);
      subPub.on("msg2", sub3);
      subPub1.on("msg2", sub1);

      // 发布msg1
      emit1.onclick = () => {
        subPub.emit("msg1", "我是监听的msg1");
      };

      // 发布msg2
      emit2.onclick = () => {
        subPub.emit("msg2", "我是监听的msg2");
      };

      // 清除msg1中订阅的sub2
      remove1.onclick = () => {
        console.log("清除了 msg1 中的 sub2");
        subPub.remove("msg1", sub2);
        console.log(subPub);
      };

      // 清除msg2中订阅的sub3
      remove2.onclick = () => {
        console.log("清除了 msg2 中的 sub3");
        subPub.remove("msg2", sub3);
        console.log(subPub);
      };

      // 清除msg1中订阅的sub2
      clear.onclick = () => {
        console.log("清除了所有的监听");
        subPub.clear();
      };

      // 重新增加监听
      sub.onclick = () => {
        // 先全部清除，再从新监听，防止重复
        subPub.clear();
        subPub.on("msg1", sub1);
        subPub.on("msg1", sub2);
        subPub.on("msg2", sub3);
        subPub1.on("msg2", sub1);
        console.log("重新增加所有监听了");
      };
    </script>
  </body>
</html>
```

#### 发布订阅模式的优缺点

优点：

1. 对象之间解耦。

2. 异步编程中，可以更松耦合的代码编写。

缺点：

1. 创建订阅者本身要消耗一定的时间和内存。

2. 虽然可以弱化对象之间的联系，多个发布者和订阅者嵌套一起的时候，程序难以跟踪维护。

### 模块化模式

模块化模式最初被定义为在传统软件工程中为类提供私有和公共封装的一种方法，能够使一个单独的对象拥有公共及私有的方法和变量，从而屏蔽来自全局作用域的特殊部分。这可以减少我们的函数名与在页面中其它脚本区域内定义的函数名冲突的可能性。

#### 实现方式

使用闭包实现：

```js
const obj = (function () {
  let count = 0;

  return {
    increment() {
      return ++count;
    },

    decrement() {
      return --count;
    },
  };
})();

console.log(obj.increment());
```

使用 ES6 模块化的方式实现：

- 在一个 js 文件（任意名称的 js 文件，如：module.js）中编写如下代码：

```js
let count = 0;

function increment() {
  return ++count;
}

function decrement() {
  return --count;
}

export { increment, decrement };
```

具体使用方式：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>模块化模式</title>
  </head>
  <body>
    <!-- 使用闭包实现 -->
    <script>
      const obj = (function () {
        let count = 0;

        return {
          increment() {
            return ++count;
          },

          decrement() {
            return --count;
          },
        };
      })();

      console.log(obj.increment());
      console.log(obj.increment());
    </script>

    <!-- 使用ES6模块化实现实现 -->
    <script type="module">
      import { increment, decrement } from "./js/modal.js";
      console.log(increment(), "module");
      console.log(decrement(), "module");
    </script>
  </body>
</html>
```

> module 模式使用了闭包封装 “私有” 状态和组织。它提供了一种包装混合公有及私有方法和变量的方式，防止泄露到全局作用域，并与别的开发人员的接口发生冲突。通过该模式，只需要返回一个公有的 API，而其它的一切则维持在私有闭包里。

### 桥接模式

该模式将抽象部分与它的实现部分分离，使它们都可以独立变化。

#### 适用场景

1. 如果一个系统需要在构件的抽象化角色和具体化角色之间增加更多的灵活性，避免在两个层次之间建立静态的继承联系，通过桥接模式可以使它们在抽象层建立一个关联关系。

2. 对于那些不希望使用继承或因为多层次继承导致系统类的个数急剧增加的系统，桥接模式尤为适用。

3. 一个类存在两个独立变化的维度，且这两个维度都需要进行扩展。

#### 实现方式

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>桥接模式</title>
  </head>
  <body>
    <div id="message">
      <div id="content"></div>
    </div>

    <div id="message_2">
      <div id="content"></div>
    </div>
    <script>
      const Animations = {
        bounce: {
          show(ele) {
            console.log(ele, "弹跳显示");
          },

          hide(ele) {
            console.log(ele, "弹跳隐藏");
          },
        },

        slide: {
          show(ele) {
            console.log(ele, "滑动显示");
          },

          hide(ele) {
            console.log(ele, "滑动隐藏");
          },
        },

        rotate: {
          show(ele) {
            console.log(ele, "旋转显示");
          },

          hide(ele) {
            console.log(ele, "旋转隐藏");
          },
        },
      };

      function Toast(ele, animation) {
        this.ele = ele;
        this.animation = animation;
        // 扩展 Message 其它属性
      }

      Toast.prototype.show = function () {
        this.animation.show(this.ele);
      };

      Toast.prototype.hide = function () {
        this.animation.hide(this.ele);
      };

      class Message {
        constructor(ele, animation) {
          this.ele = ele;
          this.animation = animation;
        }

        show() {
          this.animation.show(this.ele);
        }

        hide() {
          this.animation.hide(this.ele);
        }

        setContent(value) {
          const content = this.ele.querySelector("#content");
          content.innerHTML = value;
        }
      }
      const toast1 = new Toast("toast1", Animations.bounce);
      const toast2 = new Toast("toast1", Animations.slide);
      const message1 = new Message(message, Animations.rotate);
      const message2 = new Message(message_2, Animations.bounce);

      toast1.show();
      toast2.show();
      message1.show();
      message2.show();

      setTimeout(() => {
        message1.setContent("我是message1消息内容");
        message2.setContent("我是message2消息内容");
      }, 1500);

      setTimeout(() => {
        toast1.hide();
        toast2.hide();
        message1.hide();
        message2.hide();
      }, 2000);
    </script>
  </body>
</html>
```

#### 桥接模式的优缺点

优点：把抽象与实现隔离开，有助于独立地管理各组成部分。

缺点：每使一个桥接元素都要增加一次函数调用，这对应用程序地性能会有一些负面影响（提高了系统地复杂度）。

### 组合模式

组合模式在对象间形成树形结构，组合模式中基本对象和组合对象被一致对待。无需关心对象有多少层，调用时只需在根部进行调用。

它在树形结构的问题中，模糊了简单元素和复杂元素的概念，客户程序可以像处理简单元素一样来处理复杂元素，从而使得客户程序与复杂元素的内部结构解耦。

#### 适用场景

1. 希望以相同方式处理简单元素和复杂元素，针对抽象编程，而无需关系对象层次结构细节。

2. 组合多个对象形成树形结构以表示具有 “整体—部分” 关系的层次结构，但又希望一种方式忽略整体与部分的差异。

#### 基本实现

```js
// 第一级类
class FirstStage {
  constructor(menu) {
    this.menu = menu;
    this.list = []; // 用于存储子级
  }

  add(data) {
    this.list.push(data);
  }

  render() {
    // 开始渲染父级菜单
    console.log("开始渲染第一级：", this.menu);
    this.list.forEach((i) => {
      i.render();
    });
  }
}

// 第二级类
class SecondStage {
  constructor(menu) {
    this.menu = menu;
    this.list = [];
  }

  add(data) {
    this.list.push(data);
  }

  render() {
    console.log("开始渲染第二级：", this.menu);
    this.list.forEach((i) => {
      i.render();
    });
  }
}

// 根
const rootMenu = new FirstStage("root");
// 子级
const menu1 = new FirstStage("菜单1");
const menu2 = new FirstStage("菜单2");
const menu3 = new FirstStage("菜单3");

// 子级的子级（孙子级）
const menu1_1 = new SecondStage("菜单1_1");
const menu1_2 = new SecondStage("菜单1_2");
const menu2_1 = new SecondStage("菜单2_1");
const menu2_2 = new SecondStage("菜单2_2");
const menu3_1 = new SecondStage("菜单3_1");
const menu3_2 = new SecondStage("菜单3_2");

// 向根节点添加数据
rootMenu.add(menu1);
rootMenu.add(menu2);
rootMenu.add(menu3);

// 向子级中添加数据
menu1.add(menu1_1);
menu1.add(menu1_2);
menu2.add(menu2_1);
menu2.add(menu2_2);
menu3.add(menu3_1);
menu3.add(menu3_2);

rootMenu.render();
```

#### 具体应用场景

用于根据**权限**实现树形菜单结构：

- index.html 文件内容：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>组合模式</title>
    <script type="module" src="./main.js"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

- main.js 文件内容：

```js
// 第一级类
class FirstStage {
  constructor(menu) {
    this.menu = menu;
    this.list = []; // 用于存储子级
  }

  add(data) {
    this.list.push(data);
  }

  render() {
    if (this.menu !== "root") {
      const ul = document.createElement("ul");
      const li = document.createElement("li");
      li.innerHTML = this.menu;
      var childUl = document.createElement("ul");
      li.appendChild(childUl);
      ul.appendChild(li);
      root.appendChild(ul);
    }

    // 开始渲染父级菜单
    console.log("开始渲第一级菜单", this.menu, this.list);
    this.list.forEach((i) => {
      i.render(childUl);
    });
  }
}

// 第二级类
class SecondStage {
  constructor(menu) {
    this.menu = menu;
    this.list = [];
  }

  add(data) {
    this.list.push(data);
  }

  render(childUl) {
    const li = document.createElement("li");
    li.innerHTML = this.menu;
    var childSubUl = document.createElement("ul");
    li.appendChild(childSubUl);
    childUl.appendChild(li);

    // 开始渲染子级菜单
    console.log("开始渲第二级菜单", this.menu, this.list);
    this.list.forEach((i) => {
      i.render(childSubUl);
    });
  }
}

// 第三级类
class ThirdStage {
  constructor(menu) {
    this.menu = menu;
  }

  // 开始渲染子孙级菜单
  render(childSubUl) {
    console.log("渲染第三级菜单", this.menu, childSubUl);
    const li = document.createElement("li");
    li.innerHTML = this.menu;
    childSubUl.appendChild(li);
  }
}

// 根
const rootMenu = new FirstStage("root");
// 子级
const menu1 = new FirstStage("菜单1");
const menu2 = new FirstStage("菜单2");
const menu3 = new FirstStage("菜单3");

// 子级的子级（孙子级）
const menu1_1 = new SecondStage("菜单1_1");
const menu1_2 = new SecondStage("菜单1_2");
const menu2_1 = new SecondStage("菜单2_1");
const menu2_2 = new SecondStage("菜单2_2");
const menu3_1 = new SecondStage("菜单3_1");
const menu3_2 = new SecondStage("菜单3_2");

// 创建孙子级
const menu1_1_1 = new ThirdStage("菜单1_1_1");
const menu1_2_1 = new ThirdStage("菜单1_2_1");
const menu2_1_1 = new ThirdStage("菜单2_1_1");
const menu2_2_1 = new ThirdStage("菜单2_2_1");
const menu3_1_1 = new ThirdStage("菜单3_1_1");
const menu3_1_2 = new ThirdStage("菜单3_1_2");
const menu3_2_1 = new ThirdStage("菜单3_2_1");
const menu3_2_2 = new ThirdStage("菜单3_2_2");

// 这里可以根据权限动态向根节点添加数据
rootMenu.add(menu1);
rootMenu.add(menu2);
rootMenu.add(menu3);

// 这里可以根据权限动态向父级中添加数据
menu1.add(menu1_1);
menu1.add(menu1_2);
menu2.add(menu2_1);
menu2.add(menu2_2);
menu3.add(menu3_1);
menu3.add(menu3_2);

// 这里可以根据权限动态向父级中添加子级
menu1_1.add(menu1_1_1);
menu1_2.add(menu1_2_1);
menu2_1.add(menu2_1_1);
menu2_2.add(menu2_2_1);
menu3_1.add(menu3_1_1);
menu3_1.add(menu3_1_2);
menu3_2.add(menu3_2_1);
menu3_2.add(menu3_2_2);

rootMenu.render();
```

### 命令模式

有时候需要向某些对象发送请求，但是并不知道请求的接收者是谁，也不知道被请求的操作是什么，需要一种松耦合的方式来设计程序，使得发送者和接收者能够消除彼此之间的耦合关系。

通俗易懂的理解：将军发布命令，士兵去执行。其中有几个角色：将军（命令发布者 Invoker）、士兵（命令的具体执行者 Receiver）、命令(连接将军和士兵 Command)。

命令模式的构成角色主要以下三种：

1. 发布者（invoker），用于发出命令，调用命令对象。它不知道如何执行与谁执行。

2. 接收者（receiver），用于提供对应接口处理请求。它不知道谁发起的请求。

3. 命令对象（command），用于接收命令，调用接收者对应接口并处理发布者的请求。

#### 适用场景

1. 假设存在两个组件，有 tabs 和 menuList，我们只需要通过一个方法就可以控制它们的渲染。

2. 这两个组件都是相互独立的，我们如果要让它们渲染，就需要分别实现渲染它们的方法。而我们期望是可以用一个公共的方法同时触发它们进行渲染。

3. 要实现一个方法同时控制这两个组件的渲染，就需要这两个组件分别提供一个方法给这个公共的方法进行调用，这时就可以考虑命令模式。

4. 命令模式可将“动作的请求者”从“动作的执行者”对象中解耦出来。

5. 在这个例子中，动作的请求者是公共的方法，动作的执行者是每个组件。

#### 基本实现示例

```js
// 接受类
class Receiver {
  exexute() {
    console.log("接受者执行请求");
  }
}

// 命令类
class Command {
  // 接受接收者实例参数，用于调用其 exexute 方法
  constructor(recevier) {
    this.recevier = recevier;
  }

  exexute() {
    console.log("命令对象通知接受者如何进行处理请求");
    this.recevier.exexute();
  }
}

// 发布类
class Invoker {
  // 接受命令类实例，用于调用其 exexute 方法
  constructor(command) {
    this.command = command;
  }

  order() {
    console.log("发布请求");
    this.command.exexute();
  }
}

const recevier = new Receiver();

const order = new Command(recevier);

const invoker = new Invoker(order);

invoker.order();
```

#### 具体应用场景

同时触发各个组件的渲染：

```js
class MacroCommand {
  constructor() {
    // 用户存储子命令对象
    this.list = new Set();
  }

  add(command) {
    this.list.add(command);
  }

  exexute() {
    this.list.forEach((command) => {
      command.exexute();
    });
  }
}

class Tabs {
  constructor() {
    if (!Tabs.instance) {
      Tabs.instance = this;
    } else {
      return Tabs.instance;
    }
  }

  async exexute() {
    console.log("tabs 执行");
    const res = await this.getData();
    if (res) {
      this.render(res);
    }
  }

  async getData() {
    console.log("加载数据...");
    return await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([0, 1, 2]);
      }, 2000);
    });
  }

  render(res) {
    console.log(res, "页面渲染...");
    const tabs = `
      <div id='tabs'>
        <span>tab1</span>
        <span>tab2</span>
        <span>tab3</span>
      </div>
    `;
    const tabWrap = document.querySelector("#tab-wrap");
    tabWrap.innerHTML = tabs;
  }
}

class MenuList {
  constructor() {
    if (!MenuList.instance) {
      MenuList.instance = this;
    } else {
      return MenuList.instance;
    }
  }

  exexute() {
    console.log("menuList 执行");
    this.render();
  }

  render() {
    const menus = `
    <div id='menus'>
      <span>menu1</span>
      <span>menu2</span>
      <span>menu3</span>
      <span>menu4</span>
      <span>menu5</span>
    </div>
  `;
    const menuWrap = document.querySelector("#menu-wrap");
    menuWrap.innerHTML = menus;
  }
}

const tabs = new Tabs();
const menuList = new MenuList();

const macroCommand = new MacroCommand();

macroCommand.add(tabs);
macroCommand.add(menuList);

macroCommand.exexute();
```

### 模板方法模式

模板方法模式由两部分组成，第一部分是抽象父类，第二部分是具体的实现子类。通常在抽象父类中封装了子类的算法框架，包括实现一些公共方法以及封装子类中所有的执行顺序。子类通过继承这个抽象类，也继承了整个算法结构，并且可以选择重写父类的方法。

#### 适用场景

当完成一个操作具体固定的流程时，有某些重复的操作，其中操作步骤相同，但具体的实现不同，如：渲染某两个组件，或某两个页面，它们都需要先获取数据，然后再渲染视图，其中获取数据的步骤，每个组件（页面）都有自己获取数据的接口，而渲染的方法是一直的。这个时候，就可以通过模板方法模式实现。

总结：模板方法模式使用的主要场景有：

1. 一次性实现一个算法的不变部分，并将可变的行为留给子类来实现。

2. 各子类中公共的行为被提取出来并集中到一个公共的父类中，从而避免代码重复。

#### 实现方式

```js
class Container {
  constructor(params = {}) {
    this.params = params;
    this.list = [];
  }

  async init() {
    const list = await this.getData();
    this.list = [...this.list, ...list];
    list?.length && this.render(list);
  }

  getData() {
    throw new Error("必须传入getData方法");
  }

  render(list) {
    console.log(list, "render");
  }
}

class Message extends Container {
  constructor() {
    super();
  }

  // 重写父类 getData 方法
  getData() {
    console.log("message 开始获取数据");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([1, 2, 3, 4, 5]);
      }, 2000);
    });
  }
}

class Article extends Container {
  constructor() {
    super();
  }

  // 重写父类 getData 方法
  getData() {
    console.log("article 开始获取数据");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([6, 7, 8, 9, 10]);
      }, 2000);
    });
  }
}

const message = new Message();
const article = new Article();

message.init();
article.init();
```

> 模板方法模式是一种典型的通过封装变化提高系统扩展性的设计模式，运用了模板方法模式的程序中，子类方法种类和执行顺序都是不变的，但是子类的方法具体实现则是可变的，父类是个模板，子类可以添加，这就可以增加不同的功能。

### 迭代器模式

迭代器模式是指提供一种方法顺序来访问一个聚合对象中的各个元素，而又不需要暴露该对象的内部表示。迭代器模式可以把迭代的郭成从业务逻辑中分离出来，在使用迭代器模式之后，即便不关心对象的内部构造，也可以按顺序访问其中的每个元素。

迭代器模式的特点：

1. 为遍历不同数据结构 “集合” 提供统一的接口。

2. 能遍历访问 “集合” 数据中的项，不关心项的数据结构。

#### 迭代器模式基本实现

```js
// 统一遍历接口
const myEach = function (arr, callback) {
  for (let i = 0; i < arr.length; i++) {
    callback(i, arr[i]);
  }
};

// 外部调用
myEach([1, 2, 3, 4, 5], function (index, value) {
  console.log(index, value);
  const oli = document.createElement("li");
  oli.innerHTML = value;
  list.appendChild(oli);
});
```

#### 迭代器模式的应用场景

使用迭代器模式实现对象支持 for...of 循环，从而只对外暴露出该对象中某个指定的值：

- 实现通过 for...of 循环只对外暴露出 hobby 数组的属性值：

```js
const obj = {
  name: "dnhyxc",
  age: "18",
  hobby: ["xixi", "zczc", "yhyh", "hmhm", "snsn"],
};

Object.defineProperty(obj, Symbol.iterator, {
  value: function () {
    let index = 0;
    return {
      next: () => {
        if (index < obj.list.length) {
          return {
            value: obj.list[index++],
            done: false,
          };
        }
        return {
          value: undefined,
          done: true,
        };
      },
    };
  },
});

const res = response[Symbol.iterator]();

console.log(res.next());
console.log(res.next());
console.log(res.next());
console.log(res.next());
console.log(res.next());
console.log(res.next());

for (let i of obj) {
  console.log(i, "iiii");
}
```

### 责任链模式

使多个对象都有机会处理请求，从而避免了请求的发送者与多个接收者直接的耦合关系，将这些接收者连接成一条链，顺着这条链传递该请求，直接找到能处理该请求的对象。

#### 适用场景

当必须按顺序执行多个处理者时，可以使用该模式。

- 无论你以何种顺序将处理者连接成一条链，所有请求都会严格按照顺序通过链上的处理者。

如果所需处理者及其顺序需要在运行时进行改变，也可以使用职责链模式。

- 调用者可以根据运行时环境，动态地插入和移除处理者，或者改变其顺序。

#### 具体需求

当表单需要进行一系列的校验时：

1. 校验输入框是否为空。

2. 校验是否是数字。

3. 校验是否大于 6 位等等。

4. 遇到这种链式的调用方式时，就可以考虑责任链模式了。

#### 实现方式

```js
const chainInp = document.querySelector("#chainInp");
const chainBtn = document.querySelector("#chainBtn");

chainBtn.addEventListener(
  "click",
  () => {
    checks.check();
  },
  false
);

function checkEmpty() {
  if (chainInp.value.length === 0) {
    console.log("内容不能为空");
    return;
  }
  return "next";
}

function checkNumber() {
  if (Number.isNaN(+chainInp.value)) {
    console.log("请输入数字");
    return;
  }
  return "next";
}

function checkLength() {
  if (chainInp.value.length < 6) {
    console.log("不能小于 6 位");
    return;
  }
  return "next";
}

class Chain {
  constructor(fn) {
    this.checkRule = fn;
    this.nextRule = null;
  }

  addRule(nextRule) {
    this.nextRule = new Chain(nextRule);
    return this.nextRule;
  }

  check() {
    this.checkRule() === "next" ? this.nextRule.check() : null;
  }

  end() {
    this.nextRule = {
      check: () => "end",
    };
  }
}

const checks = new Chain(checkEmpty);

checks.addRule(checkNumber).addRule(checkLength).end();
```

#### 责任链模式的优缺点

优点：

1. 符合单一职责，使每个方法种都只有一个职责。

2. 符合开放封闭原则，在需求增加时可以方便的扩充新的责任。

3. 使用时候不需要知道谁才是真正处理方法，减少大量的 `if` 或 `switch` 语法。

缺点：

1. 团队成员需要对责任链存在共识，否则当看到一个方法莫名其面的返回 next 时回到感到很奇怪。

2. 出错时不好排查问题，因为不知道到底在哪个职责种出了问题，需要从链头开始往后找。
