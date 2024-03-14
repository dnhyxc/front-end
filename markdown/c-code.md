#### 字母大小写转换

实现方式一

```c
#include <stdio.h>

int main() {
  char ch = 0;
  // 判断scanf是否读到值，如果读到EOF说明没有成功读取到
  while (scanf("%c", &ch) != EOF) { // 等价与scanf("%c", &ch) == 1
    if (ch >= 'a' && ch <= 'z') {
      printf("%c\n", ch - 32);
    } else if (ch >= 'A' && ch <= 'Z') {
      printf("%c\n", ch + 32);
    }
  }

  return 0;
}
```

实现方式二

```c
#include <stdio.h>
#include <ctype.h>

int main() {
  char ch = 0;
  // 判断scanf是否读到值，如果读到EOF说明没有成功读取到
  while (scanf("%c", &ch) != EOF) { // 等价与scanf("%c", &ch) == 1
    if (islower(ch)) {
      printf("%c\n", toupper(ch));
    } else if (isupper(ch)) {
      printf("%c\n", tolower(ch));
    }
  }

  return 0;
}
```

#### 判断是不是字母

实现方式一

```c
#include <stdio.h>

int main() {
  char ch = 0;

  // %c 的前面加空格，表示需要跳过下一个字符之前的所有空白字符
  while (scanf(" %c", &ch) == 1) {
    // 判断输入的字符是不是a-z的大小写字母
    if ((ch >= 'A' && ch <= 'z') || (ch >= 'a' && ch <= 'z')) {
      printf("%c is an alphabet\n", ch);
    } else {
      printf("%c is not an alphabet\n", ch);
    }
  }

  return 0;
}
```

> 如果不想通过 ` %c` 处理空格问题，还可以通过 `getchar()` 处理。

实现方式二

```c
#include <stdio.h>
#include <ctype.h>

int main() {
  char ch = 0;

  while (scanf("%c", &ch) == 1) {
    // 通过 isalpha() 库函数判断输入的字符是不是a-z的大小写字母
    if (isalpha(ch)) {
      printf("%c is an alphabet\n", ch);
    } else {
      printf("%c is not an alphabet\n", ch);
    }
    getchar(); // 处理打印多余空格问题
  }

  return 0;
}
```

#### 求出 0 ～ 100000 之间的所有 “水仙花数” 并输出

“水仙花数” 是指一个 n 位数，其各位数字的 n 次方之和恰好等于该数本身，如：153 = 1 ^ 3 + 5 ^ 3 + 3 ^ 3，那么 153 就是一个 “水仙花数”。

```c
#include <stdio.h>
#include <math.h>

int main() {
  int i = 0;
  for (i = 0; i <= 100000; i++) {
    // 计算 i 是几位数
    int n = 1; // 任何一个数至少是一位数
    int tmp = i;
    int sum = 0;
    // 如果 tmp 除以 10 不为 0，说明还有位数
    while (tmp / 10) {
      n++;
      tmp /= 10;
    }
    // 得到 i 每一位，计算它的 n 次方之和
    tmp = i; // 重新将 tmp 赋值为 i，因为上面的 tmp 已经通过循环改变了
    while (tmp) {
      // tmp % 10 得到 tmp 的每一位，1234 % 10 => 4
      sum += pow(tmp % 10, n);
      // 去除计算过的每一位 1234 / 10 => 123
      tmp /= 10;
    }
    if (sum == i) {
      // 0 1 2 3 4 5 6 7 8 9 153 370 371 407 1634 8208 9474 54748 92727 93084
      printf("%d ", i);
    }
  }

  return 0;
}
```

#### 变种水仙花

变种水仙花数 - Lily Number：把任意的数字，从中间拆分位两个数字，比如 1461 可以拆分为 （1 和 461）、（14 和 61）、（146 和 1），如果所有拆分之后的乘积之和等于自身，则是一个 Lily Number，例如：

655 = 6 _ 55 + 65 _ 5

1461 = 1 _ 461 + 14 _ 61 + 146 \* 1

题为：求出 5 位数中所有的 Lily Number。

```c
#include <stdio.h>
#include <math.h>

int main () {
  int i = 0;

  // 循环产生所有五位数
  for (i = 10000; i <= 99999; i++) {
    int sum = 0;
    int j = 0;

    // 因为是五位数，只需要循环 4 次就能产生 10 100 1000 10000
    for (j = 1; j <= 4; j++) {
      // 通过 pow 产生 10 的 1 ～ 4 的次方
      int k = (int)pow(10, j); // 10 100 1000 10000
      sum += (i % k) * (i / k);
    }

    if (sum == i) {
      printf("%d ", sum); // 14610 16420 23610 34420 65500
    }
  }

  return 0;
}
```

