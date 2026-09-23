//Главный файл, запускает сервер который принимает все запросы и отдает их файлу routs.js

const express = require('express')
const app = express()
const notesRouts = require('./routs.js')

app.use(express.json())
app.use("/notes", notesRouts)

//Запрос на несуществующий адрес
app.use((req, res) => {
    res.status(404).json({
        error: "Маршрут не найден"
    })
})

//Все ошибки (в том числе из async-контроллеров) приходят сюда и отдаются в виде JSON
app.use((err, req, res, next) => {
    if (err.type === "entity.parse.failed") {
        return res.status(400).json({
            error: "Некорректный JSON"
        })
    }
    console.error(err)
    res.status(500).json({
        error: "Ошибка сервера"
    })
})

app.listen(3000, () =>{
    console.log("Сервер запущен")
})