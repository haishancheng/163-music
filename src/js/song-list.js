{
  let view = {
    el: "#songList-container",
    template: `
      <ul class="songList">
      </ul>
    `,
    render(data){
      $(this.el).html(this.template)
      $(this.el).find('.songList').empty()
      let {songs} = data
      songs.map((song) => {
        let $li = $('<li></li>').text(song.name)
        $(this.el).find('.songList').append($li)
      })
    },
    clearActive(){
      $(this.el).find('.active').removeClass('active')
    }
  }

  let model = {
    data: {
      songs: []
    },
    fetch(){
      var query = new AV.Query('Song');
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
      //将ul渲染进模板
      this.view.render(this.model.data)
      window.eventHub.on('upload', () => {
        this.view.clearActive()
      })
      window.eventHub.on('create', (songData) => {
        this.model.data.songs.push(songData)
        this.view.render(this.model.data)
      })
      this.model.fetch().then(() => {
        this.view.render(this.model.data)
      })
    }
  }

  controller.init(view, model)

}