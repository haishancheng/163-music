{
  let view = {
    el: 'section.newestMusic',
    template: `
      <li>
        <h3>{{name}}</h3>
        <p>{{singer}}</p>
        <a class="playButton" href="./song.html?id={{id}}">
          <svg class="icon icon-play" aria-hidden="true">
              <use xlink:href="#icon-play"></use>
          </svg>
        </a>
      </li>
    `,
    
    init(){
      this.$el = $(this.el)
    },
    render(data){
      let {songs} = data
      songs.map((song) => {
        let $li = $(
          this.template.replace('{{name}}', song.name)
            .replace('{{singer}}', song.singer)
            .replace('{{id}}', song.id)
        )
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