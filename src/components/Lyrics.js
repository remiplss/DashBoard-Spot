import {
    useState,
    useEffect,
    useMemo
} from 'react';
import {
    Container,
    Form
} from 'react-bootstrap';
import useAuth from '../useAuth';
import Player from '../Player';
import TrackSearchResult from '../TrackSearchResult';
import SpotifyWebApi from 'spotify-web-api-node';
import axios from 'axios';
import "@progress/kendo-theme-material/dist/all.css";


const spotifyApi = new SpotifyWebApi({
    clientId: "069f98556faa430ea3cf900f87f6dafd",
});

export default function Lyrics({
    playingTrack,
    searchResults
}) {

    //Declaration des variables globales
    const [lyrics, setLyrics] = useState("");
    const [artist, setArtist] = useState("");

    //Récupère les paroles de la musique actuellement écoutée
    useEffect(() => {
        if (!playingTrack) return

        axios.get('http://localhost:3001/lyrics', {
            params: {
                track: playingTrack.title,
                artist: playingTrack.artist

            }

        }).then(res => {
            setLyrics(res.data.lyrics)

            spotifyApi.searchArtists(playingTrack.artist)
                .then(function (res) {
                    setArtist(res.body.artists.items[0])
                    console.log('Search artists', res.body.artists.items[0].id);

                    spotifyApi.getArtistTopTracks(res.body.artists.items[0].id, 'FR').then((data) => {
                        let topArtists = data.body;

                    }, (err) => {
                        console.log('Something went wrong!', err);
                    });

                }, function (err) {
                    console.error(err);
                });

        })
    }, [playingTrack])


    return (

        <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
            {searchResults.length === 0 && (
                <div className="text-center" style={{ whitespace: "pre" }}>
                    {lyrics}
                </div>
            )}
        </div>
    );
}