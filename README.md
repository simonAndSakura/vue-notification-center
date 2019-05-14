# Vue Notification Center
English | [简体中文](./README.zh-CN.md)

## What's Vue Notification Center
A lightweight vue cross-component communication plugin，designed with Subscribe/Publish mode。when Publisher post notifications with specific topic，subscribers will receive the notification if they subscribe this topic。

Note that, Notification Center is a global singleton

## Download

using npm
```shell
$ npm i vue-notification-center -S
```

## Install

in `main.js`:
```js
import Vue from 'vue'
import nc from 'vue-notification-center'

Vue.use(nc)
```

## How to use
### Publisher:
```js
// componentA.vue

methods: {
    someMethod () {
        let data = {msg: 'data to be transmitted'}
        this.$nc.publish('someTopic', data)
    }
}
```
fine, you just published a notification with topic `someTopic`,subscribers will receive the notification if they subscribe topic named 'someTopic'。

the Notification Center will not broadcast the notification if this topic has no subscribers, it will silently fail.

### Subscriber:

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
`componentB` subscribed to the notification with topic `someTopic`.if someone published this notification, and then Notification Center will invoke the given callback

### How to unsubscribe

Before the subscriber component instance is destroyed, it will automatically unsubscribes all subscribed topics without having to manually cancel. 
Subsequent versions will be added with a manual unsubscribe method.


## API
the api has been mixin to all vue instance,you can call them like `this.$XXXX`

|name|parameter|description|
|---|---|---|
|$nc|Function()|return current topics in Notification Center|
|$nc.subscribe|Function(topic:String, callback:Function)|topic: topic name to subscribe.|
|$nc.publish|Function(topic:String, data:Object):()|topic: topic name to publish.data: carrying data|
