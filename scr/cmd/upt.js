const axios = require("axios");

module.exports.start = async function ({ text, reply }) {
  const time = process.uptime();
  const hours = Math.floor(time / (60 * 60));
  const minutes = Math.floor((time % (60 * 60)) / 60);
  const seconds = Math.floor(time % 60);

  const id = Math.floor(Math.random() * 800) + 1;

  const gh = "chilli bot";
  const insta = "churchilli";
  const fb = "Churchill Ag";
  const bname = global.deku.BOTNAME;

  try {
    const res = (
      await axios.get(
        `${global.deku.ENDPOINT}/canvas/uptime?id=${id}&instag=${insta}&ghub=${gh}&fb=${fb}&hours=${hours}&minutes=${minutes}&seconds=${seconds}&botname=${bname}`,
        {
          responseType: "stream",
        }
      )
    ).data;

    return reply({
      body:
        "UPTIME: " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds +
        "\nCharacter ID: " +
        id +
        "\nBot Name: " +
        bname,
      attachment: res,
    });
  } catch (error) {
    console.error("Error fetching uptime image:", error.message);
    
    // Fallback: Sending text-only reply if the image fetch fails
    reply({
      body: 
        "Failed to retrieve the uptime image.\n" +
        "Here's the text-based uptime report instead:\n" +
        "UPTIME: " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds +
        "\nCharacter ID: " +
        id +
        "\nBot Name: " +
        bname,
    });
  }
};

module.exports.config = {
  name: "upt",
  prefix: false,
  accessibleby: 0,
  description: "Upt",
  credits: "Deku",
  category: "system",
  cooldown: 0,
};
