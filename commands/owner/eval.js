const { MessageEmbed } = require("discord.js");
const { inspect } = require("util");
const vm = require("vm");
const codeContext = {};
vm.createContext(codeContext);

module.exports = {
  name: "eval",
  aliases: [],
  permissions: [],
  usage: "",
  description: "",
  ownerOnly: true,
  enabled: true,
  cooldown: 5,
  exec: async (client, message, args) => {
    const code = args.join(" ");
    const token = client.token.split("").join("[^]{0,2}");
    const rev = client.token
      .split("")
      .reverse()
      .join("[^]{0,2}");
    const filter = new RegExp(`${token}|${rev}`, "g");
    try {
      let output = eval(code);
      if (
        output instanceof Promise ||
        (Boolean(output) &&
          typeof output.then === "function" &&
          typeof output.catch === "function")
      )
        output = await output;
      output = inspect(output, { depth: 0, maxArrayLength: null });
      output = output.replace(filter, "[TOKEN]");
      output = clean(output);
      if (output.length < 1950) {
        message.channel.send(`\`\`\`js\n${output}\n\`\`\``);
      } else {
        message.channel.send(`${output}`, { split: "\n", code: "js" });
      }
    } catch (error) {
      message.channel.send(
        `The following error occured \`\`\`js\n${error}\`\`\``
      );
    }

    function clean(text) {
      return text
        .replace(/`/g, "`" + String.fromCharCode(8203))
        .replace(/@/g, "@" + String.fromCharCode(8203));
    }
  }
};
