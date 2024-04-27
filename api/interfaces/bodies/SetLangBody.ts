import UserData from "../UserData";

export default interface SetLangBody {
    userData: UserData,
    hash: string,
    lang: string
}