//Этот файл отвечает за обработку запросов и работу с файлом notes.json, занося в него, вытаскивая и удаляя заметки

const { create } = require("domain")
const fs = require("fs")
const { title } = require("process")
const notes = JSON.parse(
    fs.readFileSync("./notes.json", "utf-8")
)

const AllNotes = (req, res) => {
    res.json(notes)
}
const Note = (req, res) => {
    const id = Number(req.params.id)
    const note = notes.find(note => note.id === id)
    if (!note) {
        return res.status(404).json({
            message: "Note not found"
        })
    }
    res.json(note)
}
const Create = async (req, res) => {
    const { title, comment } = req.body

    if (!title || !comment) {
        return res.status(400).json({
            error: "Ошибка составления запроса"
        })
    }

    try {
        const data = await fs.readFile("./notes.json", "utf8")
        const notes = JSON.parse(data)

        const id = notes.length > 0
            ? notes[notes.length - 1].id + 1
            : 1

        const newNote = {
            id,
            title,
            comment
        }
        notes.push(newNote)
        await fs.writeFile(
            "./notes.json",
            JSON.stringify(notes, null, 2)
        )
        res.status(201).json({
            message: "Заметка создана",
            note: newNote
        })
    } catch (error) {
        res.status(500).json({
            error: "Ошибка сервера"
        })
    }
}

module.exports = {
  AllNotes,
  Note,
  Create
}