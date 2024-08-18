const axios = require('axios');

module.exports = {
    config: {
        name: 'ai', // name of the command
        description: 'Interact with the Gemini', // description of the command
        usage: 'ai [custom prompt] (attach image or not)', // usage of the command
        cooldown: 3, // cooldown in seconds
        accessableby: 0, // 0 for everyone, 1 for bot owner/admin
        category: 'AI', // category of the command
        prefix: false, // command requires a prefix
    },
    start: async function({ api, text, event, reply }) {
        const attachment = event.messageReply?.attachments[0] || event.attachments[0];
        const customPrompt = text.join(' ');

        if (!customPrompt && !attachment) {
            return reply('Please provide a prompt or attach a photo for the AI to analyze.');
        }

        let apiUrl = 'https://ggwp-ifzt.onrender.com/gemini?';

        if (attachment && attachment.type === 'photo') {
            const prompt = customPrompt || 'describe this photo';
            const imageUrl = attachment.url;
            apiUrl += `prompt=${encodeURIComponent(prompt)}&url=${encodeURIComponent(imageUrl)}`;
        } else {
            apiUrl += `prompt=${encodeURIComponent(customPrompt)}`;
        }

        const initialMessage = await new Promise((resolve, reject) => {
            api.sendMessage({
                body: '🔍 Processing your request...',
                mentions: [{ tag: event.senderID, id: event.senderID }],
            }, event.threadID, (err, info) => {
                if (err) return reject(err);
                resolve(info);
            }, event.messageID);
        });

        try {
            const response = await axios.get(apiUrl);
            const aiResponse = response.data.gemini;

            const formattedResponse = `
✨ 𝙲𝚑𝚒𝚕𝚕𝚒 𝚁𝚎𝚜𝚙𝚘𝚗𝚜𝚎
━━━━━━━━━━━━━━━━━━
${aiResponse.trim()}
━━━━━━━━━━━━━━━━━━
-𝙱𝚒𝚗𝚐 𝙲𝚑𝚞𝚛𝚌𝚑𝚒𝚕𝚕
            `;

            await api.editMessage(formattedResponse.trim(), initialMessage.messageID);

        } catch (error) {
            console.error('Error:', error);
            await api.editMessage('An error occurred, please try using the "ai2" command.', initialMessage.messageID);
        }
    },
    auto: async function({ api, event, text, reply }) {
        // If you want to implement auto-response logic
    }
};
