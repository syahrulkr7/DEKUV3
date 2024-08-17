const axios = require('axios');

async function getAIResponse(question) {
    try {
        const response = await axios.get('https://hercai.onrender.com/v3/hercai', {
            params: { question }
        });
        return response.data.reply || 'No result found.';
    } catch (error) {
        console.error('Error:', error);
        throw new Error('An error occurred, please try again later.');
    }
}

module.exports = {
    config: {
        name: 'ai2',
        description: 'Interact with the Hercai AI',
        prefix: true,
        usage: 'ai2 [question]',
        aliases: ['ai2'],
        accessableby: 0,
        cooldown: 3,
    },

    start: async function ({ api, event, args, reply, react }) {
        const question = args.join(' ');

        if (!question) {
            return reply('Please provide a question, for example: ai2 what is love?');
        }

        const initialMessage = await new Promise((resolve, reject) => {
            api.sendMessage({
                body: '🤖 Ai answering...',
                mentions: [{ tag: event.senderID, id: event.senderID }],
            }, event.threadID, (err, info) => {
                if (err) return reject(err);
                resolve(info);
            }, event.messageID);
        });

        try {
            const aiResponse = await getAIResponse(question);

            const formattedResponse = `
🤖 Hercai AI
━━━━━━━━━━━━━━━━━━
${aiResponse}
━━━━━━━━━━━━━━━━━━
-𝚆𝙰𝙶 𝙼𝙾 𝙲𝙾𝙿𝚈 𝙻𝙰𝙷𝙰𝚃 𝙽𝙶 𝚂𝙰𝙶𝙾𝚃 𝙺𝚄𝙽𝙶 𝙰𝚈𝙰𝚆 𝙼𝙾𝙽𝙶 𝙼𝙰𝙷𝙰𝙻𝙰𝚃𝙰
━━━━━━━━━━━━━━━━━━
If you want to donate for the server, just PM or Add the developer: [https://www.facebook.com/Churchill.Dev4100]
            `.trim();

            await api.editMessage(formattedResponse, initialMessage.messageID);
        } catch (error) {
            await api.editMessage(error.message, initialMessage.messageID);
        }
    },
};
