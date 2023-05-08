const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

// Landing Page
app.get("/", (req, res) => {
  res.redirect("/notes");
});

// Notes Page
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
  fs.readFile(path.join(__dirname, "db/db.json"), "utf8", (err, data) => {
    if (err) throw err;
    res.json(JSON.parse(data));
  });
});

// API Route to get notes from db.json
app.get("/api/notes", (req, res) => {
  fs.readFile(path.join(__dirname, "db/db.json"), "utf8", (err, data) => {
    if (err) throw err;
    res.json(JSON.parse(data));
  });
});

// API Route to save a new note to db.json
app.post("/api/notes", (req, res) => {
  fs.readFile(path.join(__dirname, "db/db.json"), "utf8", (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    const newNote = req.body;
    const lastId = notes.length > 0 ? notes[notes.length - 1].id : 0;
    newNote.id = lastId + 1;
    notes.push(newNote);
    fs.writeFile(
      path.join(__dirname, "db/db.json"),
      JSON.stringify(notes),
      (err) => {
        if (err) throw err;
        res.json(notes);
      }
    );
  });
});


// API Route to delete a note from db.json
app.delete("/api/notes/:id", (req, res) => {
  const noteId = parseInt(req.params.id);
  fs.readFile(path.join(__dirname, "db/db.json"), "utf8", (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    const filteredNotes = notes.filter((note) => note.id !== noteId);
    fs.writeFile(
      path.join(__dirname, "db/db.json"),
      JSON.stringify(filteredNotes),
      (err) => {
        if (err) throw err;
        res.send("Note deleted successfully");
      }
    );
  });
});

// Start server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
