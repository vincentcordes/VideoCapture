const { app, Menu } = require('electron');
const MainWindow = require('./MainWindow');


// Set env
process.env.NODE_ENV = 'development'

const isDev = process.env.NODE_ENV !== 'production' ? true : false
const isMac = process.platform === 'darwin' ? true : false

let mainWindow;

// menu
const menu = [];

function createMainWindow() {
    mainWindow = new MainWindow('./app/index.html', isDev);
}

app.whenReady().then(() => {
    createMainWindow();

    // create and assign menu
    const mainMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu);

});