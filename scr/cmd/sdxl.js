module.exports = {
  config: {
    name: "sdxl",
    description: "Generate image with SDXL",
    accessableby: 0,
    prefix: false,
    usage: "prompt _ style (optional)",
    cooldown: 3
  },
  start: async function ({ reply, text }) {
    const axios = require("axios")
    if (!text[0]) return reply("Missing type or prompt!");
    let styles, prompts;
    const content = text

      .join(" ")

      .split("_")

      .map((item) => (item = item.trim()));

    let prompt = content[0];

    let style = content[1];
    if (!prompt)
      return reply(
        "Missing prompt!\n\nUsage: " +
          this.config.name +
          " dog _ 1" +
          "\n\nTo see the available styles just type " +
          +this.config.name +
          " list",
      );
    
    if (text[0] == "list") {
      let msg =
        "[ AVAILABLE IMAGE STYLES ]\n\nSDXL\n1. Anime\n2. Fantasy\n3. Pencil\n4. Digital\n5. Vintage\n6. 3D (render)\n7. Cyberpunk\n8. Manga\n9. Realistic\n10 Demonic\n11. Heavenly\n12. Comic\n13. Robotic";
      return reply(msg);
    }
    if (!style) {
      styles = prompt
    }
    reply('⏳ Generating...');
    try {
      const url = "https://weopi.com/aiImages/StableDiffusion";
      const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
      };
    switch (style) {
      case "1":
        styles =
          "anime character. anime style, key visual,  vibrant, studio anime, highly detailed, ";
        break;
      case "2":
        styles =
          "fantasy style, soft, semi realistic, fantasy, extremely detailed, ";
        break;
      case "3":
        styles = "hyper realistic art, pencil drawing of ";
        break;
      case "4":
        styles =
          "style is digital art, prompt, highly detailed, 8k, high clarity, ";
        break;
      case "5":
        styles = "Vintage-style, soft focus, ";
        break;
      case "6":
        styles =
          "3d with cartoon style, 8k, clear background, model, render style, CGI style, mini style, ";
        break;
      case "7":
        styles =
          "cyberpunk style with cyberpunk city background, highly detailed, ";
        break;
      case "8":
        styles = "manga style with color, highly detailed, ";
        break;
      case "9":
        styles =
          "super realistic style, highly detailed, high quality, the background is based on a prompt, soft focus, centered, 8k,";
        break;
      case "10":
        styles =
          "dark red theme, demonic style, dark, extremely detailed, more on satanic theme ";
        break;
      case "11":
        styles =
          "heavenly light style, more on faith, goddesses, Heaven theme, extremely detailed ";
        break;
      case "12":
        styles =
          "A Scene from a comic book set in the 1940s style, look like from a comic book, ";
        break;
      case "13":
        styles =
          "Robotic/android/technology/cyborg style, more on technology theme, extremely detailed, the background is based on prompt, a robotic version of ";
        break;
    }
      prompts = styles + prompt;
      
    const rest = (
      await axios.post(
        url,
        {
          prompt: prompts,
        },
        {
          headers,
        },
      )
    ).data;
    const image = (
      await axios.get("https://weopi.com/" + rest.image_urls[0], {
        responseType: "stream",
      })
    ).data;
      return reply({ attachment: image });
    } catch (e) {
      return reply(e.message);
    }
  },
};
