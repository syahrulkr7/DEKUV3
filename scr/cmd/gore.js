const axios = require('axios');
const fs = require('fs');
const path = require('path');
const os = require('os'); // For handling temporary directory

module.exports = {
    config: {
        name: "gore",
        description: "Fetch a random gore video from the API",
        usage: "!gore",
        cooldown: 5,
        accessableby: 0,
        category: "Gore",
        prefix: true
    },
    start: async function ({ api, event, reply }) {
        try {
            await api.sendMessage({ body: "Sending, please wait..." }, event.threadID);
            await api.setMessageReaction("⏳", event.messageID, true);

            const response = await axios.get("https://ggwp-ifzt.onrender.com/api/randgre");
            const data = response.data.result;

            let message = `**${data.title}**\n\n`;
            message += `Source: ${data.source}\n`;
            message += `Tag: ${data.tag}\n`;
            message += `Upload Date: ${data.upload}\n`;
            message += `Author: ${data.author}\n`;
            message += `Views: ${data.view}\n`;
            message += `Votes: ${data.vote}\n`;
            message += `Comments: ${data.comment}\n`;

            const videoUrl = data.video1 || data.video2;
            if (!videoUrl) {
                return reply("No video available in the response.");
            }

            const videoPath = path.join(os.tmpdir(), 'randomvideogore.mp4');

            // Stream the video and save it to a file
            const videoResponse = await axios({
                url: videoUrl,
                method: 'GET',
                responseType: 'stream',
                timeout: 30000 // 30 seconds timeout
            });

            const writer = fs.createWriteStream(videoPath);
            videoResponse.data.pipe(writer);

            // Ensure the video is completely downloaded before proceeding
            await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });

            // Log file size
            const stats = fs.statSync(videoPath);
            console.log(`Video downloaded: ${stats.size} bytes`);

            // Send the video file as an attachment
            await api.sendMessage({
                body: message,
                attachment: fs.createReadStream(videoPath)
            }, event.threadID, (err) => {
                if (err) {
                    console.error("Error sending video:", err);
                } else {
                    // Delete the video file after sending
                    fs.unlink(videoPath, (err) => {
                        if (err) {
                            console.error("Failed to delete video:", err);
                        }
                    });
                }
            });

            await api.setMessageReaction("✅", event.messageID, true);

        } catch (error) {
            console.error("Error fetching or sending video:", error);
            await api.setMessageReaction("❌", event.messageID, true);
            return reply("There was an error fetching the random gore video.");
        }
    }
};
