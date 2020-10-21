import { Message, Client} from 'discord.js';
import { Command } from '../base';
import { Utils } from '../../utils/utils';
import { QueueConsruct } from './play';

module.exports = class skip extends Command {
    constructor() {
        super({
            name: "skip",
            description: "",
            usage: "",
            group: "member",
            aliases: []
        });
    }
    queues: Map<String, QueueConsruct>

    async run(bot: Client, message: Message, args: string[], prefix: string): Promise<void> {
        this.queues = new Map(Utils.queues);
        var serverQueue = this.queues.get(message.guild.id);

        if(serverQueue.dispatcher != null) {
            
            serverQueue.dispatcher.end();
        } else {
            message.channel.send(`I'm not playing anything.`)
        }
        
    }
}