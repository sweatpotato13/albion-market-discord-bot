import axios from "axios";
import { itemLists } from "../constants";

export class HistoryService {
    static async getHistory(server: string, itemName: string, enchant: number, quality: number, city: string) {
        let itemFilter = itemLists.filter((it: any) => it.name === itemName);
        if (itemFilter.length < 1) {
            throw new Error("Item does not exist");
        }

        const itemCode = itemFilter[enchant].value;

        let url;
        if (server === "West") {
            url = `https://albion-online-data.com/api/v2/stats/history/${itemCode}`
        }
        if (server === "East") {
            url = `https://east.albion-online-data.com/api/v2/stats/history/${itemCode}`
        }
        if (!url) {
            throw new Error("Invalid server")
        }
        const response = await HistoryService.fetchHistory(url);

        const filteredList = response.filter((item: any) => item.location === city && item.quality === quality);
        if (filteredList.length < 1) {
            throw new Error("History does not exist");
        }
        const data = filteredList[0];
        data.data.reverse();
        return data;
    }

    private static async fetchHistory(url: string) {
        const response = await axios.get(url);
        return response.data;
    }
}