const { app, BrowserWindow, dialog, remote, ipcMain, shell } = require('electron')
const path = require('path')
const url = require('url')
const os = require('os');
const fs = require('fs');

// var printer = require('printer');
// console.log('printer : ',printer);
const isDev = require('electron-is-dev');  // this is required to check if the app is running in development mode. 
const { appUpdater } = require('./autoupdater');



let ipc = ipcMain;
ipc.on('print-to-pdf', ev => {
  let PDFpath = path.join(os.tmpdir(), "ticket.pdf");

  let printWin = new BrowserWindow({ show: false });
  printWin.loadURL('file://' + __dirname + '/dist/index.html#/print');
  // console.log(path.join('file://' + __dirname + '/dist/index.html#/print'));
  printWin.webContents.on('did-finish-load', () => {

    // console.log('printers', printWin.webContents.getPrinters())
    // printWin.webContents.print({printBackground:true}, () => {
    //   console.log('success');
    // })
    console.log(printWin.webContents.getPrinters())
    printWin.webContents.print({ printBackground: true, silent: true }, (err, data) => {
      if (err) {
        console.error(err);
      } else {
        fs.writeFile(PDFpath, data, (err2) => {
          if (err2) {
            console.error(err2);
          } else {
            shell.openExternal('file://' + PDFpath);
            ev.sender.send('wrote-pdf', PDFpath)
            printWin.close();
          }
        })
      }
    })
  })

})


app.showExitPrompt = true;
// if (require('electron-squirrel-startup')) {
//   app.quit();
// }


let win


function isWindowsOrmacOS() {
  return process.platform === 'darwin' || process.platform === 'win32';
}


function createWindow() {
  win = new BrowserWindow({
    show: false, width: 800, height: 600, backgroundColor: '#2e2c29', minimumFontSize: 72, defaultFontSize: 72, defaultMonospaceFontSize: 72
  })

  // create a new `splash`-Window 
  splash = new BrowserWindow({ width: 810, height: 610, transparent: true, frame: false, resizable: false, movable: false, alwaysOnTop: true });
  splash.loadURL(path.join(__dirname, '/splash.html'));
  // mainWindow.loadURL(`file://${__dirname}/index.html`);
  // load the dist folder from Angular
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'dist/index.html'),
    protocol: 'file:',
    slashes: true
  }))
  // if main window is ready to show, then destroy the splash window and show up the main window
  win.once('ready-to-show', () => {
    // splash.destroy();
    splash.close();
    win.show();
    win.maximize()
  });


  // Open the DevTools optionally:
  win.webContents.openDevTools();
  // win.setFullScreen(true);

  win.on('closed', () => {
    win = null
  })

  // Inside main/index.js, where BrowserWindow is initialized
  win.on('close', (e) => {
    if (app.showExitPrompt) {
      e.preventDefault() // Prevents the window from closing 
      dialog.showMessageBox(win, {
        type: 'question',
        buttons: ['Yes', 'No'],
        title: 'Confirm',
        message: 'Unsaved data will be lost. Are you sure you want to quit?'
      }, function (response) {
        if (response === 0) { // Runs the following if 'Yes' is clicked
          app.showExitPrompt = false
          win.close()
        }
      })
    }
  })


  const page = win.webContents;

  page.once('did-frame-finish-load', () => {
    const checkOS = isWindowsOrmacOS();
    if (checkOS && !isDev) {
      // Initate auto-updates on macOs and windows
      appUpdater();
    }
  });

  // console.log('printer', printer)
}

app.on('ready', createWindow)
app.on('browser-window-created', function (e, window) {
  window.setMenu(null);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})