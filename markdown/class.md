#### Class（类）

desc：本文将详细的介绍 ES6 Class 类，读完后你将更为全面的了解 Class。

为什么会出现类 —— 因为 JavaScript 语言的传统方法是通过构造函数，定义并生成新对象。写法跟传统的面向对象语言（比如 C++和 Java）差异很大，很容易让新学习这门语言的程序员感到困惑，如下：

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.toString = function () {
  return "(" + this.name + ", " + this.age + ")";
};

const sn = new Person("snsn", 27);
```

将上述构造函数写法改写成类的写法如下：

```js
class Person {
  constructor(name, age) {
    // 当前this指向当前类的实例
    this.name = name;
    this.age = age;
  }

  toString() {
    return "(" + this.name + ", " + this.age + ")";
  }
}

const sn = new Person("snsn", 27);
```

上述代码中，类中存在一个 constructor() 构造器方法，是类的构造函数（默认方法），用于传递参数，返回实例对象，**通过 new 命令生成对象的实例时自动调用该方法**。如果没有显示定义，类内部会自动创建一个 constructor()。其中的 this 关键字指向实例对象。

**需要注意的是，类不可调用，必须使用 new 实例化对象**。

class 可以看作只是一个语法糖，它的绝大部分功能，ES5 都可以做到，新的 class 写法只是让对象原型的写法更加清晰、更像面向对象编程的语法而已。ES6 的类，完全可以看作构造函数的另一种写法，如下代码就能表明：**类的数据类型就是函数，类本身就指向构造函数**。

```js
class Point {
  // ...
}

typeof Point; // "function"
Point === Point.prototype.constructor; // true
```

类的所有方法都定义在类的 prototype 属性上面：

```js
class Point {
  constructor() {
    // ...
  }

  toString() {
    // ...
  }

  toValue() {
    // ...
  }
}

// 等同于
Point.prototype = {
  toString() {},
  toValue() {},
};
```

在类的实例上面调用方法，其实就是调用当前类的原型上的方法。

```js
class B {}
let b = new B();

b.constructor === B.prototype.constructor; // true
```

上面代码中，b 是 B 类的实例，它的 constructor 方法就是 B 类原型的 constructor 方法。

由于类的方法都定义在 prototype 对象上面，所以类的新方法可以添加在 prototype 对象上面。Object.assign 方法可以很方便地一次向类添加多个方法。

```js
class Point {
  constructor() {
    // ...
  }
}

Object.assign(Point.prototype, {
  toString() {},
  toValue() {},
});
```

prototype 对象的 constructor 属性，直接指向“类”的本身，这与 ES5 的行为是一致的。

```js
Point.prototype.constructor === Point; // true
```

类的内部所有定义的方法，都是不可枚举的（non-enumerable）。

```js
class Point {
  constructor(x, y) {
    // ...
  }

  toString() {
    // ...
  }
}

Object.keys(Point.prototype);
// []
Object.getOwnPropertyNames(Point.prototype);
// ["constructor","toString"]
```

Object.keys()方法会返回一个由一个给定对象的自身可枚举(enumerable=true)属性组成的数组，数组中属性名的排列顺序和正常循环遍历该对象时返回的顺序一致 。

Object.getOwnPropertyNames()方法返回一个由指定对象的所有自身属性的属性名（包括不可枚举属性但不包括 Symbol 值作为名称的属性）组成的数组。

在 ES5 中，通过构造函数的写法，将 toString 定义在构造函数的原型上，那么 toString 就可以被枚举：

```js
const Point = function (x, y) {
  // ...
};

Point.prototype.toString = function () {
  // ...
};

Object.keys(Point.prototype);
// ["toString"]
Object.getOwnPropertyNames(Point.prototype);
// ["constructor","toString"]
```

类的属性名，可以采用表达式。

```js
let methodName = "getArea";
class Square {
  constructor(length) {
    // ...
  }

  [methodName]() {
    // ...
  }
}
```

class 不存在变量提升，而这种规定的原因与下文要提到的继承有关，必须保证子类在父类之后定义。

```js
new Foo(); // ReferenceError
class Foo {}
```

类和模块的内部，默认就是严格模式，所以不需要使用 use strict 指定运行模式。只要你的代码写在类或模块之中，就只有严格模式可用。

#### constructor()

constructor 方法是类的默认方法，通过 new 命令生成对象实例时，自动调用该方法。一个类必须有 constructor 方法，如果没有显式定义，一个空的 constructor 方法会被默认添加。

constructor 方法默认返回实例对象（即 this），但是可以手动让它返回另外一个对象。

```js
class Foo {
  constructor() {
    return Object.create(null);
  }
}

