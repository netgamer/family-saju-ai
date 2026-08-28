-- Family Saju AI - initial D1 schema
-- Run this in Cloudflare D1 after creating the database.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS families (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS family_members (
  id TEXT PRIMARY KEY,
  family_id TEXT NOT NULL,
  name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  birth_date TEXT NOT NULL,
  birth_time TEXT NOT NULL,
  sex TEXT NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'Asia/Seoul',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS saju_profiles (
  member_id TEXT PRIMARY KEY,
  calculation_version TEXT NOT NULL,
  year_pillar TEXT,
  month_pillar TEXT,
  day_pillar TEXT,
  hour_pillar TEXT,
  payload_json TEXT NOT NULL,
  calculated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES family_members(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS relationships (
  id TEXT PRIMARY KEY,
  family_id TEXT NOT NULL,
  member_a_id TEXT NOT NULL,
  member_b_id TEXT NOT NULL,
  relationship_type TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE,
  FOREIGN KEY (member_a_id) REFERENCES family_members(id) ON DELETE CASCADE,
  FOREIGN KEY (member_b_id) REFERENCES family_members(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_members_family_id ON family_members(family_id);
CREATE INDEX IF NOT EXISTS idx_relationships_family_id ON relationships(family_id);
