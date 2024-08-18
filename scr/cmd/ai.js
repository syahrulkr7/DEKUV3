const axios = require('axios');

module.exports = {
    config: {
        name: 'ai',
        description: 'Interact with GPT API to generate responses.',
        usage: 'gpt [custom prompt]',
        cooldown: 3,
        accessableby: 0,
        category: 'AI',
        prefix: false,
    },
    start: async function({ api, text, event, reply }) {
        const customPrompt = text.join(' ');

        if (!customPrompt) {
            return reply('Please provide a 𝚚𝚞𝚎𝚜𝚝𝚒𝚘𝚗.');
        }

        const apiUrl = `https://asmit-docs.onrender.com/Gpt?prompt=${encodeURIComponent(customPrompt)}`;

        // React to the user's original message with a loading emoji
        api.setMessageReaction("🔄", event.messageID, () => {}, true);

        // Send the initial response
        const initialMessage = await new Promise((resolve, reject) => {
            api.sendMessage({
                body: '𝙲𝚑𝚒𝚕𝚕𝚒 𝙶𝚎𝚗𝚎𝚛𝚊𝚝𝚒𝚗𝚐 𝙰𝚗𝚜𝚠𝚎𝚛...',
                mentions: [{ tag: event.senderID, id: event.senderID }],
            }, event.threadID, (err, info) => {
                if (err) return reject(err);
                resolve(info);
            }, event.messageID);
        });

        try {
            const response = await axios.get(apiUrl);
            const gptResponse = response.data;

            const currentDate = new Date();
            const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const dayName = daysOfWeek[currentDate.getDay()];
            const timeString = currentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

            const senderName = event.senderName || 'Unknown User';

            const formattedResponse = `
🤖 𝙲𝚑𝚒𝚕𝚕𝚒 𝚁𝚎𝚜𝚙𝚘𝚗𝚜𝚎
━━━━━━━━━━━━━━━━━━
${gptResponse.trim()}
━━━━━━━━━━━━━━━━━━
👤 𝙰𝚜𝚔𝚎𝚍 𝙱𝚢: ${senderName}
🕒 𝚁𝚎𝚜𝚙𝚘𝚗𝚍 𝚃𝚒𝚖𝚎: ${dayName} ${timeString}
            `;

            // Edit the initial message with the GPT response
            await api.editMessage(formattedResponse.trim(), initialMessage.messageID);

            // React to the user's original message with a checkmark
            api.setMessageReaction("✔️", event.messageID, () => {}, true);

        } catch (error) {
            console.error('Error:', error);
            await api.editMessage('An error occurred while fetching the GPT response. Please try again later.', initialMessage.messageID);
        }
    },
    auto: async function({ api, event, text, reply }) {
        // Implement any automatic actions here if needed
    }
};
