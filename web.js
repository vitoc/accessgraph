let express = require('express');
let bodyParser = require('body-parser');
let server = express();
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
            companyListString += `<li><a href='/as/?uen=${company.properties.uen[0].value}'>${company.properties.uen[0].value}</a></li>`;
          });
          res.send(companyListString);
      } else {
          res.send("Error listing companies");        
          console.log(err);
      }
    }.bind(res));
});

server.get("/as/", function (req, res) {
  res.send("You're "+req.query.uen);
});

var port = 8080;
server.listen(port, function() {
  console.log('server listening on port ' + port);
});