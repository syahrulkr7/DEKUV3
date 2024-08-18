
const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "gore",
    description: "Send a random gore video",
    usage: "gore", 
    cooldown: 5,  
    accessableby: 2, 
    category: "entertainment", 
    prefix: false, 
  },

  start: async function({ api, event, react, reply }) {
    try {
      reply("⏱️ | Fetching a random gore video, please wait...");

      const response = await axios.get('https://ggwp-ifzt.onrender.com/api/randgre');
      const data = response.data.result;

      if (!data || Object.keys(data).length === 0) {
        return reply("No gore videos found.");
      }

      const { title, source, view, comment, vote, video1: videoUrl } = data;

      if (!videoUrl) {
        return reply("No valid gore video found.");
      }

      const message = `Title: ${title}\nSource: ${source}\nViews: ${view}\nComments: ${comment}\nVotes: ${vote}`;

      const filePath = path.join(__dirname, `/cache/gore_video.mp4`);
      const writer = fs.createWriteStream(filePath);

      const videoResponse = await axios({
        method: 'get',
        url: videoUrl,
        responseType: 'stream'
      });

      videoResponse.data.pipe(writer);

      writer.on('finish', async () => {
        react(this.config.react || "😱");
        await reply({
          body: message,
          attachment: fs.createReadStream(filePath)
        });

        fs.unlinkSync(filePath);
      });

      writer.on('error', () => {
        reply("An error occurred while downloading the video.");
      });

    } catch (error) {
      console.error('Error:', error);
      reply("An error occurred while processing the request.");
    }
  },
};
