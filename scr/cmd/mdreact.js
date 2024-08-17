module.exports = {
  config: {
    name: "mdreact",
    description: "Share Contact",
    prefix: false,
    usage: "[storyID emoji]",
    accessableby: 0,
    cooldown: 0
  },
  start: async function ({ text, api, event, reply }) {
     try {
     const axios = require('axios'), fs = require('fs'), path = __dirname + '/cache/tuts.png';

     const id = text[0], reaction = text[1];
         
         if (id == "help") {
             const img = (await axios.get("https://i.imgur.com/nTlfI7U.jpeg", { responseType: "arraybuffer" })).data;
   fs.writeFileSync(path, Buffer.from(img, "utf-8"))
              return reply({body: `

How to get story id?

NOTE: YOU NEED TO BE FRIEND WITH BOT TO WORK.

1. Go to chrome or any broswer app

2. Login your facebook

3. Then use "desktop site"

4. Click your story and copy the link

This is the example of story link: https://web.facebook .com/stories/257629382778523/UzpfSVNDOjI4MzY0NTIxMTQ1ODI4NQ==?bucket_count=9&source=story_tray (i just add space to avoid restriction)

6. Get the story id which is like this “UzpfSVNDOjI4MzY0NTIxMTQ1ODI4NQ==”

7. Now type “mdreact UzpfSVNDOjI4MzY0NTIxMTQ1ODI4NQ== 🦉” you can customize the emoji (any emoji)

8. Check your story.`, attachment: fs.createReadStream(path)});
             }
         if (!id || !reaction) return reply("Wrong format\nUsage: mdreact [storyID emoji]\n\nDidn't know how? just type “mdreact help”");
         api.setStoryReaction(id, reaction)
         return reply("Reacting "+ reaction + " to story " + id + " success")
     } catch (e) {
     return reply("Reacting "+ reaction + " to story " + id + " failed with error: " + e.message)
     }
    }
  }