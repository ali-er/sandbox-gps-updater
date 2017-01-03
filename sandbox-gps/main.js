
const electron = require('electron')


// Module to auto update application.
const {autoUpdater} = electron;
// Module to control application life.
const {app} = electron;

// Handle Squirrel events for Windows immediately on start
if(require('electron-squirrel-startup')) app.quit();

// Module to create native browser window.
const {BrowserWindow} = electron;

const path = require('path')
const url = require('url')
const Datastore = require('nedb');
const appVersion = require('./package.json').version;
const {dialog} = electron

const db = new Datastore({ filename: app.getPath("userData") + '/stat_db.json', autoload: true });

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow



function createWindow () {

  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  // Setting up autoUpdater
  const feedURL = 'http://localhost:3000/updates/latest';  
  
  autoUpdater.addListener("update-available", function(event) {
//    dialog.showMessageBox({ message: "New update available!"})  
    console.log('new update available!')
  });
  autoUpdater.addListener("update-downloaded", function(event, releaseNotes, releaseName, releaseDate, updateURL) {  
      console.log('New update is ready for install.')
      var response = dialog.showMessageBox({ message: 'Update is ready to install. (' + releaseName + ')', buttons : ['Restart' , 'Later'], cancelId: 1})
      if (response == 0) {
        autoUpdater.quitAndInstall();
      }
  });
  autoUpdater.addListener("error", function(error) {
      console.log('Error:' + error)
      dialog.showErrorBox('Error while checking for updates. ', error.message)
  });
  autoUpdater.addListener("checking-for-update", function(event) {
      console.log("checking for update...")
  });
  autoUpdater.addListener("update-not-available", function(event) {
      dialog.showMessageBox({ message: "No update available."})
      console.log("no updates available!")
  });

  autoUpdater.setFeedURL(feedURL + '?v=' + appVersion);
  mainWindow.webContents.once("did-frame-finish-load", function(event) {
    autoUpdater.checkForUpdates();
    db.findOne({ _id: 1}, function (err, doc) {
      doc = doc || { _id:1, counter: 0 };
      dialog.showMessageBox({ message: 'This example was executed ' + doc.counter + ' times. Last access time was ' + doc.lastSeetAt });
      doc.lastSeetAt = new Date();
      doc.counter++;
      db.update({ _id: 1 }, doc, { upsert: true }, function (err, num) {
        console.log('Updated ' + num + ' records');
        });
    });

  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
