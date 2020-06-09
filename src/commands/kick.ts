import { Command } from "./base";
import { Message, Client } from "discord.js";

module.exports = class kick extends Command {
  constructor() {
    super({
      name: "kick",
      description: "",
      usage: "",
      group: "member",
      aliases: [],
      userPermissions: ["KICK_MEMBERS"]
    });
  }

  async run(bot: Client, message: Message, args: string[], prefix: string): Promise<void> {
    let reason: string = args[0];
    console.log(message.mentions.users.size);
    console.log(message.mentions.users.first());
    console.log(message.guild.member(message.mentions.users.first()))

    if(message.guild.member(bot.user).hasPermission("KICK_MEMBERS")) {
      message.channel.send('I don\'t have the permission `KICK_MEMBERS`');
      return;
    }
    if(message.mentions.users.size == 0) {
      console.log("1");
    }

    if(message.mentions.users.size > 1) {

    }

    message.guild.member(message.mentions.users.first()).kick(reason);
    
  } 
};
