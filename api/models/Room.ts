import { DataTypes, Model } from "sequelize";
import sequelize from "../sequelize";

class Room extends Model {
    declare id: number;
    declare owner_id: string;
    declare text: string;
}

Room.init(
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        text: {
            type: DataTypes.TEXT,
        }
    },
    {
        sequelize,
        modelName: "rooms",
    }
);

export default Room;