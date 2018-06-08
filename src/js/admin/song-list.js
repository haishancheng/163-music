{
  let view = {
    el: ".songList",
    template: `
        <li>
          <svg class="icon icon-music" aria-hidden="true">
              <use xlink:href="#icon-music"></use>
          </svg>
          <div class="songInfo">
            <p title="{{name}}" class="song">{{name}}</p>
            <p title="{{singer}}" class="singer">
              <svg class="icon icon-music" aria-hidden="true">
                  <use xlink:href="#icon-geshou"></use>
              </svg>
              {{singer}}
            </p>
          </div>
        </li>
    `,
    render(data){
      // $(this.el).html(this.template)
      $(this.el).empty()
      let {songs, selectSongId} = data
      songs.map((song) => {
        let $li = $(
          this.template.replace(/{{name}}/g, song.name)
          .replace(/{{singer}}/g, song.singer)
        ).attr('data-song-id', song.id)
        if(song.id === selectSongId){
          $li.addClass('active')
        }
        $(this.el).append($li)
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
      window.eventHub.on('delete', (data) => {
        this.model.data.songs = this.model.data.songs.filter((song) => {
          return song.id !== data.id
        })
        this.model.data.selectSongId = undefined
        this.view.render(this.model.data)
      })
    }
  }

  controller.init(view, model)

}