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
      let {songs, selectSongId} = data
      songs.map((song) => {
        let $li = $('<li></li>').text(song.name).attr('data-song-id', song.id)
        if(song.id === selectSongId){
          $li.addClass('active')
        }
        $(this.el).find('.songList').append($li)
      })
    },
    clearActive(){
      $(this.el).find('.active').removeClass('active')
    }
  }

  let model = {
    data: {
      songs: [],
      selectSongId: undefined
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
      this.bindEvents()
      this.bindEventHub()
      this.getAllSongs()
    },
    getAllSongs(){
      return this.model.fetch().then(() => {
        this.view.render(this.model.data)
      })
    },
    bindEvents(){
      $(this.view.el).on('click', 'li', (e) => {
        let songId = $(e.currentTarget).attr('data-song-id')
        this.model.data.selectSongId = songId
        this.view.render(this.model.data)

        let data
        let songs = this.model.data.songs
        for(let i = 0; i < songs.length; i++){
          if(songs[i].id === songId){
            data = songs[i]
            break
          }
        }
        //深拷贝一下在发布
        let object = JSON.parse(JSON.stringify(data))
        window.eventHub.emit('select', object)
      })
    },
    bindEventHub(){
      window.eventHub.on('create', (songData) => {
        this.model.data.songs.push(songData)
        this.model.data.selectSongId = undefined
        this.view.render(this.model.data)
      })
      window.eventHub.on('new', () => {
        this.view.clearActive()
      })
      window.eventHub.on('update', (data) => {
        let songs = this.model.data.songs
        for(let i = 0; i < songs.length; i++){
          if(songs[i].id === data.id){
            songs[i] = data
          }
        }
        this.view.render(this.model.data)
      })
    }
  }

  controller.init(view, model)

}