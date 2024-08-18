const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
    config: {
        name: "video",
        description: "Search video from YouTube",
        usage: "video [search]",
        cooldown: 9,
        accessableby: 0,
        category: "Media",
        prefix: false
    },
    start: async function ({ api, event, args, reply }) {
        try {
            const searchQuery = args.join(" ");
            if (!searchQuery) {
                return reply("Usage: video <search text>");
            }

            const ugh = await api.sendMessage(`⏱️ | Searching, for '${searchQuery}' please wait...`, event.threadID);

            await api.setMessageReaction("🕥", event.messageID, true);

            const response = await axios.get(`https://chorawrs-sheshh.vercel.app/video?search=${encodeURIComponent(searchQuery)}`);
            const data = response.data;
            const videoUrl = data.downloadUrl;
            const title = data.title;
            const thumbnail = data.thumbnail;

            // Save the video in the current directory with a unique filename
            const videoPath = path.join(__dirname, `video_${Date.now()}.mp4`);

            const videoResponse = await axios.get(videoUrl, { responseType: "arraybuffer" });
            fs.writeFileSync(videoPath, Buffer.from(videoResponse.data));

            await api.setMessageReaction("✅", event.messageID, true);

            await api.sendMessage({
                body: `Here's your video, enjoy!🥰\n\nTitle: ${title}\nImage: ${thumbnail}`,
                attachment: fs.createReadStream(videoPath),
            }, event.threadID, event.messageID);

            
            fs.unlinkSync(videoPath);
            await api.unsendMessage(ugh.messageID);
        } catch (error) {
            await reply(`Error: ${error.message}`);
            console.log(error);
        }
    }
};
