const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// GET /notes should return the notes.html file
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});


// GET * should return the index.html file
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// GET /api/notes should read the db.json file and return all saved notes as JSON
app.get("/api/notes", (req, res) => {
  const notes = JSON.parse(fs.readFileSync("./db/db.json"));
  res.json(notes);
});

// POST /api/notes should receive a new note to save on the request body, add it to the db.json file,
// and then return the new note to the client. You'll need to find a way to give each note a unique id
// when it's saved
app.post("/api/notes", (req, res) => {
  const notes = JSON.parse(fs.readFileSync("./db/db.json"));

  const newNote = {
    id: uuidv4(),
    title: req.body.title,
    text: req.body.text,
  };

  notes.push(newNote);

  fs.writeFileSync("./db/db.json", JSON.stringify(notes));

  res.json(newNote);
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

