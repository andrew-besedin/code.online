import express from "express";
import router from "./routers/route";
import cookieParser from "cookie-parser";
import User from "./models/User";
import sequelize from "./sequelize";
import tryCatch from "./utils/tryCatch";

const PORT = 3033;
    
(async () => {
    await sequelize.authenticate();
    await sequelize.sync(); 

    const app = express(); 

    app.use(express.json());
    app.use(cookieParser());

    app.use("/api", [ router ]);

    User.toString();

    app.listen(PORT, () => console.log(`App is listening port ${PORT}`));
})();