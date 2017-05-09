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
      creator: req.body.creator,
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
    var pos = req.body.value,
        voter = req.body.voter;
    if (!req.params || !req.params.pollid) {
      sendJsonResponse(res, 404, {
        "message": "Not found, pollid is required"
      });
      return;
    }
    console.log("no = " + req.body.newOption);
    if (req.body.newOption != "") {
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
          poll.options.push(req.body.newOption);
          poll.voters.push(req.body.voter);
          poll.values.push(1);
          // if (poll.voters.indexOf(voter) != -1) {
          //   res.send("already voted");
          //   return;
          // }
          // else {
          //   poll.voters.push(voter)
          // }
          Poll.update({ _id: req.params.pollid }, { $set: { options: poll.options, voters: poll.voters, values: poll.values }},  function(err, poll) {
              if (err) {
                sendJsonResponse(res, 404, err);
              } else {
                sendJsonResponse(res, 200, poll);
              }
              return;
          });
        });
    }
    else {
    Poll
      .findById(req.params.pollid)
      //.select('values options voters')
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
        console.log("poll.voters = " + poll.voters);
        console.log("voter = " + voter);
        console.log("poll.voters.indexOf(voter) = " + poll.voters.indexOf(voter))
        if (poll.voters.indexOf(voter) != -1) {
          res.send("already voted");
          return;
        }
        else {
          poll.voters.push(voter)
        }
        console.log("print?")
        console.log("value = " + req.body.value)
        poll.values[poll.options.indexOf(req.body.value)]++;
        console.log(poll);
        Poll.update({ _id: req.params.pollid }, { $set: { values: poll.values, voters: poll.voters }},  function(err, poll) {
            if (err) {
              sendJsonResponse(res, 404, err);
            } else {
              sendJsonResponse(res, 200, poll);
            }
        });
      })
    }
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
  },
  userPolls: function (req, res) {
    Poll
      .find({"creator": req.headers.displayname})
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
  }
}


var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
}
