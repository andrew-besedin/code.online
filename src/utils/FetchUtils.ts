import ServerResponse from "../interfaces/common/ServerResponse";
import CreateRoomResponse from "../interfaces/common/responses/CreateRoomResponse";

export default class FetchUtils {
    private static readonly BASE_URL: string = "/api";

    static async register(): Promise<ServerResponse<undefined>> {
        return await fetch(`${FetchUtils.BASE_URL}/register`).then(res => res.json());
    }

    static async createRoom(): Promise<ServerResponse<CreateRoomResponse>> {
        return await fetch(`${FetchUtils.BASE_URL}/create-room`).then(res => res.json());
    }
}