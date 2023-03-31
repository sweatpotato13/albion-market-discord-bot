import { ApplicationCommandOptionType, AutocompleteInteraction, CommandInteraction, EmbedBuilder } from "discord.js";
import {
    Discord,
    Slash,
    SlashChoice,
    SlashOption,
} from "discordx";
import { itemLists, priceCities } from "../constants";
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
        command: CommandInteraction
    ): Promise<void> {
        await command.deferReply({ ephemeral: true });
        this._price(server, item, city, command);
    }

    async _price(server: string, itemName: string, city: string, command: CommandInteraction): Promise<any> {
        try {
            const response = await PriceService.getPrice(server, itemName, city);
            const filteredList = response.filter((item: any) => item.city === city);
            if (filteredList.length < 1) {
                throw new Error("city does not exist");
            }
            const data = filteredList[0];
            const embed = new EmbedBuilder();
            embed.setTitle("Price of " + itemName);
            embed.addFields(
                { name: "Name", value: itemName, inline: true },
                { name: "City", value: data.city, },
                { name: "Minimum Sell Price", value: data.sell_price_min.toString(), },
                { name: "Minimum Sell Price Timestamp", value: data.sell_price_min_date, inline: true},
                { name: "Maximum Sell Price", value: data.sell_price_max.toString(), },
                { name: "Maximum Sell Price Timestamp", value: data.sell_price_max_date, inline: true},
                { name: "Minimum Buy Price", value: data.buy_price_min.toString(), },
                { name: "Minimum Buy Price Timestamp", value: data.buy_price_min_date, inline: true},
                { name: "Maximum Buy Price", value: data.buy_price_max.toString(), },
                { name: "Maximum Buy Price Timestamp", value: data.buy_price_max_date, inline: true},
            )

            await command.editReply({ embeds: [embed], content: `` });
        } catch (error: any) {
            console.error(error);
            await command.editReply(`${error.message}`);
        }
    }
}