#### 统计输入数字的二进制中 1 的个数

实现方式一：

```c
#include <stdio.h>

int statCount(int n) {
  int count = 0;

  while (n) {
    n = n & (n - 1);
    count++;
  }
  return count;
}

int main() {
  int num = 0;
  scanf("%d", &num);

  int n = statCount(num);

  printf("%d\n", n);

  return 0;
}
```

> 上述代码的实现思路是：程序每执行一次 `n & (n-1)` 就会将最末位上的 1 去除，即有多少个 1 就会循环几次：
>
> ```
> 假如 n = 15;
>
> n => 1111
> n-1 => 1110
>
> n => 1110
> n-1 => 1101
>
> n => 1101
> n-1 => 1100
>
> n => 1100
> n-1 => 1011
>
> n => 1010
> n-1 => 1001
>
> n => 1001
> n-1 => 1000
>
> n => 1000
> n-1 => 0111
>
> ...
>
> n = 0000
> ```

> 通过 `n & (n - 1)` 这个表达式，同时还能判断一个数是否是 2 的 n 次方。

实现方式二：

```c
#include <stdio.h>

int statCount(int n) {
  int i = 0;
  int count = 0;

  for (i = 0; i < 32; i++) {
    // 将数字n的32位二进制序列都向右移动，并按位与 1，如果为真则 count + 1
    if (((n >> i) & 1) == 1) {
      count++;
    }
  }

  return count;
}

int main() {
  int num = 0;
  scanf("%d", &num);

  int n = statCount(num);

  printf("%d\n", n);

  return 0;
}
```

> 上述代码会将 32 位的二进制序列都遍历一遍，效率没有方式一高。

实现方式三：

```c
#include <stdio.h>

int statCount(unsigned int n) {
  int i = 0;
  int count = 0;

  while (n) {
    if (n % 2 == 1) {
      count++;
    }
    n /= 2;
  }

  return count;
}

int main() {
  int num = 0;
  scanf("%d", &num);

  int n = statCount(num);

  printf("%d\n", n);

  return 0;
}
```

> 上述代码需要注意，接受参数时，需要使用无符号接受，否则对于负数会出现问题。

#### 判断两个 int（32）位的整数 m 和 n 的二进制表达式中，有多少个位不同

实现方式一：

```c
#include <stdio.h>

int statCount(int m, int n) {
  int count = 0;
  int i = 0;

  for (i = 0; i < 32; i++) {
    if (((m >> i) & 1) != ((n >> i) & 1)) {
      count++;
    }
  }

  return count;
}

int main() {
  int m = 0;
  int n = 0;

  scanf("%d %d", &m, &n);

  int num = statCount(m, n);

  printf("%d\n", num);

  return 0;
}
```

实现方式二：

```c
#include <stdio.h>

int statCount(int m, int n) {
  int count = 0;

  // ^ 异或操作符，相同为 0，相异为 1
  int ret = m ^ n;

  while (ret) {
    // 每执行一次会把二进制从右往左上的 1 丢弃
    ret = ret & (ret - 1);
    count++;
  }

  return count;
}

int main() {
  int m = 0;
  int n = 0;

  scanf("%d %d", &m, &n);

  int num = statCount(m, n);

  printf("%d\n", num);

  return 0;
}
```

#### 获取一个整数二进制序列中所有的偶数位和奇数位，分别打印出二进制序列

```c
#include <stdio.h>

int main() {
  int i = 0;
  int num = 0;
  scanf("%d", &num);

  // 获取奇数位的数字
  for (i = 30; i >= 0; i -= 2) {
    printf("%d ", (num >> i) & 1);
  }

  printf("\n");

  // 获取偶数位的数字
  for (i = 31; i >= 0; i -= 2) {
    printf("%d ", (num >> i) & 1);
  }

  return 0;
}
```

#### X 形图案

针对每行输入，输出 `*` 组成的图案：

```
输入：5

输出：
     *   *
      * *
       *
      * *
     *   *
```

实现方式如下：

