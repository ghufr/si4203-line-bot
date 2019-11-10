const mongoose = require("mongoose");

const User = mongoose.Schema({
  name: String,
  UserId: String,
  nim: String
});

module.exports = mongoose.model("User", User);
