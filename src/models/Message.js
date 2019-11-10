const mongoose = require("mongoose");

const ImageDict = mongoose.Schema({
  originalContentUrl: String,
  previewImageUrl: String
});

const TextDict = mongoose.Schema({
  text: [String]
});

const Message = mongoose.Schema({
  type: {
    type: String,
    enum: ["text", "image", "sticker", "video", "audio", "location"]
  },
  content: {
    type: Object,
    enum: [ImageDict, TextDict]
  }
});

module.exports = mongoose.model("Message", Message);
