var express = require('express');
var router = express.Router();
var request = require('request');
var apiOptions = {
  server: "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production') {
  apiOptions.server = "https://frozen-forest-33590.herokuapp.com"
}

var variables = require('../variables').config

var colors = [
  "#dd0e0e",
	"#c1b469",
	"#92a981",
	"#7c959c",
	"#9684a1"
]

var isAuth;
var displayName

router.post('/polls', function(req, res, next) {
  isAuth == undefined ? isAuth = true : isAuth = undefined;
  displayName == undefined ? displayName = req.body.name : displayName = undefined;
  res.send({"response": "success"});
})

router.get('/polls/:id', function(req, res) {
  var error;
  if(req.query.error) {
    error = {"error": req.query.error}
  } else {
    error = {"error": ""};
  }
  var requestOptions, path;
  path = '/api/polls/' + req.params.id;
  requestOptions = {
    url: apiOptions.server + path,
    method: "GET",
    json: {}
  }
  request(
    requestOptions,
    function(err, response, body) {
      var length = body.options.length, colorScheme = [];
      var count = 0;
      while(count<=length) {
        colorScheme.push(colors[count%5])
        count++;
      }
      //var colorScheme = colors.slice(0, body.options.length)
      var data = {
        labels: body.options,
        datasets: [
          {
            data: body.values,
            backgroundColor: colorScheme
          }
        ]
      }
      res.render('poll', {title: body.title, data: JSON.stringify(data), isAuth: !(isAuth == undefined),
        pollData: body, selected: 'Home', displayName: displayName, creator: body.creator, error: JSON.stringify(error),
      id: req.params.id, config: JSON.stringify(variables)});
    }
  )
})

router.post('/polls/:id', function(req, res, next) {
  var requestOptions, path;
  path = '/api/polls/' + req.params.id;
  requestOptions = {
    url: apiOptions.server + path,
    method: "DELETE",
    json: {}
  }
  request(
    requestOptions,
    function(err, response, body) {
      res.redirect('/polls')
    }
  )
})

router.post('/polls/select/:id', function(req, res, next) {
  var requestOptions, path, newOption;
  if (req.body.newOption) {
    newOption = req.body.newOption
  } else {
    newOption = req.body.newOption
  }
  path = '/api/polls/' + req.params.id;
  requestOptions = {
    url: apiOptions.server + path,
    method: "PUT",
    json: {value: req.body.selectpicker, newOption: newOption, voter: displayName}
  }
  request(
    requestOptions,
    function(err, response, body) {
      var error = "";
      if (body == "already voted") {
        error = '/?error=denied';
      }
      res.redirect('/polls/' + req.params.id + error);
    }
  )
})

router.get('/polls', function(req, res, next) {
  console.log('print?')
  var requestOptions, path;
  path = '/api/polls';
  requestOptions = {
    url: apiOptions.server + path,
    method: "GET",
    json: {}
  }
  request(
    requestOptions,
    function(err, response, body) {
      res.render('index', {title: 'All Polls', isAuth: !(isAuth == undefined), polls: body,
      displayName: displayName, config: JSON.stringify(variables)});
    }
  )
})

router.get('/newpoll', function(req, res, next) {
  if (isAuth == undefined) {
    res.redirect('../polls');
  }
  res.render('newpoll', {title: 'Make a new poll', isAuth: !(isAuth == undefined), selected: 'New Poll',
  displayName: displayName, config: JSON.stringify(variables)});
})

router.post('/newpoll', function(req, res, next) {
  path = "/api/polls"
  postdata = {
    title: req.body.title,
    options: req.body.options.split(/\r\n/),
    creator: displayName
  }
  requestOptions = {
    url: apiOptions.server + path,
    method: "POST",
    json: postdata
  }
  request(
    requestOptions,
    function(err, response, body) {
      if (response.statusCode === 201) {
        res.redirect('../polls');
      } else {
        return;
      }
    }
  )
})

router.get('/mypolls', function(req, res, next) {
  if (isAuth == undefined) {
    res.redirect('../polls');
  }
  var requestOptions, path;
  path = '/api/polls/myPolls';
  requestOptions = {
    url: apiOptions.server + path,
    method: "GET",
    headers: {
      'displayName': displayName
    }
  }
  request(
    requestOptions,
    function(err, response, body) {
      console.log("body = " + body);
      res.render('mypolls', {title: 'My Polls', isAuth: !(isAuth == undefined), polls: JSON.parse(body),
      selected: "My Polls", displayName: displayName, config: JSON.stringify(variables)});
    }
  )
})



router.get('/*', function(req, res, next) {
  res.redirect('../polls');
})

module.exports = router;
