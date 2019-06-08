---
title: javascript高阶函数map、reduce、sort、filter
date: 2019-06-08 17:48:18
tags: javascript
---
>高阶函数英文叫Higher-order function。什么是高阶函数？

JavaScript的函数其实都指向某个变量。既然变量可以指向函数，函数的参数能接收变量，那么一个函数就可以接收另一个函数作为参数，这种函数就称之为高阶函数。

一个最简单的高阶函数：
```js
function add(x, y, f) {
    return f(x) + f(y);
}
```
## map
这个区别于`Map`，`map`是`Array`的一个方法。
举例说明，比如我们有一个函数`f(x)=x2`，要把这个函数作用在一个数组`[1, 2, 3, 4, 5, 6, 7, 8, 9]`上，就可以用`map`实现如下：
alt='map用法图例'
具体的代码实现如下：
```js
'use strict';
function pow(x) {
    return x * x;
}
var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
var results = arr.map(pow); // [1, 4, 9, 16, 25, 36, 49, 64, 81]
    console.log(results);
```
##reduce
`Array`的`reduce()`把一个函数作用在这个`Array`的`[x1, x2, x3…]`上，这个函数必须接收两个参数，`reduce()`把结果继续和序列的下一个元素做累积计算，其效果就是：
```js
[1, 2, 3, 4].reduce(f) = f( f( f(1, 2) , 3), 4)
```
比方说对一个Array求和，就可以用reduce实现：
```js
var arr = [1, 3, 5, 7, 9];
    arr.reduce(function (x, y) {
        return x + y;
    }); // 25
```
#### 总结的例子
用户输入的不规范的英文名字，变为首字母大写，其他小写的规范名字。输入：`['adam', 'LISA', 'barT']`，输出：`['Adam', 'Lisa', 'Bart']`，可以这样写。
```js
function normalize(arr){
    function up(x){
        var a = x.toLowerCase();
            a[0] = a[0].toUpperCase();
        return a.join('');
    };
    return arr.map(up)
};
var arr1 = ['adam', 'LISA', 'barT'];
    normalize(arr1)
```
## filter
`filter`也是一个常用的操作，它用于把`Array`的某些元素过滤掉，然后返回剩下的元素。也可以这么理解，`filter`的回调函数把`Array`的每个元素都处理一遍，处理结果返回false则过滤结果去除该元素，`true`则留下来。看个例子：
```js
var arr = [1, 2, 4, 5, 6, 9, 10, 15];
var r = arr.filter(function (x) {
    return x % 2 !== 0;
});
r; // [1, 5, 9, 15]
```
用`filter()`这个高阶函数，关键在于正确实现一个“筛选”函数。

其实这个筛选函数有多个参数，`filter(function (element, index, self)`，像这样：
```js
var arr = ['A', 'B', 'C'];
var r = arr.filter(function (element, index, self) {
    console.log(element); // 依次打印'A', 'B', 'C'
    console.log(index); // 依次打印0, 1, 2
    console.log(self); // 依次打印['A', 'B', 'C'](这个出现了三次)
    return true;
});
```
演示一个使用filter去重
```js
'use strict';
var r,
    arr = ['apple', 'strawberry', 'banana', 'pear', 'apple', 'orange', 'orange', 'strawberry'];
    r = arr.filter(function (element, index, self) {
        return self.indexOf(element) === index;
        //拿到元素，判断他在数组里第一次出现的位置，是不是和当前位置一样，一样的话返回true，不一样说明重复了，返回false。
    });
```
## sort排序算法
排序也是在程序中经常用到的算法。无论使用冒泡排序还是快速排序，排序的核心是比较两个元素的大小。如果是数字，我们可以直接比较，但如果是字符串或者两个对象呢？直接比较数学上的大小是没有意义的，因此，比较的过程必须通过函数抽象出来。通常规定，对于两个元素x和y，如果认为`x < y`，则返回`-1`，如果认为`x == y`，则返回`0`，如果认为`x > y`，则返回`1`，这样，排序算法就不用关心具体的比较过程，而是根据比较结果直接排序。

**值得注意的**
```js
// 看上去正常的结果:
['Google', 'Apple', 'Microsoft'].sort(); // ['Apple', 'Google', 'Microsoft'];

// apple排在了最后:
['Google', 'apple', 'Microsoft'].sort(); // ['Google', 'Microsoft", 'apple']

// 无法理解的结果:
[10, 20, 1, 2].sort(); // [1, 10, 2, 20]
```
**原因**
第二个排序把apple排在了最后，是因为字符串根据ASCII码进行排序，而小写字母a的ASCII码在大写字母之后。

第三个排序结果是什么鬼？简单的数字排序都能错？

这是因为`Array`的`sort()`方法默认把所有元素先转换为`String`再排序，结果`’10’`排在了`’2’`的前面，因为字符`’1’`比字符`’2’`的`ASCII`码小。

看个大小排序的例子：
```js
'use strict';
var arr = [10, 20, 1, 2];
    arr.sort(function (x, y) {
        if (x < y) {
            return -1;
        }
        if (x > y) {
            return 1;
        }
        return 0;
    });
    console.log(arr); // [1, 2, 10, 20]
```
解读一下：传入`x，y`，如果`x<y`，返回`-1`，`x`与前面排，如果`x>y`，返回`1`，`x`后面排，如果`x=y`，无所谓谁拍谁前面。

还有一个，`sort()`方法会直接对`Array`进行修改，它返回的结果仍是当前`Array`，一个栗子：
```js
var a1 = ['B', 'A', 'C'];
var a2 = a1.sort();
    a1; // ['A', 'B', 'C']
    a2; // ['A', 'B', 'C']
    a1 === a2; // true, a1和a2是同一对象
```