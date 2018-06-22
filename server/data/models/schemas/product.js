const mongoose = require('mongoose')

const { Schema, Schema: { ObjectId } } = mongoose

module.exports = new Schema({
  owner: {
    type: ObjectId,
    ref: 'User'
  },

  image: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  size: {
    type: Number,
    required: true
  },

  color: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  }
})
