import {
  useState,
  useEffect,
  useMemo
} from 'react';
import {
  Container,
  Form
} from 'react-bootstrap';
import useAuth from './useAuth';
import Player from './Player';
import TrackSearchResult from './TrackSearchResult';
import SpotifyWebApi from 'spotify-web-api-node';
import 'custom-piano-keys'
import {
  Link
} from "react-router-dom";
import "@progress/kendo-theme-material/dist/all.css";
import {
  TileLayout
} from "@progress/kendo-react-layout";
import "./Dashboard.css";
import ChordDisplayer from "./components/ChordDisplayer"
import Lyrics from "./components/Lyrics"
import FollowButton from "./components/FollowButton"
import ArtistBestTracks from "./components/ArtistBestTracks"
import {
  Switch
} from "@progress/kendo-react-inputs";

const spotifyApi = new SpotifyWebApi({
  clientId: "069f98556faa430ea3cf900f87f6dafd",
});

//Initialisation de la position des Widgets
const initialPositions = [{
  widgetId: "1",
  col: 1,
  colSpan: 2,
  rowSpan: 2,
},
{
  widgetId: "2",
  col: 3,
  colSpan: 1,
  rowSpan: 1,
},
{
  widgetId: "3",
  col: 4,
  colSpan: 1,
  rowSpan: 1,
},
{
  widgetId: "4",
  col: 3,
  colSpan: 2,
  rowSpan: 2,
},
];

const getPositions = initialPositions => {
  // Try to get positions from local storage
  // If we have none in the storage then default to initial positions
  return (
    JSON.parse(localStorage.getItem("dashboard-positions")) || initialPositions
  );
};

export default function Dashboard({
  code
}) {
  //Declaration des variables globales
  const accessToken = useAuth(code)
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playingTrack, setPlayingTrack] = useState();
  const [lyrics, setLyrics] = useState("");
  const [positions, setPositions] = useState(getPositions(initialPositions));

  //Choix de piste
  function chooseTrack(track) {
    setPlayingTrack(track)
    setSearch('')
    setLyrics('')
  }

  //Set le access Token pour la connection avec l'API Spotify
  useEffect(() => {
    if (!accessToken) return
    spotifyApi.setAccessToken(accessToken)
  }, [accessToken])

  //Configuration des Widgets
  var widgetsConfig = [{
    id: "1",
    header: "Lyrics",
    body: < Lyrics playingTrack={
      playingTrack
    }
      searchResults={
        searchResults
      }
    />,
    active: true,
  },
  {
    id: "2",
    header: "Artists best Tracks",
    body: < ArtistBestTracks accessToken={
      accessToken
    }
      playingTrack={
        playingTrack
      }
    />,
    active: true,
  },
  {
    id: "3",
    header: "Follow button",
    body: < FollowButton accessToken={
      accessToken
    }
      playingTrack={
        playingTrack
      }
    />,
    active: true,
  },
  {
    id: "4",
    header: "Chord displayer",
    body: < ChordDisplayer />,
    active: true,
  },
  ];
  const [widgets, setWidgets] = useState(widgetsConfig);

  //Composant agissant sur les recherches
  useEffect(() => {
    if (!search) return setSearchResults([])
    if (!accessToken) return

    let cancel = false
    spotifyApi.searchTracks(search).then(res => {
      if (cancel) return
      setSearchResults(res.body.tracks.items.map(track => {
        const smallestAlbumImage = track.album.images.reduce(
          (smallest, image) => {
            if (image.height < smallest.height) return image
            return smallest
          }, track.album.images[0])

        return {
          artist: track.artists[0].name,
          title: track.name,
          uri: track.uri,
          albumUrl: smallestAlbumImage.url
        }
      }))
    })
    return () => cancel = true
  }, [search, accessToken])




  // Filter out widgets that are inactive
  const activeWidgets = useMemo(() => {
    return widgets.reduce((acc, widget) => {
      // Bail out if widget is not active
      if (!widget.active) return acc;
      // Widget is active, so add it
      acc.push(widget);
      return acc;
    }, []);
  }, [widgets]);

  // Get positions only for active widgets
  // We use position.widgetId to get only active widgets
  const filteredPositions = useMemo(() => {
    return positions.filter(position => {
      // Find a matching widget using the id in the position id and return its active value
      return activeWidgets.find(widget => widget.id === position.widgetId)
        ?.active;
    });
  }, [activeWidgets, positions]);

  //Gère la reposition des Widgets
  const handleReposition = e => {
    setPositions(e.value);
    localStorage.setItem("dashboard-positions", JSON.stringify(e.value));
  };

  //Remet les Widgets dans leur position initiale
  const onResetLayout = () => {
    setPositions(initialPositions);
    localStorage.setItem(
      "dashboard-positions",
      JSON.stringify(initialPositions)
    );
  };

  //Permet d'activer/désactiver un Widget
  const onToggleWidget = e => {
    const {
      id
    } = e.target.props;
    const {
      value
    } = e.target;
    const updatedWidgets = widgets.map(widget => {
      if (widget.id === id) {
        return {
          ...widget,
          active: value,
        };
      }
      return widget;
    });
    setWidgets(updatedWidgets);
  };

  useEffect(() => {
    if (!playingTrack) return
    if (!searchResults) return
    setWidgets(widgetsConfig)
  }, [playingTrack, searchResults])

  return (
    <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}>
      <div className="App">
        <Form.Control type="search" placeholder="Search Songs/Artists" value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
          {searchResults.map(track => (
            <TrackSearchResult track={track} key={track.uri} chooseTrack={chooseTrack} />
          ))}
        </div>
        <div className="k-display-flex">
          <TileLayout
            columns={4}
            rowHeight={255}
            positions={filteredPositions}
            gap={{ rows: 10, columns: 10 }}
            items={activeWidgets}
            onReposition={handleReposition}
            className="tileLayout"
          />
          <aside className="k-ml-4 dashboardAside">
            <div className="k-mb-6">
              <button className="k-button" onClick={onResetLayout}>
                Reset layout
              </button>
            </div>
            <div>
              <h2 className="k-mb-4">Toggle Widgets</h2>
              <div>
                {widgets.map(widget => {
                  return (
                    <div className="k-mb-2" key={widget.id}>
                      <Switch
                        checked={widget.active}
                        onChange={onToggleWidget}
                        id={widget.id}
                      />
                      <label className="k-ml-3">{widget.header}</label>
                    </div>
                  );
                })}
              </div>
            </div>
            <button className="btn btn-success btn-lg">
              <Link
                style={{ textDecoration: "none", color: "white" }}
                to="/Playlist">
                Ma Playlist
              </Link>
            </button>
          </aside>
        </div>
        <div>
          <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
        </div>
      </div>
    </Container>);
}