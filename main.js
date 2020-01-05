const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

const ioHook = require("iohook");

let sendToReact;

ipcMain.on("start", (evt, args) => {
  console.log("Starting ipc communication");
  sendToReact = evt.reply;
});

let isRecording = false;
ipcMain.on("startRecording", (evt, args) => {
  isRecording = true;
});

ipcMain.on("stopRecording", (evt, args) => {
  isRecording = false;
  if (recording.length > 0) {
    console.log("EVT:", recording[0]);
    console.log("CORRESPONDS TO:", recording.slice(1));
  }
  recording = [];
});

let recording = [];
ioHook.on("keyup", evt => {
  if (sendToReact) {
    sendToReact("message", "keyup");
  }
  if (isRecording) {
    recording.push(evt);
  }
});

ioHook.on("mouseup", evt => {
  if (sendToReact) {
    sendToReact("message", "mouseup");
  }
  if (isRecording) {
    recording.push(evt);
  }
});

ioHook.start();

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });
};

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});
