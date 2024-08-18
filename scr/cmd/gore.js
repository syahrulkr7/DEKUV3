const axios = require("axios");
const fs = require("fs");

module.exports = {
  config: {
    name: "gore",
    description: "Sends random video gore content",
    prefix: false,
    usage: "gore",
    react: "😱",
    accessableby: 0,
    category: "fun",
    cooldown: 4,
  },
  start: async function ({ reply, react }) {
    const cacheDir = __dirname + "/cache";
    const videoPath = cacheDir + "/video.mp4";

    try {
      // Ensure cache directory exists
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir);
      }

      // Fetch random gore content from the API
      const res = (await axios.get("https://ggwp-ifzt.onrender.com/api/randgre")).data;
      const { title, tag, upload, author, comment, vote, view, video1 } = res.result;

      // Download the video
      const videoResponse = await axios.get(video1, { responseType: "arraybuffer" });
      fs.writeFileSync(videoPath, videoResponse.data);

      // React to the command
      react(this.config.react);

      // Send the video and metadata as a reply
      await reply({
        body: `**Title:** ${title}\n**Tag:** ${tag}\n**Uploaded:** ${upload}\n**Author:** ${author}\n**Comments:** ${comment}\n**Votes:** ${vote}\n**Views:** ${view}`,
        attachment: fs.createReadStream(videoPath),
      });

      // Clean up the cached video file after sending
      fs.unlinkSync(videoPath);
    } catch (e) {
      console.log(e);
      return reply(e.message);
    }
  },
};
