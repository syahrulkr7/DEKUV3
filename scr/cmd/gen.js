module.exports.start = async function({api, event, text, reply}){
let t = text.join(" ");
if (!t) return reply('Missing prompt!');
reply('Processing request...');
const axios = require('axios');
  const fs = require('fs');
const { Prodia } = require("prodia.js");
try {
const prodia = new Prodia("367c6ef4-2c26-4222-a5a9-c8cf13a6e7a7");
const bestModel = [ "absolutereality_V16.safetensors [37db0fc3]", "absolutereality_v181.safetensors [3d9d4d2b]", "amIReal_V41.safetensors [0a8a2e61]", "ICantBelieveItsNotPhotography_seco.safetensors [4e7a3dfd]"];
let url = [];
  let h;
  let pathh;
  let image = []
  for (let i of bestModel){
    const generate = await prodia.generateImage({
         prompt: t,
        model: i,
        negative_prompt: "BadDream, (UnrealisticDream:1.3), sex, fuck, dick, pussy, ass, boobs, nudes",
        sampler: "DPM++ SDE Karras",
        cfg_scale: 9,
        steps: 30,
        aspect_ratio: "portrait"
    })

    while (generate.status !== "succeeded" && generate.status !== "failed") {
        new Promise((resolve) => setTimeout(resolve, 250));

        const job = await prodia.getJob(generate.job);

        if (job.status === "succeeded") {
           console.log(job);
            url.push(job.imageUrl)
            break;
        }
      }
    }
   console.log(url)
  let c = 0;
for (let urls of url){
  c += 1
   pathh = __dirname+"/cache/generated-"+c+".png";
  //const writer = fs.createWriteStream(pathh);
h = (await axios.get(urls,{
  responseType: "arraybuffer"
})).data;
  //h.data.pipe(writer);
/*await new Promise((resolve, reject) => {
writer.on('finish', resolve);
writer.on('error', reject);
});*/
  fs.writeFileSync(pathh, Buffer.from(h, "utf-8"));
image.push(fs.createReadStream(pathh))
    }
  console.log('Downloaded')
  return api.sendMessage({body: "Here's the results", attachment: image}, event.threadID, event.messageID)
 } catch (e){
return reply(e.message)
   }
}
module.exports.config = {
  name: "gen",
  prefix: false,
  accessableby: 0, 
  description: "Generate image",
  usage: "[text]",
  cooldown: 5
}