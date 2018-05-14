const { app, BrowserWindow, dialog, remote, ipcMain, shell } = require('electron')
const path = require('path')
const url = require('url')
const os = require('os');
const fs = require('fs');

// var printer = require('printer');
// console.log('printer : ',printer);

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
    printWin.webContents.print({ printBackground: true, silent: true, deviceName: 'EPSON LX-300+ /II' }, (err, data) => {
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

let win

function createWindow() {
  win = new BrowserWindow({ width: 800, height: 600, backgroundColor: '#2e2c29', minimumFontSize: 72, defaultFontSize: 72, defaultMonospaceFontSize: 72 })

  // load the dist folder from Angular
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'dist/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools optionally:
  // win.webContents.openDevTools();
  // win.setFullScreen(true);
  win.maximize()

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


  // console.log('printer', printer)
}

app.on('ready', createWindow)


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