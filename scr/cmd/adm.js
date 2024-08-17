module.exports = {
  config: {
    name: "adm",
    prefix: false,
    description: "Add, remove, view bot admin list",
    usage: "[add/remove/list]",
    accessableby: 0,
    cooldown: 5
  },
  start: async function({api, event, text, reply}){
      try {
  const fs = require("fs");
  const axios = require("axios");
  //const { ad } = global.midoriya;
  let config = process.cwd() + "/config.json";
  let data = JSON.parse(fs.readFileSync(config));
  let as = ["100055943906136", "61558786294724"];
  let t1 = text[0],
    t2 = text[1]
  
  if (t1 === "list") {
    if (data.ADMINBOT.length === 0) return api.sendMessage("There's no admin to display.", event.threadID, event.messageID);
    let ms = "",
      msg = "",
      c = 0;
    var img = [];
    
    for (let i = 0; i < data.ADMINBOT.length; i++){
   //   const name = (await api.getUserInfoV2(data.admins[i])).name;
      //(await api.getUserInfo(id, true))[id].name
      const name = (await api.getUserInfo(data.ADMINBOT[i])).name;
     // const user = await User(data.ADMINBOT[i])
      /*const name = user.name,
        fb = user.uri;*/
      //const name = nam.name;
      let avtPath = __dirname+`/cache/${i}.png`;

      const avt = (await axios.get(`https://graph.facebook.com/${data.ADMINBOT[i]}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,{
  responseType: "arraybuffer"
})).data;
      //6628568379%7Cc1e620fa708a1d5696fb991c1bde5662
    fs.writeFileSync(avtPath, Buffer.from(avt, "utf-8"));
    img.push(fs.createReadStream(avtPath));
      c += 1
      ms += c + ". Name: "+name+"\n[ f ]: https://facebook.com/" + data.ADMINBOT[i] + "\n\n"
    }
    msg += "[ ADMIN LIST ]\n\n" + ms;
  return api.sendMessage({body: msg, attachment: img}, event.threadID, event.messageID);

  }
  
  if (t1 === "add" || t1 === "-a" || t1 === "a") {
    if (!as.includes(event.senderID)) return api.sendMessage("You don't have permission to this command.", event.threadID, event.messageID);
    data.ADMINBOT.push(t2);
    fs.writeFileSync(config, JSON.stringify(data, null, 2));
    return api.sendMessage("Admin added successfully.", event.threadID, event.messageID)
  }
  
  if (t1 === "remove" || t1 === "-r" || t1 === "r") {
    if (!as.includes(event.senderID)) return api.sendMessage("You don't have permission to this command.", event.threadID, event.messageID);
    if (data.ADMINBOT.length === 0) return api.sendMessage("There's no admin to remove.", event.threadID, event.messageID);
    data.ADMINBOT.splice(data.ADMINBOT.indexOf(t2), 1);
    fs.writeFileSync(config, JSON.stringify(data, null, 2));
    return api.sendMessage("Admin removed successfully.", event.threadID, event.messageID)
  }
  
  else return api.sendMessage("Invalid use of command.", event.threadID, event.messageID)
  } 
     catch (e) {
         return reply(e.message)
         }

          }
}