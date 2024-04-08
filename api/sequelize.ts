import { Sequelize } from "sequelize";

import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize({
    dialect: 'postgres',
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    username: process.env.PGUSER,
    port: parseInt(process.env.PGPORT || "5432", 10),
    database: process.env.PGDATABASE,
    logging: false
});

export default sequelize;
