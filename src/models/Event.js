const mongoose = require("mongoose");

const Event = mongoose.Schema({
  name: String,
  GroupId: String,
  inviterId: String,
  isJoin: Boolean
});

module.exports = mongoose.model("Event", Event);
