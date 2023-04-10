import axios from "axios";

export class PlayerService {
    static async getPlayer(server: string, name: string) {
        const playerId = await PlayerService.getPlayerId(server, name);

        let url;
        if (server === "West") {
            url = `https://gameinfo.albiononline.com/api/gameinfo/players/${playerId}`
        }
        if (server === "East") {
            url = `https://gameinfo-sgp.albiononline.com/api/gameinfo/players/${playerId}`
        }
        if (!url) {
            throw new Error("Invalid server")
        }
        const response = await PlayerService.fetchData(url);
        return response;
    }

    private static async getPlayerId(server: string, name: string) {
        let url;
        if (server === "West") {
            url = `https://gameinfo.albiononline.com/api/gameinfo/search?q=${name}`
        }
        if (server === "East") {
            url = `https://gameinfo-sgp.albiononline.com/api/gameinfo/search?q=${name}`
        }
        if (!url) {
            throw new Error("Invalid server")
        }

        const response = await PlayerService.fetchData(url);

        const players = response.players;
        const filteredList = players.filter((elem: any) => elem.Name === name);
        if (filteredList.length < 1) {
            throw new Error("Player does not exist");
        }
        const playerId = filteredList[0].Id;
        return playerId;
    }

    private static async fetchData(url: string) {
        const response = await axios.get(url);
        return response.data;
    }
}