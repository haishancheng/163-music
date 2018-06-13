{
  let view = {
    el: '#page2',
    init(){
      this.$el = $(this.el)
      this.setTime()
    },
    show(){
      this.$el.addClass('active')
    },
    hide(){
      this.$el.removeClass('active')
    },
    setTime(){
      let time = new Date()
      let month = time.getMonth() + 1
      let day = time.getDate()
      this.$el.find('.hotTop .month').text(month)
      this.$el.find('.hotTop .day').text(day)
    }
  }

  let model = {}

  let controller = {
    init(view, model){
      this.view = view
      this.model = model
      this.view.init()
      this.bindEventHub()
      this.loadSubModule('./js/index/page2-songList.js')
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