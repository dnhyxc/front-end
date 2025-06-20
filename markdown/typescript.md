### ts 基础

#### any / unknown / never

**any** 表示任何类型。

**unknown** 表示未知类型，适用于不确定具体类型的数据。它会强制开发者在使用之前进行类型检查，从而提升类型的安全性。

**never** 表示任何值都不是，即任何类型分配给一个变量都不成立（没有任何类型可以分配）。

#### enum 枚举

数字枚举：

```ts
enum Direction {
	Up,
	Down,
	Left,
	Right,
}

console.log(Direction.Up); // 0
console.log(Direction.Down); // 1
```

字符串枚举：

```ts
enum Direction {
	Up = "up",
	Down = "down",
	Left = "left",
	Right = "right",
}

console.log(Direction.Up); // up
console.log(Direction.Down); // down
```

接口枚举：

```ts
enum Color {
	Red = "red",
	Green = "green",
}

interface ColorInfo {
	red: Color.red;
}

const obj: A = {
	red: Color.red,
};
```

const 枚举：使用 const 声明的枚举会被变异成常量，普通声明的枚举变异完成后是一个对象。

```ts
// 只能使用 const 声明，不能使用 var 或者 let 声明
const enum Types {
	Yes = "yes",
	No = "no",
}
```

#### 元组类型

```ts
const arr: [number, boolean] = [1, true];

arr.push(1); // 报错，因为只定义了 [number, boolean] 两个类型，越界就会报错

// 定义不可修改的元组，即不可重新定义，也不可通过 push 等操作元素
const arr1: readonly [number, boolean] = [1, true];

// 给元组中的元素设置别名
const arr2: [x: number, y?: boolean] = [1];

// 通过 typeof 获取元组中的某个类型
type first = typeof (arr[0]) // 获取到 arr 中的第一个元素类型 number
type length = typeof (arr['length']) // 获取 arr 数组的长度类型
```

#### 属性修饰符

**public**: 公开的，可以在**类内部、子类、类外部**中访问。

**protected**: 受保护的，可以在**类内部、子类**中访问。

**private**: 私有的，只能在**类内部**中访问。

**readonly**: 只读属性，属性无法修改。

#### 抽象类

抽象类是一种**无法被实例化**的类，专门用于定义类的**结构和行为**，类中可以写抽象方法，也可以写具体实现。抽象类主要用来为其派生类提供**基础结构**，要求其派生类必须实现其中的抽象方法。

即：抽象类**不能实例化**，其意义是**可以被继承**，抽象类里可以有**普通方法**，也可以有**抽象方法**。

```ts
// 抽象类
abstract class Package {
	constructor(public weight: number) {}
	// 抽象方法
	abstract calculate(): number;
	getInfo() {
		console.log(`包裹重量为：${this.weight}kg，运费为：${this.calculate()}元`);
	}
}

// 继承抽象类
class StandardPackage extends Package {
	constrouctor(weight: number, public unitPrice: number) {
		super(weight);
	}
	// 实现抽象类中定义的 calculate 方法
	calculate(): number {
		return this.weight * this.unitPrice;
	}
}

const p1 = new StandardPackage(10, 5);
const info = p1.calculate();
console.log(info);
s1.getInfo();

// 继承抽象类
class ExpressPackage extends Package {
	constrouctor(
		weight: number,
		public unitPrice: number,
		public additional: number
	) {
		super(weight);
	}
	// 实现抽象类中定义的 calculate 方法
	calculate(): number {
		if (this.weight > 10) {
			return 10 * this.unitPrice + (this.weight - 10) * this.additional;
		}
		return this.weight * this.unitPrice;
	}
}

const p2 = new ExpressPackage(12, 9, 2);
const info2 = p2.calculate();
console.log(info2);
e1.getInfo();
```

#### type 高级用法

```ts
type num = 1 extends never ? 1 : 0; // num 为 0
type num = 1 extends string ? 1 : 0; // num 为 1
```

!!! warning 说明
extends 是包含的意思，即 extends 左边的值会作为右边类型的子类型。

TS 类型层级：

第一梯队：any unknow

第二梯队：Object

