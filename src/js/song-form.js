{
  let view = {
    el: ".page > main",
    template: `
      <form class="form">
        <div class="row">
          <label>歌名</label>
          <input type="text" name="name" value="__name__">
        </div>
        <div class="row">
          <label>歌手</label>
          <input type="text" name="singer" value="__singer__">
        </div>
        <div class="row">
          <label>外链</label>
          <input type="text" name="url" value="__url__">
        </div>
        <div class="row actions">
          <button type="submit">保存</button>
        </div>
      </form>
    `,
    render(data = {}){//es6语法，如果没有传data或者data为undefined，那么data等于{}
      let placeholders = ['name', 'singer', 'url', 'id']
      let html = this.template
      placeholders.map((placeholder) => {
        html = html.replace(`__${placeholder}__`, data[placeholder] || '')//data[placeholder]为undefined的话就换成''
      })
      $(this.el).html(html)
      if(data.id){
        //渲染的时候有id传过来就是编辑歌曲
        $(this.el).prepend('<h1>编辑歌曲</h1>')
      }else{
        // 否则就是新建歌曲
        $(this.el).prepend('<h1>新建歌曲</h1>')
      }
      
    },
    reset(){
      this.render({})
    }
  }

  let model = {
    data: {
      name:'', singer:'', url:'', id:''
    },
    create(data){
      var Song = AV.Object.extend('Song');
      var song = new Song()
      return song.save(data).then((newSong) => {
        let {id, attributes} = newSong //es6解构语法，得到id和attributes的值
        // {id, ...attributes}也是es6语法: 
        // ①id: id,key和value相同的情况下，可以简写成一个
        // ②...attributes表示将attribute中的内容，加入到目前对象中
        // ③所以{id: id, name: attributes.name, singer: attributes.singer, url: attributes.url}这一大串就变成了
        Object.assign(this.data, {id, ...attributes})
      })
    }
  }

  let controller = {
    init(view, model){
      this.view = view
      this.model = model
      this.view.render(this.model.data)
      this.bindEvents()
      window.eventHub.on('upload',(data) => {
        this.model.data = data
        this.view.render(this.model.data)
      })
      window.eventHub.on('select', (data) => {
        this.model.data = data
        this.view.render(this.model.data)
      })
      window.eventHub.on('new',() => {
        //根据有没有data中有没有id来判断form是否清空
        //点击歌曲列表之后, 此模块得到的data中是有id的，此时点击新建歌曲，需要清空form
        //上传完毕后, 此模块得到的data中是没有id的，此时点击新建歌曲，不需要清空form，因为用户正在编辑上传的歌曲
        if(this.model.data.id){
          this.view.reset()
        }
      })
    },
    bindEvents(){
      $(this.view.el).on('submit', 'form', (e) => {
        e.preventDefault()
        let needs = ['name', 'singer', 'url']
        let data = {}
        needs.map((need) => {
          data[need] = $(this.view.el).find(`[name="${need}"]`).val()
        })
        this.model.create(data).then(() => {
          this.view.reset()
          /* ☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆ */
          /* 这边不能直接将this.model.data传入emit，
             一定要深拷贝,再传入emit，否则这个对象的内存地址会传给song-list.js中的model的data的song中，
             这边一进行Object.assign(this.data, {id, ...attributes})，改动了this.model.assign的值，
             song-list中的model的data的数组song就会变动，最后数组song中会有多个重复的对象！！！！！
           */
          var string = JSON.stringify(this.model.data)
          var obj = JSON.parse(string)
          /* ☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆ */
          window.eventHub.emit('create', obj)
        })
      })
    }
  }

  controller.init(view, model)
}