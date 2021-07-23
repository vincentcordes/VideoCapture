"use strict";
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
}

async function addMediaSourcesToDocument(sources) {
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
        div.addEventListener('click', async () => { await selectMediaStream(source); });

        popupContainer.appendChild(div);
    });
}

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
        console.log(source);
        const constraints = {
            audio: false,
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: source.id,
                    // minWidth: 1280,
                    // maxWidth: 1280,
                    // minHeight: 720,
                    // maxHeight: 720
                }
            }
        };

        // Create a Stream
        await navigator.webkitGetUserMedia(constraints, (stream) => {
            console.log(stream);
            // set and play stream
            videoElement.srcObject = stream;
            videoElement.onloadedmetadata = () => {
                videoElement.play();
                showPlayer();
            }
        }, () => console.log("media error"));

    } catch (error) {
        console.log(error);
    }
}

function showPlayer() {
    videoElement.classList.remove('hide');
    videoElement.classList.add('show');
    popupContainer.classList.remove('show');
    popupContainer.classList.add('hide');
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
help.addEventListener('click', () => { console.log('help clicked'); });