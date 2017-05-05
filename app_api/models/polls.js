var mongoose = require('mongoose');

var pollSchema = new mongoose.Schema({
  title: {type: String, required: true},
  options: {type: [String], required: true},
  values: {type: [Number], default: []},
  creator: {type: Number, default: 1},
  voters: [Number]
})

mongoose.model('Poll', pollSchema);
