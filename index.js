const http = require("http");
const https = require("https");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const config = require("./config");
const fs = require("fs");

//instantiating the http server

var httpServer = http.createServer(function (req, res) {
   unifiedServer(req,res);
});

//starting the http server 

httpServer.listen(config.httpPort, function (req, res) {
   console.log("listening on port "+ config.httpPort + " in " + config.envName + " mode ");
});

var httpsServerOptions = {
    'key' : fs.readFileSync("./ssl/key.pem"),
    'cert' : fs.readFileSync("./ssl/cert.pem")
}

// Instantiating a https server
var httpsServer = https.createServer(httpsServerOptions,function(req,res){
   unifiedServer(req,res);
});


//starting the https server 
httpsServer.listen(config.httpsPort, function (req, res) {
   console.log("listening on port "+ config.httpsPort + " in " + config.envName + " mode ");
});

var unifiedServer = function(req,res){
   var parsedURL = url.parse(req.url, true);
   var pathName = parsedURL.pathname;
   var trimmedPath = pathName.replace(/^\/+|\/+$/g, '');
   var method = req.method.toLowerCase();
   var queryObject = parsedURL.query;
   var headers = req.headers;

   //getting the payload
   var decoder = new StringDecoder("utf-8");
   var buffer = "";
   req.on("data", function (data) {
      buffer += decoder.write(data);
   });
   req.on("end", function () {
      buffer += decoder.end();

      var chosenHandler = typeof (router[trimmedPath]) !== "undefined" ? router[trimmedPath] : handlers.notFound;
      


      var data = {
         "trimmedPath": trimmedPath,
         "method": method,
         "queryObject": queryObject,
         "payload": buffer,
         "headers": headers
      };

      chosenHandler(data, function (statusCode, payload) {
         statusCode = typeof(statusCode) == "number" ? statusCode : 200;
         payload = typeof(payload) == "object" ? payload : {};
         var parsedPayload = JSON.stringify(payload);
         res.setHeader('Content-Type', 'application/json');
         res.end(parsedPayload);
         res.writeHead(statusCode);
         console.log("Returning this response: ", statusCode , parsedPayload);

      });

   });
}

var handlers = {};
handlers.sample = function (data, callback) {
   callback(405, {
      "name": "sample handler"
   });
};

handlers.notFound = function (data, callback) {
   callback(404, {})
};
var router = {
   'sample': handlers.sample
};