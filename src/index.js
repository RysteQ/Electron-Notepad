const { 
    app, 
    BrowserWindow, 
    Notification, 
    Menu, 
    dialog, 
    ipcMain 
} = require('electron')

const fileSystem = require('fs')
let mainWindow

const template = [
    {
        label: 'File',

        submenu: [
            {
                label: 'Open File...',
                accelerator: 'Ctrl+O',

                click: () => {
                    dialog.showOpenDialog(
                        JSON.parse(
                            fileSystem.readFileSync('File Filters.json')
                        )
                    ).then(result => {
                        if (!result.canceled) {
                            mainWindow.webContents.send("file_data_send", fileSystem.readFileSync(result.filePaths[0]).toString())
                        }
                    })
                }
            },
            {
                label: 'Save File...',
                accelerator: 'Ctrl+S',

                click: () => {
                    dialog.showSaveDialog(
                        JSON.parse(
                            fileSystem.readFileSync('Save Filters.json')
                        )
                    ).then(result => {
                        if (!result.canceled) {
                            mainWindow.webContents.send('file_data_receive')

                            ipcMain.on("file_data_to_write", (event, args) => {
                                fileSystem.writeFileSync(result.filePath, args)
                            })
                        }
                    })
                }
            },
            {
                type: 'separator'
            },
            {
                label: 'Exit Application',

                click: () => {
                    app.exit(0)
                }
            }
        ]
    },
    {
        label: 'Text',

        submenu: [
            {
                label: 'Increase Font Size',
                accelerator: 'Ctrl+I',

                click: () => {
                    mainWindow.webContents.send('increase_font_size')
                }
            },
            {
                label: 'Decrease Font Size',
                accelerator: 'Ctrl+D',

                click: () => {
                    mainWindow.webContents.send('decrease_font_size')
                }
            },
            {
                type: 'separator'
            },
            {
                label: 'Change Font...',

                submenu: [
                    {
                        label: "Serif",

                        click: () => {
                            mainWindow.webContents.send('change_font', 'Serif')
                        }
                    },
                    {
                        label: "Sans-Serif",

                        click: () => {
                            mainWindow.webContents.send('change_font', 'Sans-Serif')
                        }
                    },
                    {
                        label: "Monospace",

                        click: () => {
                            mainWindow.webContents.send('change_font', 'Monospace')
                        }
                    },
                    {
                        label: "Cursive",

                        click: () => {
                            mainWindow.webContents.send('change_font', 'Cursive')
                        }
                    },
                    {
                        label: "Fantasy",

                        click: () => {
                            mainWindow.webContents.send('change_font', 'Fantasy')
                        }
                    }
                ]
            }
        ]
    }
]


function showNotification(TITLE, MESSAGE) {
    new Notification({
        title: TITLE,
        body: MESSAGE
    }).show()
}

function startMainWindow(HEIGHT, WIDTH, is_resizable, menu, sourceFile) {
    mainWindow = new BrowserWindow({
        height: HEIGHT,
        width: WIDTH,
        center: true,
        resizable: is_resizable,

        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    mainWindow.loadFile(sourceFile)
    mainWindow.setMenu(Menu.buildFromTemplate(menu))
    mainWindow.show()
}

function startNewWindow(HEIGHT, WIDTH, is_resizable, menu, sourceFile) {
    const newWindow = new BrowserWindow({
        height: HEIGHT,
        width: WIDTH,
        resizable: is_resizable,

        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    newWindow.setMenu(Menu.buildFromTemplate(menu))
    newWindow.loadFile(sourceFile)
    newWindow.show()
}

app.whenReady().then( () => {
    startMainWindow(600, 900, false, template, 'main.html')
    showNotification('Electron Notepad', 'Electron Notepad has started')
})

ipcMain.on('new_style', (event, args) => {
    mainWindow.webContents.send('change_style', args)
})