const mongoose = require("mongoose");

const Group = mongoose.Schema({
  name: String,
  GroupId: String,
  inviterId: String,
  isJoin: Boolean
});

module.exports = mongoose.model("Group", Group);
