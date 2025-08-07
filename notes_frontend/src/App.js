import React, { useEffect, useState, useCallback } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import NoteEditor from "./components/NoteEditor";
import {
  fetchNotes,
  createNote,
  updateNote,
  deleteNote
} from "./api/notes";

// PUBLIC_INTERFACE
function App() {
  // Sidebar/main
  const [notes, setNotes] = useState([]);
  const [selectedId, setSelectedId] = useState(null); // note id or null for new note
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // error message for user feedback

  // Light minimal theme only; could add theme toggle if desired
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "light");
  }, []);

  // Load notes from Supabase
  const loadNotes = useCallback(() => {
    setLoading(true);
    setError("");
    fetchNotes()
      .then((data) => {
        setNotes(Array.isArray(data) ? data : []);
        // If no note selected or selected was deleted, select newest or none
        if (!selectedId || !data.some((n) => n.id === selectedId)) {
          setSelectedId(data[0]?.id || null);
        }
      })
      .catch((err) => {
        setError("Failed to load notes. " + (err?.message || ""));
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line
  }, [selectedId]);

  useEffect(() => {
    loadNotes();
    // eslint-disable-next-line
  }, []);

  // Handlers for CRUD
  const handleSelectNote = (id) => {
    setSelectedId(id);
    setError("");
  };

  const handleNewNote = () => {
    setSelectedId("NEW");
    setError("");
  };

  // Save = create or update based on current context
  async function handleSaveNote(fields) {
    setLoading(true);
    setError("");
    try {
      let saved;
      if (selectedId === "NEW" || !notes.some((n) => n.id === selectedId)) {
        saved = await createNote({
          title: fields.title,
          content: fields.content,
          // Let backend handle timestamps
        });
        setNotes([saved, ...notes]);
        setSelectedId(saved.id);
      } else {
        // Update
        saved = await updateNote(selectedId, {
          title: fields.title,
          content: fields.content
        });
        setNotes(
          notes.map((n) => (n.id === selectedId ? { ...n, ...saved } : n))
        );
      }
    } catch (err) {
      setError("Failed to save note. " + (err?.message || ""));
    }
    setLoading(false);
  }

  async function handleDeleteNote() {
    if (!selectedId) return;
    setLoading(true);
    setError("");
    try {
      await deleteNote(selectedId);
      setNotes(notes.filter((n) => n.id !== selectedId));
      // Select first note or none after deletion
      setSelectedId(notes.filter((n) => n.id !== selectedId)[0]?.id || null);
    } catch (err) {
      setError("Failed to delete note. " + (err?.message || ""));
    }
    setLoading(false);
  }

  // Find note to edit for central editor
  const selectedNote =
    selectedId === "NEW"
      ? { title: "", content: "" }
      : notes.find((n) => n.id === selectedId) || null;

  return (
    <div className="NotesAppRoot">
      <Sidebar
        notes={notes}
        selectedId={selectedId === "NEW" ? null : selectedId}
        onSelectNote={handleSelectNote}
        onNewNote={handleNewNote}
      />
      <main className="NotesAppMain">
        <div className="NotesAppHeader">
          <span style={{ color: "#000", fontWeight: 700, fontSize: 22 }}>
            Simple Notes
          </span>
        </div>
        {error && (
          <div className="NotesAppError" data-testid="error">
            {error}
          </div>
        )}
        <NoteEditor
          note={selectedNote}
          onSave={handleSaveNote}
          onDelete={handleDeleteNote}
          loading={loading}
        />
        <footer className="NotesAppFooter">
          <span>
            Built with <span style={{ color: "#000" }}>♥</span> using
            Supabase & React.
          </span>
        </footer>
      </main>
    </div>
  );
}

export default App;
