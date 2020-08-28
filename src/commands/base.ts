import { Message, PermissionResolvable, Client } from "discord.js";

// Command Base Class
export abstract class Command {
  name: string = "Unkown";
  aliases: string[];
  usage: string = "This command does not have a use specified.";
  description: String = "This is an unknown command!";
  group: string = "Unkown";
  nsfw: boolean = false;
  userPermissions: PermissionResolvable[];

  constructor(info: {
    name: string;
    aliases: string[];
    usage: string;
    description: string;
    group: string;
    nsfw?: boolean;
    userPermissions?: PermissionResolvable[];
  }) {
    this.name = info.name;
    this.aliases = info.aliases;
    this.usage = "usage" in info ? info.usage : this.usage;
    this.description = info.description;
    this.group = info.group;
    this.nsfw = "nsfw" in info ? info.nsfw : this.nsfw;
    this.userPermissions =
      "userPermissions" in info ? info.userPermissions : this.userPermissions;
  }

  /**
   *
   * @param message Message to check permissions for.
   */
  hasPermission(message: Message): boolean {
    if (this.userPermissions != null) {
      const hasPerms = message.guild
        .member(message.author)
        .permissions.has(this.userPermissions);
      if (hasPerms) {
        return true;
      }
      return false;
    } else {
      return true;
    }
  }

  getAliases(): string[] {
    return this.aliases;
  }

  /**
   * What to do when command is called.
   *
   * @param bot Bot Client
   * @param message Message sent by user
   * @param args Command Arguments
   * @param prefix The Bot's current prefix
   */

  abstract async run(
    bot: Client,
    message: Message,
    args: string[],
    prefix: string
  ): Promise<void>;
}
