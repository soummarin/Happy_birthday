/**
 * Supabase Schema — Run this in your Supabase SQL Editor
 *
 * CREATE TABLE wishes (
 *   id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   creator_name TEXT NOT NULL,
 *   birthday_name TEXT NOT NULL,
 *   age          INTEGER,
 *   theme        JSONB NOT NULL DEFAULT '{"preset":"girl","primary":"#f43f5e","secondary":"#a855f7","accent":"#fbbf24"}',
 *   music_url    TEXT,
 *   photo_url    TEXT,
 *   ai_message   TEXT,
 *   locale       TEXT NOT NULL DEFAULT 'en',
 *   created_at   TIMESTAMPTZ DEFAULT now()
 * );
 *
 * CREATE TABLE guestbook (
 *   id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   wish_id    UUID REFERENCES wishes(id) ON DELETE CASCADE,
 *   author_name TEXT NOT NULL,
 *   message    TEXT NOT NULL,
 *   voice_url  TEXT,
 *   created_at TIMESTAMPTZ DEFAULT now()
 * );
 *
 * CREATE TABLE scores (
 *   id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   wish_id       UUID REFERENCES wishes(id) ON DELETE CASCADE,
 *   score         INTEGER NOT NULL DEFAULT 0,
 *   blow_duration FLOAT NOT NULL DEFAULT 0,
 *   created_at    TIMESTAMPTZ DEFAULT now()
 * );
 *
 * -- Storage bucket for user uploads
 * INSERT INTO storage.buckets (id, name, public) VALUES ('blowwish', 'blowwish', true);
 */

export const SCHEMA_DOCS = "See comments in this file for Supabase SQL setup.";
