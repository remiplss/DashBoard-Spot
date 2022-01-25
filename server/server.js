const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const bodyParser = require('body-parser');
const lyricsFinder = require('lyrics-finder');
const SpotifyWebApi = require('spotify-web-api-node');

require('dotenv/config');
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Import Routes
const postsRoute = require('./routes/posts');

app.use('/posts', postsRoute);


//Connect To DB
mongoose.connect(
    'mongodb+srv://admin:admin@cluster0.xywxd.mongodb.net/cluster0?retryWrites=true&w=majority',
    { useNewUrlParser: true }, () => {
        console.log('Connected to DataBase')
    })

app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken
    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: '069f98556faa430ea3cf900f87f6dafd',
        clientSecret: 'aa69aa7fefcc4f1ab0df91a14e7b65c5',
        refreshToken,
    })

    spotifyApi.refreshAccessToken()
        .then(data => {
            res.json({
                accessToken: data.body.accessToken,
                expiresIn: data.body.expiresIn,
            })
        }).catch(err => {
            console.log(err)
            res.sendStatus(400);
        })
})
app.post('/login', (req, res) => {
    const code = req.body.code;
    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: '069f98556faa430ea3cf900f87f6dafd',
        clientSecret: 'aa69aa7fefcc4f1ab0df91a14e7b65c5'

    })

    spotifyApi.authorizationCodeGrant(code).then(data => {
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in,
        })
    }).catch((err) => {
        console.log(err)
        res.sendStatus(400)
    })
})

app.get('/lyrics', async (req, res) => {
    const lyrics = (await lyricsFinder(req.query.artist, req.query.track)) || "No Lyrics Found"
    res.json({ lyrics })
})

app.listen(3001)