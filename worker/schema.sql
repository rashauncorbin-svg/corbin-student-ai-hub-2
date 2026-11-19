-- Corbin Student AI Hub 2.0
-- Apply only after authentication and authorization are configured.
-- Store provider subject identifiers, not passwords or raw identity tokens.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  auth_subject TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
  display_name TEXT NOT NULL,
  email TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS classes (
  id TEXT PRIMARY KEY,
  teacher_user_id TEXT NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  course_id TEXT NOT NULL CHECK (course_id IN (
    'us-history-standard', 'us-history-honors', 'psychology', 'sociology'
  )),
  join_code_hash TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS enrollments (
  id TEXT PRIMARY KEY,
  class_id TEXT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  student_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'withdrawn')),
  enrolled_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (class_id, student_user_id)
);

CREATE TABLE IF NOT EXISTS lessons (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL,
  title TEXT NOT NULL,
  essential_question TEXT NOT NULL,
  content_json TEXT NOT NULL,
  sequence_number INTEGER NOT NULL,
  published INTEGER NOT NULL DEFAULT 0 CHECK (published IN (0, 1)),
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (course_id, sequence_number)
);

CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY,
  lesson_id TEXT NOT NULL REFERENCES lessons(id),
  class_id TEXT NOT NULL REFERENCES classes(id),
  student_user_id TEXT NOT NULL REFERENCES users(id),
  checkpoint_key TEXT NOT NULL,
  response_text TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'reviewed', 'returned')),
  teacher_feedback TEXT,
  submitted_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TEXT,
  UNIQUE (lesson_id, class_id, student_user_id, checkpoint_key)
);

CREATE INDEX IF NOT EXISTS idx_classes_teacher ON classes(teacher_user_id, status);
CREATE INDEX IF NOT EXISTS idx_enrollments_student ON enrollments(student_user_id, status);
CREATE INDEX IF NOT EXISTS idx_lessons_course ON lessons(course_id, published, sequence_number);
CREATE INDEX IF NOT EXISTS idx_submissions_class ON submissions(class_id, submitted_at);
CREATE INDEX IF NOT EXISTS idx_submissions_student ON submissions(student_user_id, submitted_at);
