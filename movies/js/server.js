var http = require("http");

function onRequest(req, res) { // REQuest RESponse
  res.writeHead(200, {"Content-Type":"text/plain"})
  res.write("Hello World");
  res.end();
}

http.createServer(onRequest).listen(8080);
