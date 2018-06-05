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
        let $li = $('<li></li>').text(song.name).attr('data-song-id', song.id)
        $(this.el).find('.songList').append($li)
      })
    },
    activeItem(li){
      $(li).addClass('active').siblings('.active').removeClass('active')
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
        this.view.activeItem(e.currentTarget)
        let songId = $(e.currentTarget).attr('data-song-id')
        let songs = this.model.data.songs
        let data
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
      window.eventHub.on('upload', () => {
        this.view.clearActive()
      })
      window.eventHub.on('create', (songData) => {
        this.model.data.songs.push(songData)
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