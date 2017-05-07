var mongoose = require('mongoose');
var Poll = mongoose.model('Poll');

module.exports = {
  pollList: function (req, res) {
    Poll
      .find()
      .select("title")
      .exec(function(err, polls) {
        if (!polls) {
          sendJsonResponse(res, 404, {
            "message": "pollid not found"
          });
          return;
        } else if (err) {
          sendJsonResponse(res, 404, err);
          return;
        }
        sendJsonResponse(res, 200, polls);
      })
  },
  pollCreate: function (req, res) {
    const arr = Array(req.body.options.length).fill(0);
    var voters = [];
    Poll.create({
      title: req.body.title,
      options: req.body.options,
      values: arr,
      voters: voters
    }, function(err, poll) {
      if (err) {
        sendJsonResponse(res, 400, err);
      } else {
        sendJsonResponse(res, 201, poll);
      }
    })
  },
  pollReadOne: function (req, res) {
    if (req.params && req.params.pollid) {
      Poll
      .findById(req.params.pollid)
      .exec(function(err, poll) {
        if (!poll) {
          sendJsonResponse(res, 404, {
            "message": "pollid not found"
          });
          return;
        } else if (err) {
          sendJsonResponse(res, 404, err);
          return;
        }
        sendJsonResponse(res, 200, poll);
      })
    }
    else {
      sendJsonResponse(res, 404, {
        "message": "No pollnid in request"
      })
    }
  },
  pollUpdateValues: function(req, res) {
    var pos = req.body.value
    if (!req.params || !req.params.pollid) {
      sendJsonResponse(res, 404, {
        "message": "Not found, pollid is required"
      });
      return;
    }
    Poll
      .findById(req.params.pollid)
      .select('values options')
      .exec(function(err, poll) {
        if (!poll) {
          sendJsonResponse(res, 404, {
            "message": "pollid not found"
          });
          return;
        } else if (err) {
          sendJsonResponse(res, 404, err);
          return;
        }
        console.log("print?")
        console.log("value = " + req.body.value)
        poll.values[poll.options.indexOf(req.body.value)]++;
        console.log(poll.values);
        Poll.update({ _id: req.params.pollid }, { $set: { values: poll.values }},  function(err, poll) {
            if (err) {
              sendJsonResponse(res, 404, err);
            } else {
              sendJsonResponse(res, 200, poll);
            }
        });
      })
  },
  pollDeleteOne: function (req, res) {
    console.log(req.params.pollid)
    if (req.params.pollid) {
      Poll
        .findByIdAndRemove(req.params.pollid)
        .exec(
          function(err, poll) {
            if (err) {
              sendJsonResponse(res, 404, err);
              return;
            }
            sendJsonResponse(res, 204, null);
            return;
          }
        )
    } else {
      sendJsonResponse(res, 404, {
        "message": "No pollid"
      })
    }
  }
}


var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
}
