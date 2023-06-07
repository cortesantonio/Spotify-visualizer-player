
// Crea una instancia de la API de Spotify
var spotifyApi = new SpotifyWebApi();
var accessToken = null;
var coverContainer = document.getElementById('cover-container');
var currentCoverUrl = null;



// Autoriza con Spotify
function authorizeSpotify() {
  var clientId = 'YOUR CLIENT ID FROM SPOTIFY DEVELOPER PROJECT';
  var redirectUri = 'YOUR URL';
  var scopes = ['user-read-playback-state', 'user-modify-playback-state'];


  var url = 'https://accounts.spotify.com/authorize';
  url += '?response_type=token';
  url += '&client_id=' + encodeURIComponent(clientId);
  url += '&redirect_uri=' + encodeURIComponent(redirectUri);
  url += '&scope=' + encodeURIComponent(scopes.join(' '));

  window.location.href = url;


}

// Callback para obtener el token de acceso desde la URL de redirección
function handleAccessToken() {
  var hashParams = {};
  var hash = window.location.hash.substring(1);
  var regex = /([^&;=]+)=?([^&;]*)/g;
  var match;

  while ((match = regex.exec(hash))) {
    hashParams[match[1]] = decodeURIComponent(match[2]);
  }

  accessToken = hashParams.access_token;

  if (accessToken) {
    var btnLogin = document.getElementById('autorize').style;
    btnLogin.display = 'none';
    spotifyApi.setAccessToken(accessToken);
    getCurrentlyPlayingTrackCover();
  }
}

// Obtén la carátula de la canción en reproducción
function getCurrentlyPlayingTrackCover() {
  spotifyApi.getMyCurrentPlayingTrack().then(function (data) {
    var imageUrl = data.item.album.images[0].url;

    // Verifica si la carátula ha cambiado
    if (imageUrl !== currentCoverUrl) {
      // Actualiza la carátula
      updateCover(imageUrl);
      currentCoverUrl = imageUrl;
    }
  }).catch(function (error) {
    console.error('Error al obtener la información de la canción:', error);
  });
}


// Obtén la información de la canción en reproducción
function getCurrentlyPlayingTrackInfo() {
  spotifyApi.getMyCurrentPlayingTrack().then(function (data) {
    var track = data.item;
    var songName = track.name;
    var artistName = track.artists[0].name;
    console.log(track.artists.length)

    // Actualiza la información de la canción
    updateSongInfo(songName, artistName);

    var imageUrl = track.album.images[0].url;

    // Verifica si la carátula ha cambiado
    if (imageUrl !== currentCoverUrl) {
      // Actualiza la carátula
      updateCover(imageUrl);
      currentCoverUrl = imageUrl;
    }
  }).catch(function (error) {
    console.error('Error al obtener la información de la canción:', error);
  });
}

// Actualiza la información de la canción en el contenedor
function updateSongInfo(songName, artistName) {
  var songInfoContainer = document.getElementById('nombre-cancion');
  songInfoContainer.innerHTML = songName;

  var songInfoContainerArtist = document.getElementById('artista');
  songInfoContainerArtist.innerHTML = artistName;

}

// Actualiza la carátula en el contenedor
function updateCover(imageUrl) {

  var coverImg = document.getElementById('cover-container');
  coverImg.src = imageUrl;
  var coverImgBackground = document.getElementById('background-media')
  coverImgBackground.src = imageUrl;

}

// Reproducir una canción
function play() {
  spotifyApi.play().then(function () {
    console.log('Reproduciendo');
  }).catch(function (error) {
    console.error('Error al reproducir:', error);
  });
}

// Pausar la reproducción
function pause() {
  spotifyApi.pause().then(function () {
    console.log('Pausado');
  }).catch(function (error) {
    console.error('Error al pausar:', error);
  });
}

// Ir a la siguiente canción
function next() {
  spotifyApi.skipToNext().then(function () {
    console.log('Siguiente canción');
    // Espera un breve momento y actualiza la carátula
    setTimeout(getCurrentlyPlayingTrackCover, 500);
  }).catch(function (error) {
    console.error('Error al ir a la siguiente canción:', error);
  });
}

// Ir a la canción anterior
function previous() {
  spotifyApi.skipToPrevious().then(function () {
    console.log('Canción anterior');
    // Espera un breve momento y actualiza la carátula
    setTimeout(getCurrentlyPlayingTrackCover, 500);
  }).catch(function (error) {
    console.error('Error al ir a la canción anterior:', error);
  });
}

// Inicia la verificación periódica de la carátula
function startCoverUpdate() {
  setInterval(getCurrentlyPlayingTrackInfo, 1000)
  setInterval(getCurrentlyPlayingTrackCover, 3000); // Verifica cada 3 segundos
}

// Maneja el token de acceso al cargar la página
window.addEventListener('load', function () {
  handleAccessToken();
  startCoverUpdate();


});
