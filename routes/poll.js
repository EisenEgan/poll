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

var isAuth;

router.post('/', function(req, res, next) {
  console.log('herp')
  isAuth = true;
  console.log("name = " + req.body.name)
  console.log('derp')
  // console.log("req.body = " + req.body);
  // console.log('derp')
  // var requestOptions, path;
  // path = '/api/polls';
  // requestOptions = {
  //   url: apiOptions.server + path,
  //   method: "GET",
  //   json: {}
  // }
  // request(
  //   requestOptions,
  //   function(err, response, body) {
  res.send({"herp": "derp"})
  //res.render('index', {title: 'All Polls', isAuth: true, polls: body});
  //   }
  // )
})

var firebase = require('firebase');
var config = {
  apiKey: "AIzaSyBxAuw_Bwaea2UjbD1tO7YI3CRGFjj2tS4",
  authDomain: "pollapp-25bfb.firebaseapp.com",
  databaseURL: "https://pollapp-25bfb.firebaseio.com",
  storageBucket: "pollapp-25bfb.appspot.com",
  };
firebase.initializeApp(config);
var provider = new firebase.auth.TwitterAuthProvider();

router.get('/:id', function(req, res) {
  // var isAuth;
  // firebase.auth().onAuthStateChanged(function(user) {
  //   if (user) {
  //     // User is signed in.
  //     isAuth == true;
  //     console.log('does this ever print?')
  //     var displayName = user.displayName;
  //     var email = user.email;
  //     var emailVerified = user.emailVerified;
  //     var photoURL = user.photoURL;
  //     var isAnonymous = user.isAnonymous;
  //     var uid = user.uid;
  //     var providerData = user.providerData;
  //   // ...
  //   } else {
  //   // User is signed out.
  //   // ...
  //   }
  // });
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
      res.render('poll', {title: body.title, data: JSON.stringify(data), isAuth: !(isAuth == undefined), pollData: body});
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
      res.render('index', {title: 'All Polls', isAuth: !(isAuth == undefined), polls: body});
    }
  )
})


module.exports = router;
