{
  let view = {
    el: '#page3',
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
      this.loadSubModule('./js/index/page3-searchArea.js')
      this.loadSubModule('./js/index/page3-hotSearch.js')
      this.loadSubModule('./js/index/page3-bestMatch.js')
    },
    bindEventHub(){
      window.eventHub.on('selectTab', (tabName)=>{
        if(tabName === 'page3'){
          this.view.show()
        }else{
          this.view.hide()
        }
      })
    },
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