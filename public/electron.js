const { app, BrowserWindow, screen: electronScreen } = require('electron');
const { URL } = require ('url');
const path = require("path");
const isDev = require("electron-is-dev");

let mainWindow;
async function createWindow() {

    app.on('activate', () => {
        if (!BrowserWindow.getAllWindows().length) {
            createWindow();
        }
    });

    mainWindow = new BrowserWindow({
        title: "RUUUM",
        width: electronScreen.getPrimaryDisplay().workArea.width,
        height: electronScreen.getPrimaryDisplay().workArea.height,
        maxHeight: electronScreen.getPrimaryDisplay().workArea.height - (process.platform === 'linux' || process.platform === 'macos'? 50 : 0 ),
        top: process.platform === 'linux' || process.platform === 'macos'? -50 : 0,
        resizable: false, //isDev,
        icon: path.join(__dirname, 'apple-touch-icon-180x180.png'),
        autoHideMenuBar: !isDev,
        frame: true,
        show: true,
        backgroundColor: 'black',
        webPreferences: {
            nodeIntegration: false,
            enableRemoteModule: false,
            devTools: false,
            contextIsolation: true,
            // preload: path.join(__dirname,'preload.js')
        }

    });
    mainWindow.center();
    // mainWindow.loadURL('http://localhost:3000');
    // mainWindow.loadURL('http://95.181.224.33:5555');
    // mainWindow.loadURL('https://bot-auto-razbor.vercel.app');
    mainWindow.loadURL('https://front.botrazbor.ru/');
    // isDev && 
    // mainWindow.webContents.openDevTools();
    mainWindow.once('ready-to-show', () => mainWindow.show());
    mainWindow.on("closed", () => (mainWindow = null));
   
    mainWindow.webContents.on('new-window', (event, url) => {
        event.preventDefault();
        mainWindow.loadURL(url);
    });
}

app.on("ready", createWindow);
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});