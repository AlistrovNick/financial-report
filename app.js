const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const url = require("url");
const path = require("path");
const xlsxReader = require('read-excel-file/node');

let mainWindow;

function createWindow() {
    ipcMain.handle('dialog:openFile', handleFileOpen);
    ipcMain.handle('file:read', handleFileRead);

    mainWindow = new BrowserWindow({
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    mainWindow.maximize();

    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, `/dist/financial-report/index.html`),
            protocol: "file:",
            slashes: true
        })
    );

    mainWindow.on('closed', function () {
        mainWindow = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
    if (mainWindow === null) createWindow()
})

async function handleFileOpen() {
    const { canceled, filePaths} = await dialog.showOpenDialog();
    if (canceled) {
        return;
    }

    return filePaths[0];
}

async function handleFileRead(event, filePath) {
    const rows = await xlsxReader(filePath);
    return rows;
}

