var express = require('express');
var router = express.Router();
var request = require('request');
var apiOptions = {
  server: "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production') {
  apiOptions.server = "https://frozen-forest-33590.herokuapp.com"
}

var colors = [
  "#dd0e0e",
	"#c1b469",
	"#92a981",
	"#7c959c",
	"#9684a1"
]

router.get('/:id', function(req, res, next) {
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
      var colorScheme = colors.slice(0, body.options.length)
      var data = {
        labels: body.options,
        datasets: [
          {
            data: body.values,
            backgroundColor: colorScheme
          }
        ]
      }
      res.render('poll', {title: body.title, data: JSON.stringify(data), isAuth: false, pollData: body});
    }
  )
})

router.post('/:id', function(req, res, next) {
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

router.post('/select/:id', function(req, res, next) {
  var requestOptions, path;
  path = '/api/polls/' + req.params.id;
  requestOptions = {
    url: apiOptions.server + path,
    method: "PUT",
    json: {value: req.body.selectpicker}
  }
  request(
    requestOptions,
    function(err, response, body) {
      console.log(body);
      res.redirect('/polls/' + req.params.id)
    }
  )
})

router.get('/', function(req, res, next) {
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
      res.render('index', {title: 'All Polls', isAuth: false, polls: body});
    }
  )
})

module.exports = router;
