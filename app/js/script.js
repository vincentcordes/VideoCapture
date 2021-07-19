const { desktopCapturer, remote } = require('electron');
const videoElement = document.getElementById('video');

let media;

// Select functionality
const popupBase = document.getElementById('popup-container-base');
const popupItems = document.getElementById('popup-items');
const select = document.getElementById('select');
select.addEventListener('click', () => openMediaSources());

function stripNameLength(name) {
    let newName = '';
    if (name.length > 15) {
        for (let i = 0; i < 15; i++) {
            newName += name[i];
        }
        newName += '...';
    }
    else
        newName = name;

    return newName;
}

const removeChildren = (parent) => {
    while (parent.lastChild) {
        parent.removeChild(parent.lastChild);
    }
};

function addMediaSourceToDocument(sources) {
    removeChildren(popupItems);
    sources.map(source => {
        // card for source info to sit in
        let div = document.createElement('div');
        div.classList.add('sourceCard');

        // make card title
        let p = document.createElement('p');
        let text = document.createTextNode(stripNameLength(source.name));
        p.appendChild(text);

        // card image
        let img = document.createElement('img');
        img.src = source.thumbnail.toDataURL();

        // put it together in order
        div.appendChild(p);
        div.appendChild(img);
        // add click event 
        div.addEventListener('click', () => { selectMediaStream(source); });

        popupItems.appendChild(div);
    });
}

async function openMediaSources() {
    try {
        if (popupBase.classList.contains('hide')) {
            const inputSources = await desktopCapturer.getSources({
                types: ['window', 'screen'],
                thumbnailSize: {
                    width: 150,
                    height: 150,
                }
            });
            addMediaSourceToDocument(inputSources);

            popupBase.classList.remove('hide');
            popupBase.classList.add('show');
        }
        else {
            popupBase.classList.remove('show');
            popupBase.classList.add('hide');
        }
    } catch (error) {
        console.log(error);
    }
}

async function selectMediaStream(source) {
    try {
        const constraints = {
            audio: false,
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: source.id,
                }
            }
        };

        // Create a Stream
        const stream = await navigator.mediaDevices
            .getUserMedia(constraints); // why for stream null??

        // Preview the source in a video element
        videoElement.srcObject = stream;
        videoElement.play();

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
stop.addEventListener('click', () => { console.log('stop clicked') });

// Help functionality
const help = document.getElementById('help')
help.addEventListener('click', () => { console.log('help clicked') });