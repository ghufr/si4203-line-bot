const mongoose = require("mongoose");

const Event = mongoose.Schema({
  mode: {
    type: String,
    enum: ["active", "passive"]
  }
});

module.exports = mongoose.model("Event", Event);
