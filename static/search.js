// Configuration for the WebSocket connection
const form = document.getElementById("song-form");
const songInput = document.getElementById("song");

form.addEventListener("submit", function (e) {
    e.preventDefault();
    window.location = 'http://0.0.0.0:5017/add_song_to_playlist?song=' + songInput.value;
});