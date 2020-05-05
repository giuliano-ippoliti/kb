let mongoose = require('mongoose');

// Article Schema

// https://mongoosejs.com/docs/guide.html
// Everything in Mongoose starts with a Schema.
// Each schema maps to a MongoDB collection and defines the shape
// of the documents within that collection.

let articleSchema = mongoose.Schema({
  title:{
    type: String,
    required: true
  },
  author:{
    type: String,
    required: true
  },
  body:{
    type: String,
    required: true
  }
});

// Article is a model
let Article = module.exports = mongoose.model('Article', articleSchema);
