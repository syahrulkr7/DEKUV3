module["exports"] = class {

  static config = {

    name: "talk",

    description: "Talk to Mr Beast AI",

    prefix: true,

    accessableby: 0,

    usage: "[ask]",

    author: "Deku",

    cooldown: 0

  };

  static async start({ reply, text }) {

    const axios = require("axios"),

      fs = require("fs"),

      gif = __dirname + "/cache/beast.mp3";

    try {

      let em = text[0];

      if (!em) return reply("Missing prompt!");
      reply('Mr. Beast AI is answering...');

    /*  let p = `Prompt: MrBeast Challenge

**Style:**

* Enthusiastic and energetic

* Informal and conversational (uses slang)

* Exaggerated and dramatic for comedic effect

* First-person perspective (as MrBeast)

**Content:**

* **Intro:** Start with a high-energy greeting and introduce the video with a teaser about a crazy challenge. 

* **Challenge Description:** Describe the challenge in detail, emphasizing its absurdity and the large sum of money involved for the winner. 

* **Inner Monologue (Optional):** Include quick cuts with MrBeast whispering to himself or speaking directly to the camera, expressing his excitement and thoughts about the challenge. 

* **Charity Segment (Optional):** Briefly mention that a portion of the video's ad revenue will go to charity.

* **Call to Action:** End with a strong call to action, urging viewers to like, subscribe, and watch to see the outcome of the challenge.

**Additional Notes:**

* You can replace "(insert challenge concept here)" with a specific outrageous idea for the challenge. 

* Feel free to include bracketed text with specific instructions or details for the GPT to follow within the prompt. 

* GPT can generate different sections of the video script based on these prompts. 

Here's an example:

**Prompt 1: Intro**

> Yo, what is up everybody! MrBeast here, back with another crazy challenge that's gonna blow your mind! Today, we're taking things to a whole new level with a challenge so epic, so out-of-this-world, that it'll have you saying 'WTH is MrBeast on this time?' But hey, that's what you guys love, right? 

**Prompt 2: Challenge Description**

> Alright, alright, here's the deal. I've gathered some of my best friends (points dramatically to bewildered friends) and we're gonna be facing off in an epic... [who can build the tallest tower out of only marshmallows in 30 minutes]. The twist? The loser... well, let's just say they're gonna be in for a SHOCKING surprise (evil grin). But of course, there's gonna be a MASSIVE amount of cash on the line for the winner. We're talking life-changing money, people! 

`*/

      let p = `Your name should be Mr Beast (You probably know Mr. Beast, right?) then pretend it's you and then imitate how he speaks and responds to the question, you must also love the challenge and the prize for those who participate. With so much wealth you don't know what to do with your money.

      **Style:**

* Enthusiastic and energetic

* Informal and conversational (uses slang)

* Exaggerated and dramatic for comedic effect`;

        const data = {

    messages: [

      {

        content: p,

        role: 'system'

      },

      {

        content: em,//'who are you',

        role: 'user',

      }

    ],

    id: '',

    previewToken: null,

    userId: '',

    codeModelMode: true,

    agentMode: [],

    trendingAgentMode: [],

    isMicMode: false,

    isChromeExt: false,

    githubToken: null,

    webSearchMode: false, // mode

    maxTokens: '10240',

  };

      const response = await axios.post('https://www.blackbox.ai/api/chat', data);

      const result = response.data

      const au = (await axios.get('https://www.api.vyturex.com/beast?query=' + result)).data;

      const auu = au.audio;

      const audio = (await axios.get(auu, {

        responseType: "arraybuffer"

      })).data;

      fs.writeFileSync(gif, Buffer.from(audio, "utf-8"));

      return reply({

        attachment: fs.createReadStream(gif)

      }, () => fs.unlinkSync(gif));

      

    } catch (w) {

      return reply(w["message"]);

    }

  }

};