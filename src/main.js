require("dotenv").config();

const express = require("express");
const line = require("@line/bot-sdk");
const mongoose = require("mongoose");

const { image_dictionary, text_dictionary } = require("./dict");
const { authenticateUser, authenticateGroup } = require("./utils/auth");
const { textDictionary, imageDictionary } = require("./utils/dictionary");
const constants = require("./constants");

const app = express();

const PORT = process.env.PORT || 5000;

// const GroupId = "Ceb966c899a6b3a2ed68383db4eb5e8b0";
const groupId = process.env.GROUP_ID;
const userId = process.env.USER_ID;

const lineConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
};

const client = new line.Client(lineConfig);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.on("open", console.log.bind(console, "Connected to mongodb"));

app.post("/webhook", line.middleware(lineConfig), (req, res) => {
  if (req.body.events) {
    Promise.all(req.body.events.map(handleEvent))
      .then(() => res.status(200).end())
      .catch(err => {
        console.error(err);
        res.status(200).end();
      });
  }
});

const replyText = (token, texts) => {
  texts = Array.isArray(texts) ? texts : [texts];
  return client.replyMessage(
    token,
    texts.map(text => ({ type: "text", text }))
  );
};

const replyImage = (token, url) => {
  return client.replyMessage(token, {
    type: "image",
    originalContentUrl: url,
    previewImageUrl: url
  });
};

const handleText = evt => {
  switch (evt.source.type) {
    case "user":
      return authenticateUser(evt.source.userId).then(res => {
        if (res) {
          return imageDictionary(evt.message.text).then(res_2 => {
            client.pushMessage(groupId, {
              type: "image",
              originalContentUrl: image_dictionary[evt.message.text],
              previewImageUrl: image_dictionary[evt.message.text]
            });
          });
        }
      });
    case "group":
      return authenticateGroup(evt.source.groupId).then(res => {
        if (res) {
          return textDictionary(evt.message.text);
        }
      });
  }
  if (evt.source.type == "user" && image_dictionary[evt.message.text]) {
    if (userId == evt.source.userId) {
      return client.getProfile(evt.source.userId).then(profile =>
        client.pushMessage(groupId, {
          type: "image",
          // text: profile.displayName,
          originalContentUrl: image_dictionary[evt.message.text],
          previewImageUrl: image_dictionary[evt.message.text]
        })
      );
    } else {
      return client.replyMessage(evt.replyToken, constants.unverifiedUserError);
    }
  } else if (evt.source.type == "group" && text_dictionary[evt.message.text]) {
    if (evt.source.groupId == groupId) {
      return replyText(evt.replyToken, text_dictionary[evt.message.text]);
    }
  }
};

const handleImage = evt => {
  // TODO: Handle Image Message
};

const handleSticker = ext => {
  // TODO: Handle Sticker Message
};

const handleEvent = evt => {
  if (evt.replyToken && evt.replyToken.match(/^(.)\1*$/)) {
    return console.log("Test hook recieved: " + JSON.stringify(evt.message));
  }
  switch (evt.type) {
    case "message":
      switch (evt.message.type) {
        case "text":
          return handleText(evt);
        case "image":
          return handleImage(evt);
        case "sticker":
          return handleSticker(evt);
        default:
          return null;
      }

    case "join":
      // console.log(evt.source.groupId);
      return replyText(evt.replyToken, constants.welcomeMessage);
    case "leave":
      // TODO: Change Group record
      return null;
    default:
      return null;
  }
};

app.get("*", (req, res) => {
  res.status(200).end();
});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
