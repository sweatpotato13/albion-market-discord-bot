import { Pagination, PaginationType } from "@discordx/pagination";
import { ApplicationCommandOptionType, CommandInteraction, EmbedBuilder, HexColorString } from "discord.js";
import {
    Discord,
    Slash,
    SlashChoice,
    SlashOption,
} from "discordx";
import { enchantColorCode, itemQuality, priceCities } from "../constants";
import { PriceService } from "../services";

@Discord()
export class Price {
    @Slash({ description: "Hello World" })
    async price(
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
        @SlashChoice(...priceCities)
        @SlashOption({
            description: "city", name: "city", required: true, type: ApplicationCommandOptionType.String
        })
        city: string,
        @SlashChoice(0, 1, 2, 3, 4)
        @SlashOption({
            description: "enchant", name: "enchant", required: false, type: ApplicationCommandOptionType.Number
        })
        enchant: number,
        command: CommandInteraction
    ): Promise<void> {
        await command.deferReply({ ephemeral: true });

        this._price(server, item, enchant ? enchant : 0, city, command);
    }

    async _price(server: string, itemName: string, enchant: number, city: string, command: CommandInteraction): Promise<any> {
        try {
            const data = await PriceService.getPrice(server, itemName, enchant, city);

            const pages = data.map((elem) => {
                const embed = new EmbedBuilder()
                embed.setTitle("Price of " + itemName);
                embed.setColor(enchantColorCode[enchant] as HexColorString);
                embed.setThumbnail(`https://render.albiononline.com/v1/item/${elem.item_id}.png`);
                embed.addFields(
                    { name: "Name", value: itemName, inline: true },
                    { name: "City", value: elem.city, },
                    { name: "Quality", value: itemQuality[elem.quality] },
                    { name: "Minimum Sell Price", value: elem.sell_price_min.toString(), },
                    { name: "Minimum Sell Price Timestamp", value: elem.sell_price_min_date, inline: true },
                    { name: "Maximum Sell Price", value: elem.sell_price_max.toString(), },
                    { name: "Maximum Sell Price Timestamp", value: elem.sell_price_max_date, inline: true },
                    { name: "Minimum Buy Price", value: elem.buy_price_min.toString(), },
                    { name: "Minimum Buy Price Timestamp", value: elem.buy_price_min_date, inline: true },
                    { name: "Maximum Buy Price", value: elem.buy_price_max.toString(), },
                    { name: "Maximum Buy Price Timestamp", value: elem.buy_price_max_date, inline: true },
                )

                return { embeds: [embed] };
            });

            new Pagination(command, pages, {
                filter: (interact) => interact.user.id === command.user.id,
                type: PaginationType.Button,
            }).send();
        } catch (error: any) {
            console.error(error);
            await command.editReply(`${error.message}`);
        }
    }
}