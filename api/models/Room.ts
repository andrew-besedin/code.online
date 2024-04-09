import { DataTypes, Model } from "sequelize";
import sequelize from "../sequelize";

class Room extends Model {
    declare id: number;
}

Room.init(
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
    },
    {
        sequelize,
        modelName: "rooms",
    }
);

export default Room;