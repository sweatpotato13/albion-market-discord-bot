import axios from "axios";
import { itemLists } from "../constants";

export class PriceService {
    static async getPrice(server: string, itemName: string, enchant: number, city: string) {
        let itemFilter = itemLists.filter((it: any) => it.name === itemName);
        console.log(itemFilter)
        if (itemFilter.length < 1) {
            throw new Error("Item does not exist");
        }

        const itemCode = itemFilter[enchant].value;

        let url;
        if (server === "West") {
            url = `https://albion-online-data.com/api/v2/stats/Prices/${itemCode}`
        }
        if (server === "East") {
            url = `https://east.albion-online-data.com/api/v2/stats/Prices/${itemCode}`
        }
        if (!url) {
            throw new Error("Invalid server")
        }
        const response = await PriceService.fetchPrice(url);
        const filteredList = response.filter((item: any) => item.city === city);
        if (filteredList.length < 1) {
            throw new Error("city does not exist");
        }
        const data = filteredList[0];
        return data;
    }

    private static async fetchPrice(url: string): Promise<any[]> {
        const response = await axios.get(url);
        return response.data;
    }
}