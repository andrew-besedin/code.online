import ServerResponse from "../interfaces/common/ServerResponse";
import CreateRoomResponse from "../interfaces/common/responses/CreateRoomResponse";
import GetLangResponse from "../interfaces/common/responses/GetLangResponse";
import GetRoomResponse from "../interfaces/common/responses/GetRoomResponse";
import axios from "axios";

export default class FetchUtils {
    private static readonly BASE_URL: string = "/api";

    static async register(): Promise<ServerResponse<undefined>> {
        return await fetch(`${FetchUtils.BASE_URL}/register`).then(res => res.json());
    }

    static async createRoom(): Promise<ServerResponse<CreateRoomResponse>> {
        return await fetch(`${FetchUtils.BASE_URL}/create-room`).then(res => res.json());
    }

    static async getRoom(id: string): Promise<ServerResponse<GetRoomResponse>> {
        return await axios.post('/api/get-room', {
            roomId: id,
        }).then(res => res.data);
    }

    static async getLang(): Promise<ServerResponse<GetLangResponse>> {
        return await fetch(`${FetchUtils.BASE_URL}/get-langs`).then(res => res.json());
    }

    static async setLang(roomId: string, lang: string): Promise<ServerResponse<undefined>> {
        return await axios.post('/api/set-lang', { roomId, lang }).then(res => res.data);
    }
}