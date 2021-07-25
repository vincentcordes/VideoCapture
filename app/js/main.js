const { app, Menu, ipcMain, desktopCapturer, dialog } = require('electron');
const { writeFile } = require('fs')
const MainWindow = require('./mainwindow');
const { Buffer } = require('buffer');

// Set env
process.env.NODE_ENV = 'production'

const isDev = process.env.NODE_ENV !== 'production' ? true : false
const isMac = process.platform === 'darwin' ? true : false

let mainWindow;

// menu
const menu = [];

function createMainWindow() {
    mainWindow = new MainWindow('./app/index.html', isDev);
}

app.on('ready', () => {
    app.whenReady().then(() => {
        createMainWindow();

        // create and assign menu
        const mainMenu = Menu.buildFromTemplate(menu);
        Menu.setApplicationMenu(mainMenu);

    });
})

app.allowRendererProcessReuse = true

ipcMain.on('sources:request', async (event, data) => {
    const sources = await desktopCapturer.getSources({
        types: ['window', 'screen'],
        thumbnailSize: {
            width: 150,
            height: 150,
        }
    });

    let newSources = sources.map(s => {
        return {
            name: s.name,
            image: s.thumbnail.toDataURL(), // it is necessary to call toDataURL in main
            id: s.id,
        }
    });

    // Send media sources back
    mainWindow.webContents.send('sources:response', newSources)
});

ipcMain.on('savevideo:request', async (event, blobArray) => {

    const buffer = Buffer.from(blobArray);

    const { filePath } = await dialog.showSaveDialog({
        buttonLabel: 'Save video',
        defaultPath: `vid-${Date.now()}.webm`
    });

    if (filePath) {
        writeFile(filePath, buffer, () => { console.log('video saved successfully!') });
    }
});