module.exports = {
  config: {
    name: "t",
    description: "test",
    prefix: false,
    usage: "[test]",
    accessableby: 0,
    cooldown: 0
  },
  start: async function ({ event, reply, User }) {
const user = await User(event.senderID);
let msg = "Name: " + user.name + "\nGender: " + user.gender + "\nFacebook: " + user.uri;
reply(msg)
  }
}