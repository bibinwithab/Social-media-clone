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

app.get("/posts", async (req, res)=>{
    const allPost = await Post.find({});
    res.send(allPost)
});

app.get("/posts/:id", async (req, res)=>{
    const id = req.params.id;

    const post = await Post.findById(id);
    
    res.send(post);
})

app.put("/posts/:id", async (req, res)=>{
    const id = req.params.id;
    const caption = req.body.caption;

    const post = await Post.findById(id);

    if(caption){
        post.caption = caption;
    }

    await post.save();
    res.send(post);
})

app.post("/posts", async (req, res)=>{
    const image = req.body.image;
    const caption = req.body.caption;

    const newPost = new Post({
        image: image,
        caption: caption
    })

    await newPost.save();
    res.send(newPost);
})

app.put("/posts/:id/comment", async (req, res)=>{
    const id = req.params.id;
    const comment = req.body.comment;

    const post = await Post.findById(id);

    if (post) {
        post.comment.push(comment);
    }
    
    await post.save();
    res.send(post);
})

app.put("/posts/:id/upvote", async (req, res)=>{
    const id = req.params.id;

    const post = await Post.findById(id);

    if (post) {
        post.upvote += 1;
    }

    await post.save();
    res.send(post);
})

app.put("/posts/:id/downvote", async (req, res)=>{
    const id = req.params.id;

    const post = await Post.findById(id);

    if (post) {
        post.upvote -= 1;
    }

    await post.save();
})

app.delete("/posts/:id", async (req, res)=>{
    const id = req.params.id;
    await Post.findByIdAndDelete(id);
    res.send("Deleted")
})


app.listen(PORT, () => {
    console.log(`Server up in http://localhost:${PORT}`);
    mongoose.connect(process.env.MONGODB_URI).then(()=>{
        console.log("Connected to MongoDB");
    })
})