第三梯队：Number String Boolean

第四梯队：number string boolean

第五梯队：never

有上述梯队说明：1 不能作为 never 的子类型，因此 1 extends never 表达式为 false，即得出 num 为 0。
!!!

#### interface / type / 抽象类

1. interface 使用场景:

- 定义对象的格式：描述数据模型、API 响应格式、配置对象...

- 类的契约：规定一个类需要实现哪些属性和方法。

- 自动合并（重复定义）：一般用于扩展第三方库的类型。

2. type 使用场景：

- 定义对象的格式：描述数据模型、API 响应格式、配置对象...

- 定义类型别名、联合类型、交叉类型等。

3. interface 和 type 的区别：

- 相同点：

  - interface 和 type 都可以用于定义对象结构，两者在许多场景中可以互换。

- 不同点：

  - interface：更专注于定义**对象**和**类**的结构，支持**继承**、**合并**。

  - type: 可以定义**类型别名**、**联合类型**、**交叉类型**，不支持使用 `extends` 继承。

4. interface 和 抽象类的区别：

- 相同点：

  - 都用于定义一个类的格式。

- 不同点：

  - interface：只能描述结构、不能有任何实现代码，一个类剋实现多个接口。

  - 抽象类：既可以包含抽象方法，也可以包含具体方法，一个类只能继承一个抽象类。

#### 泛型

泛型接口：

```ts
interface JobInfo {
	title: string;
	company: string;
}

interface Person<T> {
	name: string;
	age: number;
	extraInfo: T;
}

let p: Person<JobInfo> = {
	name: "snsn",
	age: 29,
	extraInfo: {
		title: "dancer",
		company: "xxx",
	},
};
```

泛型类：

```ts
class Person<T> {
	constructor(public name: string, public age: number, public extraInfo: T) {}
	sing() {
		console.log(
			`my name is ${this.name}，今年${this.age}岁，extraInfo：${this.extraInfo}`
		);
	}
}

type JobInfo = {
	title: string;
	company: string;
};

const p1 = new Person<JobInfo>("snsn", 29, { title: "dancer", company: "xxx" });
```

泛型约束：

```ts
type Len = {
	length: number;
};

function add<T extends number, U extends Len>(a: T, b: U) {
	return a + b;
}

add(2, "snsn");

// 使用 keyof 进行约束
const obj = {
	name: "snsn",
	sex: "男",
};

function ob<T extends object, K extends keyof T>(obj: T, key: K) {
	return obj[key];
}
```

#### typeof

typeof: 用于获取一个 js 值（变量、对象等）的类型。

```ts
const user = { name: "张三", age: 30 };
type UserType = typeof user; // 得到类型：{ name: string; age: number }
```

#### keyof

keyof: 从一个类型（type/interface）中提取所有的键（key），生成键名的联合类型。

```ts
interface User {
	id: number;
	name: string;
}
type UserKeys = keyof User; // 得到联合类型："id" | "name"
```

keyof 高级用法：

```ts
interface Data {
	name: string;
	age: number;
	sex: string;
}

// 使用 in + keyof 将 Data 中的类型变成可选
type Options<T extends object> = {
	[Key in keyof T]?: T[Key];
};

type B = Options<Data>; // {name?: string, age?: numner, sex?: string}
```

#### 组合使用 typeof keyof

使用 typeof + keyof 可以直接从一个 js 对象/枚举（运行时存在的值）中提取键的联合类型。即：使用 typeof 先获取到值的类型，再使用 keyof 提取该类型的键。

```ts
// 示例 1：对象键名联合
const config = { theme: "dark", size: 12 };
type ConfigKeys = keyof typeof config; // "theme" | "size"

// 枚举键名联合
enum Direction {
	Up = "UP",
	Down = "DOWN",
}
type DirectionKeys = keyof typeof Direction; // "Up" | "Down"
```

#### infer

`infer` 是一个高级类型操作关键字，专门用于条件类型中。它的核心作用是在类型推断过程中声明一个带推断的类型变量，可以从复杂类型中提取出子类型。

!!! danger 注意点
1、infer 只能用于 `extends` 条件语句的子句中，即 `extends` 的右边。

