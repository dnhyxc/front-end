### static 关键字

static 是用来修饰变量和函数的：

- 修饰局部变量：称为静态局部变量。

- 修饰全局变量：称为静态全局变量。

- 修饰函数：称为静态函数。

#### 修饰局部变量

在一般情况下，局部作用域的变量生命周期是进入作用域时创建，出作用域时销毁。因此局部作用域中的变量就在每次执行时创建，执行完毕之后销毁。
而通过 static 修饰过后，局部变量出了作用域，该局部变量也不会被销毁。

static 修饰局部变量的本质就是 static 改变了变量的存储位置。原本局部变量时存放在栈区中的，但被 static 修饰过后，就会把变量存放到「静态区」。也就相当于延长了变量的生命周期，将该变量的生命周期变成了与程序的生命周期一样，只有当程序运行结束后，该变量才会被销毁。

```c
#include "stdio.h"

void test() {
  // 局部作用域的变量生命周期是进入作用域时创建，出作用域时销毁，即每次进入时，a 都会重新创建并赋值为1。
  int a = 1;
  a++;
  printf("%d ", a); // 2 2 2 2 2 2 2 2 2 2
}

void test_static () {
  // static 声明的局部变量不会被重新创建，会保存上一次执行完毕的值。
  static int a = 1;
  a++;
  printf("%d ", a); // 2 3 4 5 6 7 8 9 10 11
}

int main() {
  int i = 0;
  while (i < 10) {
    test();
    test_static();
    i++;
  }
  return 0;
}
```

#### 声明全局变量

正常情况下，全局变量都是具有外部链接属性的，也就是说，其他的源文件（.c 后缀的文件）如果想使用某个变量时，可以使用「extern」关键字引入即可。但如果使用 static 修饰全局变量的时候，这个全局变量的外部链接属性就会变成内部链接属性，而这就会使得其它源文件不能再通过「extern」关键字使用这个全局变量，只能在声明该变量的源文件中使用了。

在 add.c 文件中创建如下全局变量：

```c
// 在 add.c 文件中创建如下全局变量

int g_val = 120902;

static int g_val2 = 1209021101;
```

在 test.c 文件中使用 add.c 中声明的变量

```c
#include "stdio.h"

extern int g_val; // 引入 add.c 中声明的全局变量
extern int g_val2; // 引入 add.c 中使用static声明的全局变量

int main() {
  printf("%d\n", g_val); // 120902
  printf("%d\n", g_val2); // 运行会报错，因为该全局变量使用static修饰了
  return 0;
}
```

#### 声明函数

函数原本是具有外部链接属性的，但是当一个函数被 static 修饰过后，该函数的外部链接属性就会变成内部链接属性，从而使得其它源文件无法通过「extern」使用该函数。

在 add.c 文件中创建如下函数：

```c
int Add (int x, int y) {
  return x + y;
}
```

在 test.c 文件中调用 add.c 中声明的函数：

```c
#include "stdio.h"

extern int Add(int x, int y); // 引入 add.c 中声明的函数

int main() {
  int sum = Add(12, 9);
  printf("%d", sum); // 21
  return 0;
}
```

### #difine

`#define` 用于定义预处理器宏。预处理器宏是一种文本替换机制，它告诉编译器在编译代码之前将指定的文本替换为特定的值或表达式。

基本的语法格式如下：

```c
#define 宏名 宏体
```

> 说明：**宏名**是你自定义的标识符，**宏体**可以是常量、变量、表达式等。

#### #difine 定义标识符常量

```c
#include <stdio.h>

// 定义标识符常量
#define MAX 999

int main () {
  printf("%d\n", MAX);

  int n = MAX;
  printf("%d\n", n);

  // MAX 是一个常量，因此可以作为数组的长度限制
  int arr[MAX] = { 0, 1, 2 }
  printf("%d\n", arr);

  return 0;
}
```

#### #define 定义宏

