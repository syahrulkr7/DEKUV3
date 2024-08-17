module.exports = {
  config: {
    name: "uid",
    accessableby: 0,
    description: "Get user ID",
    usage: "id/reply/group/all",
    prefix: false,
    credits: "Deku",
    cooldown: 0
  },
  start: async function ({ text, reply, event, api }) {
    let id;
    if (!text[0]) {
      id = event.senderID
    } 
    if (text[0]) {
      if (text[0].startsWith('https://')) {
        const idd = await api.getUID(text[0]);
        return api.shareContact(idd, idd, event.threadID)
      }
    }
    if (event.type == "message_reply") {
      id = event.messageReply.senderID;
    }
    let t = text.join(' ')
    if (t.indexOf('@') !== -1) {
      id = Object.keys(event.mentions)[0]
    }
    let m = '', c = 0;
    if (t == "all") {
     for (let i of event.participantIDs) {
       c += 1
       m += `${c}. ${i}\n`
     }
      return reply(m)
    }
    if (t == "-g" || t == "group") {
      id = event.threadID
       return reply(id)
    }
    return api.shareContact(id, id, event.threadID)

  }
}