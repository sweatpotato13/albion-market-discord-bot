import axios from "axios";
import { itemLists } from "../constants";

export class PriceService {
    static async getPrice(server: string, itemName: string, city: string) {
        let itemFilter = itemLists.filter((it: any) => it.name === itemName);
        if (itemFilter.length < 1) {
            throw new Error("Item does not exist");
        }
        const itemCode = itemFilter[0].value;

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
        return await PriceService.fetchPrice(url, city);
    }

    private static async fetchPrice(url: string, city: string): Promise<any []> {
        const response = await axios.get(url);
        return response.data;
    }
}