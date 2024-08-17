module["exports"] = class {
  static config = {
    name: "emgif",

    description: "Emoji to GIF",

    prefix: true,

    accessableby: 0,

    usage: "[emoji]",

    author: "Deku",
    cooldown: 4,
  };

  static async start({ reply, text }) {
    const axios = require("axios"),
      fs = require("fs"),
      gif = __dirname + "/cache/gif.gif";

    try {
      let em = text[0];

      if (!em) return reply("Missing Emoji");

      const avEmoji =
        "😀😃😄😁😆😅😂🤣😭😉😗😙😚😘🥰😍🤩🥳🙃🙂🥲🥹😊☺️😌😏🤤😋😛😝😜🤪🥴😔🥺😬😑😐😶🤐🤔🤫🫢🤭🥱🤗😱🤨🧐😒🙄😮‍💨😤😠😡🤬😞😓😟😥😢☹️🙁😰😨😧😦😮😯😲😳🤯😖😣😩😫😵🥶🥵🤢🤮😴😪🤧🤒🤕😷🤥😇🤠🤑🤓😎🥸🤡😈👿";

      if (!avEmoji.includes(em))
        return reply(
          "Sorry but the emoji " + em + " is not available or not emoji",
        );

      const str = em.codePointAt(0).toString(16);

      const emoji = str.toLowerCase();

      const url = `https://fonts.gstatic.com/s/e/notoemoji/latest/${emoji}/512.gif`;

      const response = (
        await axios.get(url, {
          responseType: "arraybuffer",
        })
      ).data;

      fs.writeFileSync(gif, Buffer.from(response, "binary"));

      return reply({
        attachment: fs.createReadStream(gif),
      });
    } catch (w) {
      return reply(w["message"]);
    }
  }
};
