{
  let view = {
    el: ".infoPage",
    template: `
      <div class="showArea">
          <h1>编辑歌曲</h1>
          <div class="row">
            <label>歌曲名称</label>
            <input type="text" name="name" value="__name__">
          </div>
          <div class="row">
            <label>歌手</label>
            <input type="text" name="singer" value="__singer__">
          </div>
          <div class="row">
            <label>歌曲外链</label>
            <input type="text" name="url" value="__url__">
          </div>
          <div class="row">
            <label>封面外链</label>
            <input type="text" name="cover" value="__cover__">
          </div>
          <div class="button-wrapper">
              <div class="button delete">删&nbsp;&nbsp;除</div>
              <div class="button confirm">确&nbsp;&nbsp;定</div>
          </div>
      </div>
    `,
    render(data = {}){//es6语法，如果没有传data或者data为undefined，那么data等于{}
      let placeholders = ['name', 'singer', 'url', 'id', 'cover']
      let html = this.template
      placeholders.map((placeholder) => {
        html = html.replace(`__${placeholder}__`, data[placeholder] || '')//data[placeholder]为undefined的话就换成''
      })
      $(this.el).html(html)
    },
    reset(){
      this.render({})
    },
    show(){
      $(this.el).addClass('active')
    },
    hide(){
      $(this.el).removeClass('active')
    }
  }

  let model = {
    data: {
      name:'', singer:'', url:'', id:'', cover:''
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
    },
    update(data){
      var song = AV.Object.createWithoutData('Song', this.data.id);
      song.set('name', data.name);
      song.set('singer', data.singer);
      song.set('url', data.url);
      song.set('cover', data.cover);
      return song.save().then((newSong) => {
        Object.assign(this.data, {id: newSong.id, ...newSong.attributes})
      })
    },
    delete(data){
      var song = AV.Object.createWithoutData('Song', this.data.id);
      return song.destroy().then((success) => {
        this.data = {name:'', singer:'', url:'', id:'', cover:''}
        return success.id
      });
    }
  }

  let controller = {
    init(view, model){
      this.view = view
      this.model = model
      this.view.render(this.model.data)
      this.bindEvents()
      this.bindEventHub()
    },
    create(){
      let needs = ['name', 'singer', 'url', 'cover']
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
        //创建成功后通知song-list显示，并通知upload-song显示，并通知本模块隐藏
        window.eventHub.emit('create', obj)
        //不重置的话，连续存会有问题
        this.model.data = {name:'', singer:'', url:'', id:'', cover:''}
      })
    },
    update(){
      let needs = ['name', 'singer', 'url', 'cover']
      let data = {}
      needs.map((need) => {
        data[need] = $(this.view.el).find(`[name="${need}"]`).val()
      })
      this.model.update(data).then(() => {
        //更新成功后通知song-list更新
        window.eventHub.emit('update', JSON.parse(JSON.stringify(this.model.data))) //同上面的新建，需要深拷贝
      })
    },
    delete(){
      this.model.delete(this.model.data).then((id) => {
        //删除成功后通知song-list更新，并通知upload-song显示，并通知本模块隐藏
        window.eventHub.emit('delete', {id: id})
      })
    },
    bindEvents(){
      $(this.view.el).on('click', '.confirm', (e) => {
        if(this.model.data.id){
          //id存在，相当于已存入数据库的，修改的歌曲
          this.update()
        }else{
          //id不存在，相当于未存入数据库的，新建的歌曲
          this.create()
        }
      }),
      $(this.view.el).on('click', '.delete', (e) => {
        if(this.model.data.id){
          //id存在，相当于已存入数据库的，修改的歌曲
          this.delete()
        }
      })
    },
    bindEventHub(){
      window.eventHub.on('select', (data) => {
        this.model.data = data
        this.view.show()
        this.view.render(this.model.data)
      })
      window.eventHub.on('new',(data) => {
        //用户上传歌曲到七牛完毕，正在编辑歌曲准备存入leanclound时，此时点击新建歌曲应该不使得当前页面消失
        //根据是否有id来判断，是否是点击歌曲后才点击的新建歌曲按钮
        if(this.model.data.id){
          this.model.data = {name:'', singer:'', url:'', id:'', cover:''}
          this.view.hide()
        }
      })
      window.eventHub.on('afterUpload',(data) => {
        this.view.show()
        Object.assign(this.model.data, data)
        this.view.render(this.model.data)
      })
      window.eventHub.on('create', () => {
        this.view.hide()
      })
      window.eventHub.on('delete', () => {
        this.view.hide()
      })
    }
  }

  controller.init(view, model)
}