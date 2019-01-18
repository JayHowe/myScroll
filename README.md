# myScroll
- 用法
    - 引入
    ```js
        <script type="text/javascript" src="./dist/myScroll.js"></script>
    ```

    - 初始化
    ```js
        //.wrap为滚动对象的父级
        let scroll=new MyScroll('.wrap',{});
    ```
    - html写法
    ```html
        <div class="wrap">
            <div class="content"></div>
        </div>
    ```
- 方法
```js
    //开始滚动之前
    scroll.on('beforeScrollStart',function(){});

    //开始滚动
    scroll.on('scrollStart',function(){});

    //滚动中
    scroll.on('scroll',function(){
        //滚动到的x
        console.log(scroll.x);
        //滚动到的y
        console.log(scroll.y);
    });

    //滚动结束
    scroll.on('scrollEnd',function(){});
```