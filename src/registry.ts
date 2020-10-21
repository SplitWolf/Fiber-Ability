import { PathLike, access, constants } from "fs";
import { Command } from "./commands/base";

//Registry Class
export class Registry {
  //Register for commands
  private commands: Map<string, Command>;
  private aliases: Map<string, string>;

  constructor() {
    //Intizalie Map
    this.commands = new Map<string, Command>();
    this.aliases = new Map<string, string>();
  }

  /**
   * Add command to register
   *  @param commandName The name of the command.
   *  @param filePath /path/to/file of command to execute.
   * */

  setCommand(commandName: string, filePath: PathLike) {
    access(filePath, constants.F_OK, noAccess => {
      if (!noAccess) {
        //Register Command
        const cmdImport = require(filePath.toString());
        const cmd = new cmdImport();
        if (!this.commands.has(commandName) && !this.aliases.has(commandName)) {
          this.commands.set(commandName, cmd);
        } else {
          console.error(
            `${commandName} is already present as another command/alias!`
          );
        }
        //Register aliases
        let aliases: string[] = cmd.getAliases();
        aliases.forEach(alias => {
          if (!this.commands.has(alias) && !this.aliases.has(alias)) {
            this.aliases.set(alias, commandName);
          } else {
            console.error(
              `${alias} is already present as another command/alias!`
            );
          }
        });

        return;
      } else {
        throw new Error("Invalid path: " + filePath);
      }
    });
  }

  /**
   *
   * @param cmdName Command name or Alias
   * @param callback Callback Function, if null is returned no command was found, else an instance of the command is returned
   */

  getCommand(cmdName: string, callback: (command: Command) => void) {
    if (this.commands.has(cmdName)) {
      callback(this.commands.get(cmdName));
    } else if (this.aliases.has(cmdName)) {
      let cmd = this.aliases.get(cmdName);
      callback(this.commands.get(cmd));
    } else {
      //Return null as no command exists
      callback(null);
    }
  }
}
