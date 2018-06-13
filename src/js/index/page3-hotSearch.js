{
  let view = {
    el: '.hot-search',
    init(){
      this.$el = $(this.el)
    },
    show(){
      this.$el.addClass('show')
    },
    hide(){
      this.$el.removeClass('show')
    }
  }

  let model = {
    data:{
      songs: []
    },
    query(songName){
      var query = new AV.Query('Song');
      query.equalTo('name', songName);
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
      this.view.$el.find('.hot-search-simple').on('click', 'li', (e)=>{
        let songName = $(e.currentTarget).text()
        this.model.query(songName).then(() => {
          let string = JSON.stringify(this.model.data)
          let object = JSON.parse(string)
          window.eventHub.emit('choose', object)
        })
        
      })
    },
    bindEventHub(){
      window.eventHub.on('choose', ()=>{
        this.view.$el.hide()
      })
    }
  }

  controller.init(view, model)
}