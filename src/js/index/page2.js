{
  let view = {
    el: '#page2',
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
      this.loadSongListModule()
    },
    bindEventHub(){
      window.eventHub.on('selectTab', (tabName)=>{
        if(tabName === 'page2'){
          this.view.show()
        }else{
          this.view.hide()
        }
      })
    },
    loadSongListModule(){
      let script = document.createElement('script')
      script.src = './js/index/page2-songList.js'
      script.onload = function(){
        console.log('page2-songList模块加载完毕')
      }
      document.body.appendChild(script)
    },
  }

  controller.init(view, model)
}