var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/poll', function(req, res, next) {
  var data = {
    labels: [
        "Red",
        "Blue",
        "Yellow"
    ],
    datasets: [
        {
            data: [300, 50, 100],
            backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
            ],
            hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
            ]
        }]
  };
  res.render('poll', {title: 'Poll', data: JSON.stringify(data), isAuth: false});
})

router.get('/newpoll', function(req, res, next) {
  res.render('newpoll', {title: 'Make a new poll', isAuth: true, selected: 'New Poll'});
})

router.get('/mypolls', function(req, res, next) {
  res.render('mypolls', {title: 'My Polls', isAuth: true, selected: 'My Polls'});
})

router.get('/polls', function(req, res, next) {
  res.render('index', {title: 'Polls', isAuth: false});
})

router.get('/*', function(req, res, next) {
  res.redirect('../polls');
})

module.exports = router;
