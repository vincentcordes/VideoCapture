const { desktopCapturer, remote } = require('electron');

const select = document.getElementById('select');
const record = document.getElementById('record');
const stop = document.getElementById('stop');
const popup = document.getElementById('popup')
const videoElement = document.getElementById('video');

record.addEventListener('click', () => console.log('record clicked'));

let media;
const recordedChunks = [];

async function selectMediaStream() {
    try {
        if (!popup.classList.contains('show')) {
            const inputSources = await desktopCapturer.getSources({
                types: ['window', 'screen']
            });
            console.log(inputSources);
            popup.classList.add('show');
        }
        else
            popup.classList.remove('show');
        // console.log('create media stream');
        // const mediaStream = await navigator.mediaDevices.getUserMedia();
        // //const mediaStream = await navigator.mediaDevices.getDisplayMedia();
        // console.log('set video source')
        // videoElement.srcObject = mediaStream;
        // videoElement.onloadedmetadata = () => {
        //     videoElement.play();
        // }
    } catch (error) {
        console.log(error);
    }
}

select.addEventListener('click', () => selectMediaStream());
