const { BrowserWindow } = require('electron');
const path = require('path');

class MainWindow extends BrowserWindow {
    constructor(file, isDev) {
        super({
            title: 'Video Capture',
            width: 800, //isDev ? 800 : 355,
            height: 600,
            minHeight: 500,
            icon: './assets/icons/app_icon4.png',
            //resizable: isDev ? true : false,
            show: true,
            opacity: 1,
            //opacity: 0.8,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
                nodeIntegration: false,
                contextIsolation: true,
                enableRemoteModule: false,
                // nodeIntegration: false,
                // contextIsolation: true,
                // enableRemoteModule: false,
            },
        });

        this.loadFile(file);

        if (isDev) {
            this.webContents.openDevTools();
        }
    }
}

module.exports = MainWindow