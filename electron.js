const { app, BrowserWindow } = require('electron')
const serve = require('electron-serve')

const loadURL = serve({ directory: 'out_next' })

function createWindow () {
  const win = new BrowserWindow({
    minWidth: 1024,
    minHeight: 768,
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true
    }
  })

  loadURL(win).then(() => {
    win.loadURL('app://-')
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
