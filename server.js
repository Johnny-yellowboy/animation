var http = require("http");
http.createServer(function(req,res){
  res.writeHead(200,{"Content-type":"text-plain"});
  res.write('hello!woow');
  res.end();
});
server.listen(9394,'127.0.0.1',function(){
  console.log('开启服务器成功');
});