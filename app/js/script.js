const { desktopCapturer, remote } = require('electron');
const videoElement = document.getElementById('video');

let media;

// Select functionality
const popupContainer = document.getElementById('popup-container');
const select = document.getElementById('select');
select.addEventListener('click', () => getMediaSources());

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

function addMediaSourcesToDocument(sources) {
    removeChildren(popupContainer);
    sources.map(source => {
        // card for source info to sit in
        let div = document.createElement('div');
        div.classList.add('popup-item');

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

        popupContainer.appendChild(div);
    });
}
// Still need to fix this to play media
//http://imfly.github.io/electron-docs-gitbook/en/api/desktop-capturer.html
async function getMediaSources() {
    try {
        if (popupContainer.classList.contains('hide')) {
            const inputSources = await desktopCapturer.getSources({
                types: ['window', 'screen'],
                thumbnailSize: {
                    width: 150,
                    height: 150,
                }
            });
            addMediaSourcesToDocument(inputSources);

            popupContainer.classList.remove('hide');
            popupContainer.classList.add('show');
        }
        else {
            popupContainer.classList.remove('show');
            popupContainer.classList.add('hide');
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
        // const stream = await navigator.mediaDevices
        //     .getUserMedia(constraints); // why for stream null??

        await navigator.webkitGetUserMedia(constraints,
            (stream) => {
                videoElement.srcObject = stream;
                videoElement.play();
            }, () => console.log(error));

        // Preview the source in a video element
        // videoElement.srcObject = stream;
        // videoElement.play();

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