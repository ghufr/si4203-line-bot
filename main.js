require("dotenv").config();

const express = require("express");
const line = require("@line/bot-sdk");

const app = express();

const PORT = process.env.PORT || 5000;

// const GroupId = "Ceb966c899a6b3a2ed68383db4eb5e8b0";
const groupId = process.env.GROUP_ID;
const userId = process.env.USER_ID;

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
};

const IMAGE_BASEURL =
  "https://firebasestorage.googleapis.com/v0/b/bot-si4203.appspot.com/o";

const image_dictionary = {
  kntl: `${IMAGE_BASEURL}/kntl.png?alt=media&token=04b2925d-aaed-40a7-af6e-aafff39488cb`,
  "open-bo": `${IMAGE_BASEURL}/open-bo.png?alt=media&token=382cd876-21c2-4873-9913-664732133b64`,
  gnw: `${IMAGE_BASEURL}/gnw.png?alt=media&token=66b668f3-658f-4a77-88f3-99ae38dfb211`,
  majalengka: `${IMAGE_BASEURL}/majalengka.png?alt=media&token=dbe8ae6e-eba8-4ac8-b8db-248ebde0602d`,
  bismillah: `${IMAGE_BASEURL}/bismillah.png?alt=media&token=b0bdb0f0-782e-4a7c-9e2f-aaefde8434e4`,
  "like-genesis": `${IMAGE_BASEURL}/like-genesis.png?alt=media&token=a976c85d-aec0-489a-8b14-ceb8ed47f238`,
  "we-love-cyan": `${IMAGE_BASEURL}/we-love-cyan.jpg?alt=media&token=336d7c2d-3496-4cc3-87f0-0c25b9017a39`,
  "we-do": `${IMAGE_BASEURL}/we-do.png?alt=media&token=cb53eb42-d8d4-48c4-9501-dca1747449e9`,
  logo: `${IMAGE_BASEURL}/cyan.png?alt=media&token=4d77d16a-6871-4755-8460-293aeae46cdf`
};

const text_dictionary = {
  "genesis 2019": "Be precious, be proud, to be a cyan",
  "siapa kita?": "CYAN CYAN CYAN",
  "prodase?": "Fast, smart, efficient",
  "untuk apa kita disini?": "Bersenang Senang",
  "anda yakin lulus?": "Yakin yakin yakin",
  "we love you cyan": "we do!",
  "sistem informasi": "Satu hati selalu di depan",
  "bpad laboratory club": "One step forward",
  "praktikum erp": "Be safe, be resourceful, be respectful, and be responsible",
  si4203: "Uhuy",
  "erp lab": "SI"
};

const client = new line.Client(config);

app.post("/webhook", line.middleware(config), (req, res) => {
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

const handleEvent = evt => {
  if (evt.replyToken && evt.replyToken.match(/^(.)\1*$/)) {
    return console.log("Test hook recieved: " + JSON.stringify(evt.message));
  }
  switch (evt.type) {
    case "message":
      if (evt.message.type == "text") {
        console.log(evt.message.text);
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
            return client.replyMessage(
              evt.replyToken,
              "Akun anda tidak terverifikasi"
            );
          }
        } else if (
          evt.source.type == "group" &&
          text_dictionary[evt.message.text]
        ) {
          if (evt.source.groupId == groupId) {
            return replyText(evt.replyToken, text_dictionary[evt.message.text]);
          }
        }
      }
      return null;
    case "join":
      console.log(evt.source.groupId);

      return replyText(evt.replyToken, "We love you cyan, we do!");
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
