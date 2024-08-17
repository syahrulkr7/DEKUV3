module["exports"] = class {
  static config = {
    name: "ad",
    description: "ad",
    prefix: true,
    accessableby: 0,
    author: "Deku",
    cooldown: 0,
  };
  static async start({ reply, event, currencies }) {
    const date = new Date().toISOString();
    currencies("increase", event.senderID, 200, date).then(ok => {
      reply(ok)
    })
  }
};
