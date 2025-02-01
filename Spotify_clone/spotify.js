console.log("welcome to spotify");

let songIndex=0;
let audioElement = new Audio('./songs/1.mp3');


let masterPlay=document.getElementById('masterPlay');
let myProgressBar=document.getElementById('myProgressBar');
let gif=document.getElementById('gif');
let masterSongName=document.getElementById('masterSongName');
let songItems=Array.from(document.getElementsByClassName('songItems'));


    document.getElementById("masterPlay").addEventListener("click", () => {
        audioElement.play();
    });

    
let songs=[
    { songName:"Luther",filePath:"./songs/1.mp3",coverPath:"./covers/1.jpg"},
    {songName:"All the stars",filePath:"./songs/2.mp3",coverPath:"./covers/2.jpg"},
    {songName:"I warned myself",filePath:"./songs/3.mp3",coverPath:"./covers/3.jpg"},
    {songName:"Tragedy",filePath:"./songs/4.mp3",coverPath:"./covers/4.jpg"},
    {songName:"California Winter",filePath:"./songs/5.mp3",coverPath:"./covers/5.jpg"},
    {songName:"How?",filePath:"./songs/6.mp3",coverPath:"./covers/6.jpg"},
    {songName:"Speed of Light",filePath:"./songs/7.mp3",coverPath:"./covers/7.jpg"},
    {songName:"Attention",filePath:"./songs/8.mp3",coverPath:"./covers/8.jpg"},
]





//this is og
songItems.forEach((element,i)=>{
    element.getElementsByTagName("img")[0].src=songs[i].coverPath;
    element.getElementsByClassName("songName")[0].innerText=songs[i].songName;
})

const makeAllPlays=()=>{
    Array.from(document.getElementsByClassName('songItemPlay')).forEach((element)=>{
        element.classList.remove('fa-pause-circle');
        element.classList.add('fa-play-circle');
    })

}



let songTimes = {}; // Store playback positions for each song

Array.from(document.getElementsByClassName('songItemPlay')).forEach((element) => {
    element.addEventListener('click', (e) => {
        let clickedIndex = parseInt(e.target.id)-1;

        // Save the current song's playback time before switching
        if (songIndex !== undefined) {
            songTimes[songIndex] = audioElement.currentTime || 0;
        }

        // If the same song is clicked, toggle play/pause
        if (songIndex === clickedIndex && !audioElement.paused) {
            audioElement.pause();
            e.target.classList.remove('fa-pause-circle');
            e.target.classList.add('fa-play-circle');
            masterPlay.classList.remove('fa-pause-circle');
            masterPlay.classList.add('fa-play-circle');
            gif.style.opacity = 0;
        } else {
            makeAllPlays();
            songIndex = clickedIndex;
            let resumeTime = songTimes[songIndex] || 0; // Retrieve saved time if exists

            audioElement.src = `./songs/${songIndex +1}.mp3`;
            audioElement.currentTime = resumeTime; // Resume from saved time
            audioElement.play();

            e.target.classList.remove('fa-play-circle');
            e.target.classList.add('fa-pause-circle');
            masterSongName.innerHTML = songs[songIndex].songName;
            gif.style.opacity = 1;
            masterPlay.classList.remove('fa-play-circle');
            masterPlay.classList.add('fa-pause-circle');
        }
    });
});




document.getElementById('next').addEventListener('click',()=>{
    if(songIndex>= songs.length - 1){
        songIndex=0;
    }
    else{
        songIndex=songIndex+1;

    }
    audioElement.src=`./songs/${songIndex+1}.mp3`;
    masterSongName.innerHTML=songs[songIndex].songName;
        audioElement.currentTime=0;
        audioElement.play();
        masterPlay.classList.remove('fa-play-circle');
        masterPlay.classList.add('fa-pause-circle');
})


document.getElementById('previous').addEventListener('click',()=>{
    if(songIndex<0){
        songIndex=0;
    }
    else{
        songIndex=songIndex-1;

    }
    audioElement.src=`./songs/${songIndex+1}.mp3`;
    masterSongName.innerHTML=songs[songIndex].songName;
        audioElement.currentTime=0;
        audioElement.play();

        masterPlay.classList.remove('fa-play-circle');
        masterPlay.classList.add('fa-pause-circle');

})