```ts
type Invalid = infer T; // 错误：无法单独使用
```

2、类型必须可推断：如果无法匹配到类型，会走到 `false` 分支。

```ts
type Test = string extends infer U ? U : never; // string
type Test2 = string extends number ? true : false; // false
```

3、联合类型行为：当输入是联合类型时，会分发处理。

```ts
type Example<T> = T extends { a: infer U } ? U : never;
type Result = Example<{ a: string } | { a: number }>; // string | number
```

!!!

##### 为什么需要 `infer`?

1. 类型解构能力：允许从复合类型中提取组成部分。

2. 类型安全：避免手动声明类型带来的维护成本。

3. 动态类型编程：实现更灵活的类型操作。

4. 减少重复：自动推导类型而非硬编码。

```ts
// 没有 infer 的繁琐写法
type ManualReturnType<T> =
  T extends () => number ? number :
  T extends () => string ? string :
  ... // 需要穷举所有类型
```

##### infer 基本使用示例

1. 提取函数返回类型：

```ts
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// 使用
function foo() {
	return { name: "snsn", age: 18 };
}
type FooReturn = ReturnType<typeof foo>; // {name: string, age: number}
```

2. 提取数组元素类型：

```ts
type ElementType<T> = T extends (infer U)[] ? U : never;

// 使用
type NumArray = number[];
type Num = ElementType<NumArray>; // number
```

3. 提取 Promise 的解析类型：

```ts
interface User {
	name: string;
	age: number;
}

type PromiseType = Promise<User>;
type GetPromiseType<T> = T extends Promise<infer U> ? U : T;
type T = GetPromiseType<PromiseType>; // User
```

##### 进阶用法

1. 递归提取嵌套类型：

```ts
// 示例1
type DeepUnpackArray<T> = T extends (infer U)[] ? DeepUnpackArray<U> : T;

// 使用
type Nested = number[][][];
type DeepNum = DeepUnpackArray<Nested>; // number

// 示例2
interface User {
	name: string;
	age: number;
}

type PromiseType1 = Promise<Promise<Promise<User>>>;

type GetPromiseType<T> = T extends Promise<infer U> ? U : T;
type T = GetPromiseType<PromiseType1>; // Promise<Promise<User>>

// 使用递归解析出 User
type GetPromiseType1<T> = T extends Promise<infer U> ? GetPromiseType1<U> : T;
type T1 = GetPromiseType1<PromiseType1>; // User

// 使用 Awaited 解析出嵌套的 Promise 返回
type T2 = Awaited<PromiseType1>; // User
```

2. 提取函数参数类型：

```ts
type FirstParam<T> = T extends (arg: infer P, ...args: any[]) => any
	? P
	: never;

// 使用
type Fn = (id: number) => void;
type Param = FirstParam<Fn>; // number
```

3. 提取对象属性类型：

```ts
type PropType<T, K extends keyof T> = T extends { [key in K]: infer V }
	? V
	: never;

// 使用
type User = { id: number; name: string };
type NameType = PropType<User, "name">; // string
```

4. 反转数组：

```ts
type Arr = [1, 2, 3, 4, 5];

type ReverArr<T extends any[]> = T extends [infer First, ...infer rest]
	? [...ReverArr<rest>, First]
	: T;

type Arrb = ReverArr<Arr>; // [5, 4, 3, 2, 1]
```

##### 内置工具类型中的 infer

**ReturnType<T>**：用于获取函数返回类型，实现原理为 `T extends (...args: any) => infer R ? R : any`。

```ts
type T = (...args: any[]) => any; // T 必须是函数类型
type Result = ReturnType<T>; // Result 是函数 T 的返回值类型

// 直接用于函数类型
type AddFunc = (a: number, b: number) => number;
type AddResult = ReturnType<AddFunc>; // number

// 配合 typeof 获取实际函数的返回类型
function getUser(id: string) {
	return { name: "Alice", age: 30 };
}
// 使用 typeof 获取函数类型，再用 ReturnType 提取返回类型
type User = ReturnType<typeof getUser>; // { name: string; age: number }

// 用于泛型或复杂类型
async function fetchData<T>(url: string): Promise<T> {
	const res = await fetch(url);
	return res.json();
}

// 提取 Promise 的泛型类型 T
type DataType = ReturnType<typeof fetchData>; // Promise<any>（未指定 T 时默认 any）

// 通过传入具体类型解决
type FetchString = typeof fetchData<string>; // (url: string) => Promise<string>
type StringResult = ReturnType<FetchString>; // Promise<string>
type UnwrappedResult = Awaited<StringResult>; // string （用 Awaited 解开 Promise）
```

