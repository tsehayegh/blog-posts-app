'use strict';

const mongoose = require('mongoose');


const blogSchema = mongoose.Schema({
  title: {type: String, required: true},
  author: {
    firstName: {type: String, required: true},
    lastName: {type: String, required: true}
  },
  content: String
});

blogSchema.virtual('fullName').get(function() {
  return `${this.author.firstName} ${this.author.lastName}`.trim()});

blogSchema.virtual('publishDate').get(function() {
  return Date.now()});


blogSchema.methods.serialize = function() {
  return {
    "title": this.title,
    "content": this.content,
    "author": this.fullName,
    "created": this.publishDate
  };
}

const Blog = mongoose.model('Blog', blogSchema);

module.exports = {Blog};
