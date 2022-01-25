const mongoose = require('mongoose');

//Modèle de la Data dans la BDD
const PostSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Ma Playlist', PostSchema);