**Parameters<T>**：用于获取函数参数类型元组，实现原理 `T extends (...args: infer P) => any ? P : never`。

```ts
type Parameters<T extends (...args: any) => any> = T extends (
	...args: infer P
) => any
	? P
	: never;

// 提取普通函数的参数类型
declare function getUser(id: number, name: string): void;
// 提取参数类型为元组 [number, string]
type FuncParams = Parameters<typeof getUser>; // [id: number, name: string]

// 结合泛型使用
type ApiFunction = (url: string, payload: object) => Promise<Response>;
type ApiParams = Parameters<ApiFunction>; // [url: string, payload: object]

// 实现高阶函数类型安全
function wrapLog<F extends (...args: any[]) => any>(func: F) {
	return (...args: Parameters<F>): ReturnType<F> => {
		console.log("Arguments:", args);
		return func(...args);
	};
}
// 使用示例
const add = (a: number, b: number): number => a + b;
const loggedAdd = wrapLog(add);
loggedAdd(2, 3); // 输出: Arguments: [2, 3] → 返回 5

// 处理构造函数（需配合 ConstructorParameters）
class Person {
	constructor(public name: string, public age: number) {}
}

// 错误：Parameters 不支持构造函数
// type CtorParams = Parameters<typeof Person>; // ❌

// 正确：使用 ConstructorParameters
type CtorParams = ConstructorParameters<typeof Person>; // [name: string, age: number] ✅
```

**InstanceType<T>**：用于获取构造函数实例类型，实现原理 `T extends new (...args: any) => infer R ? R : any`。

```ts
class MyClass {
	value: number;
	constructor() {
		this.value = 42;
	}
}

// 获取 MyClass 构造函数的类型
type MyClassConstructor = typeof MyClass;

// 使用 InstanceType 获取实例类型
type MyClassInstance = InstanceType<MyClassConstructor>; // = MyClass
```

**Awaited<T> (TS 4.5+)**：用于递归解包 Promise，实现原理 `使用嵌套 infer 解包 Promise 链`。

```ts
type T3 = Awaited<Promise<string>>; // string

type T4 = Awaited<Promise<Promise<number>>>; // number

type T5 = Awaited<boolean | Promise<string>>; // boolean | string

// 处理 Promise.all() 的元组
type T8 = Awaited<Promise<[Promise<string>, Promise<number>]>>;

// 解包异步函数返回值
async function fetchData() {
	return { id: 1, name: "Alice" } as const;
}
type Result = Awaited<ReturnType<typeof fetchData>>;
// { readonly id: 1; readonly name: "Alice" }

// 处理嵌套 Promise
type DeepPromise = Promise<Promise<Promise<{ status: number }>>>;
type Unwrapped = Awaited<DeepPromise>; // { status: number }

// 处理 Promise 数组
const promises = [Promise.resolve("text"), Promise.resolve(100)] as const;
type ArrResult = Awaited<typeof promises>; // readonly ["text", number]
```

### ts 协变和逆变

#### 协变（Covariance）

协变允许你在类型参数中使用子类型。换句话说，如果类型 A 是类型 B 的子类型，那么 `Container<A>` 可以被视为 `Container<B>` 的子类型。这通常用于输出类型。如：

```ts
class Animal {}
class Dog extends Animal {}

function getAnimal(): Array<Animal> {
	return [new Dog()]; // 合法，因为 Dog 是 Animal 的子类型
}
```

#### 逆变（Contravariance）

逆变则允许你在类型参数中使用父类型。也就是说，如果类型 A 是类型 B 的子类型，那么 `Container<B>` 可以被视为 `Container<A>` 的子类型。这通常用于输入类型。如：

