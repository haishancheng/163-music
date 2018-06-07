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
      this.loadSongSheetModule()
      this.loadNewestMusicModule()
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
    loadSongSheetModule(){
      let script1 = document.createElement('script')
      script1.src = './js/index/page1-songSheet.js'
      script1.onload = function(){
        console.log('songSheet模块加载完毕')
      }
      document.body.appendChild(script1)
    },
    loadNewestMusicModule(){
      let script2 = document.createElement('script')
      script2.src = './js/index/page1-newestMusic.js'
      script2.onload = function(){
        console.log('newestMusic模块加载完毕')
      }
      document.body.appendChild(script2)
    }
  }

  controller.init(view, model)
}