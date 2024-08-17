const axios = require('axios')
async function liner(prompt) {
  const url = 'https://linerva.getliner.com/platform/copilot/v3/answer';
  const headers = {
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'content-type': 'application/json',
    'Referer': 'https://getliner.com/',
  };
  const data = {
    spaceId: 18097491,
    "threadId": "53007419",
    "userMessageId": 59420219,
    "userId": 8933542,
    query: prompt,
    agentId: '@liner-pro',
    platform: 'web',
    regenerate: false
  };

  try {
    const response = await axios.post(url, data, { headers });
     { response: response.data };
    const respon = response.data.split('\n');
    const res = JSON.parse(respon[respon.length - 2]);
    return res.answer;
  } catch (error) {
    return error.message;
  }
}

module.exports = {

  config: {

    name: "ai2",

    accessableby: 0,

    description: "Talk to Linerva AI",

    usage: "ask",

    prefix: false,

    credits: "Deku"

  },

  start: async function ({ text, reply }) {
 let p = text.join(' ')
  if (!p) return reply('Missing input!');
  liner(p).then(re => {
     return reply(re)
      })

   }

}