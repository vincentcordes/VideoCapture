const { BrowserWindow } = require('electron');

class MainWindow extends BrowserWindow {
    constructor(file, isDev) {
        super({
            title: 'Video Capture',
            width: 1200, //isDev ? 800 : 355,
            height: 500,
            //icon: './assets/icons/icon.png',
            //resizable: isDev ? true : false,
            show: true,
            opacity: 1,
            //opacity: 0.8,
            webPreferences: {
                nodeIntegration: true,
            },
        });
        this.loadFile(file);

        // if (isDev) {
        //     this.webContents.openDevTools();
        // }
    }
}

module.exports = MainWindow