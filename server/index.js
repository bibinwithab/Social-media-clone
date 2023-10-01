require('dotenv').config();

const express = require("express");
const app = express();
const cors = require("cors");

const PORT = process.env.PORT || 3000;

app.use(cors());

app.get("/", (req, res) => {
    res.send("Hello World!");
})

app.listen(PORT, () => {
    console.log(`Server up in http://localhost:${PORT}`);
})