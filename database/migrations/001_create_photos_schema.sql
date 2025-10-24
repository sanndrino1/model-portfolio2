-- Photo Management Database Schema
-- Creation Date: 2025-10-23
-- For Model Portfolio project

-- Photos table - main photo metadata
CREATE TABLE IF NOT EXISTS photos (
    id VARCHAR(36) PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    alt_text VARCHAR(500) NOT NULL,
    
    -- File info
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    width INTEGER,
    height INTEGER,
    
    -- URLs
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    medium_url TEXT,
    
    -- Organization
    category VARCHAR(50) NOT NULL DEFAULT 'portrait',
    featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    
    -- SEO and metadata
    slug VARCHAR(255) UNIQUE,
    
    -- Timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Check constraints
    CHECK (category IN ('portrait', 'fashion', 'commercial', 'editorial', 'beauty', 'lifestyle', 'artistic')),
    CHECK (file_size > 0),
    CHECK (width > 0),
    CHECK (height > 0)
);

-- Photo tags table - many-to-many relationship
CREATE TABLE IF NOT EXISTS photo_tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    photo_id VARCHAR(36) NOT NULL,
    tag VARCHAR(100) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE CASCADE,
    UNIQUE(photo_id, tag)
);

-- Photo collections table - for organizing photos
CREATE TABLE IF NOT EXISTS photo_collections (
    id VARCHAR(36) PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    slug VARCHAR(255) UNIQUE NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Collection-Photo relationship
CREATE TABLE IF NOT EXISTS collection_photos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    collection_id VARCHAR(36) NOT NULL,
    photo_id VARCHAR(36) NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (collection_id) REFERENCES photo_collections(id) ON DELETE CASCADE,
    FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE CASCADE,
    UNIQUE(collection_id, photo_id)
);

-- Photo processing jobs table - for async thumbnail generation
CREATE TABLE IF NOT EXISTS photo_processing_jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    photo_id VARCHAR(36) NOT NULL,
    job_type VARCHAR(50) NOT NULL, -- 'thumbnail', 'resize', 'optimization'
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    params TEXT, -- JSON with processing parameters
    error_message TEXT,
    started_at DATETIME,
    completed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE CASCADE,
    CHECK (job_type IN ('thumbnail', 'resize', 'optimization', 'webp_conversion')),
    CHECK (status IN ('pending', 'processing', 'completed', 'failed'))
);

-- Photo analytics table - track views, downloads etc
CREATE TABLE IF NOT EXISTS photo_analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    photo_id VARCHAR(36) NOT NULL,
    event_type VARCHAR(50) NOT NULL, -- 'view', 'download', 'share', 'like'
    user_id VARCHAR(36), -- nullable for anonymous users
    ip_address VARCHAR(45),
    user_agent TEXT,
    referrer TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE CASCADE,
    CHECK (event_type IN ('view', 'download', 'share', 'like', 'lightbox_open'))
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_photos_category ON photos(category);
CREATE INDEX IF NOT EXISTS idx_photos_featured ON photos(featured);
CREATE INDEX IF NOT EXISTS idx_photos_published ON photos(is_published);
CREATE INDEX IF NOT EXISTS idx_photos_created_at ON photos(created_at);
CREATE INDEX IF NOT EXISTS idx_photos_sort_order ON photos(sort_order);
CREATE INDEX IF NOT EXISTS idx_photos_slug ON photos(slug);

CREATE INDEX IF NOT EXISTS idx_photo_tags_photo_id ON photo_tags(photo_id);
CREATE INDEX IF NOT EXISTS idx_photo_tags_tag ON photo_tags(tag);

CREATE INDEX IF NOT EXISTS idx_collection_photos_collection ON collection_photos(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_photos_photo ON collection_photos(photo_id);
CREATE INDEX IF NOT EXISTS idx_collection_photos_sort ON collection_photos(sort_order);

CREATE INDEX IF NOT EXISTS idx_processing_jobs_status ON photo_processing_jobs(status);
CREATE INDEX IF NOT EXISTS idx_processing_jobs_type ON photo_processing_jobs(job_type);

CREATE INDEX IF NOT EXISTS idx_analytics_photo_id ON photo_analytics(photo_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON photo_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON photo_analytics(created_at);

-- Update trigger for photos table
CREATE TRIGGER IF NOT EXISTS update_photos_updated_at 
    AFTER UPDATE ON photos
    FOR EACH ROW
    BEGIN
        UPDATE photos SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

-- Update trigger for collections table
CREATE TRIGGER IF NOT EXISTS update_collections_updated_at 
    AFTER UPDATE ON photo_collections
    FOR EACH ROW
    BEGIN
        UPDATE photo_collections SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

-- Sample data for development (optional)
-- INSERT INTO photos (filename, original_filename, title, description, alt_text, file_size, mime_type, width, height, url, category)
-- VALUES 
--     ('sample-portrait-1.jpg', 'model-headshot-2024.jpg', 'Professional Headshot', 'Professional portrait for modeling portfolio', 'Professional headshot of model with natural lighting', 2048000, 'image/jpeg', 2000, 3000, '/photos/sample-portrait-1.jpg', 'portrait'),
--     ('sample-fashion-1.jpg', 'fashion-shoot-spring.jpg', 'Spring Fashion Editorial', 'Editorial fashion shoot for spring collection', 'Model wearing spring fashion collection in natural setting', 3072000, 'image/jpeg', 2400, 3600, '/photos/sample-fashion-1.jpg', 'fashion');