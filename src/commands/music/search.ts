import { Message, Client, MessageEmbed} from 'discord.js';
import { Command } from '../base';
import { Utils } from '../../utils/utils';
import { QueueConsruct } from './play';
import { search } from 'yt-search';

module.exports = class skip extends Command {
    constructor() {
        super({
            name: "nowplaying",
            description: "",
            usage: "",
            group: "member",
            aliases: ["s"]
        });
    }
    queues: Map<String, QueueConsruct>

    async run(bot: Client, message: Message, args: string[], prefix: string): Promise<void> {
        const vc = message.member.voice.channel;
        if (!vc) {
            message.channel.send(
            "I'm sorry but you need to be in a voice channel to use this command!"
          );
          return;
        }
        if(args.join(' ') == "") {
            message.channel.send("Please enter a search query!")
            return;
        }
        let video = await this.search(args.join(' '), message);
        if(video != '') {
            const cmdImport = require('./play')
            const cmd = new cmdImport();
            cmd.run(bot, message, [video], prefix);
        }
    }
    async search(songName: string, message: Message) : Promise<string> {
        let data = await search(songName)
        let videos = data.videos.slice(0, 10);
        let video = '';
        let resp = '';
    
        for (var i in videos) {
            resp += `${parseInt(i)+1}) ${videos[i].title}\n`
        }
        resp = "```apache\n" + resp + "```" 
        message.channel.send(resp);

        const filter = (m: Message) => !isNaN(parseInt(m.content)) && parseInt(m.content) < videos.length+1 && parseInt(m.content) > 0;
        await message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time']}).then( (collected) => {
            video = videos[parseInt(collected.first(1)[0].content)-1].url
        }).catch(e => {
            //console.error(e);
            return null;
        });

        return video;
    }
    
}