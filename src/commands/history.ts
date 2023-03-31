import { ApplicationCommandOptionType, CommandInteraction } from "discord.js";
import {
    Discord,
    Slash,
    SlashOption,
} from "discordx";

@Discord()
export class History {
    @Slash({ description: "Albion online market price history" })
    async history(
        @SlashOption({ description: "server", name: "server", required: true, type: ApplicationCommandOptionType.String })
        @SlashOption({ description: "item", name: "item", required: true, type: ApplicationCommandOptionType.String })
        @SlashOption({ description: "city", name: "city", required: true, type: ApplicationCommandOptionType.String })
        server: string,
        item: string,
        city: string,
        command: CommandInteraction
    ): Promise<void> {
        await command.deferReply({ ephemeral: true });
        this._history(server, item, city, command);
    }

    async _history(server: string, item: string, city: string, command: CommandInteraction): Promise<any> {
        try {
            await command.editReply(`WIP`);
        } catch (error: any) {
            console.error(error);
            await command.editReply(`Error`);
        }
    }
}