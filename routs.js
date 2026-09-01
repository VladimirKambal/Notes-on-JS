//Данный файл связующие звено между main.js и controlers.js
//Служит он как прослойка ради того что бы они могли спокойнее общаться без конфликтов в будующем

const express = require('express')
const requires = express.Router()

const controler = require("./controlers.js")

requires.get(`/`, controler.AllNotes)
requires.get(`/:id`, controler.Note)
requires.post(`/`, controler.Create)

module.exports = requires