const express = require('express');
const Post = require('../models/Post');

const router = express.Router();


//Get back all the posts
router.get('/read', async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (err) {
        res.json({ message: err });
    }
});

//Submit a post
router.post('/insert', async (req, res) => {
    const post = new Post({
        title: req.body.title,
        artist: req.body.artist
    });
    try {
        const savedPost = await post.save();
        res.json(savedPost);
    } catch (err) {
        res.json({ message: err })
    }
});

//Specific post 
router.get('/:postId', async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        res.json(post);
    } catch (err) {
        res.json({ message: err })
    }
})

//Delete post
router.delete('/delete/:id', async (req, res) => {
    try {
        const removedPost = await Post.remove({ _id: req.params.id })
        res.json(removedPost)
    } catch (err) {
        res.json({ message: err })
    }
})

//Update a post 
router.patch('/:postId', async (req, res) => {
    try {
        const updatedPost = await Post.updateOne({ _id: req.params.postId },
            { $set: { name: req.body.name } });
        res.json(updatedPost);
    } catch (err) {
        res.json({ message: err })
    }
})

module.exports = router;