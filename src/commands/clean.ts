import { Command } from "./base";
import { Message } from "discord.js";

module.exports = class clean extends Command {
  constructor() {
    super({
      name: "clean",
      description: "",
      usage: "",
      group: "member",
      aliases: [],
      userPermissions: ["MANAGE_MESSAGES"]
    });
  }

  async run(
    bot: import("discord.js").Client,
    message: import("discord.js").Message,
    args: string[],
    prefix: string
  ): Promise<void> {
    message.delete();
    let amount: number = Number(args[0]);
    if (isNaN(amount) || amount <= 0) {
      let msg = await message.channel.send("Invaild Arguments");
      if (!Array.isArray(msg)) {
        msg.delete(700);
      }
    } else {
      let fetched = await message.channel.fetchMessages({ limit: amount });
      message.channel
        .bulkDelete(fetched)
        .catch(error => message.channel.send(`Error: ${error}`));
      let msg = await message.channel.send(
        `Deleted \`${fetched.size}\` messages.`
      );
      if (!Array.isArray(msg)) {
        msg.delete(700);
      }
    }
  }
};