```c
#include <stdio.h>

int main() {
  int n = 0;

  while (scanf("%d", &n) == 1) {
    int i = 0;
    int j = 0;

    for (i = 0; i < n; i++) {
      for (j = 0; j < n; j++) {
        if ((i == j) || (i + j == n - 1)) {
          printf("*");
        } else {
          printf(" ");
        }
      }
      printf("\n");
    }
  }

  return 0;
}
```

#### 打印棱形

打印如下棱形图案：

```
输入：5

输出：
     *
    ***
   *****
    ***
     *
```

```c
#include <stdio.h>

int main() {
  int line = 0;
  scanf("%d", &line);
  // 先打印上半部分
  int i = 0;
  for (i = 0; i < line; i++) {
    // 打印空格
    int j = 0;
    // line - 1 - i => 如果上半部分有 7 行，那么空格的数量分别为：6 5 4 3 2 1 0
    // i = 0 => 第一行就有 6 个空格，i = 1 => 第二行就有 5 个空格，以此类推
    for (j = 0; j < line - 1 - i; j++) {
      printf(" ");
    }
    // 打印 *，假设上半部分有 7 行，那么 * 的数量分别为 1 3 5 7 9 11 13
    for (j = 0; j < 2 * i + 1; j++) {
      printf("*");
    }
    printf("\n");
  }
  // 打印下半部分，因为是棱形，最长的 * 只有一行，不可能最长的一行同时存在两行，即下方的行数为 line - 1
  for (i = 0; i < line - 1; i++) {
    // 打印空格
    int j = 0;
    // 因为下方的空格数量是依次递增的，假设上面有 7 行，下面就有 6 行，空格数分别为：1 2 3 4 5 6
    for (j = 0; j <= i; j++) {
      printf(" ");
    }
    // 打印 *，假设上面有 7 行，下面就有 6 行，* 的数量分别是：11 9 7 5 3 1
    for (j = 0; j < 2 * (line - 1 - i) - 1; j++) {
      printf("*");
    }
    printf("\n");
  }
}
```

#### 获得月份天数

输入年份和月份，计算这一年这个月有多少天。

多行输入，一行有两个数，分别表示年份和月份，用空格分隔。针对每组输入，输出为一行，一个整数，表示这一年这个月有多少天，如：

```
输入：2008 2

输出：29
```

实现方式：

```c
#include <stdio.h>

int isLeepYear(int y) {
  return (((y % 4 == 0) && (y % 100 != 0)) || (y % 400 == 0));
}

int main() {
  int y = 0;
  int m = 0;
  int days[13] = {0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};

  while(scanf("%d %d", &y, &m) == 2) {
    int day = days[m];
    // 判断二月份是不是闰年，如果是则需要加一天
    if (isLeepYear(y) && (m == 2)) {
      day++;
    }
    printf("%d", day);
  }

  return 0;
}
```

#### 实现 strcpy 库函数

```c
#include <stdio.h>
#include <assert.h>

// 实现方式一，const 可以防止拷贝对象与被拷贝对象写反引起不必要的报错
char* my_strcpy(char* str1, const char* str2) {
  // 断言，如果 str2 为 NULL 空指针时，报错
  assert(str1 != NULL);
  assert(str2 != NULL);
  char* ret = str1;
  while(*str1++ = *str2++);
  return ret;
}

// 实现方式二
char* myStrcpy(char* str1, const char* str2) {
  // 断言，如果 str2 为 NULL 空指针时，报错
  assert(str1 != NULL);
  assert(str2 != NULL);
  char* ret = str1;
  while(*str2 != '\0') {
    *str1++ = *str2++;
  }
  // 多执行一次是为了将 \0 也拷贝过去
  *str1 = *str2;
  return ret;
}

int main() {

  char arr[] = "hello dnhyxc";
  char test[20] = "XXXXXXXXXXXXXX";
  void* p = NULL;

  // my_strcpy(test, p);
  printf("%s\n", myStrcpy(test, arr));
  printf("%s\n", my_strcpy(test, arr));

  return 0;
}
```

#### 实现 strlen 库函数

```c
#include <stdio.h>
#include <assert.h>

// 判断字符长度
int my_strlen(const char* str) {
  assert(str != NULL);

  int count = 0;

  while (*str != '\0'){
    count++;
    str++;
  }

  return count;
}

int main() {
  char arr[] = "dnhyxc";

  printf("%d\n", my_strlen(arr)); // 6

  return 0;
}
```

#### 计算求和

