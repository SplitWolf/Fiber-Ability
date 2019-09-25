import { Command } from "./base"
import { Message, Client } from "discord.js"

module.exports = class ping extends Command {
    constructor() {
        super({name: "ping", description: "", usage: "", group: "member", aliases: []})
    }
    
    async run(bot: Client, message: Message, args: string[], prefix: string) {
        
        message.channel.send(`Pong! \`${Math.abs(Date.now() - new Date(message.createdAt).getTime())}ms\``);
    }
    
}
