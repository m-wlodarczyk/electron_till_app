// Modules
const { app, BrowserWindow } = require("electron");
let path = require("path");
let { PythonShell } = require("python-shell");

let options = {
  pythonPath: path.join(__dirname, "\\venv\\Scripts\\python.exe"),
  scriptPath: path.join(__dirname, "\\python-scripts\\")
};

let mainWindow;

// Create a new BrowserWindow when `app` is ready
function createWindow() {
  mainWindow = new BrowserWindow({
    height: 725,
    width: 1450,
    // resizable: false,
    webPreferences: { nodeIntegration: true }
  });

  // Load index.html into the new BrowserWindow
  mainWindow.loadFile("index.html");

  // Open DevTools - Remove for PRODUCTION!
  // mainWindow.webContents.openDevTools();

  // Listen for window being closed
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function run_script() {
  PythonShell.run("backend.py", options, function() {});
}

// Electron `app` is ready
app.on("ready", createWindow);
// app.on("ready", run_script);

// Quit when all windows are closed - (Not macOS - Darwin)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on("activate", () => {
  if (mainWindow === null) createWindow();
});
