import React from "react";
import "./Sidebar.css";

/**
 * PUBLIC_INTERFACE
 * Sidebar navigation for the Notes app.
 * Provides an 'All Notes' link and 'New Note' action.
 * @param {Object} props
 *   onNewNote - callback when user clicks 'New Note'
 *   notes - array of note objects
 *   selectedId - currently selected note id
 *   onSelectNote - callback to select a note by id
 */
const Sidebar = ({ notes, selectedId, onSelectNote, onNewNote }) => (
  <nav className="Sidebar">
    <div className="Sidebar-title">Notes</div>
    <button className="Sidebar-new-btn" onClick={onNewNote}>
      + New Note
    </button>
    <div className="Sidebar-list">
      {notes.length === 0 && (
        <div className="Sidebar-empty">No notes yet.</div>
      )}
      {notes.map((n) => (
        <div
          key={n.id}
          className={
            "Sidebar-item" + (n.id === selectedId ? " Sidebar-item--selected" : "")
          }
          onClick={() => onSelectNote(n.id)}
        >
          <div className="Sidebar-item-title">{n.title || "Untitled note"}</div>
          <div className="Sidebar-item-updated">
            {n.updated_at
              ? new Date(n.updated_at).toLocaleString()
              : "Never"}
          </div>
        </div>
      ))}
    </div>
  </nav>
);

export default Sidebar;
