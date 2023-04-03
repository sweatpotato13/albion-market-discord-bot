import { Pagination, PaginationType } from "@discordx/pagination";
import { ApplicationCommandOptionType, CommandInteraction, EmbedBuilder, HexColorString } from "discord.js";
import {
    Discord,
    Slash,
    SlashChoice,
    SlashOption,
} from "discordx";
import { enchantColorCode, historyCities, itemQuality } from "../constants";
import { HistoryService } from "../services";

@Discord()
export class History {
    @Slash({ description: "Albion online market price history" })
    async history(
        @SlashChoice("West", "East")
        @SlashOption({
            description: "server", name: "server", required: true, type: ApplicationCommandOptionType.String
        })
        server: string,
        @SlashChoice()
        @SlashOption({
            description: "item", name: "item", required: true, type: ApplicationCommandOptionType.String
        })
        item: string,
        @SlashChoice(...historyCities)
        @SlashOption({
            description: "city", name: "city", required: true, type: ApplicationCommandOptionType.String
        })
        city: string,
        @SlashChoice(0, 1, 2, 3, 4)
        @SlashOption({
            description: "enchant", name: "enchant", required: false, type: ApplicationCommandOptionType.Number
        })
        enchant: number,
        @SlashChoice(1, 2, 3, 4, 5)
        @SlashOption({
            description: "quality", name: "quality", required: false, type: ApplicationCommandOptionType.Number
        })
        quality: number,
        command: CommandInteraction
    ): Promise<void> {
        await command.deferReply({ ephemeral: false });
        this._history(server, item, enchant ? enchant : 0, quality ? quality : 1, city, command);
    }

    async _history(server: string, itemName: string, enchant: number, quality: number, city: string, command: CommandInteraction): Promise<any> {
        try {
            const data = await HistoryService.getHistory(server, itemName, enchant, quality, city);

            const pages = data.data.map((elem: any) => {
                const embed = new EmbedBuilder()
                embed.setTitle("Price history of " + itemName);
                embed.setColor(enchantColorCode[enchant] as HexColorString);
                embed.setThumbnail(`https://render.albiononline.com/v1/item/${data.item_id}.png`);
                embed.addFields(
                    { name: "Name", value: itemName, inline: true },
                    { name: "City", value: data.location, },
                    { name: "Quality", value: itemQuality[data.quality] },
                    { name: "Item Count", value: elem.item_count.toString() },
                    { name: "Average Price", value: elem.avg_price.toString() },
                    { name: "Timestamp", value: elem.timestamp },
                );
                return { embeds: [embed] };
            });

            new Pagination(command, pages, {
                filter: (interact) => interact.user.id === command.user.id,
                type: PaginationType.Button,
            }).send();
        } catch (error: any) {
            console.error(error);
            await command.editReply(`Error`);
        }
    }
}