```ts
class Animal {}
class Dog extends Animal {}

function handleAnimal(animal: Animal) {
	// 处理动物
}

const handleDog: (dog: Dog) => void = handleAnimal; // 合法，因为 handleAnimal 可以处理 Dog
```

#### 总结

协变：允许使用子类型，通常用于输出类型。

逆变：允许使用父类型，通常用于输入类型。

### TS 复杂类型

#### <-P>

在 TypeScript 中，`<-P` 表示这是一个类型参数（type parameter），它是一个泛型（generic）声明的一部分。具体来说，`<P>` 是一个类型变量，表示该类型可以接受任何类型作为参数。

如 `ComponentType<-P>` 表示一个组件类型，它接受一个类型参数 P。这个类型参数通常用于定义组件的 props 类型。通过使用泛型，组件可以灵活地接受不同类型的 props，而不需要为每种可能的 props 类型单独定义一个组件。

例如，如果你有一个组件 MyComponent，你可以这样定义它的 props 类型：

```typescript
type MyComponentProps = {
	name: string;
	age: number;
};

const MyComponent: ComponentType<MyComponentProps> = (props) => {
	// 组件实现
};
```

在上述这个例子中，MyComponent 的 props 类型被指定为 MyComponentProps，而 `ComponentType<-P>` 允许你在使用组件时传递不同的 props 类型。

#### <+C>

在 TypeScript 中，`<+C>` 表示这是一个协变（covariant）类型参数。协变意味着如果类型 A 是类型 B 的子类型，那么 `Element<C>` 中的 C 也可以是类型 B 的子类型。

具体来说，`+` 符号表示该类型参数是协变的，这通常用于表示输出类型。例如，在 React 中，`Element<+C>` 表示一个元素类型，其中 C 是该元素的类型。由于 C 是协变的，你可以将 `Element<Dog>` 赋值给 `Element<Animal>`，前提是 Dog 是 Animal 的子类型。如：

```typescript
class Animal {}
class Dog extends Animal {}

function getAnimal(): Element<Animal> {
	return <Dog />; // 这里是合法的，因为 Dog 是 Animal 的子类型
}
```

在上述这个例子中，`Element<+C>` 允许你使用更具体的类型（如 Dog）来替代更通用的类型（如 Animal），这使得代码更加灵活和可重用。

### TS 常用的工具类型

#### Omit<Type, Keys>

从 Type 中删除一个或者多个属性，并返回一个新的类型。

```ts
type Options = {
	url: string;
	method?: "GET" | "POST";
	data?: any;
};

// 只从 Options 选取 method 类型，Omit<Options, 'url' | 'data'>
const defaultOptions: Pick<Options, "method"> = { method: "GET" };
// 排除 Options 中的 'url' | 'data' 类型，只保留 method 类型
const defaultOptions2: Omit<Options, "url" | "data"> = { method: "GET" };

function mergeOptions(options: Options) {
	return { ...defaultOptions, ...options };
}

function mergeOptions2(options: Options) {
	return { ...defaultOptions2, ...options };
}
```

#### Pick<Type, Keys>

从 Type 中选择一个或者多个属性，并返回一个新的类型。

```ts
type Options = {
	url: string;
	method?: "GET" | "POST";
	data?: any;
};

// 排除 Options 中的 'url' | 'data' 类型，只保留 method 类型，等价于 Pick<Options, 'method'>
const defaultOptions: Omit<Options, "url" | "data"> = { method: "GET" };
// 只从 Options 选取 method 类型，Omit<Options, 'url' | 'data'>
const defaultOptions2: Pick<Options, "method"> = { method: "GET" };

function mergeOptions(options: Options) {
	return { ...defaultOptions, ...options };
}

function mergeOptions2(options: Options) {
	return { ...defaultOptions2, ...options };
}
```

#### Parameters<Type>

获取函数类型 Type 的参数类型，以元组类型返回。

```ts
function get(url: string): Promise<{ success: boolean }> {
	return fetch(url).then((res) => res.json());
}

type GetFun = typeof get; // (url: string) => Promise<{success:boolean}>
type Params = Parameters<GetFun>; // [url: string]
```

