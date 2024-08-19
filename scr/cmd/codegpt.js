const axios = require('axios');

module.exports = {
  config: {
    name: 'codegpt',
    description: 'Generate code snippets using CodeGPT',
    usage: 'codegpt [query]',
    cooldown: 3,
    accessableby: 0,
    category: 'Utility',
    prefix: true,
    author: 'Churchill',  // Credit to Churchill
    version: '1.0.0',
  },
  start: async function ({ api, event, text, reply, react }) {
    const pangutana = text.join(' ');

    if (!pangutana) {
      return reply('Palihug og provide og code-related nga pangutana.');
    }

    // Use the global API endpoint
    const chilliHotUrl = `${global.deku.ENDPOINT}/api/codegpt?type=code&lang=nodejs&q=${encodeURIComponent(pangutana)}`;

    await react('💡'); // React with a lightbulb emoji to indicate processing

    const bayotMessage = await new Promise((resolve, reject) => {
      api.sendMessage({
        body: '💡 Nag-generate sa imong code snippet, pogi...',
        mentions: [{ tag: event.senderID, id: event.senderID }],
      }, event.threadID, (err, info) => {
        if (err) return reject(err);
        resolve(info);
      });
    });

    try {
      const chilliMansiResponse = await axios.get(chilliHotUrl);
      const pogiCode = chilliMansiResponse.data.result;

      const karon = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      const formattedDate = karon.toLocaleDateString('en-US', options);

      const formattedResponse = `
💻 𝙲𝚘𝚍𝚎 𝙶𝚎𝚗𝚎𝚛𝚊𝚝𝚎𝚍 𝚋𝚢 𝙲𝚘𝚍𝚎𝙶𝙿𝚃
━━━━━━━━━━━━━━━━━━
${pogiCode.trim()}
━━━━━━━━━━━━━━━━━━
🕒 𝚁𝚎𝚜𝚙𝚘𝚗𝚍 𝚃𝚒𝚖𝚎: ${formattedDate}
      `;

      await react('✅'); // React with a checkmark emoji to indicate completion
      await api.editMessage(formattedResponse.trim(), bayotMessage.messageID);

    } catch (error) {
      console.error('Error:', error);
      await api.editMessage('Naay error sa pag-generate sa code. Palihug og sulayi usab.', bayotMessage.messageID);
    }
  }
};