console.log(new Foo() instanceof Foo); // false

class Foo1 {
  constructor() {}
}

console.log(new Foo1() instanceof Foo1); // false
```

#### 类的实例对象

生成类的实例对象的写法，与 ES5 完全一样，也是使用 new 命令。如果忘记加上 new，像函数那样调用 Class，将会报错。

```js
// 报错
const point = Point(2, 3);

// 正确
const point = new Point(2, 3);
```

与 ES5 一样，实例的属性除非显式定义在其本身（即定义在 this 对象上），否则都是定义在原型上（即定义在 class 上）。

```js
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  toString() {
    return "(" + this.name + ", " + this.age + ")";
  }
}

const sn = new Person("snsn", 27);

console.log(sn.toString()); // (snsn, 27)
console.log(sn.hasOwnProperty("name")); // true
console.log(sn.hasOwnProperty("age")); // true
console.log(sn.hasOwnProperty("toString")); // false
console.log(sn.__proto__.hasOwnProperty("toString")); // true
```

上面代码中，name 和 age 都是实例对象 Person 自身的属性（因为定义在 this 变量上），所以 hasOwnProperty 方法返回 true，而 toString 是原型对象的属性（因为定义在 Person 类上），所以 hasOwnProperty 方法返回 false。这些都与 ES5 的行为保持一致。

与 ES5 一样，类的所有实例共享一个原型对象。

```js
const p1 = new Point(2, 3);
const p2 = new Point(3, 2);

console.log(p1.__proto__ === p2.__proto__); //true
```

上面代码中，p1 和 p2 都是 Point 的实例，它们的原型都是 Point.prototype，所以 **\_\_proto\_\_** 属性是相等的。这也意味着，可以通过实例的 **\_\_proto\_\_** 属性为 Class 添加方法。

```js
const p1 = new Person("snsn", 26);
const p2 = new Person("hmhm", 27);

p1.__proto__.printName = function () {
  return "dnhyxc";
};

p1.printName(); // "dnhyxc"
p2.printName(); // "dnhyxc"

const p3 = new Person("yhyh", 18);
p3.printName(); // "dnhyxc"
```

上面代码在 p1 的原型上添加了一个 printName 方法，由于 p1 的原型就是 p2 的原型，因此 p2 也可以调用这个方法。而且，此后新建的实例 p3 也可以调用这个方法。这意味着，使用实例的\_\_proto\_\_属性改写原型，必须相当谨慎，不推荐使用，因为这会改变 Class 的原始定义，影响到所有实例。

#### Class 表达式

与函数一样，类也可以使用表达式的形式定义。

```js
const MyClass = class Me {
  getClassName() {
    return Me.name;
  }
};
```

上面代码使用表达式定义了一个类。需要注意的是，这个类的名字是 MyClass 而不是 Me，Me 只在 Class 的内部代码可用，指代当前类。

```js
let inst = new MyClass();
inst.getClassName(); // Me
Me.name; // ReferenceError: Me is not defined
```

上面代码表示，Me 只在 Class 内部有定义。

如果类的内部没用到的话，可以省略 Me，也就是可以写成下面的形式。

```js
const MyClass = class {
  /* ... */
};
```

采用 Class 表达式，可以写出立即执行的 Class。

```js
let person = new (class {
  constructor(name) {
    this.name = name;
  }

  sayName() {
    console.log(this.name);
  }
})("snsn");

console.log(person.sayName()); // "snsn"
```

#### 类的私有方法

私有方法是常见需求，但 ES6 不提供，只能通过变通方法模拟实现。我们可以通过 Symbol 实现私有方法。

```js
const sym = Symbol("sym");
const bol = Symbol("bol");

export default class myClass {
  // 公有方法
  foo(bol) {
    this[sym](bol);
  }

  // 私有方法
  [sym](bol) {
    return (this[bol] = sym);
  }
}
```

上面代码中，sym 和 bol 都是 Symbol 值，导致第三方无法获取到它们，因此达到了私有方法和私有属性的效果。

#### class 中 this 的指向

类的方法内部如果含有 this，它默认指向类的实例。但是将该方法结构出来单独使用，将会报错。

```js
class Person {
  sayName(name = "snsn") {
    this.say(`Hello ${name}`);
  }

  say(name) {
    console.log(name);
  }
}

const per = new Person();
const { sayName } = per;
sayName(); // TypeError: Cannot read property 'say' of undefined
```

上面代码中，sayName 方法中的 this，默认指向 Person 类的实例。但是，如果将这个方法提取出来单独使用，this 会指向该方法运行时所在的环境，因为找不到 say 方法而导致报错。

解决 this 指向问题的方式：

- 在构造方法中绑定 this：

```js
class Person {
  constructor() {
    this.sayName = this.say.bind(this);
  }

