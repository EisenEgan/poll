var express = require('express');
var router = express.Router();
var request = require('request');
var apiOptions = {
  server: "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production') {
  apiOptions.server = "https://frozen-forest-33590.herokuapp.com"
}

router.get('/newpoll', function(req, res, next) {
  res.render('newpoll', {title: 'Make a new poll', isAuth: true, selected: 'New Poll'});
})

router.post('/newpoll', function(req, res, next) {
  path = "/api/polls"
  postdata = {
    title: req.body.title,
    options: req.body.options.split(/\r\n/)
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
        console.log(err);
        return;
      }
    }
  )
})

router.get('/mypolls', function(req, res, next) {
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
      res.render('mypolls', {title: 'All Polls', isAuth: false, polls: body});
    }
  )
})

router.get('/*', function(req, res, next) {
  res.redirect('../polls');
})

module.exports = router;
