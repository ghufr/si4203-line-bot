const Message = require("../models/Message");

const textDictionary = name => {
  return Message.findOne({ type: "text", name }).catch(err => {
    console.log(err);
  });
};

const imageDictionary = name => {
  return Message.findOne({ type: "image", name }).catch(err => {
    console.log(err);
  });
};

module.exports = { textDictionary, imageDictionary };
