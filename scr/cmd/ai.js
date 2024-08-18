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
        author: 'churchill',
    },
    start: async function({ api, text, event, reply }) {
        const customPrompt = text.join(' ');

        if (!customPrompt) {
            return reply('Please provide a question.');
        }

        const apiUrl = `https://asmit-docs.onrender.com/Gpt?prompt=${encodeURIComponent(customPrompt)}`;

        api.setMessageReaction("🔄", event.messageID, () => {}, true);

        const initialMessage = await new Promise((resolve, reject) => {
            api.sendMessage({
                body: 'Chilli Generating Answer...',
                mentions: [{ tag: event.senderID, id: event.senderID }],
            }, event.threadID, (err, info) => {
                if (err) return reject(err);
                resolve(info);
            }, event.messageID);
        });

        try {
            const response = await axios.get(apiUrl);
            const gptResponse = response.data;

            // Fetch the user's name if not already set
            const senderName = event.senderName || (await api.getUserInfo(event.senderID))[event.senderID].name || 'Unknown User';

            // Get the current date and time in the correct timezone
            const currentDate = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' });
            const currentDateObj = new Date(currentDate);  // Convert to Date object for easier manipulation

            const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const dayName = daysOfWeek[currentDateObj.getDay()];
            const timeString = currentDateObj.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });

            const formattedResponse = `
🤖 Chilli Response
━━━━━━━━━━━━━━━━━━
${gptResponse.trim()}
━━━━━━━━━━━━━━━━━━
👤 Asked By: ${senderName}
🕒 Respond Time: ${dayName} ${timeString}
            `;

            await api.editMessage(formattedResponse.trim(), initialMessage.messageID);
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
