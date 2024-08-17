const axios = require('axios');

async function getGeminiResponse(apiUrl) {
    try {
        const response = await axios.get(apiUrl);
        return response.data.gemini; // Access the "gemini" key directly
    } catch (error) {
        console.error('Error fetching Gemini AI response:', error);
        throw new Error('Failed to communicate with Gemini AI.');
    }
}

module.exports = {
    config: {
        name: 'ai',
        version: '1.0.0',
        role: 0,
        hasPrefix: false,
        aliases: ['gemini'],
        description: 'Interact with the Gemini AI',
        usage: 'ai [custom prompt] (attach image or not)',
        credits: 'churchill',
        cooldown: 3,
    },

    start: async function ({ api, event, args, reply }) {
        const attachment = event.messageReply?.attachments[0] || event.attachments[0];
        const customPrompt = args.join(' ');

        if (!customPrompt && !attachment) {
            return api.sendMessage('Please provide a prompt or attach a photo for the AI to analyze.', event.threadID, event.messageID);
        }

        let apiUrl = 'https://ggwp-ifzt.onrender.com/gemini?';

        if (attachment && attachment.type === 'photo') {
            const prompt = customPrompt || 'describe this photo';
            const imageUrl = attachment.url;
            apiUrl += `prompt=${encodeURIComponent(prompt)}&url=${encodeURIComponent(imageUrl)}`;
        } else {
            apiUrl += `prompt=${encodeURIComponent(customPrompt)}`;
        }

        let initialMessage;
        try {
            initialMessage = await new Promise((resolve, reject) => {
                api.sendMessage({
                    body: '🔍 Processing your request...',
                    mentions: [{ tag: event.senderID, id: event.senderID }],
                }, event.threadID, (err, info) => {
                    if (err) return reject(err);
                    resolve(info);
                }, event.messageID);
            });

            const aiResponse = await getGeminiResponse(apiUrl);
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
            if (initialMessage) {
                await api.editMessage('An error occurred, please try using the "ai2" command.', initialMessage.messageID);
            } else {
                reply('An error occurred, please try using the "ai2" command.');
            }
        }
    },
};