audioElement.addEventListener('timeupdate',()=>{
    //update seek bar
    progress=parseFloat((audioElement.currentTime/audioElement.duration)*100);
    myProgressBar.value=progress;
});

myProgressBar.addEventListener('change',()=>{
    audioElement.currentTime=myProgressBar.value * audioElement.duration / 100; 
})





let isPlaying = false;
gif.style.opacity=0;

masterPlay.addEventListener('click', async (e) => {
    e.stopPropagation(); // Prevent event bubbling

    try {
        if (!isPlaying) {
            gif.style.opacity=1;

            await audioElement.play();
            isPlaying = true;
            masterPlay.classList.remove('fa-play-circle');
            masterPlay.classList.add('fa-pause-circle');
        }  else{
            gif.style.opacity=0;
            audioElement.pause();
            isPlaying = false;
            masterPlay.classList.remove('fa-pause-circle');
            masterPlay.classList.add('fa-play-circle');
        }
    } catch (error) {
        console.error('Error playing/pausing audio:', error);
    }
});

// Add event listeners to update isPlaying state
audioElement.addEventListener('play', () => {
    isPlaying = true;

});

audioElement.addEventListener('pause', () => {
    isPlaying = false;
});

audioElement.addEventListener('ended', () => {
    isPlaying = false;
    masterPlay.classList.remove('fa-pause-circle');
    masterPlay.classList.add('fa-play-circle');
});



// audioElement.addEventListener('ended', () => {
//     document.getElementById('next').click(); // Simulates clicking "Next"
// });


audioElement.addEventListener('ended', () => {
    while (songIndex < songs.length - 1) {
        songIndex++;
        audioElement.src = songs[songIndex].filePath;
        masterSongName.innerHTML = songs[songIndex].songName;
        audioElement.currentTime = 0;
        audioElement.play();
        masterPlay.classList.remove('fa-play-circle');
        masterPlay.classList.add('fa-pause-circle');
        return; // Exit loop after playing next song
    }

    // If last song ends, stop playback
    masterPlay.classList.remove('fa-pause-circle');
    masterPlay.classList.add('fa-play-circle');
    gif.style.opacity = 0;
    audioElement.currentTime = 0;
});



//3rd code

// Function to load and display song durations
function loadSongDurations() {
    songItems.forEach((element, i) => {
        let audio = new Audio(songs[i].filePath);
        let durationElement = element.getElementsByClassName("songDuration")[0];

        // Debugging: Check if the element exists
        if (!durationElement) {
            console.warn(`Duration element not found for song index ${i}`);
            return;
        }

        // Wait for metadata to load, then update duration
        audio.addEventListener("loadedmetadata", () => {
            let duration = formatTime(audio.duration);
            console.log(`Loaded duration for ${songs[i].songName}: ${duration}`); // Debugging
            durationElement.innerText = duration;
        });

        // Error handling for loading issues
        audio.addEventListener("error", () => {
            console.error(`Error loading ${songs[i].filePath}`);
        });
    });
}

// Function to format time (e.g., 125 sec → 2:05)
function formatTime(seconds) {
    let min = Math.floor(seconds / 60);
    let sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}

// Call function after DOM is loaded
document.addEventListener("DOMContentLoaded", loadSongDurations);


//change

window.addEventListener('resize', adjustFontSize); // Listen for window resize

function adjustFontSize() {
    const masterSongName = document.getElementById('masterSongName');
    if (window.innerWidth <= 600) {
        // For small screens (phones)
        masterSongName.style.fontSize = '18px';
        masterSongName.style.color = '#FFFFFF'; // White color for better visibility
    } else {
        // For larger screens (tablets, desktops)
        masterSongName.style.fontSize = '24px';
        masterSongName.style.color = '#FF6347'; // Tomato color
    }
}

// Call the function on page load to set the initial size
adjustFontSize();
