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

var designerNames = {
	"annasui":"Anna Sui",
	"amcqueen":"Alexander McQueen",
	"versace":"Versace",
	"metGala": "The Met Gala"
}

var galleryFiles = [
	"amcqueen-spring-2018",
	"annasui-fall-2017",
	"annasui-spring-2018",
	"metGala-2017",
	"metGala-2018",
	"versace-spring-2018"
];

function getSearchTermsFromQueryString(qs) {
	qs = qs.split('&');
	var i, value, param, params ={};

	for (i = 0; i < qs.length; ++i) {
		value = qs[i];
		param = value.split('='); 
		params[param[0]] = param[1] || null;
	}
	params = params.q;
	return (params && params.split(',')) || null;
}



function serveFile(req, res) {
	var fs   = require('fs');
	var fileName, url, qs;
	[url, qs] = req.url.split('?');
	fileName = url.split('/').slice(-1)[0]
	var ext = url.split('.').slice(-1)[0];



/* 
use this and similar to test
http://127.0.0.1:8006/data/pictureData.json?q=annasui-spring-2018,amcqueen-spring-2018

*/

	if( fileName === 'pictureData.json') {
		var galleries = {};
		var searchTerms = getSearchTermsFromQueryString(qs);
		searchTerms.forEach(function(searchTerm){
			if(galleryFiles.indexOf(searchTerm) !== -1) {

				var dataStr = fs.readFileSync("./data/" + searchTerm + ".json");
				var dataObj = JSON.parse(dataStr);

				var designer, collection, collectionName, season, year;
				[designer, season, year] = searchTerm.split('-');
				collection = season + '-' + year;
				collectionName = season[0].toUpperCase() + season.substr(1) + ' ' + year;
				if(!galleries[designer]) {
					galleries[designer] = {}
					galleries[designer].title = designerNames[designer];
					galleries[designer].pictures = [];
				}
				galleries[designer].pictures.push(dataObj.pictures[0]);

			}
			
		});
		res.writeHead(200, {'Content-Type': responseInfo[ext][0]});
		res.end(JSON.stringify(galleries, undefined, 4), responseInfo[ext][1]);

	}

	else if(responseInfo[ext]) {
		fs.readFile("./" + url, function(err, data){
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


