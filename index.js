
const http = require("http");
const url = require("url");

//creating a server

var server = http.createServer(function(req,res){
   var parsedURL = url.parse(req.url,true);
   var pathName = parsedURL.pathname;
   var trimmedPath = pathName.replace(/^\/+|\/+$/g,'');
   
   res.end("bazinga!\n");
   console.log("path",trimmedPath);
   
});

//starting the server and listening on port 3000

server.listen(3000,function(req,res){
   console.log("listening on port 3000");
});