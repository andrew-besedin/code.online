import { DataTypes, Model } from "sequelize";
import sequelize from "../sequelize";

class Room extends Model {
    declare id: number;
    declare owner_id: number;
}

Room.init(
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        owner_id: {
            type: DataTypes.BIGINT,
        }
    },
    {
        sequelize,
        modelName: "rooms",
    }
);

export default Room;