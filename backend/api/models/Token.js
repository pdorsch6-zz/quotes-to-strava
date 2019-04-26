const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Token = new Schema(
  {
    _id: {
      type: String,
      required: true,
      minlength: 1
    },
    token: {
      type: String,
      required: true,
      minlength: 1
    },
  },

);

Token.virtual('type').get(function() {
  return this._id;
});

module.exports = mongoose.model("Token", Token);