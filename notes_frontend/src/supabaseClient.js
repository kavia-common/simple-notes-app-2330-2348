//
// Supabase client setup for the Notes app.
// PUBLIC_INTERFACE
// This module provides the configured Supabase client using project environment variables.
//
import { createClient } from "@supabase/supabase-js";

/**
 * PUBLIC_INTERFACE
 * Creates and exports the Supabase client for usage throughout the app.
 * Uses REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY from environment variables.
 */
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  // Fail early for clarity
  throw new Error(
    "Missing Supabase environment variables: REACT_APP_SUPABASE_URL and/or REACT_APP_SUPABASE_KEY"
  );
}

// All Supabase calls in the app use this client instance.
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
