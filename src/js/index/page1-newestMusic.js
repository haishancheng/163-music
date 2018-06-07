{
  let view = {
    el: 'section.newestMusic',
    template: `
      <h2 class="sectionTitle">最新音乐</h2>
      <ol class="songList">
      </ol>
    `,
    
    init(){
      this.$el = $(this.el)
    },
    render(data){
      this.$el.html(this.template)
      let {songs} = data
      songs.map((song) => {
        let $li = $(`
          <li>
            <h3>${song.name}</h3>
            <p>${song.singer}</p>
            <a class="playButton" href="#">
              <svg class="icon icon-play" aria-hidden="true">
                  <use xlink:href="#icon-play"></use>
              </svg>
            </a>
          </li>
        `)
        this.$el.find('ol.songList').append($li)
      })
    }
  }
  let model = {
    data:{
      songs:[]
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
      this.view.init()
      //将ol.songList先渲染进页面
      this.view.render(this.model.data)
      this.model.fetch().then(() => {
        this.view.render(this.model.data)
      })
    }
  }
  controller.init(view, model)
}