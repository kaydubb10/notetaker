const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static("public"));


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  fs.readFile(path.join(__dirname, "db/db.json"), "utf8", (err, data) => {
    if (err) throw err;
    res.json(JSON.parse(data));
  });
});

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
        res.json(newNote);
      }
    );
  });
});

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


