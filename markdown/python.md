## Python 基础

```python
## 字符串

name = 'dnhyxc'

### 字符串的查找

# find('findStr', startIndex, endIndex)
print(name.find('h', 1, 6)) # 2

# index('findStr', startIndex, endIndex) 注意：index 找不到会报错
# print(name.index('d', 1)) # 报错，因为没找到

# count('findStr', startIndex, endIndex)
print(name.count('d', 1)) # 0

### 字符串查找方法

# startswith('str', startIndex, endIndex)
print(name.startswith('d')) # True

# endswith('str', startIndex, endIndex)
print(name.endswith('c')) # True
print(name.endswith('d')) # False

# isupper() 检测字符串中所有的字符是否都是大写， 返回布尔值。
print(name.isupper()) # False

### 字符串修改

title = '好好学习，天天向上'

# replace(oldStr, newStr, 替换次数) 替换字符串中的某个元素，替换次数可以省略，默认全部替换。
print(title.replace('天', '日')) # 好好学习，日日向上
print(title.replace('天', '日', 1)) # 好好学习，日天向上

# split(分隔符，分隔次数) 指定分隔符来切分字符串。返回值为一个列表（数组）。注意：如果字符串中不包含你写的分隔内容，则不进行分割，会作为一个整体在列表中返回。
print(title.split('，')) # ['好好学习', '天天向上']
print(title.split('。')) # ['好好学习，天天向上']
print(title.split('好', 1)) # ['', '好学习，天天向上']

# capitalize() 将第一个字符转为大写，其余字符都转为小写
capitalizeStr = 'dnhYxc'
print(capitalizeStr.capitalize()) # Dnhyxc

# lower() 将大写字母转为小写
lowerStr = 'DnhYxc'
print(lowerStr.lower()) # dnhyxc

# upper() 将小写字母转为大写
upperStr = 'dnhyxc'
print(upperStr.upper()) # DNHYXC

## 列表（数组）

### 列表切片
li = [1, 2, 3, 4, 5, 6]
print(li[1]) # 2
print(li[1:3]) # [2, 3]

### 获取列表的长度

# len(需要获取长度的列表) 用户获取列表的长度
lenLi = [1, 2, 3, 4, 5, 6]
print(len(lenLi), 'len') # 6 len

### 列表的添加方法

# append(需要添加的元素) 将元素整体添加到列表的最后一项
arr = ['dnhyxc']
arr.append('xixi')
print(arr) # ['dnhyxc', 'xixi']

# extend(需要添加的元素) 将元素分散添加到列表的最后，注意 extend 的元素必须是可迭代的。
arr1 = ['dnhyxc']
arr.extend('xixi')
print(arr) #
['dnhyxc', 'xixi', 'x', 'i', 'x', 'i']

# insert(指定添加到的位置, 需要添加的元素) 向列表的指定位置插入元素，如果指定的位置有元素，则原先该位置的元素会往后移。
arr2 = ['one', 'two', 'three']
arr2.insert(3, 'four')
arr2.insert(0, 'dnhyxc')
print(arr2) # ['dnhyxc', 'one', 'two', 'three', 'four']

### 列表的修改方法

# 列表的修改可以直接通过下标更改
arr3 = [1, 2, 3]
arr3[0] = 0
print(arr3) # [0, 2, 3]

### 列表的查找

# in 判断指定元素是否存在列表中，返回布尔值。
arr4 = ['a', 'b', 'c']
print('a' in arr4) # True
print('d' in arr4) # False

# not in 判断指定元素是否不存在列表中，返回布尔值。
print('d' not in arr4) # True
print('a' not in arr4) # False

# index()、count() 与字符串的用法一致
print(arr4.index('a')) # 0
print(arr4.count('a')) # 1

### 列表的删除方法

# del 删除某个列表或者删除某个列表中的某个元素
delList = [1, 2, 3, 4, 5]

# del delList
# print(delList) # 报错，因为该列表已经被删除Traceback (most recent call last): File "<string>", line 105, in <module> NameError: name 'delList' is not defined

del delList[3]
print(delList) # [1, 2, 3, 5]

# pop(需要删除元素的下标) 根据指定下标删除列表中的元素，注意：指定的下标不能超出列表的长度。python3 版本如果不传下标，默认删除最后一个元素。返回被删除的元素。
popList = ['a', 'b', 'c']
print(popList.pop(2)) # c
print(popList) # ['a', 'b']

# remove() 根据列表中的某个值进行删除。如果存在多个相同的值，默认删除最先出现的那个元素，即删除第一个。没有返回值。
removeList = ['a', 'b', 'c']
print(removeList.remove('c'))
print(removeList) # ['a', 'b']

### 列表的排序方法

# sort() 将列表按特定的顺序排列，默认从小到大进行排列。
sortList = [1, 8, 5, 2]
sortList.sort()
print(sortList) # [1, 2, 5, 8]

# reverse() 将列表进行倒序。
reverseList = [1, 2, 3, 4, 5]
reverseList.reverse()
print(reverseList) # [5, 4, 3, 2, 1]

### 列表推导式

# 列表推导式相当于 for 循环的简便写法

# 基本写法：
# 格式一：[表达式 for 变量 in 列表]
# 格式二：[表达式 for 变量 in 列表 if 条件]
# 注意：in 后面不仅可以放列表，还可以放 range()、可迭代对象。

arr5 = [1, 2, 3, 4, 5, 6]
# print(i) 就为表达式
[print(i * 2) for i in arr5] # 2 4 6 8 10 12

arr6 = []
[arr6.append(i) for i in range(1, 6)]
print(arr6) # [1, 2, 3, 4, 5]

# 通过 for 循环实现
arr7 = []
for i in range(1, 6):
  arr7.append(i)
print(arr7) # [1, 2, 3, 4, 5]

# 通过方式二获取列表中的所有奇数
arr8 = []
[arr8.append(i) for i in range(1, 11) if i % 2 == 1]
print(arr8) # [1, 3, 5, 7, 9]

## 元组

### 元组的基本格式

# 元素格式：tua = (1, 2, 3)
# 注意：
# - 定义元组时，如果只有一个元素，末尾要加逗号，如果不加逗号，类型就不是元组了。多个元素用 ,（逗号）隔开。
# - 元组只支持查询操作，不支持增删改的操作，其余操作及方法与列表相同

tua = ('a', 'b', 'c', [1, 2, 3])
print(tua) # ('a', 'b', 'c', [1, 2, 3])
print(tua[1]) # b

tua1 = (1,)
print(tua1) # (1,)

tua2 = ('dnhyxc')
print(tua2, type(tua2)) # dnhyxc <class 'str'>

## 字典

### 字典的格式

# dic = {'name': 'dnhyxc', 'age': 18}
# 注意：键值对形式保存，键必须使用引号，同时键具有唯一性，但值可以重复

obj = {
  'name': 'dnhyxc',
  'age': 18
}
print(obj, type(obj)) # {'name': 'dnhyxc', 'age': 18} <class 'dict'>

### 获取字典中的元素值方法

# 获取元素的属性值
print(obj['name']) # dnhyxc
print(obj['age']) # 18

# get(key, 自定义返回的默认值)
print(obj.get('name')) # dnhyxc
print(obj.get('age')) # 18
print(obj.get('age1', '这个字段不存在')) # 这个字段不存在

### 修改字典的元素方法

# 变量名[键名] = 值
obj1 = {
  'a': 1,
  'b': 2
}
obj1['a'] = 'dnhyxc'
print(obj1) # {'a': 'dnhyxc', 'b': 2}

### 向字典中添加元素

# 变量名[键] = 值，注意：键名存在就修改，不存在就新增
obj2 = {
  'a': 1,
  'b': 2
}
obj2['c'] = 3
print(obj2) # {'a': 1, 'b': 2, 'c': 3}

### 字典的删除方法

# del 删除指定的元素，或者删除整个字典。
delObj = {
  'a': 1,
  'b': 2
}
del delObj['b']
print(delObj) # {'a': 1}

# clear() 清空整个字典
clearObj = {
  'a': 1,
  'b': 2
}
clearObj.clear()
print(clearObj) # {}

# pop(key) 删除指定的键值对
popObj = {
  'a': 1,
  'b': 2
}
#popObj.pop('b')
print(popObj) # {'a': 1}

# popitem() 3.7 之前的版本随机删除一个键值对，3.7 之后的版本默认删除最后一对键值对
popObj.popitem()
print(popObj, 'popObj')

### 字典的其他方法

# len(字典) 获取字段的长度
lenObj =  {
  'a': 1,
  'b': 2
}
print(len(lenObj)) # 2

# keys() 返回字段中的所有键
keysObj = {
  'a': 1,
  'b': 2
}
print(keysObj.keys()) #dict_keys(['a', 'b'])

# 通过 for 循环取出键名或者键值
for i in keysObj:
  print(i) # a b
  # 取出键值
  print(keysObj[i]) # 1 2

# values() 返回字典中的所有键值
valuesObj = {
  'a': 1,
  'b': 2
}
print(valuesObj.values()) # dict_values([1, 2])

# items() 返回字典中包含的所有键值对，其中键值对会以元组的形式返回。
itemsObj = {
  'a': 1,
  'b': 2
}
print(itemsObj.items()) # dict_items([('a', 1), ('b', 2)])

# 通过 for 循环从 items 中获取键值对
for i in itemsObj.items():
  print(i, type(i)) # ('a', 1) <class 'tuple'> ('b', 2) <class 'tuple'>

## 集合 set

### 集合的基本格式

# 集合格式：s1 = {1, 2, 3}
# 注意：
# 1. 集合中的元素可以是不同的数据类型。
# 2. 集合是无序的，里面的元素是唯一的。
# 3. 可以用于元组或者列表去重。
# 4. 由于是无序性的，因此不能删除
# 5. 集合的无序性是由于计算机内存中 hash 表导致的。只有集合中的元素全是数字的情况，hash 的顺序才不会变，因为数字的 hash 就是数字本身。

# 定义空集合
s1 = set()
print(s1, type(s1)) # set() <class 'set'>
s2 = {1, 2, 'dnhyxc'}
print(s2) # {1, 2, 'dnhyxc'}

# 利用集合去重
s3 = [1, 2, 2, 3, 3, 4, 4, 5, 5]
print(set(s3)) # {1, 2, 3, 4, 5}

### 集合的常见操作

# add() 向集合中添加元素，添加的是一个整体，因此一次只能添加一个元素。如果已经存在需要添加的元素，那么就不进行添加操作。

s4 = {1, 2, 3}
s4.add(4)
print(s4) # {1, 2, 3, 4}

# update(可叠戴对象) 将传入的可迭代元素一个一个拆分插入到集合中。注意：参数必须是可迭代的元素
s5 = {1, 2, 3}
s5.update([4, 5, 6])
print(s5) # {1, 2, 3, 4, 5, 6}

# remove(需要删除的元素) 删除指定的元素，如果需要删除的元素不存在则会报错
s6 = {1, 2, 3, 'dnhyxc'}
s6.remove(3)
print(s6) # {1, 2, 'dnhyxc'}

# pop() 默认删除经过 hash 排序后的第一个元素
s7 = {'1', '2', '3', 'dnhyxc', '5'}
s7.pop()
print(s7) # {2, 3, 'dnhyxc', 5}

# discard() 选择需要删除的元素，有就会删除，没有就不进行任何操作。也不会报错。
s8 = {'1', '2', '3', 'dnhyxc', '5'}
s8.discard('1')
print(s8) # {'2', '3', '5', 'dnhyxc'}

### 交集和并集

# 交集表示共有的部分，使用 & 符号表示，如果没有共有的部分，则返回空集合 set()
a = {1, 2, 3}
b = {2, 3, 4}
c = {5, 6, 7}
print(a & b) # {2, 3}
print(a & c) # set()

# 并集表示不重复的部分，使用 | 符号表示。
d = {1, 2, 3}
e = {2, 3, 4}
f = {5, 6, 7}
print(d | e) # {1, 2, 3, 4}
print(d | f) # {1, 2, 3, 5, 6, 7}
```
