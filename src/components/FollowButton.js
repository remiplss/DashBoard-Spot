import { useState, useEffect, useMemo } from 'react';
import { Container, Form } from 'react-bootstrap';
import useAuth from '../useAuth';
import Player from '../Player';
import TrackSearchResult from '../TrackSearchResult';
import SpotifyWebApi from 'spotify-web-api-node';
import axios from 'axios';
import "@progress/kendo-theme-material/dist/all.css";

const spotifyApi = new SpotifyWebApi({
    clientId: "069f98556faa430ea3cf900f87f6dafd",
});

export default function FollowButton({ accessToken, playingTrack }) {
    //Declaration des variables globales
    const [lyrics, setLyrics] = useState("");
    const [artist, setArtist] = useState("");

    //Follow l'artiste actuellement écouté
    function Follow() {
        axios.get('http://localhost:3001/lyrics', {
            params: {
                track: playingTrack.title,
                artist: playingTrack.artist
            }
        }).then(res => {
            spotifyApi.searchArtists(playingTrack.artist)
                .then(function (res) {
                    setArtist(res.body.artists.items[0])
                    console.log('Search artists', res.body.artists.items[0].id);

                    spotifyApi.setAccessToken(accessToken);

                    spotifyApi.followArtists([res.body.artists.items[0].id])
                        .then(() => {

                            alert("Vous suivez maintenant " + res.body.artists.items[0].id)
                        }, err => {
                            console.log('Something went wrong!', err);
                        });
                }, function (err) {
                    console.error(err);
                });
        })
    }
    return (
        <div className="k-mb-4">
            <a className="btn btn-success btn-lg" onClick={Follow}>
                Follow Artist
            </a>
        </div>
    );
}