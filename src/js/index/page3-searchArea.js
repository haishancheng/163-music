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

  let model = {
    data:{
      songs:[],
      searchLock: false
    },
    search(keyword){
      var query = new AV.Query('Song');
      query.contains('name', keyword);
      return query.find().then((songs) => {
        this.data.songs = songs.map((song) => {
          return {id: song.id, ...song.attributes}
        })
      })
    }
  }

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
        window.eventHub.emit('clearSearch')
      })
      this.view.$el.find('input').on('input propertychange',(e) => {
        if($(e.currentTarget).val() === ''){
          this.view.hideDeleteIcon()
          window.eventHub.emit('clearSearch')
        }else{
          this.view.showDeleteIcon()
          this.model.searchLock = true
          this.model.search($(e.currentTarget).val()).then(() => {
            let string = JSON.stringify(this.model.data)
            let object = JSON.parse(string)
            window.eventHub.emit('searchSuccess', object)
            this.model.searchLock = false
          })
        }
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