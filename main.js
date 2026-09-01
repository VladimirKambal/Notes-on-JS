//Главный файл, запускает сервер который принимает все запросы и отдает их файлу routs.js

const express = require('express')
const app = express()
const notesRouts = require('./routs.js')

app.use(express.json())
app.use("/notes", notesRouts)

app.listen(3000, () =>{
    console.log("Сервер запущен")
})