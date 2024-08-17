const axios = require("axios");
class Imgur {
  constructor() {
    (this.clientId = "fc9369e9aea767c"),
      (this.client = axios.create({
        baseURL: "https://api.imgur.com/3/",
        headers: {
          Authorization: `Client-ID ${this.clientId}`,
        },
      }));
  }
  async uploadImage(url) {
    return (
      await this.client.post("image", {
        image: url,
      })
    ).data.data.link;
  }
}
class Modules extends Imgur {
  constructor() {
    super();
  }
  get config() {
    return {
      name: "imgur",
      accessableby: 0,
      description: "Upload to imgur",
      usage: "[reply]",
      prefix: false,
      cooldown: 0,
    };
  }
  start = async function ({ api, event }) {
    var array = [];
    if (
      "message_reply" != event.type ||
      event.messageReply.attachments.length < 0
    )
      return api.sendMessage(
        "Please reply with the photo/video/gif that you need to upload",
        event.threadID,
        event.messageID,
      );

    for (let { url } of event.messageReply.attachments)
      await this.uploadImage(url)
        .then((res) => array.push(res))
        .catch((err) => console.log(err));

    return api.sendMessage(
      `Uploaded successfully ${array.length} image(s)\nFailed to upload: ${array.length - event.messageReply.attachments.length}\nImage link: \n${array.join("\n")}`,
      event.threadID,
      event.messageID,
    );
  };
}
module.exports = new Modules();
