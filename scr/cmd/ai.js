const axios = require('axios');

async function getAIResponse(prompt, attachment) {
    let apiUrl = 'https://ggwp-ifzt.onrender.com/gemini?';

    if (attachment && attachment.type === 'photo') {
        const imageUrl = attachment.url;
        apiUrl += `prompt=${encodeURIComponent(prompt)}&url=${encodeURIComponent(imageUrl)}`;
    } else {
        apiUrl += `prompt=${encodeURIComponent(prompt)}`;
    }

    try {
        const response = await axios.get(apiUrl);
        return response.data.gemini.trim();
    } catch (error) {
        console.error('Error:', error);
        throw new Error('An error occurred, please try use "ai2" command.');
    }
}

module.exports = {
    config: {
        name: 'ai',
        description: 'Interact with the Gemini AI',
        prefix: true,
        usage: 'ai [custom prompt] (attach image or not)',
        aliases: ['gemini'],
        accessableby: 0,
        cooldown: 3,
    },

    start: async function ({ api, event, args, reply, react }) {
        const attachment = event.messageReply?.attachments[0] || event.attachments[0];
        const customPrompt = args.join(' ');

        if (!customPrompt && !attachment) {
            return reply('Please provide a prompt or attach a photo for the AI to analyze.');
        }

        let prompt = customPrompt;
        if (attachment && attachment.type === 'photo' && !customPrompt) {
            prompt = 'describe this photo';
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
            const aiResponse = await getAIResponse(prompt, attachment);

            const formattedResponse = `
✨ 𝙲𝚑𝚒𝚕𝚕𝚒 𝚁𝚎𝚜𝚙𝚘𝚗𝚜𝚎
━━━━━━━━━━━━━━━━━━
${aiResponse}
━━━━━━━━━━━━━━━━━━
-𝙱𝚒𝚗𝚐 𝙲𝚑𝚞𝚛𝚌𝚑𝚒𝚕𝚕
            `.trim();

            await api.editMessage(formattedResponse, initialMessage.messageID);
        } catch (error) {
            await api.editMessage(error.message, initialMessage.messageID);
        }
    },
};
