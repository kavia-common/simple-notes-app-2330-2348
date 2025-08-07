//
// Note API abstraction for all Supabase CRUD operations.
//
import { supabase } from "../supabaseClient";

/**
 * PUBLIC_INTERFACE
 * List all notes.
 * Returns: Array of notes or throws on error.
 */
export async function fetchNotes() {
  // [Supabase] GET all notes, ordered by updated_at DESC
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data;
}

/**
 * PUBLIC_INTERFACE
 * Create a new note.
 * @param {Object} fields Note fields: {title, content}
 * Returns: Newly created note object.
 */
export async function createNote(fields) {
  // [Supabase] INSERT new note row, returns inserted row
  const { data, error } = await supabase
    .from("notes")
    .insert([fields])
    .select()
    .single();
  if (error) throw error;
  return data;
}

/**
 * PUBLIC_INTERFACE
 * Update an existing note by id.
 * @param {string} id Note's id
 * @param {Object} fields ({title, content})
 * Returns: Updated note object.
 */
export async function updateNote(id, fields) {
  // [Supabase] UPDATE note row where id = ...
  const { data, error } = await supabase
    .from("notes")
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/**
 * PUBLIC_INTERFACE
 * Delete note by id.
 * @param {string} id
 * Returns: true if deleted, throws on error.
 */
export async function deleteNote(id) {
  // [Supabase] DELETE row where id = ...
  const { error } = await supabase.from("notes").delete().eq("id", id);
  if (error) throw error;
  return true;
}
