"use strict";

const videoElement = document.getElementById('video');
const popupContainer = document.getElementById('popup-container');

// select stream functionality
const select = document.getElementById('select');
select.addEventListener('click', getMediaSources);

async function getMediaSources() {
    try {

        if (popupContainer.classList.contains('hide')) {
            // Send request for sources to main process
            await api.send('sources:request');

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

window.api.receive("sources:response", (sources) => {
    addMediaSourcesToDocument(sources);
});

async function addMediaSourcesToDocument(sources) {
    removeChildren(popupContainer);
    await sources.map(async (source) => {
        // card for source info to sit in
        let div = document.createElement('div');
        div.classList.add('popup-item');

        // make card title
        let p = document.createElement('p');
        let text = document.createTextNode(stripNameLength(source.name));
        p.appendChild(text);

        // card image
        let img = document.createElement('img');
        img.src = source.image;

        // put it together in order
        div.appendChild(p);
        div.appendChild(img);
        // add click event 
        div.addEventListener('click', async () => {
            await selectMediaStream(source.id);
        });

        popupContainer.appendChild(div);
    });
}

async function selectMediaStream(id) {
    try {
        const constraints = {
            audio: false,
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: id,
                }
            }
        };

        // Create a Stream
        await navigator.webkitGetUserMedia(constraints, (stream) => {
            console.log(stream);
            // Set and play stream
            videoElement.srcObject = stream;
            videoElement.onloadedmetadata = () => {
                videoElement.play();
                showPlayer();
                // Init the mediaRecorder
                // No need to keep a global reference to stream
                initMediaRecorder(stream);
            }
        }, () => console.log("media error"));

        // Enable record button
        record.addEventListener('click', startRecord);
        record.classList.remove('disable');

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
record.addEventListener('click', startRecord);

function startRecord() {
    // Disable select button
    select.removeEventListener('click', getMediaSources);
    select.classList.add('disable');

    // Disable record button
    record.removeEventListener('click', startRecord)
    record.classList.add('disable');

    // Enable stop button
    stop.addEventListener('click', stopRecord);
    stop.classList.remove('disable');

    console.log(mediaRecorder);
    if (mediaRecorder !== undefined)
        mediaRecorder.start();
}


let recordedChunks = [];
let mediaRecorder;

function initMediaRecorder(stream) {
    // Reset previously recorded chunks
    recordedChunks = [];

    // Create the Media Recorder
    const options = { mimeType: 'video/webm; codecs=vp9' };
    mediaRecorder = new MediaRecorder(stream, options);

    // Register Event Handlers
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.onstop = handleStop;
}

// Captures all recorded chunks
function handleDataAvailable(e) {
    console.log('video data available');
    recordedChunks.push(e.data);
}

// Stop functionality
const stop = document.getElementById('stop');

function stopRecord() {
    // Disable stop button
    stop.removeEventListener('click', stopRecord)
    stop.classList.add('disable');

    // Enable select button
    select.addEventListener('click', getMediaSources);
    select.classList.remove('disable');

    if (mediaRecorder !== undefined)
        mediaRecorder.stop();
}

// Saves the video file on stop
async function handleStop(e) {
    // Seems silly but I can't figure out how to get access to 'Blob' in the main process
    console.log('handle stop');
    const blob = new Blob(recordedChunks, {
        type: 'video/webm; codecs=vp9'
    });

    const blobArrayBuffer = await blob.arrayBuffer()
    await api.send('savevideo:request', blobArrayBuffer);
}

// Help functionality
const help = document.getElementById('help')
help.addEventListener('click', () => { console.log('help clicked'); });