import * as path from 'path'

import { app, BrowserWindow, ipcMain } from 'electron'

const isDev = !app.isPackaged

let mainWindow: BrowserWindow | null = null

async function waitForNext() {
  return new Promise((resolve) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('http://localhost:3000')
        if (res.ok) {
          clearInterval(interval)
          resolve(true)
        }
      } catch (error) {
        console.error(error)
      }
    }, 500)
  })
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1024,
    minHeight: 600,
    titleBarStyle: 'hiddenInset',
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  if (isDev) {
    await waitForNext()
    await mainWindow.loadURL('http://localhost:3000')
    mainWindow.webContents.openDevTools()
  } else {
    await mainWindow.loadURL('file://' + path.join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle('app:version', () => {
  return app.getVersion()
})
