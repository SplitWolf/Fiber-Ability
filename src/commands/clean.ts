import { Command } from "./base";

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

  async run(bot: import("discord.js").Client, message: import("discord.js").Message, args: string[], prefix: string): Promise<void> {
    await message.delete();
    let amount: number = Number(args[0]);
    if (isNaN(amount) || amount <= 0) {
      message.channel.send("Invaild Arguments").then(msg => {
        msg.delete({timeout: 700})
      });
    } else {
      let fetched = await message.channel.messages.fetch({ limit: amount });
      message.channel.bulkDelete(fetched)
      .catch(error => message.channel.send(`Error: ${error}`));
      message.channel.send(
        `Deleted \`${fetched.size}\` messages.`
      ).then(msg => {
        msg.delete({timeout: 700})
      });
    }
  }
};
