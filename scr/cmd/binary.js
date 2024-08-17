module["exports"] = class {
  static config = {
    name: "binary",
    description: "Binary decode and encode",
    prefix: false,
    accessableby: 0,
    usage: "[de => text / en => text]",
    author: "Deku",
    cooldown: 3,
  };
  static async start({ reply, text }) {
    const a = text.join(" ");
    const b = a.split(" => ");
    const c = b[0];
    const d = b[1];
    if (!c || !d)
      return reply(
        "Wrong format\n\nUse: " + this.config.name + " " + this.config.usage,
      );
    const e = ["encode", "en", "decode", "de"];
    if (!e.includes(c))
      return reply(
        "Wrong format\n\nUse: " + this.config.name + " " + this.config.usage,
      );
    if (c == "encode" || c == "en") {
      return reply(encode(d));
    }
    if (c == "decode" || c == "de") {
      return reply(decode(d));
    }
  }
};
function encode(q) {
  return Array.from(q)
    .reduce((acc, char) => acc.concat(char.charCodeAt().toString(2)), [])
    .map((bin) => "0".repeat(8 - bin.length) + bin)
    .join(" ");
}

function decode(q) {
  const arrayOfBytes = q.split(" ");
  let Output = "";
  for (let i = 0; i < arrayOfBytes.length; i++)
    Output += String.fromCharCode(parseInt(arrayOfBytes[i], 2));
  return Output;
}
