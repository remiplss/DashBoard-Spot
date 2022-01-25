import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Playlist.css";

export default function Playlist() {
    //Declaration des variables globales
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [playlist, setPlaylist] = useState([]);

    //Affiche toutes les musiques de la BDD
    useEffect(() => {
        axios.get('http://localhost:3001/posts/read').then((response) => {
            setPlaylist(response.data);
        });
    }, []);

    //Permet d'ajouter une musique dans la BDD
    const addToPlaylist = () => {
        axios.post('http://localhost:3001/posts/insert', {
            title: title,
            artist: artist
        });
        console.log('Music added to playlist !');
        window.location.reload(false);
    };

    //Permet de supprimer une musique de la BDD
    const deleteMusic = (id) => {
        axios.delete(`http://localhost:3001/posts/delete/${id}`);
        console.log('Music deleted !');
        window.location.reload(false);
    };

    return (
        <div className="playlist">
            <h1>My Playlist</h1>
            <label>Title : </label>
            <input type="text" class='putTitle' onChange={(event) =>
                setTitle(event.target.value)} />
            <label>Artist(s) : </label>
            <input type="text" class='putArtist' onChange={(event) =>
                setArtist(event.target.value)} />
            <button className="btn btn-success btn-lg" onClick={addToPlaylist}>Add to My Playlist</button>
            <h1>Actual Playlist : </h1>
            {playlist.map((val, key) => {
                return (
                    <div key={key} className='music'>
                        <h2>{val.title}</h2>
                        <h2>{val.artist}</h2>
                        <button className="btn btn-success btn-lg" onClick={() => deleteMusic(val._id)}> Delete</button>
                    </div>
                );
            })}
        </div>
    );
}

