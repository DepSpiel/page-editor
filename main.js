const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

app.commandLine.appendSwitch('--ignore-gpu-blacklist');
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    // width: 'auto', height: 'auto',
    /*webPreferences: {
      sandbox: true
    },*/
    frame: true,
    webgl: true
  })

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'editor.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.maximize();

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

function helpWindow() {
  // Create the browser window.
  hWindow = new BrowserWindow({
    width: 1280, height: 800,
    /*webPreferences: {
      sandbox: true
    },*/
    frame: true,
    webgl: true
  })

  // and load the index.html of the app.
  /*hWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'html5edit/index.html'),
    protocol: 'file:',
    slashes: true
  }))*/



  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  hWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    hWindow = null
  })
}
const isSecondInstance = app.makeSingleInstance((commandLine, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })

    if (isSecondInstance) {
      app.quit()
    }

// Create myWindow, load the rest of the app, etc...
    app.on('ready', () => {
})
const Menu = electron.Menu;
const MenuItem = electron.MenuItem;
const ipc = electron.ipcMain;

const menu = new Menu()
menu.append(new MenuItem({ label: 'Cut', role: 'cut'}))
menu.append(new MenuItem({ label: 'Copy', role: 'copy'}))
menu.append(new MenuItem({ label: 'Paste', role: 'paste'}))
menu.append(new MenuItem({ label: 'Select All', role: 'selectall'}))
menu.append(new MenuItem({ type: 'separator' }))
menu.append(new MenuItem({
  label: 'Toggle Developer Tools',
  click: function (item, focusedWindow) {
    if (focusedWindow) {
      focusedWindow.toggleDevTools()
    }
  }
}))
// menu.append(new MenuItem({ label: 'Electron', type: 'checkbox', checked: true }))

app.on('browser-window-created', function (event, win) {
  win.webContents.on('context-menu', function (e, params) {
    menu.popup(win, params.x, params.y)
  })
})

ipc.on('show-context-menu', function (event) {
  const win = BrowserWindow.fromWebContents(event.sender)
  menu.popup(win)
})

let template = [{
  label: 'File',
    submenu:[{
      label: 'Exit',
      accelerator: 'CmdOrCtrl+Q',
      role: 'quit'
    }]
  }, {
  label: 'Edit',
  submenu: [{
    label: 'Undo',
    accelerator: 'CmdOrCtrl+Z',
    role: 'undo'
  }, {
    label: 'Redo',
    accelerator: 'Shift+CmdOrCtrl+Z',
    role: 'redo'
  }, {
    type: 'separator'
  }, {
    label: 'Cut',
    accelerator: 'CmdOrCtrl+X',
    role: 'cut'
  }, {
    label: 'Copy',
    accelerator: 'CmdOrCtrl+C',
    role: 'copy'
  }, {
    label: 'Paste',
    accelerator: 'CmdOrCtrl+V',
    role: 'paste'
  }, {
    label: 'Select All',
    accelerator: 'CmdOrCtrl+A',
    role: 'selectall'
  }]
}, {
  label: 'View',
  submenu: [{
    label: 'Reload',
    accelerator: 'CmdOrCtrl+R',
    click: function (item, focusedWindow) {
      if (focusedWindow) {
        // on reload, start fresh and close any old
        // open secondary windows
        if (focusedWindow.id === 1) {
          BrowserWindow.getAllWindows().forEach(function (win) {
            if (win.id > 1) {
              win.close()
            }
          })
        }
        focusedWindow.reload()
      }
    }
  }, {
    label: 'Toggle Full Screen',
    accelerator: (function () {
      if (process.platform === 'darwin') {
        return 'Ctrl+Command+F'
      } else {
        return 'F11'
      }
    })(),
    click: function (item, focusedWindow) {
      if (focusedWindow) {
        focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
      }
    }
   /*{
    label: 'Toggle Developer Tools',
    accelerator: (function () {
      if (process.platform === 'darwin') {
        return 'Alt+Command+I'
      } else {
        return 'Ctrl+Shift+I'
      }
    })(),
    click: function (item, focusedWindow) {
      if (focusedWindow) {
        focusedWindow.toggleDevTools()
      }
    }
  }, {
    type: 'separator'
  }, {
    label: 'App Menu Demo',
    click: function (item, focusedWindow) {
      if (focusedWindow) {
        const options = {
          type: 'info',
          title: 'Application Menu Demo',
          buttons: ['Ok'],
          message: 'This demo is for the Menu section, showing how to create a clickable menu item in the application menu.'
        }
        electron.dialog.showMessageBox(focusedWindow, options, function () {})
      }
    }
  }*/}]
}, {
  label: 'Window',
  role: 'window',
  submenu: [{
    label: 'Minimize',
    accelerator: 'CmdOrCtrl+M',
    role: 'minimize'
  }, {
    label: 'Close',
    accelerator: 'CmdOrCtrl+W',
    role: 'close'
  }, {
    type: 'separator'
  }, {
    label: 'Reopen Window',
    accelerator: 'CmdOrCtrl+Shift+T',
    enabled: false,
    key: 'reopenMenuItem',
    click: function () {
      app.emit('activate')
    }
  }]
}, {
  label: 'Checkout PRO Version',
  role: 'help',
  submenu: [{
    label: 'WebPage Builder PRO',
    click: function () {
      electron.shell.openExternal('https://www.amazon.com/wysiwyg-WebPage-Builder-Download/dp/B079P89C5H')
    }
  }, {
    label: 'Chrome Extension',
    click: function(){
      electron.shell.openExternal('https://chrome.google.com/webstore/detail/webpage-builder/pbinilemenokbbkhnfofcoeieblcffal')
    }
  }]
}]

