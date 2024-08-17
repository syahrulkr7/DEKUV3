module['exports'] = {
  config: {
    name: "emix",
    accessableby: 0,
    description: "Mix two emoji",
    usage: "[emoji 1 | emoji 2]",
    prefix: false,
    cooldown: 2
  },
  start: async function ({reply, text}){
    const axios = require('axios');
    const fs = require('fs');
    const content = text.join(" ").split("|").map(item => item = item.trim());
      let emo1 = content[0]
      let emo2 = content[1]
    if (!emo1) return reply('Missing emoji 1');
    if (!emo2) return reply('Missing emoji 2');
    let emojiPath = __dirname+'/cache/emoji.png';
    let data = (await axios.get(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emo1)}_${encodeURIComponent(emo2)}`)).data;
    if (!data) return reply('No results found.');
    let mixed = data.results[0].media_formats.png_transparent.url
    if (!mixed) return reply('No results found.');
    let img = (await axios.get(data.results[0].media_formats.png_transparent.url, {
      responseType: "arraybuffer"
    })).data;
    fs.writeFileSync(emojiPath, Buffer.from(img, "utf-8"));
    return reply({attachment: fs.createReadStream(emojiPath)})
  }
}