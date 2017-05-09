var mongoose = require('mongoose');

var pollSchema = new mongoose.Schema({
  title: {type: String, required: true},
  options: {type: [String], required: true},
  values: {type: [Number], default: []},
  creator: {type: String, required: true},
  voters: [String]
})

mongoose.model('Poll', pollSchema);
