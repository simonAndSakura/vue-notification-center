# Vue Notification Center

## 什么是Vue Notification Center
一个轻量的vue跨组件通信插件，采用订阅/发布(Subscribe/Publish)模式设计。
发布者发布带主题的通知，如果有订阅者订阅了该主题，则订阅者会收到该通知。

请注意，通知中心是全局的单例。

## 下载

使用npm
```shell
$ npm i vue-notification-center -S
```

## 安装

在`main.js`中:
```js
import Vue from 'vue'
import nc from 'vue-notification-center'

Vue.use(nc)
```

## 如何使用
### 发布者:
```js
// componentA.vue

methods: {
    someMethod () {
        let data = {msg: '需要传递的数据'}
        this.$nc.publish('someTopic', data)
    }
}
```

你刚才发布了一个主题为`someTopic`的通知。如果有订阅者订阅了该主题，那么它将会收到对应的通知。

如果该主题没有订阅者，则会静默失败。

### 订阅者:

```js
// componentB.vue
methods: {
    onReceived (message) {
        let {notifyFrom, notifyTo, data} = message
        console.log(notifyFrom, notifyTo, data)
    }
},
created () {
    this.$nc.subscribe('someTopic', this.onReceived)
}
```
你刚才为`componentB`组件订阅了主题为`someTopic`的通知。如果有人发布了该主题的通知，那么`componentB`组件会调用你传入的回调函数。
### 如何取消订阅
在订阅者组件实例销毁之前，该组件会自动取消订阅所有已订阅的主题，无需手动取消。之后的版本会加上手动取消订阅的方法


## API
api已经混入到所有vue实例上，你可以通过`this.$XXXX`的方式使用

|名称|参数|说明|
|---|---|---|
|$nc|Function()|返回当前全局通知中心已订阅的主题|
|$nc.subscribe|Function(topic:String, callback:Function)|topic: 要订阅的主题名称.callback:回调函数|
|$nc.publish|Function(topic:String, data:Object):()|topic: 要发布的主题名称.data:通知数据|
