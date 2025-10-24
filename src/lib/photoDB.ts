import Database from 'better-sqlite3';
import { join } from 'path';
import { readFileSync, existsSync, mkdirSync } from 'fs';

export interface PhotoRecord {
  id: string;
  filename: string;
  original_name: string;
  title: string;
  description?: string;
  alt: string;
  category: string;
  tags: string; // JSON string
  url: string;
  thumbnail_url?: string;
  width?: number;
  height?: number;
  file_size?: number;
  mime_type?: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface PhotoFilters {
  category?: string;
  tags?: string[];
  featured?: boolean;
  limit?: number;
  offset?: number;
  search?: string;
}

class PhotoDatabase {
  private db: Database.Database;

  constructor(dbPath?: string) {
    // Create data directory if it doesn't exist
    const dataDir = join(process.cwd(), 'data');
    if (!existsSync(dataDir)) {
      mkdirSync(dataDir, { recursive: true });
    }

    const defaultPath = join(dataDir, 'photos.db');
    this.db = new Database(dbPath || defaultPath);
    
    // Enable foreign keys
    this.db.pragma('foreign_keys = ON');
    
    // Initialize database
    this.initializeDatabase();
  }

  private initializeDatabase() {
    try {
      // Read and execute migrations
      const migrationPath = join(process.cwd(), 'database', 'migrations', '002_create_photos_tables.sql');
      
      if (existsSync(migrationPath)) {
        const migration = readFileSync(migrationPath, 'utf-8');
        
        // Split by semicolon and execute each statement
        const statements = migration.split(';').filter(stmt => stmt.trim());
        
        this.db.transaction(() => {
          for (const statement of statements) {
            if (statement.trim()) {
              this.db.exec(statement);
            }
          }
        })();
        
        console.log('Photo database initialized successfully');
      } else {
        console.warn('Migration file not found, creating basic tables');
        this.createBasicTables();
      }
    } catch (error) {
      console.error('Error initializing photo database:', error);
      // Create basic tables as fallback
      this.createBasicTables();
    }
  }

  private createBasicTables() {
    const createPhotosTable = `
      CREATE TABLE IF NOT EXISTS photos (
        id TEXT PRIMARY KEY,
        filename TEXT NOT NULL,
        original_name TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        alt TEXT NOT NULL,
        category TEXT NOT NULL,
        tags TEXT,
        url TEXT NOT NULL,
        thumbnail_url TEXT,
        width INTEGER,
        height INTEGER,
        file_size INTEGER,
        mime_type TEXT,
        featured BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    this.db.exec(createPhotosTable);
  }

  // Photo CRUD operations
  createPhoto(data: Omit<PhotoRecord, 'created_at' | 'updated_at'>): PhotoRecord {
    const stmt = this.db.prepare(`
      INSERT INTO photos (
        id, filename, original_name, title, description, alt, category, 
        tags, url, thumbnail_url, width, height, file_size, mime_type, featured
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      data.id,
      data.filename,
      data.original_name,
      data.title,
      data.description || null,
      data.alt,
      data.category,
      data.tags,
      data.url,
      data.thumbnail_url || null,
      data.width || null,
      data.height || null,
      data.file_size || null,
      data.mime_type || null,
      data.featured ? 1 : 0
    );

    return this.getPhotoById(data.id)!;
  }

  getPhotoById(id: string): PhotoRecord | null {
    const stmt = this.db.prepare('SELECT * FROM photos WHERE id = ?');
    const result = stmt.get(id) as PhotoRecord | undefined;
    
    if (result) {
      result.featured = Boolean(result.featured);
    }
    
    return result || null;
  }

  getPhotos(filters: PhotoFilters = {}): {
    photos: PhotoRecord[];
    total: number;
    hasMore: boolean;
  } {
    let query = 'SELECT * FROM photos WHERE 1=1';
    const params: any[] = [];

    // Apply filters
    if (filters.category) {
      query += ' AND category = ?';
      params.push(filters.category);
    }

    if (filters.featured !== undefined) {
      query += ' AND featured = ?';
      params.push(filters.featured ? 1 : 0);
    }

    if (filters.search) {
      query += ' AND (title LIKE ? OR description LIKE ? OR tags LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (filters.tags && filters.tags.length > 0) {
      const tagConditions = filters.tags.map(() => 'tags LIKE ?').join(' AND ');
      query += ` AND (${tagConditions})`;
      filters.tags.forEach(tag => params.push(`%"${tag}"%`));
    }

    // Count total results
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as count');
    const countStmt = this.db.prepare(countQuery);
    const { count: total } = countStmt.get(...params) as { count: number };

    // Apply pagination
    query += ' ORDER BY created_at DESC';
    
    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(filters.limit);
      
      if (filters.offset) {
        query += ' OFFSET ?';
        params.push(filters.offset);
      }
    }

    const stmt = this.db.prepare(query);
    const photos = stmt.all(...params) as PhotoRecord[];
    
    // Convert featured to boolean
    photos.forEach(photo => {
      photo.featured = Boolean(photo.featured);
    });

    const hasMore = filters.limit ? (filters.offset || 0) + photos.length < total : false;

    return { photos, total, hasMore };
  }

  updatePhoto(id: string, data: Partial<Omit<PhotoRecord, 'id' | 'created_at' | 'updated_at'>>): PhotoRecord | null {
    const fields = Object.keys(data).filter(key => data[key as keyof typeof data] !== undefined);
    if (fields.length === 0) return this.getPhotoById(id);

    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => {
      const value = data[field as keyof typeof data];
      return field === 'featured' ? (value ? 1 : 0) : value;
    });

    const stmt = this.db.prepare(`UPDATE photos SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`);
    stmt.run(...values, id);

    return this.getPhotoById(id);
  }

  deletePhoto(id: string): boolean {
    const stmt = this.db.prepare('DELETE FROM photos WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  close() {
    this.db.close();
  }
}

// Export singleton instance
export const photoDatabase = new PhotoDatabase();
export default PhotoDatabase;