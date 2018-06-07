{
  let view = {
    el: '#app',
    template = `
    `
  }

  let model = {
    data: {
      id: '',
      name: '',
      singer: '',
      url: ''
    },
    get(id){
      var query = new AV.Query('Song')
      return query.get(id).then((song) => {
        Object.assign(this.data, {id: song.id, ...song.attributes})
      })
    }
  }

  let controller = {
    init(view, model){
      this.view = view
      this.model = model
      let id = this.getSongId()
      this.model.get(id).then(() => {
        this.view.render(this.model.data)
      })
    },
    getSongId(){
      let search = window.location.search
      // 查询参数search可能等于,需要解析:
      // ?id=2343214234234343&a=1&&b=2
      if(search.indexOf('?') === 0){
        search = search.substring(1)
      }
      
      let array = search.split('&').filter((v) => {
        // search.split('&') => ["id=2343214234234343", "a=1", "", "b=2"] 
        // fiter来过滤空字符串 => ["id=2343214234234343", "a=1", "b=2"]
        return v
      })

      let id = ''
      for(let i=0; i<array.length; i++){
        let kv = array[i].split('=')
        let k = kv[0]
        let v = kv[1]
        if(k === 'id'){
          id = v
          break
        }
      }

      return id
    }
  }
  controller.init(view, model)
}