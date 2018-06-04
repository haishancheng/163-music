// 事件中心, 发布订阅模式
window.eventHub = {
  events: {
    // event1: [fn1, fn2, ...]
    // event2: [fnA, fnB, ...]
    // ...
  },
  emit(eventName, data){//发布(触发事件，需要发送数据者需要调用发布)，找到那个桶，把里面的函数全都call一遍，call的时候带个data
    for(let key in this.events){
      if(key === eventName){
        this.events[key].map((fn) => {
          fn.call(undefined, data)
        })
      }
    }
  },
  on(eventName, fn){//订阅(接收事件，接收数据者需要调用订阅),把你的函数放到一个桶里面
    if(this.events[eventName] === undefined){
      this.events[eventName] = []
    }
    this.events[eventName].push(fn)
  },

}