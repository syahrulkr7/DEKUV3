const sharp = require("sharp");
async function fact(t) {
    try {
        let img = await sharp(__dirname + "/fact.png").metadata();
        const width = img.width;
        const height = img.height;
        const text = encodeURI(t);
        const svgImage = `
<svg width="${width}" height="${height}">
<style>
.title { fill: #000; font-size: 20px; font-family: Tahoma;}
</style>
<text x="30%" y="60%" text-anchor="middle" class="title" transform="translate(100,100) rotate(15)" text-align="justify" text-justify="inter-word">${text}</text>
</svg>
`;
        const svgBuffer = Buffer.from(svgImage);
        await sharp(svgBuffer).toFile(__dirname + `/cache/${t}_txt.png`);
        await sharp(__dirname + "/fact.png")
            .composite([
                {
                    input: __dirname + `/cache/${t}_txt.png`,
                    top: 50,
                    left: 50,
                },
            ])
            .toFile(__dirname + `/cache/${t}_output.png`);
        return true;
    } catch (error) {
        console.log(error.message);
        return false;
    }
}
module.exports = fact;
