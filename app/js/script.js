const { desktopCapturer, remote } = require('electron');
const videoElement = document.getElementById('video');

let media;

// Select functionality
const popup = document.getElementById('popup');
const select = document.getElementById('select');
select.addEventListener('click', () => selectMediaStream());
const imgStringPrefix = 'data:image/Bmp;base64,';

function addMediaSourceToDocument(sources) {
    sources.map(source => {
        //console.log(source);
        let div = document.createElement('div');
        div.classList.add('sourceCard');

        let p = document.createElement('p');
        let text = document.createTextNode(source.name);
        p.appendChild(text);

        p.app
        let img = document.createElement('img');
        img.src = source.thumbnail.toDataURL();
        //console.log(img.src);
        div.appendChild(p);
        div.appendChild(img);
        popup.appendChild(div);
    });
}

async function selectMediaStream() {
    try {
        if (!popup.classList.contains('show')) {
            // popup.children.map(child => popup.removeChild(child));

            const inputSources = await desktopCapturer.getSources({
                types: ['window', 'screen'],
                thumbnailSize: {
                    width: 200,
                    height: 200,
                }
            });
            addMediaSourceToDocument(inputSources);
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

// Record functionality
const record = document.getElementById('record');
record.addEventListener('click', () => console.log('record clicked'));
const recordedChunks = [];
// Stop functionality
const stop = document.getElementById('stop');
stop.addEventListener('click', () => { });