import React from 'react';
import { Container } from 'react-bootstrap';
//Lien d'authorisation avec les scopes
const AUTH_URL = "https://accounts.spotify.com/authorize?client_id=069f98556faa430ea3cf900f87f6dafd&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state%20user-follow-modify"

export default function Login() {
  //Se connecte au compte Spotify qui lui redirige vers le localhost:3000
  return (
    <Container className="d-flex justify-content-center
    align-items-center" style={{ minHeight: '100vh' }}>
      <a className="btn btn-success btn-lg" href={AUTH_URL}>
        Login With Spotify
      </a>
    </Container>
  )
}
