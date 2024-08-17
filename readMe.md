# FACEBOOK MESSENGER BOT
# THIS BOT WAS MADE BY DEKU
### Contact
- **Facebook:** [Joshua Sy](https://facebook.com/joshg101)

### EXAMPLE ON HOW TO MAKE COMMAND.

```javascript
module.exports = {
  config: {
    name: "", // name of the command
    description: "", // description of the command
    usage: "", // usage of the command
    cooldown: 5, // a cooldown for the command (default is 1 second)
    accessableby: 0, // 0 is for everyone, 1 is for bot owner/admin
    category: "", // category of the command
    prefix: true, // false if the command doesn't need a prefix
    cooldown: 0 // cooldown
  },
  start: async function ({ api, text, react, event, reply, User }) {
    //start is for the command to run
    // text = args
    // react() = function to react to the message
    //reply() = function to reply to the message
    // event = event object
    // api = api object
    // example code
    let userMessage = text.join(" ");
    react("🤖")
    return reply(userMessage)
    
    // example usage of User
    const user = await User(event.senderID);
    let msg = "Name: " + user.name + "\nGender: " + user.gender + "\nFacebook: " + user.uri;
    reply(msg)
  },
  auto: async function ({ api, event, text, reply }) {
    // auto is for auto reply
    // text = args
    // react() = function to react to the message
    //reply() = function to reply to the message
    // event = event object
    // api = api object
    // example code
    if (event.body == "hi") {
      return reply("Hello")
    }
  }
}
```