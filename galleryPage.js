function handleHTTP(req,res) {
	if (req.method === "GET") {
		serveFile(req, res);
	}
	else {
		res.writeHead(403);
		res.end("Service not available.");
	}
}

var http = require("http");
http.createServer((req, res) => {
	handleHTTP(req, res);
}).listen(8006);

console.log("Listening on 8006");

var responseInfo = {
	jpg:  ['image/gif', 'binary'],
	jpeg: ['image/gif', 'binary'],
	gif:  ['image/gif', 'binary'],
	png:  ['image/gif', 'binary'],
	ico:  ['image/gif', 'binary'],
	css:  ['text/css; charset=utf-8'],
	js:   ['application/javascript'],
	json: ['application/json; charset=utf-8'],
	html: ['utf-8']
}

function serveFile(req, res) {
	var fs   = require('fs');
	var ext = req.url.split('.');
	ext = ext[ext.length - 1];

	if(responseInfo[ext]) {
		fs.readFile("./" + req.url, function(err, data){
			if (err) {
				console.log(err);
			}
			else {
				res.writeHead(200, {'Content-Type': responseInfo[ext][0]});
				res.end(data, responseInfo[ext][1]);
			}
		});
	}
	else {
		console.log("Unknown File Type: " + req.url);
	}
}


