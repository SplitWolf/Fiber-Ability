import { Command } from "./base";
import { Message, Client, MessageAttachment, MessageEmbed } from "discord.js";
import { HypixelApi } from '../utils/hypixelapi'
import { MojangApi } from '../utils/mojangapi'
import { Utils } from '../utils/utils';



module.exports = class ping extends Command {
    constructor() {
        super({
            name: "hypixel",
            description: "",
            usage: "",
            group: "member",
            aliases: ['hp']
        });
    }

    async run(bot: Client, message: Message, args: string[], prefix: string): Promise<void> {
        const mjApi = new MojangApi
        const hpApi = new HypixelApi

        mjApi.getUUUID(args[0], (data: any) => {
            if(data.succes !== true) {
                hpApi.getUser(data.id, (userData: any) => {
                    const logo = new MessageAttachment(
                        './src/Utils/Hypixel.jpg',
                        'hypixel.jpg'
                    );
                    const duelStats = userData.player.stats.Duels;
                    const embed = new MessageEmbed()
                        .setAuthor(
                            `${
                                userData.player.displayname
                            } | LVL: ${this.getNetworkLevel(
                                userData.player.networkExp
                            )} | Rank: [${Utils.getRank(userData)}]`
                        )
                        .setDescription('Stats on Hypixel')
                        .setColor('#00e0dc')
                        .attachFiles([logo])
                        .setThumbnail('attachment://hypixel.jpg')
                        .addField(
                            '**Bewars Wins**',
                            `**${Utils.noUndef(
                                userData.player.stats.Bedwars.wins_bedwars
                            )}**`,
                            true
                        )
                        .addField(
                            '**Bedwars Total Kills**',
                            `**${Utils.noUndef(
                                userData.player.stats.Bedwars.kills_bedwars,
                                userData.player.stats.Bedwars.final_kills_bedwars
                            )}**`,
                            true
                        )
                        .addField(
                            '**Skywars Wins**',
                            `**${Utils.noUndef(userData.player.stats.SkyWars.wins)}**`,
                            true
                        )
                        .addField(
                            '**Skywars Kills**',
                            `**${Utils.noUndef(userData.player.stats.SkyWars.kills)}**`,
                            true
                        )
    
                        .addField(
                            '**Bridge Wins**',
                            `**${Utils.noUndef(
                                duelStats.bridge_duel_wins,
                                duelStats.bridge_doubles_wins,
                                duelStats.bridge_2v2v2v2_wins,
                                duelStats.bridge_3v3v3v3_wins,
                                duelStats.bridge_four_wins
                            )}**`,
                            true
                        )
                        .addField(
                            '**Bridge Kills**',
                            `**${Utils.noUndef(duelStats.bridge_kills)}**`,
                            true
                        )
                        .addField(
                            '**Arcade Wins**',
                            `**${Utils.noUndef(
                                userData.player.stats.Arcade.wins_simon_says,
                                userData.player.stats.Arcade.sw_game_wins,
                                userData.player.stats.Arcade.wins_mini_walls,
                                userData.player.stats.Arcade.wins_soccer,
                                userData.player.stats.Arcade.wins_grinch,
                                userData.player.stats.Arcade.wins_party,
                                userData.player.stats.Arcade.wins_party_2,
                                userData.player.stats.Arcade.wins_party_3,
                                userData.player.stats.Arcade.wins_dayone,
                                userData.player.stats.Arcade.wins_ender,
                                userData.player.stats.Arcade.wins_buildbattle,
                                userData.player.stats.Arcade.wins_buildbattle_teams,
                                userData.player.stats.Arcade.wins_hole_in_the_wall,
                                userData.player.stats.Arcade.wins_oneinthequiver,
                                userData.player.stats.Arcade.wins_farm_hunt,
                                userData.player.stats.Arcade.wins_throw_out,
                                userData.player.stats.Arcade.wins_dragonwars2
                            )}**`,
                            true
                        );
    
                    console.log();
                    message.channel.send(embed);
                })
            }
        })
    }

    getNetworkLevel(networkExp: number) {
        const BASE = 10000;
        const GROWTH = 2500;
        const REVERSE_PQ_PREFIX = -(BASE - 0.5 * GROWTH) / GROWTH;
        const REVERSE_CONST = REVERSE_PQ_PREFIX ^ 2;
        const GROWTH_DIVIDES_2 = 2 / GROWTH;
        return networkExp < 0
            ? 1
            : Math.floor(
                1 +
                REVERSE_PQ_PREFIX +
                Math.sqrt(REVERSE_CONST + GROWTH_DIVIDES_2 * networkExp)
            );
    }
};