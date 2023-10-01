require('dotenv').config();

const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


const postSchema = new mongoose.Schema({
    image: String,
    caption: String,
    upvote:{
        type: Number,
        default: 0
    },
    comment:{
        type: [String],
        default: []
    }
});


const Post = mongoose.model("Post", postSchema);


app.get("/", (req, res) => {
    res.send("Use /posts to checkout all posts");
})

app.use("/posts", (req, res)=>{
    res.json(Post);
});


app.put("/posts/:id", (req, res)=>{
    Post.findById(req.params.id).then((post)=>{
        post.upvote = req.body.upvote;
        post.save().then((post)=>{
            res.json(post);
        })
    })
})

app.put("/posts/:id", (req, res)=>{
    Post.findById(req.params.id).then((post)=>{
        post.comment = req.body.comment;
        post.save().then((post)=>{
            res.json(post);
        })
    })
})


app.delete("/posts/:id", (req, res)=>{
    Post.findByIdAndDelete(req.params.id).then((post)=>{
        res.json(post);
    })
})


app.listen(PORT, () => {
    console.log(`Server up in http://localhost:${PORT}`);
    mongoose.connect(process.env.MONGODB_URI).then(()=>{
        console.log("Connected to MongoDB");
    })
})