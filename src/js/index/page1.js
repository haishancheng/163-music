{
  let view = {
    el: '#page1',
    init(){
      this.$el = $(this.el)
    },
    show(){
      this.$el.addClass('active')
    },
    hide(){
      this.$el.removeClass('active')
    }

  }

  let model = {}

  let controller = {
    init(view, model){
      this.view = view
      this.model = model
      this.view.init()
      this.bindEventHub()
      this.loadSubModule('./js/index/page1-songSheet.js')
      this.loadSubModule('./js/index/page1-newestMusic.js')
    },
    bindEventHub(){
      window.eventHub.on('selectTab', (tabName)=>{
        if(tabName === 'page1'){
          this.view.show()
        }else{
          this.view.hide()
        }
      })
    },
    //用webpack的话可以直接import，没用的话加载子模块只能创建script标签，插入到html中
    loadSubModule(path){
      let script = document.createElement('script')
      script.src = path
      script.onload = function(){
        console.log(`${path}模块加载完毕`)
      }
      document.body.appendChild(script)
    }
  }

  controller.init(view, model)
}