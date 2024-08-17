module["exports"] = class {
  static config = {
    name: "upload",
    description: "Upload image to Deku API server",
    prefix: false,
    accessableby: 0,
    author: "Deku",
    cooldown: 0
  };
  static async start({ reply, text, react, event }) {
    const { get } = require("axios");
    try {
      let url;
      if (event.type == "message_reply" && event.messageReply.attachments[0].type == "photo") {
        url = event.messageReply.attachments[0].url;
      } else {
        url = text[0]
        if (!url) return reply("Missing image url!");
      }
      
     /* const allowed = [".jpeg", ".jpg", ".png", ".gif"];
      if (!allowed.includes(url)){
        react("❌");
        return reply("Invalid url!");
      }*/
      react("⏳");
      const rest = (
        await get(global.deku.ENDPOINT + "/others/image/upload?url=" + encodeURI(url))
      ).data;
     react('✔️');
      if (rest.status == true){
        let msg = `[ IMAGE UPLOAD ]\n\n${rest.message}\nImage URL: ${rest.imageUrl}\n\n[ IMAGE UPLOAD ]`
        return reply(msg);
      } else {
        return reply("An error occurred while uploading the image.");
      }
    } catch (e) {
      return reply(e.message);
    }
  }
};