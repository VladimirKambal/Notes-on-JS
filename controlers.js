//Этот файл отвечает за обработку запросов и работу с файлом notes.json, занося в него, вытаскивая и удаляя заметки

const fs = require("fs")
const path = require("path")

const FILE = path.join(__dirname, "notes.json")

let notes = JSON.parse(
    fs.readFileSync(FILE, "utf-8")
)

const isText = value => typeof value === "string" && value.trim() !== ""

const notFound = res => res.status(404).json({
    message: "Note not found"
})

const badRequest = res => res.status(400).json({
    error: "Ошибка составления запроса"
})

const AllNotes = (req, res) => {
    res.json(notes)
}

const Note = (req, res) => {
    const id = Number(req.params.id)
    const note = notes.find(note => note.id === id)
    if (!note) {
        return notFound(res)
    }
    res.json(note)
}

const Create = async (req, res) => {
    const { title, comment } = req.body ?? {}

    if (!isText(title) || !isText(comment)) {
        return badRequest(res)
    }

    const id = notes.length > 0
        ? Math.max(...notes.map(note => note.id)) + 1
        : 1

    const newNote = {
        id,
        title,
        comment
    }
    notes = [...notes, newNote]
    await save()

    res.status(201).json({
        message: "Заметка создана",
        note: newNote
    })
}

const Patch = async (req, res) => {
    const id = Number(req.params.id)
    const oldNote = notes.find(note => note.id === id)
    if (!oldNote) {
        return notFound(res)
    }

    const { title, comment } = req.body ?? {}
    const hasTitle = title !== undefined
    const hasComment = comment !== undefined

    if (!hasTitle && !hasComment) {
        return badRequest(res)
    }
    if ((hasTitle && !isText(title)) || (hasComment && !isText(comment))) {
        return badRequest(res)
    }

    const updatedNote = {
        ...oldNote,
        ...(hasTitle && { title }),
        ...(hasComment && { comment })
    }
    notes = notes.map(note => note.id === id ? updatedNote : note)
    await save()

    res.json({
        message: "Заметка обновлена",
        note: updatedNote
    })
}

const Delete = async (req, res) => {
    const id = Number(req.params.id)
    const deletedNote = notes.find(note => note.id === id)
    if (!deletedNote) {
        return notFound(res)
    }

    notes = notes.filter(note => note.id !== id)
    await save()

    res.json({
        message: "Заметка удалена",
        note: deletedNote
    })
}

module.exports = {
  AllNotes,
  Note,
  Create,
  Patch,
  Delete
}