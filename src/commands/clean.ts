import { Command } from "./base"
import { Message } from "discord.js";

module.exports = class clean extends Command {
    constructor() {
        super({name: "clean", description: "", usage: "", group: "member", aliases: [], userPermissions: ['MANAGE_MESSAGES']})
    }
    
    async run(bot: import("discord.js").Client, message: import("discord.js").Message, args: string[], prefix: string): Promise<void> {
            message.delete();
            if(isNaN(Number(args[0]))) {
                message.channel.send("Invaild Arguments").then(msg => {
                    if(!Array.isArray(msg)) {
                        msg.delete(700);
                    }
                })
               
            } else {
                let amount : number = Number(args[0]);
                message.channel.fetchMessages({limit: amount}).then(fetched => {
                    message.channel.bulkDelete(fetched);
                    message.channel.send(`Deleted \`${fetched.size}\` messages.`).then(msg => {
                        if(!Array.isArray(msg)) {
                            msg.delete(700);
                        }
                    })
                })
            }      
    }
    
}