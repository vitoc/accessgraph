let express = require('express');
let bodyParser = require('body-parser');
let server = express();
let graph = require('./graph');
let blob = require('./blob');

server.use(express.static(__dirname + '/static'));
server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());

server.post('/company/add/', function (req, res) {
  blob.service.createContainerIfNotExists(req.body.uen, function(error, result, response) {    
    let sharedAccessPolicy = blob.getSharedAccessPolicy();
    let token = blob.service.generateSharedAccessSignature(req.body.uen, null, sharedAccessPolicy);
    graph.client.execute(`g.addV('company').property('uen', '${req.body.uen}').property('token', '${token}')`, { }, function (err, results) {
      res.send("Success. <a href='/'>Home</a>");
    }.bind(res));
  }.bind(req, res));
});

server.get("/company/list/", function (req, res) {
  graph.client.execute(`g.V().has('label','company')`, { }, function (err, results) {
    if (!err) {
      let companyListString = "";
      results.forEach(function(company) {
        companyListString += `<li><a href='/as/?uen=${company.properties.uen[0].value}'>${company.properties.uen[0].value}</a> 
        <br/>|->Add project: <form action="/project/add?uen=${company.properties.uen[0].value}&id=${company.id}" 
        method="post">
            <input type="text" name="name">
            <button type="submit">Add</button>
          </form>`;
      });
      res.send(companyListString);
    } else {
      res.send("Error listing companies");
      console.log(err);
    }
  }.bind(res));
});

server.get("/as/", function (req, res) {
  graph.client.execute(`g.V().has('uen', '${req.query.uen}')`, { }, function (err, results) {
    var sasUrl = blob.service.getUrl(req.query.uen, null, results[0].properties.token[0].value);
    res.send(sasUrl);
  }.bind(req));
});

server.post('/project/add/', function (req, res) {
  graph.client.execute(`g.addV('project').property('uen', '${req.query.uen}').property('name', '${req.body.name}')`, { }, function (results, err) {
    graph.client.execute(`g.V('${req.query.id}').addE('has').to(g.V().has('name','${req.body.name}'))`, { }, function (err, results) {
      res.send("Project added. <a href='/'>Home</a>");      
    }.bind(res));
  }.bind(req, res));
});

var port = 8080;
server.listen(port, function() {
  console.log('server listening on port ' + port);
});
