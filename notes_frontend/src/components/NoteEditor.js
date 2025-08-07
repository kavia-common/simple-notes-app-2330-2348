import React, { useState, useEffect } from "react";
import "./NoteEditor.css";

/**
 * PUBLIC_INTERFACE
 * Note editor for viewing, editing, creating, and deleting a note.
 * @param {Object} props
 *   note - selected note object (null for new note)
 *   onSave - callback (note fields) when user clicks save
 *   onDelete - callback when user clicks delete
 *   loading - true to show loader/button disables
 */
function NoteEditor({ note, onSave, onDelete, loading }) {
  // Local form state for title/content
  const [title, setTitle] = useState(note ? note.title : "");
  const [content, setContent] = useState(note ? note.content : "");

  useEffect(() => {
    setTitle(note ? note.title : "");
    setContent(note ? note.content : "");
  }, [note]);

  const isEditing = !!note && !!note.id;

  function handleSubmit(e) {
    e.preventDefault();
    if (title.trim() !== "" || content.trim() !== "") {
      onSave({ title, content });
    }
  }

  return (
    <div className="NoteEditor">
      <form className="NoteEditor-form" onSubmit={handleSubmit}>
        <input
          className="NoteEditor-title"
          type="text"
          value={title}
          autoFocus
          placeholder="Title"
          maxLength={128}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="NoteEditor-content"
          value={content}
          rows={8}
          placeholder="Start writing your note here..."
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="NoteEditor-actions">
          <button
            type="submit"
            disabled={loading}
            className="NoteEditor-save-btn"
          >
            {loading
              ? "Saving..."
              : isEditing
              ? "Save Changes"
              : "Create Note"}
          </button>
          {isEditing && (
            <button
              type="button"
              className="NoteEditor-delete-btn"
              onClick={onDelete}
              disabled={loading}
            >
              {loading ? "..." : "Delete"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default NoteEditor;
