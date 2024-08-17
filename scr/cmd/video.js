const path = require("path");
const axios = require("axios");
const fs = require("fs");

async function downloadVideo(videoUrl, videoPath) {
    const videoResponse = await axios.get(videoUrl, { responseType: "arraybuffer" });
    fs.writeFileSync(videoPath, Buffer.from(videoResponse.data));
}

module.exports = {
    config: {
        name: "video",
        version: "9",
        credits: "Cliff", // API by Jonell & Churo
        description: "Search video from YouTube",
        prefix: false,
        usage: "video [search]",
        accessableby: 0,
        cooldown: 9,
    },

    start: async function ({ api, args, event, reply, react }) {
        try {
            const searchQuery = args.join(" ");
            if (!searchQuery) {
                return reply("Usage: video <search text>");
            }

            const ugh = await reply(`⏱️ | Searching, for '${searchQuery}' please wait...`);

            react("🕥");

            const response = await axios.get(`https://chorawrs-sheshh.vercel.app/video?search=${encodeURIComponent(searchQuery)}`);

            const data = response.data;
            const videoUrl = data.downloadUrl;
            const title = data.title;
            const thumbnail = data.thumbnail;

            const videoPath = path.join(__dirname, "cache", "video.mp4");

            await downloadVideo(videoUrl, videoPath);

            react("✅");

            await api.sendMessage({
                body: `Here's your video, enjoy!🥰\n\nTitle: ${title}\nImage: ${thumbnail}`,
                attachment: fs.createReadStream(videoPath),
            }, event.threadID, event.messageID);

            fs.unlinkSync(videoPath);
            api.unsendMessage(ugh.messageID);

        } catch (error) {
            reply(`error: ${error.message}`);
            console.error(error);
        }
    },
};
