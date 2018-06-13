{
  let view = {
    el: '.search-area',
    init(){
      this.$el = $(this.el)
    },
    render(data){
      this.$el.find('input').val(data||'')
    },
    showDeleteIcon(){
      this.$el.find('.icon-delete').addClass('show')
    },
    hideDeleteIcon(){
      this.$el.find('.icon-delete').removeClass('show')
    }
  }

  let model = {}

  let controller = {
    init(view, model){
      this.view = view
      this.model = model
      this.view.init()
      this.bindEvents()
      this.bindEventHub()
    },
    bindEvents(){
      this.view.$el.find('.icon-delete').on('click', (e) => {
        this.view.render()
        this.view.hideDeleteIcon()
      })
      this.view.$el.find('input').on('input propertychange',() => {
        this.view.showDeleteIcon()
      })
    },
    bindEventHub(){
      window.eventHub.on('choose',(data) => {
        this.view.render(data.songs[0].name)
        this.view.showDeleteIcon()
      })
    }
  }

  controller.init(view, model)
}