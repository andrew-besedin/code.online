import UserData from "../UserData";

export default interface SocketRoomBody {
    userData: UserData;
    hash: string;
}