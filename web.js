var express = require('express');
var bodyParser = require('body-parser');
var server = express();
let graph = require('./graph');
let blob = require('./blob');

server.use(express.static(__dirname + '/static'));
server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());

server.post('/company/add/', function (req, res) {

  graph.client.execute(`g.addV('company').property('uen', '${req.body.uen}')`, { }, function (err, results) {
    if (!err) {
      console.log(req.body.uen);
      blob.service.createContainerIfNotExists(req.body.uen, function(error, result, response){
        if (!error){
          res.send("Success. <a href='/'>Home</a>");
        } else {
          res.send("Error adding company container");
        }
      }.bind(res));
    } else {
      res.send("Error adding company to graph");
      console.log(err);
    }
  }.bind(res));
  
});

server.get("/company/list/", function (req, res) {
    graph.client.execute(`g.V()`, { }, function (err, results) {
      if (!err) {
          let companyListString = "";        
          results.forEach(function(company) {
            companyListString += `<li><a href='/as/${company.properties.uen[0].value}'>${company.properties.uen[0].value}</a></li>`;
          });
          res.send(companyListString);
      } else {
          res.send("Error listing companies");        
          console.log(err);
      }
    }.bind(res));
});

var port = 8080;
server.listen(port, function() {
  console.log('server listening on port ' + port);
});