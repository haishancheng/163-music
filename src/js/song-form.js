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
        console.log('存入后得到的值', this.data)
      })
    },
    update(data){
      var song = AV.Object.createWithoutData('Song', this.data.id);
      song.set('name', data.name);
      song.set('singer', data.singer);
      song.set('url', data.url);
      return song.save().then((newSong) => {
        Object.assign(this.data, {id: newSong.id, ...newSong.attributes})
      })
    }
  }

  let controller = {
    init(view, model){
      this.view = view
      this.model = model
      this.view.render(this.model.data)
      this.bindEvents()
      window.eventHub.on('select', (data) => {
        this.model.data = data
        this.view.render(this.model.data)
      })
      window.eventHub.on('new',(data) => {
        if(this.model.data.id){
          //只有在点击歌曲列表之后,才有id
          //点击歌曲列表之后, song-list模块会将id传过来，此时this.model.data.id有数据的
          if(data===undefined){
            // 点击歌曲列表后，点击新建歌曲
            this.model.data = {name:'', singer:'', url:'', id:''}
          } else {
            // 点击歌曲列表后，点击操作上传歌曲
            this.model.data = data
          }
        }else{
          //不点击歌曲列表
          Object.assign(this.model.data, data)
        }
        this.view.render(this.model.data)
      })
    },
    create(){
      console.log(1)
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
        //不重置的话，连续存会有问题
        this.model.data = {name:'', singer:'', url:'', id:''}
      })
    },
    update(){
      console.log(2)
      let needs = ['name', 'singer', 'url']
      let data = {}
      needs.map((need) => {
        data[need] = $(this.view.el).find(`[name="${need}"]`).val()
      })
      this.model.update(data).then(() => {
        window.eventHub.emit('update', JSON.parse(JSON.stringify(this.model.data))) //同上面的新建，需要深拷贝
      })
    },
    bindEvents(){
      $(this.view.el).on('submit', 'form', (e) => {
        e.preventDefault()
        if(this.model.data.id){
          //id存在，相当于已存入数据库的，修改的歌曲
          this.update()
        }else{
          //id不存在，相当于未存入数据库的，新建的歌曲
          this.create()
        }

        
      })
    }
  }

  controller.init(view, model)
}