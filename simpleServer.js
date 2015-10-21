//Lets require/import the HTTP module
var http = require('http');
var fs = require('fs');
var url = require("url");
//var dispatcher = require('httpdispatcher');

//Lets define a port we want to listen to
const PORT=8088;

fs.readFile('results.json', 'utf8', function (err, data) {
    if (err) throw err;
    allResults = JSON.parse(data);
});

fs.readFile('filtered.json', 'utf8', function (err, data) {
    if (err) throw err;
    filteredResults = JSON.parse(data);
});

fs.readFile('final.json', 'utf8', function (err, data) {
    if (err) throw err;
    finalResults = JSON.parse(data);
});

//Create a server
var server = http.createServer(function(req,res){

    var urlParams = url.parse(req.url, true).query;
    var relevantIds = urlParams.relevantIds;
    var unrelevantIds = urlParams.unrelevantIds;
    var results = allResults;

    if(relevantIds){
        results = filteredResults;
    }
    else if(unrelevantIds){
        results = finalResults;
    }

    if(urlParams.id){
        for(var i=0; i<results.items.length; i++){
            if(results.items[i].id == urlParams.id){
                //TODO: get rid of that
                results = results.items[i];
                break;
            }
        }
    }

    res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    });
    res.write(JSON.stringify(results, null, 3));
    res.end();
});

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});