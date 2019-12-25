import _ from 'lodash'
export default {
  install (Vue, options) {
    const noop = () => {};

    const _generateTopic = (event) => ({
      name: event,
      subscribers: []
    });
    Vue._notificationCenter = {
      _topics: [], // 通知话题
      addTopic: function (topic) {
        let newTopic = _generateTopic(topic);
        this._topics.push(newTopic);
        return newTopic
      }
    };
    Vue.prototype.__defineGetter__('$nc', function () {
      const notificationCenter = function () {
        let topics = Vue._notificationCenter._topics;
        return {topics};
      };
      notificationCenter.on = (topic, cb = noop) => {
        const vm = this;
        let oldSubscribe = vm._subscribe || [];
        if (oldSubscribe instanceof Array) {
          if (!oldSubscribe.includes(topic)) {
            oldSubscribe.push(topic);
          }
        }
        vm._subscribe = oldSubscribe;
        const _topic = _.find(Vue._notificationCenter._topics, e => e.name === topic);
        if (!_topic) {
          let newTopic = Vue._notificationCenter.addTopic(topic);
          newTopic.subscribers.push({vm, cb});
        } else {
          _topic.subscribers.push({vm, cb});
        }
      };
      notificationCenter.emit = (topicName, data = {}) => {
        const vm = this;
        const topics = Vue._notificationCenter._topics;
        const topic = _.find(topics, e => e.name === topicName);
        if (!topic) {
          if (process.env.NODE_ENV !== 'production') { console.warn(`seems topic named '${topicName}' has no subscriber!`) }
          return
        }
        // 发布通知
        _.each(topic.subscribers, e => {
          e.cb({
            notifyFrom: vm,
            notifyTo: e.vm,
            data
          })
        })
      };
      return notificationCenter
    });
    Vue.mixin({
      beforeDestroy () {
        const vm = this;
        const _subscribe = this._subscribe;
        if (_subscribe instanceof Array && _subscribe.length > 0) {
          let curTopics = Vue._notificationCenter._topics;
          _.each(_subscribe, topic => {
            let findTopic = _.find(curTopics, e => e.name === topic);
            if (!findTopic) throw new Error('error in notifyCenter when release subscribe');
            if (_.every(findTopic.subscribers, e => e.vm._uid === vm._uid)) {
              _.pull(curTopics, findTopic);
            } else {
              _.remove(findTopic.subscribers, subs => subs.vm._uid === vm._uid);
            }
          })
        }
      }
    })
  }
}
