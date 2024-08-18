const axios = require("axios");

module.exports = {
  config: {
    name: "prodia",
    description: "Text to Image generation",
    usage: "your prompt | type models here",
    cooldown: 5,
    accessableby: 0,
    category: "image",
    prefix: true,
  },
  start: async function ({ api, text, react, event, reply }) {
    const promptText = text.join(' ');

    if (!promptText) {
      return reply("Please provide a prompt with models");
    }

    const [prompt, model] = promptText.split('|').map((part) => part.trim());
    const models = model || "2";
    const baseURL = `https://smfahim.onrender.com/prodia?prompt=${prompt}&model=${models}`;

    react("⏳");

    try {
      const attachment = await global.utils.getStreamFromURL(baseURL);
      reply({ attachment });
      react("✅");
    } catch (error) {
      reply("Failed to generate image. Please try again.");
      react("❌");
    }
  },
  auto: async function ({ event, reply }) {
    // Auto functionality can be added here if needed.
  }
};
