module["exports"] = class {
  static config = {
    name: "fsong",
    description: "Find song using lyrics",
    author: "Deku",
    prefix: false,
    usage: "[some lyrics]",
    accessableby: 0,
    cooldown: 3
  };
  static async start({ text, reply, react }) {
  const { get } = require('axios')
    try {
      let q = text.join(' ');
      if (!q) return reply('Missing lyrics!');
      const res = (await get(global.deku.ENDPOINT+"/api/findsong?lyrics="+encodeURI(q))).data;
      react("🎶");
    let msg = "Title: "+res.result.title+"\n\nLyrics: "+res.result.lyrics;
      return reply(msg);
    } catch (e) {
      return reply(e.message)
    }
  }
}