```c
#include <stdio.h>

// 定义宏
#define ADD(x, y) ((x) + (y));

int main () {
  int a = 12;
  int b = 9;
  int sum = ADD(a, b)
  
  printf("%d\n", sum);

  return 0;
}
```

### 指针学习前提

指针与计算机内存息息相关，因此想要充分的了解指针，就需要先了解内存是什么。而要想清晰的认识内存，那就需要弄懂 **bit(位)** 和 **byte(字节)**。

[参考资料](https://zhuanlan.zhihu.com/p/101934152)

[参考资料](https://zhuanlan.zhihu.com/p/41187907)

#### bit（位） 和 byte（字节）

bit（位）是计算机系统中最小的**存储单位**，众所周知计算机实质是通过二进制数 0 或 1 来存储数据的，因此可以看成存放 1 个二进制数字的 1 个位置。也就是说，bit 只有两种值，0 或者 1。也就是 2^1 = 2 种不同的状态。

byte（字节）是计算机系统中最小的可寻址**内存单元**。8 个 bit 位被组合成一个字节（byte），也就是说 8 bit 可以存储一个字节的数据。因为 1 bit 有 2^1（2）种状态，所以一个字节可以表示 2^8（2 × 2 × 2 × 2 × 2 × 2 × 2 × 2）= 256 种不同的状态，即从 0 到 255。

![image.png](http://43.143.27.249/image/6e8ed63d48797bc7415522054bea6a9d.png){{{width="100%" height="auto"}}}

一个字节（1 byte）可以存储整数、字符、布尔值等各种类型的数据。例如：

- 数值 255 需要 8 个位来存放，即一个字节。这是因为 8 位可以表示 0 - 255 的数值，即（2^8）种状态，所以需要 8 位来表示 255。

- 数值 100 需要用 7 位来存放，因为 7 位就可以表示 0 - 128 的数值，也就是（2^7）种状态，因此 100 只需要 7 位即可表示出来了。

#### 内存

内存是电脑上特别重要的存储器，计算机中程序的运行都是在内存中进行的。因此为了有效的使用内存，就把内存划分成了一个个小的内存单元，每个内存单元的大小是**1 个字节(1byte)**。

为了能够有效的访问到内存的每个单元，就给内存单元进行了编号，这些编号被称为该内存单元的**地址**。如下图所示：

![image.png](http://43.143.27.249/image/7c7aa3038bd2ca32f2a0e7c685bbc757.png){{{width="100%" height="auto"}}}

对于 32 位的系统，由于有 32 位的地址空间，每个地址可以用 32 个二进制位来表示。而每个二进制位上可以有两种状态（0 或 1），因此可以用 2^32 来表示不同的地址组合。这意味着 32 位操作系统最多可以支持 2^32 个地址，也就是 4,294,967,296 个不同的内存单元（4,294,967,296B）。

说到这，那么问题就来了，4,294,967,296B 是如何算出来是 4GB 的容量呢？对此，我们可以对其进行换算一下：

因为 1KB 等于 1024B，所以 4,294,967,296B 就等于 4,194,304KB，而 1MB 等于 1024 KB，所以 4,194,304KB 就等于 4096MB，由于 1G 等于 1024MB，所以 4096MB 就等于 4G，因此 4,294,967,296B 就相当于 4G 的内存容量。即 `4,294,967,296B = 4,194,304KB = 4096MB = 4G`。

### 指针

在 C 语言中，指针是一种特殊的变量类型，它存储了一个变量的内存地址。指针可以用来访问和修改该内存地址中存储的数据。

使用指针需要先定义指针变量，然后将其初始化为一个实际变量的地址（或者使用动态内存分配函数分配一块内存，然后将指针指向该内存块的地址）。例如：

```c
int x = 12;

int *p; // 定义一个指向整型变量的指针 p

p = &x; // 将指针 p 指向变量 x 的地址

char s = 'n';

char *ps; // 定义一个指向字符型的指针 ps

ps = &s; // 将指针 ps 指向变量 s 的地址
```

上述 `*` 符号表示 `p` 和 `ps` 是一个指针变量，用于存放变量的地址。 `int *p` 表示指向整型数据的指针地址，`char *ps` 表示指向字符型数据的指针地址。

#### 指针变量的大小

对于 32 位的操作系统，地址是由 32 个 bit 位表示的，即 4 个字节。

对于 64 位的操作系统，地址是由 64 个 bit 位表示的，即 8 个字节。

至于为什么能得出上述的结论，容我慢慢道来：

在 32 位系统中，CPU 的寻址空间大小是 32 位，也就是说可以寻址的内存空间大小为 2^32 个字节（即 4GB）。为了能够**唯一地标识**每个内存地址，需要使用一个长度为 **32bit** 的二进制数字来表示，也就是 **4byte**。而对于 64 位的系统，就需要长度为 **64bit** 的二进制数来表示内存地址，即 **8byte**，从而确保内存地址的唯一性。

```c
#include "stdio.h"

int main() {
  printf("%zu\n", sizeof(int*)) // 32 位为 4，64 位为8
  printf("%zu\n", sizeof(char*)) // 32 位为 4，64 位为8
  printf("%zu\n", sizeof(short*)) // 32 位为 4，64 位为8
  printf("%zu\n", sizeof(double*)) // 32 位为 4，64 位为8

  return 0;
}
```

### 结构体

C 语言中的结构体（struct）是一种用户自定义的数据类型，它允许将不同类型的变量组合在一起，形成一个更复杂的数据结构。

结构体的定义使用关键字 `struct`，后跟结构体的名称和一对花括号 `{}`，在花括号内部定义结构体的成员。每个成员由其类型和名称组成，类似于变量的声明。具体写法如下：

```c
#include <stdio.h>

// 定义一个结构体
struct Person {
  char name[20];
  char sex[10];
  int age;
  float height;
};

int main() {
  // 声明一个结构体变量并初始化
  struct Person person1 = { "dnhyxc", "男", 25, 1.75};

  // 访问结构体成员
  printf("Name: %s\n", person1.name); // Name: dnhyxc
  printf("Sex: %s\n", person1.sex); // Sex: 男
  printf("Age: %d\n", person1.age); // Age: 25
  printf("Height: %.2f\n", person1.height); // Height: 1.75
  printf("%s %s %d %.2f\n", person1.name, person1.sex, person1.age, person1.height); // dnhyxc 男 25 1.75
  return 0;
}
```

### 语句

前言：C 语言语句可以分为五类，分别是：**控制语句**、**表达式语句**、**函数调用语句**、**复合语句**、**空语句**。

### 控制语句

控制语句是用于控制程序执行流程，以实现程序的各种结构方式，它们由特定的语句定义符组成，C 语言有九种控制语句，大体可以分为以下三类：

- 条件判断语句，同时也叫分支语句：`if 语句`、`switch 语句`。

- 循环执行语句：`do while 语句`、`while 语句`、`for 语句`。

- 转向语句，也叫跳转语句：`break 语句`、`goto 语句`、`continue 语句`、`return 语句`。

#### 分支语句（选择结构）

if 语句：用于基于条件的真假来执行不同的代码块。基本结构如下：

```c
// 单条件
if (condition) {
  // 如果条件为真，则执行这里的代码
}

// 多条件
if (condition) {
  // 如果条件为真，则执行这里的代码
} else {
  // 如果条件为假，则执行这里的代码
}

// 更多条件
if (condition1) {
  // 如果条件1为真，则执行这里的代码
} else if (condition2) {
  // 如果条件2为真，则执行这里的代码
} else {
  // 如果以上条件都不满足，则执行这里的代码
}

// 使用示例
#include "stdio.h"

int main() {
	int age = 21;

	if (age < 18) {
		printf("未成年\n");
	} else if (age > 18 && age <= 35) {
		printf("正值青年\n");
	} else if (age > 35 && age <= 55) {
		printf("正值中年\n");
	} else {
		printf("开始步入老年生活了\n");
	}

	return 0;
}
```

> 说明：在 C 语言中，0 表示假，非 0 表示真。`else` 是离他最近的一条 `if` 语句相匹配。

#### switch 语句

switch 语句也是一种分支语句，常用于多分支的情况，基本结构如下：

```c
switch (expression) {
  // case 必须是整形常量表达式
  case value1:
    // 如果expression等于value1，则执行这里的代码
    break;
  case value2:
    // 如果expression等于value2，则执行这里的代码
    break;
  default:
    // 如果expression不匹配任何case，则执行这里的代码
    break;
}

// 使用示例
#include "stdio.h"

int main() {
  
  int day = 1;

  switch (day) {
    case 1:
      printf("星期一\n");
      break;
    case 2:
      printf("星期二\n");
      break;
    case 3:
      printf("星期三\n");
      break;
    case 4:
      printf("星期四\n");
      break;
    case 5:
      printf("星期五\n");
      break;
    case 6:
      printf("星期六\n");
      break;
    case 7:
      printf("星期天\n");
      break;
    default:
      printf("没有找到一个匹配的，就会走到这，\n");
      break;
  }

  return 0;
}
```

如果想要给多个 `case` 执行同一个效果时，可以省略 `break`，具体写法如下：

```c
#include "stdio.h"

int main() {

	int day = 6;

	switch (day) {
		case 1:
		case 2:
		case 3:
		case 4:
		case 5:
			printf("又是搬砖的一天，星期%d\n", day);
			break;
		case 6:
		case 7:
			printf("今天终于不用搬砖了，星期%d\n", day);
			break;
		default:
      printf("没有找到一个匹配的，就会走到这，%d\n", day);
			break;
	}

	return 0;
}
```

switch 语句是可以嵌套的，其中嵌套的 switch 中的 `break` 只会跳出自身的 switch，而不会跳出外层的 switch：

```c
int main() {
  int n = 1;
  int m = 2;

  switch (n) {
    case 1:
      m++;
    case 2:
      n++;
    case 3:
      switch (n) {
        case 1: 
          n++;
        case 2: 
          m++;
          n++;
          break; // 跳出嵌套的 switch
      }
    case 4:
      m++;
      break;
    default:
      break;
  }

  printf("m = %d, n = %d\n", m, n); // m = 5, n = 3

  return 0;
}
```

####  while 循环语句

C 语言中的 while 循环是一种常用的循环结构，它会**重复执行**一段代码，直到给定的条件为假为止。其基本语法结构如下：

```c
// condition 条件为真（非零）进入循环，为假（0）则跳出循环
while (condition) {
  // 需要重复执行的代码
}
```

condition：是一个表达式，当其值为真（非零）时，循环会继续执行。一旦 condition 的值为假（0），循环将停止，并继续执行循环后面的代码，具体执行流程如下：

![image.png](http://43.143.27.249/image/5c61356b02b8a0c3fe7c54908bc5605f.png){{{width="100%" height="auto"}}}

**说明**：上图中 `break` 将永久终止循环，即直接跳出整个循环，而 `continue` 则是只跳出本次循环，即本次循环中 continue 之后的代码将不被执行，会直接到 while 循环的判断部分，继续执行本次循环之后满足条件的循环。

while 循环基本使用示例：

```c
#include <stdio.h>

int main() {
  int i = 1;
  // 当 i 大于 5 时，条件不满租，将跳出循环
  while (i <= 5) {
    printf("%d\n", i);
    i++;
  }

  printf("while 外层 i = %d\n", i);
  return 0;
}
```

**注意**：在使用 while 循环时，一定要确保循环体内的代码能够使循环的条件最终变为假，否则可能导致无限循环的情况。

使用 `break` 跳出循环示例：

```c
#include <stdio.h>

int main() {
  int i = 1;
  // 当 i 大于 5 时，条件不满租，将跳出循环
  while (i <= 10) {
    i++;
    // 当 i 等于 5 时，直接跳出整个循环
    if (i == 5) break;
    printf("%d\n", i); // 2 3 4
  }

  return 0;
}
```

使用 `continue` 跳出本次循环示例：

```c
#include <stdio.h>

int main() {
	int i = 1;
	// 当 i 大于 5 时，条件不满租，将跳出循环
	while (i <= 10) {
		i++;
    // i 等于 5 时，跳出本次循环，直接执行下一次循环
		if (i == 5) continue;
    // i++; 如果将 i++ 放在 continue 的后面, 会导致死循环
		printf("%d\n", i); // 2 3 4 6 7 8 9 10 11
	}

	return 0;
}
```

**注意**: 如果将 i++ 放在 continue 的后面，会导致死循环。

#### for 循环语句

C 语言中的 for 循环是一种常用的循环结构，它会重复执行一段代码，可以很方便地控制循环次数。其基本的语法结构如下：

```c
for (initialization; condition; update) {
  // 需要重复执行的代码
  循环体语句;
}
```

参数说明：

- initialization：表示初始化表达式，是循环开始时执行的一条语句，通常用于初始化一个计数器变量。

- condition：表示循环条件表达式，是一个表达式，当其值为真（非零）时，循环会继续执行。

- update：表示更新表达式，在每次循环结束后执行的一条语句，通常用于更新计数器变量的值。循环体内的代码将在每次循环开始时执行，直到 condition 的值为假（0），循环将停止，并继续执行循环后面的代码。

- 循环体语句：循环的核心部分，可以是任意数量的语句。

for 循环基本使用示例：

```c
#include <stdio.h>

int main() {
  int sum = 0;
  for (int i = 1; i <= 10; i++) {
    sum += i;
  }
  printf("1 + 2 + ... + 10 = %d\n", sum);
  return 0;
}
```

上述代码大致执行流程如下：

![image.png](http://43.143.27.249/image/edb73d97f0b822999a3e61d27108f5de.png){{{width="100%" height="auto"}}}

在上图中，for 循环中的 `break` 和 `continue` 与 while 循环中的 break 和 continue 效果基本是一致的，但是对于 continue 稍微存在一点差异，为了能清晰的看出差异，直接上一段代码：

```c
// 使用 break 跳出整个循环
#include <stdio.h>

int main() {
  int i = 0;
  for(i = 1; i <= 10; i++) {
    if(i == 5) {
      break;
    }
    printf("%d\n", i)
  }

  return 0;
}

// 使用 continue 跳出本次循环
#include <stdio.h>

int main() {
  int i = 0;
  for(i = 1; i <= 10; i++) {
    if(i == 5) {
      continue;
    }
    printf("%d\n", i)
  }

  return 0;
}
```

**说明**：上述代码中，break 和 while 循环中的效果是一致的，但是对于 continue，区别就在于 while 循环中的 continue 跳过本次循环时，如果将 `i++` 放在 continue 之后，将会导致死循环，而对于 for 循环，由于 for 循环的执行机制，`i++` 在循环体运行结束之后才会执行，所以即使 continue 跳出了本次循环，也不会导致死循环。

下面是一道 for 循环面试题，问：该 for 循环会循环多少次？

```c
#include <stdio.h>

int main() {
  int i = 0;
  int k = 0;
  for(i = 1, k = 0; k = 0; i++) {
    k++;
    printf("%d\n", i);
  }
  printf("循环结束\n");
  return 0;
}
```

> 答案是 *（如果不太肯定，放编辑器跑一下吧），原因是因为其中控制语句为 `k = 0`，是一个赋值语句，k 等于 0，条件为假，因此条件始终不成立（for 循环条件不等于 0 时，条件为真，等于 0 时，条件为假），因此该循环的循环结果是：循环 0 次。

#### do while 循环语句

do while 循环会重复执行一段代码，直到给定的条件为假为止。和 while 循环相比，**do while 循环至少会执行一次循环体内的代码**，基本语法结构如下：

```c
do {
  // 需要重复执行的代码
} while (condition);
```

condition：是一个表达式，当其值为真（非零）时，循环会继续执行。一旦 condition 的值为假（0），循环将停止，并继续执行循环后面的代码，执行流程如下图所示：

![image.png](http://43.143.27.249/image/16a56d0c2caa36d6775a017f91d432fa.png){{{width="100%" height="auto"}}}

**说明**：do while 循环中，`break` 和 `continue` 的作用与 while 循环中是一致的，与 while 循环中将 `i++` 放在 continue 之后一样，也会造成死循环。因此，为了避免造成死循环，建议把 `i++` 放在 continue 之前。

#### 循环语句总结

`for` 循环适用于已知循环次数的情况，`while` 和 `do-while` 循环适用于未知循环次数的情况。在使用时需要根据具体需求选择合适的循环结构。其中要注意的是，`while` 和 `do-while` 循环中使用 `continue` 时，如果有 `i++`，需要将其写在 continue 前面，防止死循环的发生。

### 函数

C 语言函数是一种可重复使用的代码块，用于实现特定任务或功能。它可以接受参数、执行操作，并返回结果。函数在 C 语言中起到了**模块化编程**和**代码重用**的重要作用。

在 C 语言中，函数分为**库函数**和**自定义函数**，这两类函数在下文中将会着重介绍。

### 库函数

库函数是 C 语言中提供的一些公共函数，只需要在我们的代码文件中导入对应的头文件即可使用对应的库函数，方便我们更方便的开发。

在 C 语言中，常用的标准头文件有一下几类：

- <stdio.h>：提供了一些输入输出函数。

- <stdlib.h>：包含了通用实用工具函数。

- <string.h>：包含了字符串处理函数。

- <math.h>：提供了数学计算函数。

- <ctype.h>：包含了字符分类和转换函数。

- <time.h>：提供了时间和日期操作函数。

- <assert.h>：包含了断言宏定义，用于在调试阶段进行条件检查。

- <stdbool.h>：定义了 bool 类型和 true、false 常量。

#### <stdio.h>

|函数原型|功能|
|-|-|
|[int printf(char *format...)](https://www.runoob.com/cprogramming/c-function-printf.html)|产生格式化输出的函数|
|[int getchar(void)](https://www.runoob.com/cprogramming/c-function-getchar.html)|从键盘上读取一个键，并返回该键的键值|
|[int putchar(int char)](https://www.runoob.com/cprogramming/c-function-putchar.html)|把参数 char 指定的字符（一个无符号字符）写入到标准输出 stdout 中。|
|[FILE *fopen(const char *filename, const char *mode)](https://www.runoob.com/cprogramming/c-function-fopen.html)|使用给定的模式 mode 打开 filename 所指向的文件。|
|[FILE *freopen(const char *filename, const char *mode, FILE *stream)](https://www.runoob.com/cprogramming/c-function-freopen.html)|把一个新的文件名 filename 与给定的打开的流 stream 关联，同时关闭流中的旧文件。|
|[int fflush(FILE *stream)](https://www.runoob.com/cprogramming/c-function-fflush.html)|刷新流 stream 的输出缓冲区。|
|[int fclose(FILE *stream)](https://www.runoob.com/cprogramming/c-function-fclose.html)|关闭流 stream。刷新所有的缓冲区。|
|[void clearerr(FILE *stream)](https://www.runoob.com/cprogramming/c-function-clearerr.html)|清除给定流 stream 的文件结束和错误标识符。|
