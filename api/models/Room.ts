import { DataTypes, Model } from "sequelize";
import sequelize from "../sequelize";

class Room extends Model {
    declare id: number;
    declare owner_id: string;
    declare text: string;
    declare lang: string;
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
        },
        lang: {
            type: DataTypes.STRING,
        }
    },
    {
        sequelize,
        modelName: "rooms",
    }
);

export default Room;