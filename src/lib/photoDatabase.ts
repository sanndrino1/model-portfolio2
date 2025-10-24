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

export interface PhotoCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
}
  featured: boolean;
  is_published: boolean;
  sort_order: number;
  slug?: string;
  created_at: string;
  updated_at: string;
}

export interface PhotoTag {
  id: number;
  photo_id: string;
  tag: string;
  created_at: string;
}

export interface PhotoCollection {
  id: string;
  name: string;
  description?: string;
  slug: string;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface PhotoProcessingJob {
  id: number;
  photo_id: string;
  job_type: 'thumbnail' | 'resize' | 'optimization' | 'webp_conversion';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  params?: string; // JSON string
  error_message?: string;
  started_at?: string;
  completed_at?: string;
  created_at: string;
}

class PhotoDatabase {
  private db: Database.Database;
  private static instance: PhotoDatabase;

  constructor() {
    const dbPath = process.env.NODE_ENV === 'production' 
      ? '/app/data/photos.db' 
      : path.join(process.cwd(), 'data', 'photos.db');
    
    // Ensure data directory exists
    const dataDir = path.dirname(dbPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('foreign_keys = ON');
    
    this.runMigrations();
  }

  public static getInstance(): PhotoDatabase {
    if (!PhotoDatabase.instance) {
      PhotoDatabase.instance = new PhotoDatabase();
    }
    return PhotoDatabase.instance;
  }

  private runMigrations() {
    try {
      const migrationsDir = path.join(process.cwd(), 'database', 'migrations');
      
      if (!fs.existsSync(migrationsDir)) {
        console.log('No migrations directory found, skipping database setup');
        return;
      }

      const migrationFiles = fs.readdirSync(migrationsDir)
        .filter(file => file.endsWith('.sql'))
        .sort();

      for (const file of migrationFiles) {
        const migrationPath = path.join(migrationsDir, file);
        const migration = fs.readFileSync(migrationPath, 'utf8');
        
        console.log(`Running migration: ${file}`);
        this.db.exec(migration);
      }
      
      console.log('Database migrations completed successfully');
    } catch (error) {
      console.error('Error running migrations:', error);
      throw error;
    }
  }

  // Photo CRUD operations
  public createPhoto(photo: Omit<PhotoRow, 'id' | 'created_at' | 'updated_at'>): PhotoRow {
    const stmt = this.db.prepare(`
      INSERT INTO photos (
        filename, original_filename, title, description, alt_text,
        file_size, mime_type, width, height, url, thumbnail_url, medium_url,
        category, featured, is_published, sort_order, slug
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      photo.filename,
      photo.original_filename,
      photo.title,
      photo.description,
      photo.alt_text,
      photo.file_size,
      photo.mime_type,
      photo.width,
      photo.height,
      photo.url,
      photo.thumbnail_url,
      photo.medium_url,
      photo.category,
      photo.featured ? 1 : 0,
      photo.is_published ? 1 : 0,
      photo.sort_order,
      photo.slug
    );

    return this.getPhoto(result.lastInsertRowid as string)!;
  }

  public getPhoto(id: string): PhotoRow | null {
    const stmt = this.db.prepare('SELECT * FROM photos WHERE id = ?');
    const row = stmt.get(id) as PhotoRow | undefined;
    
    if (row) {
      row.featured = Boolean(row.featured);
      row.is_published = Boolean(row.is_published);
    }
    
    return row || null;
  }

  public getPhotos(filters: PhotoFilters = {}): { photos: Photo[]; total: number; hasMore: boolean } {
    let query = 'SELECT * FROM photos WHERE is_published = 1';
    const params: any[] = [];

    if (filters.category && filters.category !== 'all') {
      query += ' AND category = ?';
      params.push(filters.category);
    }

    if (filters.featured !== undefined) {
      query += ' AND featured = ?';
      params.push(filters.featured ? 1 : 0);
    }

    if (filters.tags && filters.tags.length > 0) {
      const tagPlaceholders = filters.tags.map(() => '?').join(',');
      query += ` AND id IN (
        SELECT photo_id FROM photo_tags 
        WHERE tag IN (${tagPlaceholders})
        GROUP BY photo_id 
        HAVING COUNT(DISTINCT tag) = ?
      )`;
      params.push(...filters.tags, filters.tags.length);
    }

    // Count total for pagination
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as count');
    const countResult = this.db.prepare(countQuery).get(...params) as { count: number };
    const total = countResult.count;

    // Add ordering and pagination
    query += ' ORDER BY sort_order DESC, created_at DESC';
    
    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(filters.limit);
      
      if (filters.page && filters.page > 1) {
        query += ' OFFSET ?';
        params.push((filters.page - 1) * filters.limit);
      }
    }

    const stmt = this.db.prepare(query);
    const rows = stmt.all(...params) as PhotoRow[];

    const photos: Photo[] = rows.map(row => ({
      id: row.id,
      filename: row.filename,
      originalFilename: row.original_filename,
      title: row.title,
      description: row.description,
      alt: row.alt_text,
      fileSize: row.file_size,
      mimeType: row.mime_type,
      width: row.width,
      height: row.height,
      url: row.url,
      thumbnail: row.thumbnail_url,
      medium: row.medium_url,
      category: row.category,
      featured: Boolean(row.featured),
      published: Boolean(row.is_published),
      sortOrder: row.sort_order,
      slug: row.slug,
      tags: this.getPhotoTags(row.id),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    }));

    const hasMore = filters.limit ? (filters.page || 1) * filters.limit < total : false;

    return { photos, total, hasMore };
  }

  public updatePhoto(id: string, updates: Partial<Omit<PhotoRow, 'id' | 'created_at' | 'updated_at'>>): PhotoRow | null {
    const setClauses: string[] = [];
    const params: any[] = [];

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        setClauses.push(`${key} = ?`);
        params.push(value);
      }
    });

    if (setClauses.length === 0) {
      return this.getPhoto(id);
    }

    params.push(id);
    const query = `UPDATE photos SET ${setClauses.join(', ')} WHERE id = ?`;
    
    const stmt = this.db.prepare(query);
    stmt.run(...params);

    return this.getPhoto(id);
  }

  public deletePhoto(id: string): boolean {
    const stmt = this.db.prepare('DELETE FROM photos WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  // Photo Tags operations
  public getPhotoTags(photoId: string): string[] {
    const stmt = this.db.prepare('SELECT tag FROM photo_tags WHERE photo_id = ? ORDER BY tag');
    const rows = stmt.all(photoId) as { tag: string }[];
    return rows.map(row => row.tag);
  }

  public setPhotoTags(photoId: string, tags: string[]): void {
    // Remove existing tags
    const deleteStmt = this.db.prepare('DELETE FROM photo_tags WHERE photo_id = ?');
    deleteStmt.run(photoId);

    // Add new tags
    if (tags.length > 0) {
      const insertStmt = this.db.prepare('INSERT INTO photo_tags (photo_id, tag) VALUES (?, ?)');
      const insertMany = this.db.transaction((tags: string[]) => {
        for (const tag of tags) {
          insertStmt.run(photoId, tag.trim().toLowerCase());
        }
      });
      insertMany(tags);
    }
  }

  // Processing Jobs operations
  public createProcessingJob(job: Omit<PhotoProcessingJob, 'id' | 'created_at'>): number {
    const stmt = this.db.prepare(`
      INSERT INTO photo_processing_jobs (photo_id, job_type, status, params, error_message, started_at, completed_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      job.photo_id,
      job.job_type,
      job.status,
      job.params,
      job.error_message,
      job.started_at,
      job.completed_at
    );

    return result.lastInsertRowid as number;
  }

  public getPendingJobs(jobType?: string): PhotoProcessingJob[] {
    let query = 'SELECT * FROM photo_processing_jobs WHERE status = "pending"';
    const params: string[] = [];

    if (jobType) {
      query += ' AND job_type = ?';
      params.push(jobType);
    }

    query += ' ORDER BY created_at ASC';

    const stmt = this.db.prepare(query);
    return stmt.all(...params) as PhotoProcessingJob[];
  }

  public updateJobStatus(jobId: number, status: PhotoProcessingJob['status'], errorMessage?: string): void {
    const updates: any[] = [status];
    let query = 'UPDATE photo_processing_jobs SET status = ?';

    if (status === 'processing') {
      query += ', started_at = CURRENT_TIMESTAMP';
    } else if (status === 'completed' || status === 'failed') {
      query += ', completed_at = CURRENT_TIMESTAMP';
    }

    if (errorMessage) {
      query += ', error_message = ?';
      updates.push(errorMessage);
    }

    query += ' WHERE id = ?';
    updates.push(jobId);

    const stmt = this.db.prepare(query);
    stmt.run(...updates);
  }

  // Analytics operations
  public trackPhotoEvent(photoId: string, eventType: string, metadata?: any): void {
    const stmt = this.db.prepare(`
      INSERT INTO photo_analytics (photo_id, event_type, user_id, ip_address, user_agent, referrer)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      photoId,
      eventType,
      metadata?.userId,
      metadata?.ipAddress,
      metadata?.userAgent,
      metadata?.referrer
    );
  }

  public getPhotoStats(photoId: string): Record<string, number> {
    const stmt = this.db.prepare(`
      SELECT event_type, COUNT(*) as count 
      FROM photo_analytics 
      WHERE photo_id = ? 
      GROUP BY event_type
    `);

    const rows = stmt.all(photoId) as { event_type: string; count: number }[];
    const stats: Record<string, number> = {};
    
    rows.forEach(row => {
      stats[row.event_type] = row.count;
    });

    return stats;
  }

  // Utility methods
  public close(): void {
    this.db.close();
  }

  public backup(backupPath: string): void {
    this.db.backup(backupPath);
  }
}

// Export singleton instance
export const photoDatabase = PhotoDatabase.getInstance();
export default photoDatabase;