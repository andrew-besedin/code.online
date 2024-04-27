import UserData from "../UserData";

export default interface SetLangBody {
    userData: UserData,
    roomId: string,
    lang: string
}