求 Sn = a + aa + aaa + aaaa + aaaaa 的前五项之和，其中 a 是一个数字，如：5 + 55 + 555 + 5555 + 55555。

```c
int main() {
  int a = 0;
  int n = 0;
  int i = 0;
  int sum = 0;
  int k = 0;

  scanf("%d %d", &a, &n);

  for (i = 0; i < n; i++) {
    k = k * 10 + a;
    sum += k;
  }

  printf("%d\n", sum); // 输入 5 5 => 61725

  return 0;
}
```

#### 计算汽水数

假设 1 瓶汽水 1 块钱，2 个空瓶可以换一瓶汽水，那么 20 块钱可以喝多少瓶汽水?

写法一：

```c
#include <stdio.h>

int main() {
  int money = 0;
  scanf("%d", &money); // 20
  int total = money;
  int empty = money;

  while(empty >= 2) {
    total += empty / 2;
    empty = empty / 2 + empty % 2;
  }

  printf("%d", total); // 39

  return 0;
}
```

写法二：

```c
#include <stdio.h>

int main() {
  int money = 0;
  scanf("%d", &money); // 20

  if (money > 0) {
    printf("%d\n", 2 * money - 1); // 39
  } else {
    printf("%d\n", 0); // 0
  }

  return 0;
}
```

#### 求最小公倍数

```c
int main() {
  int a = 0;
  int b = 0;
  scanf("%d %d", &a, &b);

  int i = 1;
  while (a * i % b) {
    i++;
  }

  printf("%d\n", i * a);
}
```

#### 逆置字符

将一句话的单词进行倒置，标点不倒置，比如 I like beijing，经过函数后变为：beijing. like I。

```c
#include <stdio.h>
#include <string.h>

void reverse(char* left, char* right) {
  while (left < right) {
    char tmp = *left;
    *left = *right;
    *right = tmp;
    left++;
    right--;
  }
}

int main() {
  char arr[101] = { 0 };
  // 输入
  gets(arr);
  // 逆置
  int len = strlen(arr);
  // 逆序整个字符串，因为末尾是 . 所以需要使用 arr + len - 1
  reverse(arr, arr + len - 1);
  // 逆序单个单词
  char* start = arr;
  while (*start) {
    char* end = start;
    // 判断是否为空格
    while (*end != ' ' && *end != '\0') {
      end++;
    }
    reverse(start, end - 1);
    if (*end != '\0') {
      end++;
    }
    start = end;
  }

  printf("%s\n", arr);
}
```

#### 输入一组数字，写一个方法将这组数字中所有奇数放在所有偶数的前面

输入一个整数数组，实现一个函数，来调整还数组中数字的顺序使得数组中所有的奇数位于数组的前半部分在所有偶数位与数组的后半部分。

```c
#include <stdio.h>

void exChangeOddEven(int arr[], int sz) {
  int left = 0;
  int right = sz - 1;

  // 只有在 left 小于 right 时才进行交换
  while (left < right) {
    // 从左往右找一个偶数，如果是偶数则跳出循环，是奇数则进入循环
    while ((left < right) && (arr[left] % 2 == 1)) {
      left++;
    }
    // 从右往左找一个奇数，如果是奇数则跳出循环，是偶数则进入循环
    while ((left < right) && (arr[right] % 2 == 0)) {
      right--;
    }
    // 交换奇偶数
    if (left < right) {
      int tmp = arr[left];
      arr[left] = arr[right];
      arr[right] = tmp;
      // 直接跳过交换好的一项，减少上述循环次数
      left++;
      right--;
    }
  }
}

int main() {
  int arr[10] = { 0 };
  int i = 0;
  int sz = sizeof(arr) / sizeof(arr[0]);
  // 输入
  for (i = 0; i < sz; i++) {
    // arr 是数组的第一个值的地址，所以 &arr[i] 可以直接写成 arr + i
    scanf("%d ", arr + i);
  }
  // 调换
  exChangeOddEven(arr, sz);
  // 输出
  for (i = 0; i < sz; i++) {
    // arr 是数组的第一个值的地址，所以 &arr[i] 可以直接写成 arr + i
    printf("%d ", arr[i]);
  }
}
```

#### 有序序列合并

输入两个升序排列的序列，将两个序列合并为一个有序序列并输出。

数据范围：1 <= n,m <= 1000，序列中的值满足 0 <= ual <= 30000。

输入描述：输入包括三行，

- 第一行包含两个正整数 n，m，用空格分隔。n 表示第二行第一个升序序列中数字的个数，m 表示第三行第二个升序序列中数字的个数。

