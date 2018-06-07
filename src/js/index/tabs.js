{
  let view = {
    el: '.topTabs',
    init(){
      this.$el = $(this.el)
    }
  }

  let model = {}

  let controller = {
    init(view, model){
      this.view = view
      this.model = model
      this.view.init()
      this.bindEvents()
    },
    bindEvents(){
      this.view.$el.on('click', 'li', (e)=>{
        let $li = $(e.currentTarget)
        let pageName = $li.attr('data-tab-name')
        $li.addClass('active').siblings('.active').removeClass('active')
        window.eventHub.emit('selectTab', pageName)
      })
    }
  }

  controller.init(view, model)
}