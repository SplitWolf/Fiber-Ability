import * as Discord from "discord.js";
import { Registry } from "./registry";
require("dotenv").config();
const bot = new Discord.Client();

//Create Instance of Registry
let registry: Registry = new Registry();
//Create function to register all commands
function registerCommands() {
  registry.setCommand("ping", __dirname + "/commands/ping.ts");
  registry.setCommand("clean", __dirname + "/commands/clean.ts");
  registry.setCommand("kick", __dirname + "/commands/kick.ts");
  registry.setCommand("play", __dirname + "/commands/music/play.ts");
  registry.setCommand("skip", __dirname + "/commands/music/skip.ts");
}

bot.on("ready", () => {
  console.log("-----------------------------------------------------------");
  console.log(
    `Logged in as ${bot.user.username}#${bot.user.discriminator} running version 1.2.0`
  );
  bot.user.setActivity("f!help");
  console.log(`${bot.user.username} is on ${bot.guilds.cache.size} server(s)!`);
  console.log("-----------------------------------------------------------");
  registerCommands();
});

bot.on("message", (message: Discord.Message) => {
  const sender: Discord.User = message.author;
  //Don't respond to other bots
  if (sender.bot) return;

  // Don't respond to DM's
  if (message.channel.type === "dm") {
    return message.channel.send("Please use commands in a server!");
  }
  // Bot's Default Prefix
  const prefix: string = "f!";

  const messageArray = message.content.split(" ");

  const args = messageArray.slice(1);

  const msg = messageArray[0];

  //Get rid of prefix, whitespace and line terminators
  const cmd = msg.slice(prefix.length).trim();

  if (!msg.startsWith(prefix)) return;

  //Command Handler
  registry.getCommand(cmd, command => {
    if (command !== null) {
      if (command.hasPermission(message)) {
        command.run(bot, message, args, prefix);
      } else {
        message.channel.send(`\`You do not have permission to use ${cmd}!\``)
        .then(msg => {
              msg.delete({timeout: 1000})
          });
      }
    } else {
      message.channel.send(`\`${cmd} is not a command!\``).then(msg => {
          msg.delete({timeout: 1000})
      });
    }
  });
});

bot.on("error", (e: any) => {
  console.error(e);
});
bot.on("warn", (e: any) => {
  console.warn(e);
});
bot.on("debug", (e: any) => {
  //console.info(e);
});

bot.login(process.env.BOT_TOKEN);
