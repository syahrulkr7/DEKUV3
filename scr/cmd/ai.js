const axios = require('axios');

module.exports = {
    config: {
        name: 'ai',
        description: 'Interact with the Churchill GPT AI',
        usage: 'ai [question]',
        cooldown: 3,
        accessableby: 0, 
        category: 'AI',
        prefix: false,
        author: 'Churchill'
    },
    start: async function({ api, event, text, reply }) {
        const question = text.join(' ');

        if (!question) {
            return reply('Please provide a question, for example: tas what is the meaning of life?');
        }

        const initialMessage = await new Promise((resolve, reject) => {
            api.sendMessage({
                body: '🤖 𝙲𝚑𝚒𝚕𝚕𝚒 𝙰𝚗𝚜𝚠𝚎𝚛𝚒𝚗𝚐...',
                mentions: [{ tag: event.senderID, id: event.senderID }],
            }, event.threadID, (err, info) => {
                if (err) return reject(err);
                resolve(info);
            }, event.messageID);
        });

        try {
            const response = await axios.get('https://asmit-docs.onrender.com/Gpt', {
                params: { prompt: question }
            });

            const aiResponse = response.data;
            const responseString = aiResponse.reply ? aiResponse.reply : 'No result found.';

            // Fetch user's name to include in the response
            const userInfo = await new Promise((resolve, reject) => {
                api.getUserInfo(event.senderID, (err, ret) => {
                    if (err) return reject(err);
                    resolve(ret[event.senderID].name);
                });
            });

            const formattedResponse = `
🤖 𝙲𝚑𝚒𝚕𝚕𝚒 𝙶𝚙𝚝
━━━━━━━━━━━━━━━━━━
${responseString}
━━━━━━━━━━━━━━━━━━
👤 𝙰𝚜𝚔𝚎𝚍 𝚋𝚢: ${userInfo}
            `;

            await api.editMessage(formattedResponse.trim(), initialMessage.messageID);

        } catch (error) {
            console.error('Error:', error);
            await api.editMessage('An error occurred, please try again later.', initialMessage.messageID);
        }
    },
    auto: async function({ api, event, text, reply }) {
        // Optional: Add auto-response logic here if needed
    }
};