function addUpdateMenuItems (items, position) {
  if (process.mas) return

  const version = electron.app.getVersion()
  let updateItems = [{
    label: `Version ${version}`,
    enabled: false
  }, {
    label: 'Checking for Update',
    enabled: false,
    key: 'checkingForUpdate'
  }, {
    label: 'Check for Update',
    visible: false,
    key: 'checkForUpdate',
    click: function () {
      require('electron').autoUpdater.checkForUpdates()
    }
  }, {
    label: 'Restart and Install Update',
    enabled: true,
    visible: false,
    key: 'restartToUpdate',
    click: function () {
      require('electron').autoUpdater.quitAndInstall()
    }
  }]

  items.splice.apply(items, [position, 0].concat(updateItems))
}

function findReopenMenuItem () {
  const menu = Menu.getApplicationMenu()
  if (!menu) return

  let reopenMenuItem
  menu.items.forEach(function (item) {
    if (item.submenu) {
      item.submenu.items.forEach(function (item) {
        if (item.key === 'reopenMenuItem') {
          reopenMenuItem = item
        }
      })
    }
  })
  return reopenMenuItem
}

if (process.platform === 'darwin') {
  const name = electron.app.getName()
  template.unshift({
    label: name,
    submenu: [{
      label: `About ${name}`,
      role: 'about'
    }, {
      type: 'separator'
    }, {
      label: 'Services',
      role: 'services',
      submenu: []
    }, {
      type: 'separator'
    }, {
      label: `Hide ${name}`,
      accelerator: 'Command+H',
      role: 'hide'
    }, {
      label: 'Hide Others',
      accelerator: 'Command+Alt+H',
      role: 'hideothers'
    }, {
      label: 'Show All',
      role: 'unhide'
    }, {
      type: 'separator'
    }, {
      label: 'Quit',
      accelerator: 'Command+Q',
      click: function () {
        app.quit()
      }
    }]
  })

  // Window menu.
  template[3].submenu.push({
    type: 'separator'
  }, {
    label: 'Bring All to Front',
    role: 'front'
  })

  addUpdateMenuItems(template[0].submenu, 1)
}

if (process.platform === 'win32') {
  const helpMenu = template[template.length - 1].submenu
  addUpdateMenuItems(helpMenu, 0)
}
const shell = require('electron').shell;

shell.openItem(path.join(__dirname, '.html'));
app.on('ready', function () {
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
})
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
