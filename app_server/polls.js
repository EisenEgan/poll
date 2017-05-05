var mongoose = require('mongoose');

var pollSchema = new mongoose.Schema({
  title: {type: String, required: true},
  options: {type: [String], required: true},
  values: {type: [Number], required: true},
  creator: Number,
  voters: [Number]
})

mongoose.model('Poll', pollSchema);
