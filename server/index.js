// Import required dependencies
require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require('mongoose')
const PORT = process.env.PORT || 8000;

// Middleware setup
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)
app.use(express.json()); // Parse JSON request bodies

// Define a Mongoose schema for posts
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

// Create a Mongoose model for posts
const Post = mongoose.model("Post", postSchema);

// Define routes and their corresponding handlers

// Default route
app.get("/", (req, res) => {
    res.send("Use /posts to check out all posts");
})

// Get all posts
app.get("/posts", async (req, res)=>{
    const allPost = await Post.find({});
    res.send(allPost)
});

// Get a specific post by ID
app.get("/posts/:id", async (req, res)=>{
    const id = req.params.id;
    const post = await Post.findById(id);
    res.send(post);
})

// Update a post's caption
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

// Create a new post
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

// Add a comment to a post
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

// Upvote a post
app.put("/posts/:id/upvote", async (req, res)=>{
    const id = req.params.id;
    const post = await Post.findById(id);

    if (post) {
        post.upvote += 1;
    }

    await post.save();
    res.send(post);
})

// Downvote a post (Note: It updates the upvote count but doesn't send a response)
app.put("/posts/:id/downvote", async (req, res)=>{
    const id = req.params.id;
    const post = await Post.findById(id);

    if (post) {
        post.upvote -= 1;
    }

    await post.save();
    res.send(post);
})

// Delete a post by ID
app.delete("/posts/:id", async (req, res)=>{
    const id = req.params.id;
    await Post.findByIdAndDelete(id);
    res.send("Deleted")
})

// Start the server and connect to MongoDB
app.listen(PORT, () => {
    console.log(`Server up in http://localhost:${PORT}`);
    mongoose.connect(process.env.MONGODB_URI).then(()=>{
        console.log("Connected to MongoDB");
    })
})
