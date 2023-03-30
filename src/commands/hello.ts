import { ApplicationCommandOptionType, CommandInteraction } from "discord.js";
import {
    Discord,
    Slash,
    SlashOption,
} from "discordx";

@Discord()
export class Hello {
    @Slash({ description: "Hello World Description" })
    slashhello(
        @SlashOption({ description: "user", name: "user", required: true, type: ApplicationCommandOptionType.String })
        user: string,
        command: CommandInteraction
    ): void {
        command.deferReply({ ephemeral: true });
        this.hello(user, command);
    }

    async hello(user: string, command: CommandInteraction): Promise<any> {
        try {
            await command.editReply(`Hello ${user}`);
        } catch (error: any) {
            console.error(error);
            await command.editReply(`Error`);
        }
    }
}