- 第二行包含 n 个整数，用可个分隔。

- 第三行包含 m 个整数，用空格分隔。

输出描述：

输出为一行，输出长度为 n + m 的升序序列，即长度为 n 的升序序列和长度为 m 的升序序列中的元素重新进行升序排列合并。

示例 1：

```
输入：5 6
     1 3 7 9 22
     2 8 10 17 33 44
输出：
     1 2 3 7 8 9 10 17 22 33 44
```

实现方式：

```c
#include <stdio.h>

int main() {
  int n = 0;
  int m = 0;
  scanf("%d %d", &n, &m);
  int arr1[n];
  int arr2[m];
  // 输入n个整数
  int i = 0;
  for (i = 0; i < n; i++) {
    scanf("%d", &arr1[i]);
  }
  // 输入m个整数
  for (i = 0; i < m; i++) {
    scanf("%d", &arr2[i]);
  }
  // 合并打印
  int j = 0;
  int k = 0;
  while (j < n && k < m) {
    if (arr1[j] < arr2[k]) {
      printf("%d ", arr1[j]);
      j++;
    } else {
      printf("%d ", arr2[k]);
      k++;
    }
  }
  if (j < n) {
    for (; j < n; j++) {
      printf("%d ", arr1[j]);
    }
  } else {
    for (; k < m; k++) {
      printf("%d ", arr2[k]);
    }
  }

  return 0;
}
```

将合并的数组存储到一个新的数组中，并打印这个新的数组：

```c
#include <stdio.h>

int main() {
  int n = 0;
  int m = 0;
  scanf("%d %d", &n, &m);
  int arr1[n];
  int arr2[m];
  int arr3[m + n];
  // 输入n个整数
  int i = 0;
  for (i = 0; i < n; i++) {
    scanf("%d", &arr1[i]);
  }
  // 输入m个整数
  for (i = 0; i < m; i++) {
    scanf("%d", &arr2[i]);
  }
  // 合并打印
  int j = 0;
  int k = 0;
  int r = 0;
  while (j < n && k < m) {
    if (arr1[j] < arr2[k]) {
      // r++ 为了在本次存储完成之后，将指针指向下一个，方便下一个值得存储
      arr3[r++] = arr1[j];
      j++;
    } else {
      arr3[r++] = arr2[k];
      k++;
    }
  }
  // 判断 m 循环结束了，但是 n 还没循环结束的情况。
  if (j < n) {
    for (; j < n; j++) {
      arr3[r++] = arr1[j];
    }
  } else {
    // 判断 n 循环结束了，但是 m 还没循环结束的情况。
    for (; k < m; k++) {
      arr3[r++] = arr2[k];
    }
  }

  for(i = 0; i < m + n; i++) {
    printf("%d ", arr3[i]);
  }

  return 0;
}
```

#### 冒泡排序

自定义实现只能操作整型的冒泡排序：

```c
// 实现升序排列的方法
void bubble_sort(int arr[], int sz) {
  // 定义一个变量，用于判断是否已经排好序
  int flag = 1;

  // 趟数
  for (int i = 0; i < sz - 1; i++) {
    // 一趟冒泡排序的过程
    for (int j = 0; j < sz - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        int tmp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = tmp;
        flag = 0;
      }
    }
    if (flag == 1) break;
  }
}

int main() {
  int arr[] = {9, 8, 7, 6, 4, 5, 3, 1, 2, 0};

  int sz = sizeof(arr) / sizeof(arr[0]);

  // 实现升序排列
  bubble_sort(arr, sz);

  for (int i = 0; i < sz; i++) {
    printf("%d", arr[i]);
  }

  return 0;
}
```

使用 qsort 库函数实现排序：

- qsort 是基于快速排序实现的排序方法。

```c
#include <stdio.h>
#include <stdlib.h>

// 定义排序回调，当不知道传递的参数是什么类型的指针时，使用 void 进行定义
int cmp_int(const void* e1, const void* e2) {
  // 实现升序排列
  // return (*(int*)e2 - *(int*)e1);
  // 实现降序排列
  return (*(int*)e1 - *(int*)e2);
}

int main() {
  int arr[] = {0, 1, 2, 3, 4, 5, 6, 7, 8, 9};
  int sz = sizeof(arr) / sizeof(arr[0]);

  /*
    qsort 库函数参数说明：
      arr：排序数据的起始位置
      sz：待排序元素的个数
      sizeof(arr[0])：待排序数据元素的大小（单位字节）
      cmp_int：函数指针，即比较函数
  */
  qsort(arr, sz, sizeof(arr[0]), cmp_int);

  for (int i = 0; i < sz; i++) {
    printf("%d", arr[i]);
  }

  return 0;
}
```