  // ...
}
```

- 使用箭头函数：

```js
class Person {
  constructor() {
    this.sayName = (name = "snsn") => {
      this.say(`Hello ${name}`);
    };
  }

  // ...
}
```

#### Class 的继承

Class 之间可以通过 extends 关键字实现继承，这比 ES5 的通过修改原型链实现继承，要清晰和方便很多。

基本语法如下：

```js
class Son extends Parent {}
```

基本使用方式如下：

```js
class Son extends Parent {
  constructor(x, y, color) {
    super(x, y); // 调用父类的constructor(x, y)
    this.color = color;
  }

  toString() {
    return this.color + " " + super.toString(); // 调用父类的toString()
  }
}
```

上面代码中，constructor 方法和 toString 方法之中，都出现了 super 关键字，它在这里表示父类的构造函数，用来新建父类的 this 对象。

子类必须在 constructor 方法中调用 super 方法，否则新建实例时会报错。这是因为子类没有自己的 this 对象，而是继承父类的 this 对象，然后对其进行加工。如果不调用 super 方法，子类就得不到 this 对象。

```js
class Person {
  /* ... */
}

class Per extends Person {
  constructor() {}
}

let per = new Per(); // ReferenceError
```

> ES5 的继承，实质是先创造子类的实例对象 this，然后再将父类的方法添加到 this 上面（Parent.apply(this)）。ES6 的继承机制完全不同，实质是先创造父类的实例对象 this（所以必须先调用 super 方法），然后再用子类的构造函数修改 this。

在子类的构造函数中，只有调用 super 之后，才可以使用 this 关键字，否则会报错。这是因为子类实例的构建，是基于对父类实例加工，只有 super 方法才能返回父类实例。

```js
class Animal {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Tiger extends Animal {
  constructor(x, y, color) {
    this.color = color; // ReferenceError
    super(x, y);
    this.color = color; // 正确
  }
}

let tiger = new Tiger(25, 8, "白色");

tiger instanceof Tiger; // true
tiger instanceof Animal; // true
```

上面代码中，实例对象 tiger 同时是 Tiger 和 Animal 两个类的实例，这与 ES5 的行为完全一致。

#### 类的 prototype 属性和 \_\_proto\_\_ 属性

每一个对象都有\_\_proto\_\_属性，指向对应的构造函数的 prototype 属性。Class 作为构造函数的语法糖，同时有 prototype 属性和\_\_proto\_\_属性，因此同时存在两条继承链：

1. 子类的\_\_proto\_\_属性，表示构造函数的继承，总是指向父类。

2. 子类 prototype 属性的\_\_proto\_\_属性，表示方法的继承，总是指向父类的 prototype 属性。

```js
class A {}

class B extends A {}

B.__proto__ === A; // true
B.prototype.__proto__ === A.prototype; // true
```

上面代码中，子类 B 的\_\_proto\_\_属性指向父类 A，子类 B 的 prototype 属性的\_\_proto\_\_属性指向父类 A 的 prototype 属性。出现这样的结果，因为类的继承是按照下面的模式实现的。

```js
class A {}

class B {}

// B的实例继承A的实例
Object.setPrototypeOf(B.prototype, A.prototype);

// B继承A的静态属性
Object.setPrototypeOf(B, A);
```

Object.setPrototypeOf 方法的实现如下：

```js
Object.setPrototypeOf = function (obj, proto) {
  obj.__proto__ = proto;
  return obj;
};
```

由上述代码可以得出：

```js
Object.setPrototypeOf(B.prototype, A.prototype);
// 等同于
B.prototype.__proto__ = A.prototype;

Object.setPrototypeOf(B, A);
// 等同于
B.__proto__ = A;
```

这两条继承链，也可以这样理解：当作为一个对象时，子类（B）的原型（\_\_proto\_\_属性）是父类（A）。当作为一个构造函数时，子类（B）的原型（prototype 属性）是父类的实例。

```js
Object.create(A.prototype);
// 等同于
B.prototype.__proto__ = A.prototype;
```

#### Object.getPrototypeOf()

Object.getPrototypeOf 方法可以用来从子类上获取父类。

```js
Object.getPrototypeOf(ColorPoint) === Point; // true
```

#### super 关键字

super 这个关键字，既可以当作函数使用，也可以当作对象使用。在这两种情况下，它的用法完全不同。

#### super 作为函数调用

super 作为函数调用时，**代表父类的构造函数**。ES6 要求，子类的构造函数必须执行一次 super 函数。

```js
class A {}

class B extends A {
  constructor() {
    super();
  }
}
```

super 虽然代表了父类 A 的构造函数，但是**返回的是子类 B 的实例**，即 super 内部的 this 指的是 B，因此 super() 在这里相当于 A.prototype.constructor.call(this)。

```js
class A {
  constructor() {
    console.log(new.target.name);
  }
}

class B extends A {
  constructor() {
    super();
  }
}
new A(); // A
new B(); // B
```

上面代码中，new.target 指向当前正在执行的函数。可以看到，在 super() 执行时，它指向的是子类 B 的构造函数，而不是父类 A 的构造函数。也就是说，super() 内部的 this 指向的是 B。

super 作为函数时，super() 只能用在子类的构造函数之中，用在其他地方就会报错。

```js
class A {}

class B extends A {
  c() {
    super(); // 报错
  }
}
```

#### super 作为对象时

super 作为对象时，指向父类的原型对象。

```js
class A {
  p() {
    return 2;
  }
}

class B extends A {
  constructor() {
    super();
    console.log(super.p()); // 2
  }
}

let b = new B();
```

上面代码中，子类 B 当中的 super.p()，就是将 super 当作一个对象使用。这时，super 指向 A.prototype，所以 super.p()就相当于 A.prototype.p()。

由于 super 指向父类的原型对象，所以定义在父类实例上的方法或属性，是无法通过 super 访问的。

```js
class A {
  constructor() {
    this.p = 2;
  }
}

class B extends A {
  get c() {
    return super.p;
  }
}

let b = new B();
b.c; // undefined
```

如果属性定义在父类的原型对象上，super 就可以取到。

```js
class A {}
A.prototype.x = 2;

class B extends A {
  constructor() {
    super();
    console.log(super.x); // 2
  }
}

let b = new B();
```

通过 super 调用父类的方法时，super 会绑定子类的 this。

```js
class A {
  constructor() {
    this.x = 1;
  }
  print() {
    console.log(this.x);
  }
}

class B extends A {
  constructor() {
    super();
    this.x = 2;
  }
  m() {
    super.print();
  }
}

let b = new B();
b.m(); // 2
```

上面代码中，super.print() 虽然调用的是 A.prototype.print()，但是 A.prototype.print() 会绑定子类 B 的 this，导致输出的是 2，而不是 1。也就是说，实际上执行的是 super.print.call(this)。

由于绑定子类的 this，所以如果通过 super 对某个属性赋值，这时 super 就是 this，赋值的属性会变成子类实例的属性。

```js
class A {
  constructor() {
    this.x = 1;
  }
}

class B extends A {
  constructor() {
    super();
    this.x = 2;
    super.x = 3;
    console.log(super.x); // undefined
    console.log(this.x); // 3
  }
}

let b = new B();
```

上面代码中，super.x 赋值为 3，这时等同于对 this.x 赋值为 3。而当读取 super.x 的时候，读的是 A.prototype.x，所以返回 undefined。

使用 super 的时候，必须显式指定是作为函数、还是作为对象使用，否则会报错。

```js
class A {}

class B extends A {
  constructor() {
    super();
    console.log(super); // 报错
  }
}
```

#### 实例的 \_\_proto\_\_

子类实例的 \_\_proto\_\_ 属性的 \_\_proto\_\_ 属性，指向父类实例的 \_\_proto\_\_ 属性。也就是说，子类的原型的原型，是父类的原型。

```js
const p1 = new A(2, 3);
const p2 = new B(2, 3, "red");

p2.__proto__ === p1.__proto__; // false
p2.__proto__.__proto__ === p1.__proto__; // true
```

- B 继承了 A，促使了 B 原型的原型是 A 的原型。因此，通过子类实例的 \_\_proto\_\_.\_\_proto\_\_ 属性，可以修改父类实例的行为。

```js
p2.__proto__.__proto__.printName = function () {
  console.log("dnhyxc");
};

p1.printName(); // "dnhyxc"
```

上面代码在 B 的实例 p2 上向 A 类添加方法，结果影响到了 A 的实例 p1。

#### getter 和 setter

与 ES5 一样，在 Class 内部可以使用 get 和 set 关键字，对某个属性设置存值函数和取值函数，拦截该属性的存取行为。

```js
class MyClass {
  constructor(name) {
    this.name = name;
  }

