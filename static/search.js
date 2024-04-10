const form = document.getElementById("song-form");
const songInput = document.getElementById("song");

form.addEventListener("submit", function (e) {
    e.preventDefault();
    window.location = 'http://127.0.0.1:8000/add_song_to_playlist?song=' + songInput.value;
});