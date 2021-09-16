const { ipcRenderer } = require("electron")

const MAX_FONT_SIZE = 24
const MIN_FONT_SIZE = 10

let currentFontSize = 14
let mainTextArea, lineNumberCountSpan

window.onload = function() {
    mainTextArea = document.getElementById("mainTextArea")
    lineNumberCountSpan = document.getElementById("numberOfLines")
}

ipcRenderer.on("file_data_send", (event, args) => {
    mainTextArea.textContent = args
})

ipcRenderer.on("file_data_receive", (event, args) => {
    ipcRenderer.send("file_data_to_write", mainTextArea.value)
})

ipcRenderer.on("increase_font_size", (event, args) => {
    if (currentFontSize < MAX_FONT_SIZE) {
        mainTextArea.style.fontSize = currentFontSize.toString() + "px"
        
        currentFontSize++
    }
})

ipcRenderer.on("decrease_font_size", (event, args) => {
    if (currentFontSize > MIN_FONT_SIZE) {
        mainTextArea.style.fontSize = currentFontSize.toString() + "px"
        
        currentFontSize--
    }
})

ipcRenderer.on("change_font", (event, args) => {
    mainTextArea.style.fontFamily = lineNumberCountSpan.style.fontFamily = args
})

ipcRenderer.on("change_style", (event, args) => {
    document.body.style.backgroundColor = args[0]
    mainTextArea.style.backgroundColor = args[1]
})

function getCurrentCursorLine() {
    let rows = mainTextArea.value
    let currentRow = rows.substr(0, mainTextArea.selectionStart).split("\n").length
    let currentColumn = 0

    for (let i = 0; i < (currentRow - 1); i++) {
        currentColumn += rows.split("\n")[i].length
    }

    currentColumn = mainTextArea.selectionStart - (currentColumn + currentRow) + 2

    document.getElementById("column_row").innerHTML = currentRow + ":" + currentColumn
}