  get prop() {
    return this.name;
  }

  // set 方法必须传入一个参数，否则将会报错
  set prop(value) {
    if (value !== this.name) {
      this.name = value;
      return this.name;
    }
  }
}

let inst = new MyClass("snsn");

inst.prop = "hmhm"; // setter: 123

console.log(inst.prop); // 'hmhm'
```

#### Class 的静态方法

类相当于实例的原型，所有在类中定义的方法，都会被实例继承。如果在一个方法前，加上 static 关键字，就表示该方法不会被实例继承，而是直接通过类来调用，这就称为“静态方法”。

```js
class Foo {
  static classMethod() {
    return "hello";
  }
}

Foo.classMethod(); // 'hello'

const foo = new Foo();
foo.classMethod();
// TypeError: foo.classMethod is not a function
```

父类的静态方法，可以被子类继承。

```js
class Foo {
  static classMethod() {
    return "hello";
  }
}

class Bar extends Foo {}

Bar.classMethod(); // 'hello'
```

静态方法也是可以从 super 对象上调用的。

```js
class Foo {
  static classMethod() {
    return "hello";
  }
}

class Bar extends Foo {
  static classMethod() {
    return super.classMethod() + ", too";
  }
}

Bar.classMethod();
```

#### new.target 属性

new 是从构造函数生成实例的命令。ES6 为 new 命令引入了一个 new.target 属性，在构造函数中返回 new 命令作用于的那个构造函数。如果构造函数不是通过 new 命令调用的，new.target 会返回 undefined，因此这个属性可以用来确定构造函数是怎么调用的。

```js
function Person(name) {
  if (new.target !== undefined) {
    this.name = name;
  } else {
    throw new Error("必须使用new生成实例");
  }
}

// 另一种写法
function Person(name) {
  if (new.target === Person) {
    this.name = name;
  } else {
    throw new Error("必须使用new生成实例");
  }
}

const person = new Person("dnhyxc"); // 正确
const notAPerson = Person.call(person, "dnhyxc"); // 报错
```

在 Class 内部调用 new.target 时，返回当前 Class。

```js
class Rectangle {
  constructor(length, width) {
    console.log(new.target === Rectangle);
    this.length = length;
    this.width = width;
  }
}

const obj = new Rectangle(3, 4); // 输出 true
```

子类继承父类时，new.target 会返回子类。

```js
class Rectangle {
  constructor(length, width) {
    console.log(new.target === Rectangle);
    // ...
  }
}

class Square extends Rectangle {
  constructor(length) {
    super(length, length);
  }
}

const obj = new Square(3); // 输出 false
```

上面代码中，new.target 会返回子类，利用这个特点，可以写出不能独立使用、必须继承后才能使用的类。

```js
class Shape {
  constructor() {
    if (new.target === Shape) {
      throw new Error("本类不能实例化");
    }
  }
}

class Rectangle extends Shape {
  constructor(length, width) {
    super();
    // ...
  }
}

const x = new Shape(); // 报错
const y = new Rectangle(3, 4); // 正确
```

**注意，不能在在函数外部使用 new.target，否则将会报错。**

#### class 实现单例模式

单例模式概述：一个类创建出来的实例都是相等的，换句话说，每次创建出的实例都是同一个。

单例模式的作用：方便在项目中传递数据。

设计思路：首次创建实例对象时，会创建新的对象，除了首次之外，返回的都是第一次创建的实例对象。

具体实现方式如下：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>class单例模式</title>
  </head>
  <body>
    <script>
      class SingleMode {
        constructor(name, age) {
          if (!SingleMode.isSingle) {
            this.name = name;
            this.age = age;
            SingleMode.isSingle = this;
          }
          return SingleMode.isSingle;
        }

        setAddress(address) {
          this.address = address;
        }

        getInfo() {
          console.log(this.name, "toString-name");
          console.log(this.age, "toString-age");
          console.log(this.address, "toString-address");
        }

        static getSingle(name, age) {
          if (!SingleMode.isSingle) {
            return new SingleMode(name, age);
          } else {
            return SingleMode.isSingle;
          }
        }
      }

      const sing1 = new SingleMode("dnhyxc", 20);
      const sing2 = SingleMode.getSingle("hmhm", 18);
      const sing3 = SingleMode.getSingle("snsn", 28);
      const sing4 = new SingleMode("cxcx", 25);

      sing1.setAddress("hz");

      sing1.getInfo();
      sing2.getInfo();

      console.log(sing1 === sing2); // true
      console.log(sing2 === sing3); // true
      console.log(sing3 === sing4); // true
      console.log(sing4, "sing4"); // SingleMode {name: 'dnhyxc', age: 20, address: 'hz'}
    </script>
  </body>
</html>
```
