import { useState, useEffect, useMemo } from 'react';
import { Container, Form } from 'react-bootstrap';
import useAuth from '../useAuth';
import Player from '../Player';
import TrackSearchResult from '../TrackSearchResult';
import SpotifyWebApi from 'spotify-web-api-node';
import axios from 'axios';
import "@progress/kendo-theme-material/dist/all.css";
import { Chart } from 'react-google-charts'


const spotifyApi = new SpotifyWebApi({
    clientId: "069f98556faa430ea3cf900f87f6dafd",
});

export default function ArtistBestTracks({ accessToken, playingTrack }) {

    //Declaration des variables globales
    const [top1, setTop1] = useState("");
    const [top2, setTop2] = useState("");
    const [top3, setTop3] = useState("");
    const [pop1, setPop1] = useState("");
    const [pop2, setPop2] = useState("");
    const [pop3, setPop3] = useState("");

    //Récupère les 3 musiques les plus écoutées de l'artiste
    useEffect(() => {
        if (!playingTrack) return

        axios.get('http://localhost:3001/lyrics', {
            params: {
                track: playingTrack.title,
                artist: playingTrack.artist
            }
        }).then(res => {

            spotifyApi.setAccessToken(accessToken);
            spotifyApi.searchArtists(playingTrack.artist)
                .then(function (res) {

                    console.log('Search artists', res.body.artists.items[0].id);

                    spotifyApi.getArtistTopTracks(res.body.artists.items[0].id, 'FR').then((data) => {
                        let topArtists = data.body;

                        setTop1(topArtists.tracks[0].name);
                        setTop2(topArtists.tracks[1].name);
                        setTop3(topArtists.tracks[2].name);

                        setPop1(topArtists.tracks[0].popularity);
                        setPop2(topArtists.tracks[1].popularity);
                        setPop3(topArtists.tracks[2].popularity);

                    }, (err) => {
                        console.log('Something went wrong!', err);
                    });

                }, function (err) {
                    console.error(err);
                });

        })
    }, [playingTrack])

    return (
        <div className="k-mb-4">
            <div className="text-center" style={{ whitespace: "pre" }}>
                <Chart
                    width={'500px'}
                    height={'300px'}
                    chartType="PieChart"
                    loader={<div>Loading Chart</div>}
                    data={[
                        ['Task', 'Hours per Day'],
                        [top1, pop1],
                        [top2, pop2],
                        [top3, pop3],

                    ]}
                    options={{
                    }}
                    rootProps={{ 'data-testid': '1' }}
                />
            </div>
        </div>
    );
}