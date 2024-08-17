// PACKAGE
const example = ["https://i.imgur.com/3g6mj3M.jpg", "https://i.imgur.com/lRRpm6V.jpg", "https://i.imgur.com/YLcUU8F.jpg"];
let examples = []
const { textpro, ephoto, photooxy } = require("mumaker"),
  axios = require("axios"),
  fs = require("fs");
var warn = "Missing type or text";
var warn2 = "Missing text";
let mpath = __dirname + "/cache/maker.png";
let vpath = __dirname + "/cache/maker.mp4";

//DOWNLOADER
async function dlmaker(url, path) {
  const response = (
    await axios.get(url, {
      responseType: "arraybuffer",
    })
  ).data;
  fs.writeFileSync(path, Buffer.from(response, "utf-8"));
}

module.exports = {
  config: {
    name: "maker",
    credits: "Deku",
    description: "Logo maker",
    usage:
      "[<type>|<number>| <text> or <text1 | text2>]\nEx: maker photooxy | 1 | Joshua or maker photooxy | 12 | Joshua | Sy",
    prefix: false,
    accessibleby: 0,
    category: "edit-image",
    cooldown: 0
  },
  start: async function ({ reply, text, react }) {
    let msg = "";
    var url;
    //var text2;
    var theme;
    const textt = text.join(" ");
    const tex = textt.split("|").map((item) => (item = item.trim()));
    let text1 = tex[0];
    let text2 = tex[1];
    let text3 = tex[2];
    let text4 = tex[3];
    let c = 0;
    try {
    if (!textt){
      for (let g of example){
        const res = (await axios.get(g, {
          responseType: "arraybuffer"
        })).data;
        c += 1;
        let path = __dirname+"/cache/"+c+".png";
        fs.writeFileSync(path, Buffer.from(res, "utf-8"));
      examples.push(fs.createReadStream(path));
      }
      return reply({
        body: warn + "\nTry to use " + this.config.name + " " + this.config.usage+"\n\nHere's the example of ephoto, textpro, and photooxy", attachment: examples});
    }
      if (textt == "list") {
        msg += "LIST OF AVAILABLE TYPES\n\n";
        msg += "1. photooxy (15 effects)\n";
        msg += "2. textpro (17 effects)\n";
        msg += "3. ephoto (38 effects)\n\n";
        msg += "Use “maker <type> list” to view the available themes";
        return reply(msg);
      }
      if (text1 == "photooxy") {
        if (!text2)
          return reply(warn + "\nTry to use maker " + this.akane.usages);
        if (text2 == "list") {
          msg += "[ PHOTOOXY THEME LIST ]\n\n";
          msg += "1. blackpink\n";
          msg += "2. blackneon\n";
          msg += "3. glitch\n";
          msg += "4. wolf metal\n";
          msg += "5. glowing neon\n";
          msg += "6. flaming\n";
          msg += "7.embroidery (hello kitty style)\n\n";
          msg += "PAGE 1 OF 2\n\n";
          msg += "CHOOSE NUMBER ONLY";
          return reply(msg);
        } //end of list {}

        if (text2 == "list 2") {
          msg += "[ PHOTOOXY THEME LIST 2 ]\n\n";
          msg += `8. gold metalic 
9. neon metalic
10. harry potter
11. text under orchids flower
12. battlefield
13. pubg
14. naruto
15. graffiti\n\n`;
          msg += "PAGE 2 OF 2\n\n";
          msg += "CHOOSE NUMBER ONLY";
          return reply(msg);
        } //end of list 2
        if (!text3) return reply(warn2);
        switch (text2) {
          case "1":
            theme = "blackpink";
            break;
          case "2":
            theme = "blackneon";
            break;
          case "3":
            theme = "glitch";
          case "4":
            theme = "wolf metal";
            break;
          case "5":
            theme = "glowing neon";
            break;
          case "6":
            theme = "flaming";
            break;
          case "7":
            theme = "embroidery (hello kitty style)";
            break;
          case "8":
            theme = "gold metalic";
            break;
          case "9":
            theme = "neon metalic";
            break;
          case "10":
            theme = "harry potter";
            break;
          case "11":
            theme = "text under orchids flower";
            break;
          case "12":
            theme = "battlefield";
            break;
          case "13":
            theme = "pubg";
            break;
          case "14":
            theme = "naruto";
            break;
          case "15":
            theme = "graffiti";
            break;
          default:
            return reply("choose 1-15 only");
        } //end of switch(text1)

        switch (theme) {
          case "blackpink":
            url =
              "https://photooxy.com/create-blackpink-style-logo-effects-online-for-free-417.html";
            break;
          case "blackneon":
            url =
              "https://photooxy.com/elegant-3d-neon-dark-metal-text-effect-online-free-416.html";
            break;
          case "glitch":
            url =
              "https://photooxy.com/logo-and-text-effects/make-tik-tok-text-effect-375.html";
            break;
          case "wolf metal":
            url =
              "https://photooxy.com/logo-and-text-effects/create-a-wolf-metal-text-effect-365.html";
            break;
          case "glowing neon":
            url =
              "https://photooxy.com/logo-and-text-effects/make-smoky-neon-glow-effect-343.html";
            break;
          case "flaming":
            url =
              "https://photooxy.com/logo-and-text-effects/realistic-flaming-text-effect-online-197.html";
            break;
          case "embroidery (hello kitty style)":
            url =
              "https://photooxy.com/logo-and-text-effects/create-embroidery-text-online-191.html";
            break;
          case "gold metalic":
            url =
              "https://photooxy.com/other-design/create-metallic-text-glow-online-188.html";
            break;
          case "neon metalic":
            url =
              "https://photooxy.com/logo-and-text-effects/illuminated-metallic-effect-177.html";
            break;
          case "harry potter":
            url =
              "https://photooxy.com/logo-and-text-effects/create-harry-potter-text-on-horror-background-178.html";
            break;
          case "text under orchids flower":
            url =
              "https://photooxy.com/logo-and-text-effects/text-under-flower-165.html";
            break;
          case "battlefield":
            url =
              "https://photooxy.com/fps-game-effect/create-battlefield-4-rising-effect-152.html";
            break;
          case "pubg":
            url =
              "https://photooxy.com/battlegrounds/make-wallpaper-battlegrounds-logo-text-146.html";
            break;
          case "naruto":
            url =
              "https://photooxy.com/manga-and-anime/make-naruto-banner-online-free-378.html";
            break;
          case "graffiti":
            url =
              "https://photooxy.com/banner-cover/graffiti-text-cover-222.html";
            break;
          default:
            return (theme =
              "https://photooxy.com/manga-and-anime/make-naruto-banner-online-free-378.html");
        } // end of switch(theme)
        if (text2 == "12" || text2 == "13") {
          if (!text4)
            return reply(
              "This theme require a text 2\nTry to use maker photooxy | number | text1 | text2",
            );
          reply("⏳Processing your request…");
          react("⏳");
          const r = await photooxy(url, [text3, text4]);
          await dlmaker(r.image, mpath);
          return reply({ attachment: fs.createReadStream(mpath) });
        } else {
          reply("⏳Processing your request…");
          react("⏳");
          const r = await photooxy(url, text3);
          await dlmaker(r.image, mpath);
          return reply({ attachment: fs.createReadStream(mpath) });
        }
      } //end of photooxy {}

      if (text1 == "ephoto") {
        if (!text2)
          return reply(warn + "\nTry to use maker " + this.config.usages);
        if (text2 == "list") {
          msg += "[ EPHOTO THEME LIST ]\n\n";
          msg += `[ VIDEO ]\n\n`;
          msg += `1. PUBG lightning
2. logo
3. PUBG glitch
4. tiger logo\n\n`;
          msg += "[ GAMING ]\n\n";
          msg += `5. AOV (random)
6. PUBG cute logo (2 type random)
7. PUBG mascot logo
8. Valorant (random) (ERROR)
9. COD (4 type random)
10. ML (random)
11. LoL (random)
12. AOV 2 (random)
13. LoL 2 (random) (ERROR)
14. AOV 3 (random)\n\n`;
          msg += "PAGE 1 OF 4\n\n";
          msg += "CHOOSE NUMBER ONLY";
          return reply(msg);
        }
        if (text2 == "list 2") {
          msg += "[ EPHOTO THEME LIST 2 ]\n\n";
          msg += `15. LoL YouTube banner (random) (ERROR)
16. AOV, ROV YouTube banner (random) (ERROR)
17. Overwatch2 (random) (ERROR)
18. Among Us (2 text)
19. Among Us 2
20. PUBG Logo (2 type random)
21. Overwatch2 2 (random)
22. Free Fire (random)
23. Free Fire facebook cover (random)
24. LoL Team Fight Tactics (TFT)

PAGE 2 OF 4

CHOOSE NUMBER ONLY`;
          return reply(msg);
        } //end of list 2 {}
        if (text2 == "list 3") {
          msg += "[ EPHOTO THEME LIST 3 ]\n\n";
          msg += "[ TEXT EFFECTS ]\n\n";
          msg += `25. blackpink (random)
26. blackpink 2 (2 text)
27. naruto
28. blackpink 3
29. starwars (random)
30. logo (random 2 text)
31. bear logo
32. graffiti
33. graffiti 2 (2 text)
34. graffiti 3 (2 text)

PAGE 3 OF 4

CHOOSE NUMBER ONLY`;
          return reply(msg);
        } // end of list 3 {}
        if (text2 == "list 4") {
          msg += "[ EPHOTO THEME LIST 4 ]\n\n";
          msg += `35. light futuristic (random)
36. logo gaming (random)
37. logo gaming 2 (random)
38. blue neon logo (random)

PAGE 4 OF 4

CHOOSE NUMBER ONLY`;
          return reply(msg);
        } // end of list 4 {}
        switch (text2) {
          case "1":
            url =
              "https://en.ephoto360.com/lightning-pubg-video-logo-maker-online-615.html";
            break;
          case "2":
            url =
              "https://en.ephoto360.com/free-logo-intro-video-maker-online-558.html";
            break;
          case "3":
            url =
              "https://en.ephoto360.com/create-pubg-style-glitch-video-avatar-554.html";
            break;
          case "4":
            url =
              "https://en.ephoto360.com/create-digital-tiger-logo-video-effect-723.html";
            break;
          case "5":
            url =
              "https://en.ephoto360.com/create-beautiful-shimmering-aov-wallpapers-full-hd-for-mobile-643.html";
            break;
          case "6":
            url =
              "https://en.ephoto360.com/pubg-logo-maker-cute-character-online-617.html";
            break;
          case "7":
            url =
              "https://en.ephoto360.com/pubg-mascot-logo-maker-for-an-esports-team-612.html";
            break;
          case "8":
            url =
              "https://en.ephoto360.com/create-valorant-banner-youtube-online-588.html";
            break;
          case "9":
            url =
              "https://en.ephoto360.com/create-call-of-duty-warzone-youtube-banner-online-548.html";
            break;
          case "10":
            url =
              "https://en.ephoto360.com/make-mobile-legends-wallpaper-full-hd-for-mobile-454.html";
            break;
          case "11":
            url =
              "https://en.ephoto360.com/make-your-own-league-of-legends-wallpaper-full-hd-442.html";
            break;
          case "12":
            url =
              "https://en.ephoto360.com/generate-banner-arena-of-valor-aov-with-name-440.html";
            break;
          case "13":
            url =
              "https://en.ephoto360.com/generate-banner-game-lol-with-rank-boders-439.html";
            break;
          case "14":
            url =
              "https://en.ephoto360.com/amazing-aov-wallpaper-online-full-hd-for-mobile-436.html";
            break;
          case "15":
            url =
              "https://en.ephoto360.com/create-youtube-banner-league-of-legends-online-428.html";
            break;
          case "16":
            url =
              "https://en.ephoto360.com/create-youtube-banner-for-the-aov-rov-game-410.html";
            break;
          case "17":
            url =
              "https://en.ephoto360.com/create-overwatch-2-banner-for-the-online-youtube-channel-782.html";
            break;
          case "18":
            url =
              "https://en.ephoto360.com/create-a-banner-game-among-us-with-your-name-763.html";
            break;
          case "19":
            url =
              "https://en.ephoto360.com/create-a-cover-image-for-the-game-among-us-online-762.html";
            break;
          case "20":
            url =
              "https://en.ephoto360.com/free-pubg-logo-maker-online-609.html";
            break;
          case "21":
            url =
              "https://en.ephoto360.com/make-overwatch-wallpaper-full-hd-for-mobile-575.html";
            break;
          case "22":
            url =
              "https://en.ephoto360.com/create-free-fire-avatar-online-572.html";
            break;
          case "23":
            url =
              "https://en.ephoto360.com/create-free-fire-facebook-cover-online-567.html";
            break;
          case "24":
            url =
              "https://en.ephoto360.com/create-avatar-teamfight-tactics-tft-by-name-online-550.html";
            break;
          case "25":
            url =
              "https://en.ephoto360.com/create-a-blackpink-style-logo-with-members-signatures-810.html";
            break;
          case "26":
            url =
              "https://en.ephoto360.com/create-blackpink-s-born-pink-album-logo-online-779.html";
            break;
          case "27":
            url =
              "https://en.ephoto360.com/naruto-shippuden-logo-style-text-effect-online-808.html";
            break;
          case "28":
            url =
              "https://en.ephoto360.com/online-blackpink-style-logo-maker-effect-711.html";
            break;
          case "29":
            url =
              "https://en.ephoto360.com/create-a-star-wars-character-mascot-logo-online-707.html";
            break;
          case "30":
            url =
              "https://en.ephoto360.com/create-an-online-team-logo-in-black-and-white-style-689.html";
            break;
          case "31":
            url =
              "https://en.ephoto360.com/free-bear-logo-maker-online-673.html";
            break;
          case "32":
            url =
              "https://en.ephoto360.com/create-a-cartoon-style-graffiti-text-effect-online-668.html";
            break;
          case "33":
            url =
              "https://en.ephoto360.com/cute-girl-painting-graffiti-text-effect-667.html";
            break;
          case "34":
            url =
              "https://en.ephoto360.com/create-a-graffiti-text-effect-on-the-wall-online-665.html";
            break;
          case "35":
            url =
              "https://en.ephoto360.com/light-text-effect-futuristic-technology-style-648.html";
            break;
          case "36":
            url =
              "https://en.ephoto360.com/create-logo-team-logo-gaming-assassin-style-574.html";
            break;
          case "37":
            url =
              "https://en.ephoto360.com/free-gaming-logo-maker-for-fps-game-team-546.html";
            break;
          case "38":
            url =
              "https://en.ephoto360.com/create-blue-neon-logo-online-507.html";
            break;
          default:
            return reply("1-39 only.");
        } //end of switch
        if (text2 == "1" || text2 == "2" || text2 == "3" || text2 == "4") {
          reply("⏳Processing your request…");
          react("⏳");
          const r = await ephoto(url, text3);
          await dlmaker(r.image, vpath);
          return reply({ attachment: fs.createReadStream(vpath) });
        }
        if (
          text2 == "18" ||
          text2 == "26" ||
          text2 == "30" ||
          text2 == "33" ||
          text2 == "34"
        ) {
          if (!text4)
            return reply(
              "This theme require a text 2\nTry to use maker ephoto | number | text1 | text2",
            );
          reply("⏳Processing your request…");
          react("⏳");
          const r = await ephoto(url, [text3, text4]);
          await dlmaker(r.image, mpath);
          return reply({ attachment: fs.createReadStream(mpath) });
        } else {
          reply("⏳Processing your request…");
          react("⏳");
          const r = await ephoto(url, text3);
          await dlmaker(r.image, mpath);
          return reply({ attachment: fs.createReadStream(mpath) });
        }
        /*if (text2 && text3) return reply("Sorry maintenance.")*/
      } //end of ephoto
      if (text1 == "textpro") {
        if (!text2)
          return reply(warn + "\nTry to use maker " + this.akane.usages);
        if (text2 == "list") {
          msg += "[ TEXTPRO THEME LIST ]\n\n";
          msg += `1. thunder
2. shadow
3. blackpink
4. sliced
5. batman
6. demon
7. magma
8. neon light
9. glitch
10. blackpink 2\n\n`;
          msg += "PAGE 1 OF 2\n\n";
          msg += "CHOOSE NUMBER ONLY";
          return reply(msg);
        } //end of list

        if (text2 == "list 2") {
          msg += "[ TEXTPRO THEME LIST ]\n\n";
          msg += `11. neon light 2
12. ⬛🟧 (2 TEXT)
13. matrix
14. thunder
15. neon
16. bokeh
17. green neon\n\n`;
          msg += "PAGE 2 OF 2\n\n";
          msg += "CHOOSE NUMBER ONLY";
          return reply(msg);
        } //end of list 2

        if (!text3) return reply(warn2);

        switch (text2) {
          case "1":
            theme = "thunder";
            url =
              "https://textpro.me/create-3d-thunder-text-effects-online-1147.html";
            break;
          case "2":
            theme = "shadow";
            url =
              "https://textpro.me/create-a-gradient-text-shadow-effect-online-1141.html";
            break;
          case "3":
            theme = "blackpink";
            url =
              "https://textpro.me/create-neon-light-blackpink-logo-text-effect-online-1081.html";
          case "4":
            theme = "sliced";
            url =
              "https://textpro.me/create-light-glow-sliced-text-effect-online-1068.html";
            break;
          case "5":
            theme = "batman";
            url = "https://textpro.me/make-a-batman-logo-online-free-1066.html";
            break;
          case "6":
            theme = "demon";
            url =
              "https://textpro.me/create-green-horror-style-text-effect-online-1036.html";
            break;
          case "7":
            theme = "magma";
            url =
              "https://textpro.me/create-a-magma-hot-text-effect-online-1030.html";
            break;
          case "8":
            theme = "neon light";
            url =
              "https://textpro.me/create-3d-neon-light-text-effect-online-1028.html";
            break;
          case "9":
            theme = "glitch";
            url =
              "https://textpro.me/create-impressive-glitch-text-effects-online-1027.html";
            break;
          case "10":
            theme = "blackpink 2";
            url =
              "https://textpro.me/create-blackpink-logo-style-online-1001.html";
            break;
          case "11":
            theme = "neon light 2";
            url =
              "https://textpro.me/neon-light-text-effect-with-galaxy-style-981.html";
            break;
          case "12":
            theme = "⬛🟧 (2 TEXT)";
            url =
              "https://textpro.me/generate-a-free-logo-in-pornhub-style-online-977.html";
            break;
          case "13":
            theme = "matrix";
            url = "https://textpro.me/matrix-style-text-effect-online-884.html";
            break;
          case "14":
            theme = "thunder";
            url =
              "https://textpro.me/create-thunder-text-effect-online-881.html";
            break;
          case "15":
            theme = "neon";
            url = "https://textpro.me/neon-text-effect-online-879.html";
            break;
          case "16":
            theme = "bokeh";
            url = "https://textpro.me/bokeh-text-effect-876.html";
            break;
          case "17":
            theme = "green neon";
            url = "https://textpro.me/green-neon-text-effect-874.html";
            break;
          default:
            return reply("chooes 1-17 only");
        } // end of switch(text2)
        if (text2 == "12") {
          if (!text4)
            return reply(
              "This theme require a text 2\nTry to use maker textpro | number | text1 | text2",
            );
          reply("⏳Processing your request…");
          react("⏳");
          const r = await textpro(url, [text3, text4]);
          await dlmaker(r.image, mpath);
          return reply({ attachment: fs.createReadStream(mpath) });
        } else {
          reply("⏳Processing your request…");
          react("⏳");
          const r = await textpro(url, text3);
          await dlmaker(r.image, mpath);
          return reply({ attachment: fs.createReadStream(mpath) });
        }
      } //end of textpro {}
    } catch (e) {
      return reply(e.message);
    } //end of catch
  }, //end of run
};
