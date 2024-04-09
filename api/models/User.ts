import { DataTypes, Model } from "sequelize";
import sequelize from "../sequelize";
import Room from "./Room";

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

User.hasMany(Room, {
    foreignKey: "owner_id",
});
Room.belongsTo(User, {
    foreignKey: "owner_id",
});

export default User;