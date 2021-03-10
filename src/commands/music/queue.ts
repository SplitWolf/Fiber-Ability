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
        let resp = '';
        for(let i = 0; i < serverQueue.songs.length; i++) {
            let videoLengthMinutes = Math.floor((serverQueue.songs[i].lengthSeconds)/60)
            let videoSecondsRemaing = (serverQueue.songs[i].lengthSeconds)-(videoLengthMinutes*60)
            resp += `${i+1}) ${serverQueue.songs[i].title}    ${videoLengthMinutes}:${videoSecondsRemaing}\n`
        }        
        resp = "```apache\n" + resp + "```" 
        message.channel.send(resp);
    }
}