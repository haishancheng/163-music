var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]
var qiniu = require('qiniu')

if(!port){
  console.log('请指定端口号好不啦？\node server.js 8888 这样不会吗？')
  process.exit(1)
}

var server = http.createServer(function(request, response){
  //以  http://localhost:8080/sss?wd=hello&rsv=rsv_spt#5   为例
  var parsedUrl = url.parse(request.url, true) 
  var pathName = parsedUrl.pathname  //pathName为路径，即为    /sss
  var queryObject = parsedUrl.query     //queryObject为查询参数对象，即为   { wd: 'hello', rsv: 'rsv_spt' }
  var method = request.method

  if(pathName === '/uptoken'){
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/json;charset=utf-8')
    response.setHeader('Access-Control-Allow-Origin', '*')
    
    //将accessKey和secretKey存入一个文件，在git上传时ignore，防止泄密
    var config = fs.readFileSync('./qiniu-key.json')
    config = JSON.parse(config)
    let {accessKey, secretKey} = config
    var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    var options = {
      scope: "163-music",
    };
    var putPolicy = new qiniu.rs.PutPolicy(options);
    var uploadToken=putPolicy.uploadToken(mac);
    response.write(`
    {
      "uptoken": "${uploadToken}"
    }
    `)
    response.end()
  }else{
    response.statusCode = 404
    response.setHeader('Content-Type','text/plain;charset=utf-8')
    response.write('找不到对应路径')
    response.end()
  }
})

server.listen(port)
console.log('监听 ' + port + ' 成功\n请打开 http://localhost:' + port)