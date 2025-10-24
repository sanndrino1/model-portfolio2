-- Photos table for persistent storage
CREATE TABLE IF NOT EXISTS photos (
  id TEXT PRIMARY KEY,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  alt TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT, -- JSON array stored as text
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  width INTEGER,
  height INTEGER,
  file_size INTEGER,
  mime_type TEXT,
  featured BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS photo_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tags table
CREATE TABLE IF NOT EXISTS photo_tags (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Photo-tags relationship table
CREATE TABLE IF NOT EXISTS photo_tag_relations (
  photo_id TEXT NOT NULL,
  tag_id TEXT NOT NULL,
  PRIMARY KEY (photo_id, tag_id),
  FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES photo_tags(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_photos_category ON photos(category);
CREATE INDEX IF NOT EXISTS idx_photos_featured ON photos(featured);
CREATE INDEX IF NOT EXISTS idx_photos_created_at ON photos(created_at);
CREATE INDEX IF NOT EXISTS idx_photo_tags_name ON photo_tags(name);

-- Insert default categories
INSERT OR IGNORE INTO photo_categories (id, name, slug, description) VALUES
  ('portrait', 'Портрет', 'portrait', 'Портретна фотография'),
  ('fashion', 'Мода', 'fashion', 'Модна фотография'),
  ('commercial', 'Комерсиални', 'commercial', 'Комерсиална фотография'),
  ('editorial', 'Редакционни', 'editorial', 'Редакционна фотография'),
  ('beauty', 'Красота', 'beauty', 'Beauty фотография'),
  ('lifestyle', 'Lifestyle', 'lifestyle', 'Lifestyle фотография'),
  ('artistic', 'Артистични', 'artistic', 'Артистична фотография');

-- Triggers to update updated_at timestamp
CREATE TRIGGER IF NOT EXISTS update_photos_timestamp 
  AFTER UPDATE ON photos
  BEGIN
    UPDATE photos SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;