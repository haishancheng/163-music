{
  let view = {
    el: '.uploadArea',
    // template中没有数据变化的可以不弄过来，所以new-song.js中的view也可以不弄template
    loadProgressBar(percent){
      let width = $(this.el).find('.loading').width(percent + '%').width()
      $(this.el).find('.loading').width(width - 6)
    },
    resetLoadProgressBar(){
      $(this.el).find('.loading').width(0)
    }
  }
  let model = {
    data: {
      isloading: false
    }
  }
  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      this.initQiniu()
    },
    initQiniu() {
      var uploader = Qiniu.uploader({
        runtimes: 'html5', // 上传模式，依次退化
        browse_button: $(this.view.el).find('#uploadButton')[0], // 上传选择的点选按钮，必需
        uptoken_url: 'http://127.0.0.1:8888/uptoken', // Ajax请求uptoken的Url，强烈建议设置（服务端提供），uptoken是上传凭证
        get_new_uptoken: false, // 设置上传文件的时候是否每次都重新获取新的uptoken
        domain: 'p9lfootse.bkt.clouddn.com', // bucket域名，下载资源时用到，必需
        max_file_size: '40mb', // 最大文件体积限制
        dragdrop: true, // 开启可拖曳上传
        drop_element: $(this.view.el).find('#uploadContainer')[0], // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
        auto_start: true, // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
        init: {
          'FilesAdded': function (up, files) {
            plupload.each(files, function (file) {
              // 文件添加进队列后，处理相关的事情
            });
          },
          'BeforeUpload': (up, file) => {
            if(this.model.data.isloading){
              return
            }
            // 每个文件上传前，处理相关的事情
            window.eventHub.emit('beforeUpload')
            this.model.data.isloading = true;

          },
          'UploadProgress': (up, file) => {
            // 每个文件上传时，处理相关的事情
            this.view.loadProgressBar(file.percent)
          },
          'FileUploaded': (up, file, info) => {
            this.view.resetLoadProgressBar()
            this.model.data.isloading = false
            window.eventHub.emit('afterUpload')
            // 每个文件上传成功后，处理相关的事情
            var domain = up.getOption('domain');
            var response = JSON.parse(info.response);
            // 获取上传成功后的文件的Url
            var sourceLink = "http://" + domain + "/" + encodeURIComponent(response.key);
            window.eventHub.emit('new', {url: sourceLink, name: response.key})
          },
          'Error': function (up, err, errTip) {
            this.model.data.isloading = false
            //上传出错时，处理相关的事情
          },
          'UploadComplete': function () {
            //队列文件处理完毕后，处理相关的事情
          },
        }
      });
      // domain为七牛空间对应的域名，选择某个空间后，可通过 空间设置->基本设置->域名设置 查看获取
      // uploader为一个plupload对象，继承了所有plupload的方法
    }
  }

  controller.init(view, model)

}