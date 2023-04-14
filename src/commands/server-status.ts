import { ApplicationCommandOptionType, CommandInteraction, EmbedBuilder } from "discord.js";
import {
    Discord,
    Slash,
    SlashChoice,
    SlashOption,
} from "discordx";
import { PlayerService, ServerStatusService } from "../services";

@Discord()
export class ServerStatus {
    @Slash({ description: "Hello World" })
    async server(
        @SlashChoice("West", "East")
        @SlashOption({
            description: "server", name: "server", required: true, type: ApplicationCommandOptionType.String
        })
        server: string,
        command: CommandInteraction
    ): Promise<void> {
        await command.deferReply({ ephemeral: false });

        this._server(server, command);
    }

    async _server(server: string, command: CommandInteraction): Promise<any> {
        try {
            const status: Boolean = await ServerStatusService.getServerStatus(server);

            const embed = new EmbedBuilder()
            embed.setTitle(`Albion ${server} Server Status: ${status ? "Online" : "Offline"}`);
            embed.setColor(status ? "Green" : "Red");

            await command.editReply({ embeds: [embed] });
        } catch (error: any) {
            console.error(error);
            await command.editReply(`${error.message}`);
        }
    }
}