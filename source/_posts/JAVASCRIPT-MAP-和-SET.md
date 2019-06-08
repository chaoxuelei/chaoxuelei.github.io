---
title: JAVASCRIPT MAP 和 SET
date: 2019-06-08 17:45:21
tags: javascript
---
>Map和Set是ES6引入的规范，从命名上看就是一个构造函数，用之前需要先new一下，就像这样：

```js
'use strict';
var m = new Map();
var s = new Set();

console.log('你的浏览器支持Map和Set！');
```
## Map
怎么用呢？
```js
var m = new Map([['Michael', 95], ['Bob', 75], ['Tracy', 85]]);
    m.get('Michael'); // 95
    m.set('Adam', 67); // 添加新的key-value
    m.set('Bob', 59);
    m.has('Adam'); // 是否存在key 'Adam': true
    m.get('Adam'); // 67
    m.delete('Adam'); // 删除key 'Adam'
    m.get('Adam'); // undefined
```
一个key只能对应一个value，所以，多次对一个key放入value，后面的值会把前面的值冲掉，就像这样：
```js
var m = new Map();
m.set('Adam', 67);
m.set('Adam', 88);
m.get('Adam'); // 88
```
## Set
Set和Map类似，也是一组key的集合，但不存储value。由于key不能重复，所以，在Set中，没有重复的key。
```js
var s1 = new Set(); // 空Set
var s2 = new Set([1, 2, 3]); // 含1, 2, 3

//重复元素被过滤
```
```js
var s = new Set([1, 2, 3, 3, '3']);
    s; // Set {1, 2, 3, "3"}
```
Set的方法
```js
var s = new Set([1, 2, 3]);
    s.add(4);
    s; // Set {1, 2, 3, 4}
    s.add(4);
    s; // 仍然是 Set {1, 2, 3, 4}
var s1 = new Set([1, 2, 3]);
    s1; // Set {1, 2, 3}
    s1.delete(3);
    s1; // Set {1, 2}
```