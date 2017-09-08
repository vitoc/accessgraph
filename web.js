var express = require('express');
var bodyParser = require('body-parser');
var server = express();
let graph = require('./graph');

server.use(express.static(__dirname + '/static'));
server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());

server.post('/company/add/', function (req, res) {

  let success = function () {
    res.send("Success. <a href='/'>Home</a>");
  }.bind(res);

  let failure = function (err) {
    res.send(`Failed: ${err}. <a href='/'>Home</a>`);
  }.bind(res);

  graph.client.execute(`g.addV('company').property('uen', '${req.body.uen}')`, { }, function (results, err) {
    if (!err) {
        success();
    } else {
        failure(err);
    }
  }.bind(success, failure));
  
});

server.get('/company/list/', function (req, res) {
  
    let success = function (list) {
      for (let i = 0; i < list.length; i++) {
        console.log(list);
      }
      res.send("List company. <a href='/'>Home</a>");
    }.bind(res);
  
    let failure = function (err) {
      res.send(`Failed to list company: ${err}. <a href='/'>Home</a>`);
    }.bind(res);

    graph.client.execute(`g.V()`, { }, function (results, err) {
      if (!err) {
          success(results);
      } else {
          failure(err);
      }
    }.bind(success, failure));


});

var port = 8080;
server.listen(port, function() {
  console.log('server listening on port ' + port);
});