使用 qsort 库函数对结构体数据进行排序：

```c
#include <stdlib.h>
#include <string.h>

struct Stu {
  char name[20];
  int age;
};

int cmp_stu_by_name(const void *e1, const void *e2) {
  // strcmp 返回结果为 >0、=0、<0
  return strcmp(((struct Stu *) e1)->name, ((struct Stu *) e2)->name);
}

int cmp_stu_by_age(const void *e1, const void *e2) {
  return ((struct Stu *) e2)->age - ((struct Stu *) e1)->age;
}

void sort_with_name() {
  // qsort 排序结构数据
  struct Stu s[] = {
      {"zczc", 5},
      {"xixi", 8},
      {"yhyh", 31}
  };
  int sz = sizeof(s) / sizeof(s[0]);
  qsort(s, sz, sizeof(s[0]), cmp_stu_by_name);
}

void sort_with_age() {
  // qsort 排序结构数据
  struct Stu s[] = {
      {"zczc", 5},
      {"xixi", 8},
      {"yhyh", 31}
  };
  int sz = sizeof(s) / sizeof(s[0]);
  qsort(s, sz, sizeof(s[0]), cmp_stu_by_age);
}

int main() {
  // sort_with_name(); // => { { "xixi", 8 }, { "yhyh", 31 }, { "zczc", 5 } }

  sort_with_age(); // => { { "yhyh", 31 }, { "xixi", 8 }, { "zczc", 5 } }

  return 0;
}
```

基于冒泡排序实现排序方法：

```c
#include <stdio.h>
#include <string.h>

struct Stu {
  char name[20];
  int age;
};

void Swap(char* e1, char* e2, int width) {
  for (int i = 0; i < width; i++) {
    char tmp = *e1;
    *e1 = *e2;
    *e2 = tmp;
    // 交换完成之后，将索引移到下一个字节
    e1++;
    e2++;
  }
}

int cmp_int(const void* e1, const void* e2) {
  return (*(int*)e2 - *(int*)e1);
}

int cmp_stu_by_name(const void *e1, const void *e2) {
  // strcmp 返回结果为 >0、=0、<0
  return strcmp(((struct Stu *) e1)->name, ((struct Stu *) e2)->name);
}

int cmp_stu_by_age(const void *e1, const void *e2) {
  return ((struct Stu *) e2)->age - ((struct Stu *) e1)->age;
}

void bubble_sort(void* base, int sz, int width, int(*cmp)(const void*e1, const void* e2)) {
  // 定义一个变量，用于判断是否已经排好序
  int flag = 1;

  // 趟数
  for (int i = 0; i < sz - 1; i++) {
    // 一趟冒泡排序的过程
    for (int j = 0; j < sz - 1 - i; j++) {
      if (cmp((char*)base + j * width, (char*)base + (j + 1) * width) > 0) {
        // 交换
        Swap((char*)base + j * width, (char*)base + (j + 1) * width, width);
        flag = 0;
      }
    }
    if (flag == 1) break;
  }
}

void bubble_sort_cmp_stu_by_name() {
  struct Stu s[] = {
      {"zczc", 5},
      {"xixi", 8},
      {"yhyh", 31}
  };
  int sz = sizeof(s) / sizeof(s[0]);
  bubble_sort(s, sz, sizeof(s[0]), cmp_stu_by_name);
}

void bubble_sort_cmp_stu_by_age() {
  struct Stu s[] = {
      {"zczc", 5},
      {"xixi", 8},
      {"yhyh", 31}
  };
  int sz = sizeof(s) / sizeof(s[0]);
  bubble_sort(s, sz, sizeof(s[0]), cmp_stu_by_age);
}

int main() {
  int arr[] = { 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 };
  int sz = sizeof(arr) / sizeof(arr[0]);

  bubble_sort(arr, sz, sizeof(arr[0]), cmp_int);

  for (int i = 0; i < sz; i++) {
    printf("%d ", arr[i]);
  }

  //  bubble_sort_cmp_stu_by_name();
  bubble_sort_cmp_stu_by_age();
  return 0;
}
```
