---
title: 使用VUE2.0做一个简单的分页，过程很详细
date: 2019-06-08 18:16:15
tags: vue
---
## 优势
>使用vue做一个前端分页有什么优势呢？数据双向绑定有哪些好处呢？先来分解一个一个简单的分页所具有的功能。

1. 当前页，这个可以用watch来观察当前页码是什么。
2. 上一页、下一页，我们对当前页进行++和--其实就可以实现这两个功能。
3. 很多页码需要自动变化，比如我们每次只显示5个页码，当我们当前页是90的时候，那么起始页是86，这个是变化的。那我们需要造一个双向绑定的数组来渲染它。
## 实现
问题的关键就是3，如何生成这个页码呢？看一下逻辑判断：
![](https://i.loli.net/2018/10/09/5bbc12af4bb16.jpg)

看看代码：
```js
computed: { //在计算属性里计算一个值pages，返回一个数据
    pages:() => {
        var left = 1; //默认起始值是1
        var right = this.all; //终止值是全部
        var arr = [];
        if(this.all>= 5){
            if(this.cur > 3 && this.cur < this.all-2){
                    left = this.cur - 2
                    right = this.cur + 2
            }else{
                if(this.cur<=3){
                    left = 1
                    right = 5
                }else{
                    right = this.all
                    left = this.all -4
                }
            }
        }
        while (left <= right){
            arr.push(left)
            left ++
        }
        return arr
    }
}
```
在处理一个下面几个逻辑，点击页码，直接上代码吧：
```js
btnClick:(data){        
    if(data != this.cur){ //判断是不是当前页，不是就计算
        this.cur = data 
    }
},
```
其他代码
```html
<li v-if="cur>1"><a v-on:click="cur--,pageClick()">上一页</a></li>
<li v-if="cur==1"><a class="banclick">上一页</a></li>
<li v-for="index in indexs"  v-bind:class="{ 'active': cur == index}">
    <a v-on:click="btnClick(index)">{{ index }}</a>
</li>
<li v-if="cur!=all"><a v-on:click="cur++,pageClick()">下一页</a></li>
<li v-if="cur == all"><a class="banclick">下一页</a></li>
```
然后两个已知数据
```js
data{
    return {
        all:111,
        cur:1
    }
}
```