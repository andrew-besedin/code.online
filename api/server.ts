import express from "express";

const PORT = 3033;

const app = express();

app.use(express.json());


app.get("/", (req, res) => {
    res.send({ success: false });
});

app.get("/api", (req, res) => {
    res.send({ success: true });
});

app.listen(PORT, () => console.log(`App is listening port ${PORT}`));