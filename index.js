const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;

//creating a server

var server = http.createServer(function (req, res) {
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

});



//starting the server and listening on port 3000

server.listen(3000, function (req, res) {
   console.log("listening on port 3000");
});

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