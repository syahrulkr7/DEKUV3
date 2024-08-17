let path = __dirname + "/cache/spotify.mp3";

const axios = require("axios"),

  fs = require("fs");

module["exports"] = {

  config: {

    name: "spt",

    description: "Listen on Spotify using bot",

    prefix: false,

    usage: "[song title]",

    accessableby: 0,

    cooldown: 0
  },

  start: async function ({ reply, text }) {

    try {

      let q = text.join(" ");

      if (!q) return reply("[ ❗ ] - Missing title of the song");

      reply("[ 🔍 ] Searching for “" + q + "” ...");

      const r = await axios.get("https://lyrist.vercel.app/api/" + q);

      const { lyrics, title } = r.data;

      const results = (await axios.get(global.deku.ENDPOINT+"/spotify?q="+q)).data

      let url = results.result

      const dl = (

        await axios.get(url, { responseType: "arraybuffer" })

      ).data;

      fs.writeFileSync(path, Buffer.from(dl, "utf-8"));

      return reply(

        {

          body:

            "·•———[ SPOTIFY 🎧 ]———•·\n\n"+"Title: "+title+"\nLyrics:\n\n" +

            lyrics +

            "\n\nYou can download this audio by clicking this link or paste it to your browser: " +

            url,

          attachment: fs.createReadStream(path),

        },

        () => fs.unlinkSync(path),

      );

    } catch (s) {

      reply(s.message);

    }

  },

};