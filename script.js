const upload = document.getElementById('upload');
const fileInput = document.getElementById('file-input');
const musicPlayer = document.getElementById('music-player');
const audio = new Audio();
const playButton = document.getElementById("play-btn");
const progressBar = document.getElementById("progress-bar");
const currentTimeElem = document.getElementById("current-time");
const durationElem = document.getElementById("duration");
const songTitle = document.getElementById("song-title");
const thumbnail = document.getElementById("thumbnail");

let playlist = [];
let currentSongIndex = 0;

fileInput.addEventListener('change', function () {
    const files = Array.from(fileInput.files);
    playlist = files.map(file => ({ 
        name: file.name.replace(/\.[^/.]+$/, ''), 
        url: URL.createObjectURL(file)
    }));

    if (playlist.length > 0) {
        loadSong(0); 
    }
});

function loadSong(index) {
    currentSongIndex = index;
    const song = playlist[index];
    audio.src = song.url;
    songTitle.textContent = song.name;
    document.title = song.name;
    audio.load();

    audio.addEventListener('loadedmetadata', () => {
        durationElem.textContent = formatTime(audio.duration);
        progressBar.max = audio.duration;
    });
}

playButton.addEventListener("click", () => {
    if (audio.paused) {
        audio.play();
        playButton.querySelector("i").classList.replace("fa-play", "fa-pause");
    } else {
        audio.pause();
        playButton.querySelector("i").classList.replace("fa-pause", "fa-play");
    }
});

audio.addEventListener("timeupdate", () => {
    currentTimeElem.textContent = formatTime(audio.currentTime);
    progressBar.value = audio.currentTime;

    const playedPercentage = (audio.currentTime / audio.duration) * 100;
    progressBar.style.background = `linear-gradient(to right, #e09c83 ${playedPercentage}%, #f1d4c8 ${playedPercentage}%)`;
});

progressBar.addEventListener("input", () => {
    audio.currentTime = progressBar.value;
});

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secondsFormatted = Math.floor(seconds % 60);
    return `${minutes}:${secondsFormatted < 10 ? '0' + secondsFormatted : secondsFormatted}`;
}