#### ReturnType<Type>

获取函数类型 Type 的返回值类型。

```ts
function get(url: string): Promise<{ success: boolean }> {
	return fetch(url).then((res) => res.json());
}

type GetFun = typeof get; // (url: string) => Promise<{success:boolean}>
type Return = ReturnType<GetFun>; // Promise<{success:boolean}>
```

#### Awaited<Type>

获取 Promise 中的结果类型。

```ts
function get(url: string): Promise<{ success: boolean }> {
	return fetch(url).then((res) => res.json());
}

type GetFun = typeof get; // (url: string) => Promise<{success:boolean}>
type Return = ReturnType<GetFun>; // Promise<{success:boolean}>
type Data = Awaited<Return>; // {success:boolean}
```

#### Partial<Type>

将 Type 中的所有属性设置为**可选属性**，返回一个新的类型。

```ts
interface Todo {
	id: number;
	title: string;
	description: string;
}

// Partial 使 filedsToUpdate 参数中的 title 和 description 变为可选类型
function updateTodo(todo: Todo, filedsToUpdate: Partial<Omit<Todo, "id">>) {
	return { ...todo, ...filedsToUpdate };
}

updateTodo({ id: 1, title: "snsn", description: "hmhm" }, { title: "dnhyxc" });
```

#### Required<Type>

将 Type 中的所有属性设置为必选属性，返回一个新的类型。

```ts
type Options = {
	url: string;
	method?: "GET" | "POST";
	data?: any;
};

// 使 method 必选
const defaultOptions: Required<Pick<Options, "method">> = {
	method: "GET",
};
```

#### Readonly<Type>

将 Type 中的所有属性设置为**只读属性**，返回一个新的类型。

```ts
// 变成只读属性，不能通过 options.xxx = 'xxx' 更改其中的属性
type Options = Readonly<{
	url: string;
	method?: "GET" | "POST";
	data?: any;
}>;

const defaultOptions: Readonly<Pick<Options, "method">> = {
	method: "GET",
};

function mergeOptions(options: Options) {
	options.method = "POST"; // 此处更改属性值会报错，因为 Options 是只读属性
	return { ...defaultOptions, ...options };
}
```

#### Record<Keys, Type>

新建一个有 Keys 指定的属性和 Type 指定的值组成的对象类型。

```ts
/**
 * 实现类似 I18n 的数据类型
 * {
 *   zh: {
 *     // ...
 *   },
 *   en: {
 *     // ...
 *   },
 * }
 */

// 语言
type Language = "zh" | "en" | "jp";
// 各语言下需要翻译的内容
type Trans = { you: string; and: string; me: string };
// 其中，Language 中的值会作为最终生成类型的 key 值，Trans 会作为 value 值
type I18n = Record<Language, Trans>; // {zh: Trans; en: Trans; jp: Trans}

// 示例2
type UserID = string;
type UserState = Record<UserID, { name: string; lastActive: Date }>;
/**
 * UserState 最终得到的类型为：
 * {
 *   [x: string]: {
 *      name: string;
 *      lastActive: Date;
 *   };
 * }
 */
```

#### Exclude<UnionType, ExcludedMembers>

从 UnionType 中排除 ExcludedMembers 中的所有类型，并返回一个新的类型。

```ts
type Topics = "js" | "css" | "html" | "ts" | "go" | "rust";
type FeTopics = Exclude<Topics, "go" | "rust">; // "js" | "css" | "html" | "ts"
```

#### Extract<UnionType, ExtractedMembers>

从 UnionType 中提取 ExtractedMembers 中的所有类型，并返回一个新的类型。

```ts
type Topics = "js" | "css" | "html" | "ts" | "go" | "rust";
type BeTopics = Extract<Topics, "go" | "rust">; // "go" | "rust"
```

#### NonNullable<Type>

从 Type 中排除 null 和 undefined 类型，并返回一个新的类型。

```ts
type T0 = string | number | undefined;
type T1 = NonNullable<T0>; // string | number
type T2 = string | number | undefined | null;
type T3 = NonNullable<T2>; // string | number
```
