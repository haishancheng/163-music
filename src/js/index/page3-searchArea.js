{
  let view = {
    el: '.search-area',
    init(){
      this.$el = $(this.el)
    },
    render(song){
      this.$el.find('input').attr('value', song.name)
    }
  }

  let model = {}

  let controller = {
    init(view, model){
      this.view = view
      this.model = model
      this.view.init()
      this.bindEventHub()
    },
    bindEventHub(){
      window.eventHub.on('choose',(data) => {
        this.view.render(data.songs[0])
      })
    }
  }

  controller.init(view, model)
}