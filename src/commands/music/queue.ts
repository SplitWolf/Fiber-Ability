import { Message, Client, MessageEmbed} from 'discord.js';
import { Command } from '../base';
import { Utils } from '../../utils/utils';
import { QueueConsruct } from './play';

module.exports = class queue extends Command {
    constructor() {
        super({
            name: "queue",
            description: "",
            usage: "",
            group: "member",
            aliases: ["q"]
        });
    }
    queues: Map<String, QueueConsruct>

    async run(bot: Client, message: Message, args: string[], prefix: string): Promise<void> {
        this.queues = new Map(Utils.queues);
        var serverQueue = this.queues.get(message.guild.id);
        if(!serverQueue) {
            message.channel.send(`I'm not playing anything.`);
            return;
        }
        if(serverQueue.dispatcher == null) {
             message.channel.send(`I'm not playing anything.`);
             return;
        }
        for(let i = 0; i < serverQueue.songs.length; i++) {
            message.channel.send(`**${i + 1}.** ${serverQueue.songs[i].title}`)
        }        
    }
}