require('dotenv').config();

const express = require("express");
const app = express();
const cors = require("cors");

const PORT = process.env.PORT || 3000;

app.use(cors());

app.get("/", (req, res) => {
    res.send("Use /post to checkout all posts");
})

app.listen(PORT, () => {
    console.log(`Server up in http://localhost:${PORT}`);
})