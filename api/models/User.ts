import { DataTypes, Model } from "sequelize";
import sequelize from "../sequelize";

class User extends Model {
    declare id: number;
}

User.init(
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
    },
    {
        sequelize,
        modelName: "users",
    }
);

export default User;