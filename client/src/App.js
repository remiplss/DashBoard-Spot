import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Login';
import Dashboard from './Dashboard';
import Playlist from './Playlist';
import Logo from './images/Tuner.png';

import { Route, Routes } from 'react-router-dom'
const code = new URLSearchParams(window.location.search).get('code')

function App() {
  return (
    <div>
      <img src={Logo} alt="logo" />
      <Routes>
        <Route path="/" element={code ? <Dashboard code={code} /> : <Login />} />
        <Route path="/playlist" element={<Playlist />} />
      </Routes>
    </div>
  )
}

export default App;
