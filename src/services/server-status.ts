import axios from "axios";

export class ServerStatusService {
    static async getServerStatus(server: string): Promise<Boolean> {
        let url;
        if (server === "West") {
            url = `http://serverstatus.albiononline.com`
        }
        if (server === "East") {
            url = `http://serverstatus-sgp.albiononline.com`
        }
        if (!url) {
            throw new Error("Invalid server")
        }
        const response = await ServerStatusService.fetchData(url);
        const status: Boolean = response.status === "online";
        return status;
    }

    private static async fetchData(url: string) {
        const response = await axios.get(url);
        return response.data;
    }
}