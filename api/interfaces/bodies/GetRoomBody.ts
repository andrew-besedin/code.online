import UserData from "../UserData";

export default interface GetRoomBody {
    userData: UserData;
    hash: string;
}