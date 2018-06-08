{
  let view = {
    el: '.newSong',
    template: `
      新建歌曲
    `,
    render(data){
      $(this.el).html(this.template)
    },
    active(){
      $(this.el).addClass('active')
    },
    deActive(){
      $(this.el).removeClass('active')
    }
  }

  let model = {}

  let controller = {
    init(view, model){
      this.view = view
      this.model = model
      this.view.render(this.model.data)
      this.view.active()
      this.bindEvents()
      this.bindEventHub()
    },
    bindEvents(){
      $(this.view.el).on('click', () => {
        this.view.active()
        window.eventHub.emit('new')
      })
    },
    bindEventHub(){
      window.eventHub.on('new',() => {
        this.view.active()
      })
      window.eventHub.on('select', (data) => {
        this.view.deActive()
      })
      window.eventHub.on('create', () => {
        this.view.active()
      })
      window.eventHub.on('delete', () => {
        this.view.active()
      })
    }
  }

  controller.init(view, model)
}