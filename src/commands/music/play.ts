
import { Command } from "../base";
import { Message, Client, Guild, VoiceChannel, VoiceConnection, TextChannel, StreamDispatcher } from "discord.js";
import { Utils } from '../../utils/utils';
import * as ytdl from 'ytdl-core';
import { search } from 'yt-search';

module.exports = class play extends Command {
  constructor() {
    super({
      name: "play",
      description: "",
      usage: "",
      group: "music",
      aliases: ["p"]
    });

    
  }
  queues: Map<String, QueueConsruct>

    async run(bot: Client, message: Message, args: string[], prefix: string): Promise<void> {

        if(!Utils.queues) {
          this.queues = new Map();
        } else {
          this.queues = new Map(Utils.queues);
        }
        const serverQueue: QueueConsruct = this.queues.get(message.guild.id);
        const vc = message.member.voice.channel;
        if (!vc) {
            message.channel.send(
            "I'm sorry but you need to be in a voice channel to play music!"
          );
          return;
        }
        const perms = vc.permissionsFor(bot.user);
        if(!perms.has("CONNECT")) {
          message.channel.send(
            'I cannot connect to your voice channel, make sure I have the proper permissions'
          );
          return;
        }
        else if(!perms.has("SPEAK")) {
          message.channel.send(
            'I cannot speak in this voice channel, make sure I have the proper permissions'
          );
          return;
        }
        let songInfo: ytdl.videoInfo = null;

        if(args[0].match(/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu\.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/) != null) {
            songInfo = await ytdl.getInfo(args[0]);
        } else {
          try {
            let data = await search(args.join(' '));
            songInfo = await ytdl.getInfo(data.videos[0].url);
          } catch(e) {
            console.log("err: " + e)
            message.channel.send('Sorry, something went wrong.');
          }
        }

        const song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          lengthSeconds: parseInt(songInfo.videoDetails.lengthSeconds)
        }

        if(!serverQueue) {
          const queueConstruct = {
            songs: [],
            connection: null,
            dispatcher: null,
            nowPlaying: null,
            textChannel: message.channel,
            voiceChanel: vc,
            volume: 5,
            playing: true
          } as QueueConsruct;
          this.queues.set(message.guild.id, queueConstruct);
          queueConstruct.songs.push(song);

          try {
            const connection = await vc.join();
            queueConstruct.connection = connection;
            this.play(message.guild, queueConstruct.songs[0]);
          }
          catch (e) {
            this.queues.delete(message.guild.id);
          }
        } else {
          serverQueue.songs.push(song);
          if(serverQueue.playing == false) {
            this.play(message.guild, song);
            serverQueue.playing = true;
            return;
          }
          message.channel.send(`**${song.title}** has been added to the queue!`);          
        }

        Utils.queues = [...this.queues];
    }

    play(guild: Guild, song: Song ) {
      const serverQueue: QueueConsruct = this.queues.get(guild.id);

      if(song == undefined) {
        //serverQueue.voiceChanel.leave();
        //this.queues.delete(guild.id);
        serverQueue.playing = false;
        return;
      } else {
        serverQueue.nowPlaying = song.title;
        serverQueue.textChannel.send(`Now playing: **${song.title}**`)
      }
      
      const dispatcher = serverQueue.connection
        .play(ytdl(song.url, {highWaterMark: 1024 * 1024 * 10}))
        .on('finish', () => {
          serverQueue.songs.shift();
          const nextSong = serverQueue.songs[0];
          this.play(guild, nextSong);
        })
        .on('error', err => {
          console.log(err);
        })
        dispatcher.setVolumeLogarithmic(serverQueue.volume/ 5);
        serverQueue.dispatcher = dispatcher;
        this.queues.set(guild.id, serverQueue);
        Utils.queues = [...this.queues];
    }
}

type Song = {
  url: string,
  title: string,
  lengthSeconds: number
}

export type QueueConsruct = {
  songs: Song[],
  connection: VoiceConnection,
  dispatcher: StreamDispatcher,
  nowPlaying: string,
  textChannel: TextChannel,
  voiceChanel: VoiceChannel,
  volume: number,
  playing: boolean
}