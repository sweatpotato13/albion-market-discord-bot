import { ApplicationCommandOptionType, CommandInteraction, EmbedBuilder } from "discord.js";
import {
    Discord,
    Slash,
    SlashChoice,
    SlashOption,
} from "discordx";
import { PlayerService } from "../services";

@Discord()
export class Player {
    @Slash({ description: "Hello World" })
    async player(
        @SlashChoice("West", "East")
        @SlashOption({
            description: "server", name: "server", required: true, type: ApplicationCommandOptionType.String
        })
        server: string,
        @SlashOption({
            description: "name", name: "name", required: true, type: ApplicationCommandOptionType.String
        })
        name: string,
        command: CommandInteraction
    ): Promise<void> {
        await command.deferReply({ ephemeral: true });

        this._player(server, name, command);
    }

    async _player(server: string, name: string, command: CommandInteraction): Promise<any> {
        try {
            const data = await PlayerService.getPlayer(server, name);

            const embed = new EmbedBuilder()
            embed.setTitle(`Player Statistics`);
            // embed.setColor(enchantColorCode[enchant] as HexColorString);
            // embed.setThumbnail(`https://render.albiononline.com/v1/item/${elem.item_id}.png`);
            embed.addFields(
                { name: "Name", value: name, inline: true },
                { name: "Guild", value: data.GuildName, },
                { name: "KillFame", value: data.KillFame === null ? "0" : data.KillFame.toString() },
                { name: "DeathFame", value: data.DeathFame === null ? "0" : data.DeathFame.toString() },
                { name: "FameRatio", value: data.FameRatio === null ? "0" : data.FameRatio.toString() },
            )

            await command.editReply({ embeds: [embed] });
        } catch (error: any) {
            console.error(error);
            await command.editReply(`${error.message}`);
        }
    }
}