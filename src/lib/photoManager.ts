// Photo Management System for Model Portfolio with Persistent Storage
import { photoDatabase, PhotoRecord, PhotoFilters } from './photoDB';
import { imageProcessor, ProcessedImage } from './imageProcessor';

export interface Photo {
  id: string;
  filename: string;
  originalName: string;
  title: string;
  description?: string;
  alt: string;
  category: string;
  tags: string[];
  url: string;
  thumbnail: string;
  width?: number;
  height?: number;
  fileSize?: number;
  mimeType?: string;
  featured: boolean;
  uploadedAt: Date;
}

export enum PhotoCategory {
  PORTRAIT = 'portrait',
  FASHION = 'fashion',
  COMMERCIAL = 'commercial',
  EDITORIAL = 'editorial',
  LIFESTYLE = 'lifestyle',
  BEAUTY = 'beauty',
  HEADSHOTS = 'headshots',
  OTHER = 'other'
}

export interface PhotoFilter {
  category?: PhotoCategory;
  tags?: string[];
  featured?: boolean;
  search?: string;
}

export interface PhotoUploadResult {
  success: boolean;
  photo?: Photo;
  error?: string;
}

class PhotoManager {
  constructor() {
    // Database is initialized automatically via singleton
  }

  private convertRecordToPhoto(record: PhotoRecord): Photo {
    return {
      id: record.id,
      filename: record.filename,
      originalName: record.original_name,
      title: record.title,
      description: record.description,
      alt: record.alt,
      category: record.category,
      tags: record.tags ? JSON.parse(record.tags) : [],
      url: record.url,
      thumbnail: record.thumbnail_url || record.url,
      width: record.width,
      height: record.height,
      fileSize: record.file_size,
      mimeType: record.mime_type,
      featured: record.featured,
      uploadedAt: new Date(record.created_at),
    };
  }

  async uploadPhoto(file: File, metadata: {
    title: string;
    description?: string;
    category: string;
    tags: string[];
    alt: string;
  }): Promise<Photo> {
    try {
      // Process the image
      const processedImage = await imageProcessor.processImage(file, file.name, {
        generateThumbnail: true,
        generateMedium: true,
        quality: 90,
      });

      // Create photo record
      const photoRecord: Omit<PhotoRecord, 'created_at' | 'updated_at'> = {
        id: processedImage.id,
        filename: processedImage.filename,
        original_name: processedImage.originalName,
        title: metadata.title,
        description: metadata.description,
        alt: metadata.alt,
        category: metadata.category,
        tags: JSON.stringify(metadata.tags),
        url: processedImage.url,
        thumbnail_url: processedImage.thumbnailUrl,
        width: processedImage.width,
        height: processedImage.height,
        file_size: processedImage.fileSize,
        mime_type: processedImage.mimeType,
        featured: false,
      };

      // Save to database
      const savedRecord = photoDatabase.createPhoto(photoRecord);
      return this.convertRecordToPhoto(savedRecord);

    } catch (error) {
      console.error('Error uploading photo:', error);
      throw new Error(`Failed to upload photo: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  getPhoto(id: string): Photo | null {
    const record = photoDatabase.getPhotoById(id);
    return record ? this.convertRecordToPhoto(record) : null;
  }

  getPhotos(filters?: {
    category?: string;
    tags?: string[];
    featured?: boolean;
    limit?: number;
    page?: number;
    search?: string;
  }): {
    photos: Photo[];
    total: number;
    hasMore: boolean;
  } {
    const dbFilters: PhotoFilters = {
      category: filters?.category,
      tags: filters?.tags,
      featured: filters?.featured,
      search: filters?.search,
      limit: filters?.limit || 20,
      offset: filters?.page ? (filters.page - 1) * (filters.limit || 20) : 0,
    };

    const result = photoDatabase.getPhotos(dbFilters);
    
    return {
      photos: result.photos.map(record => this.convertRecordToPhoto(record)),
      total: result.total,
      hasMore: result.hasMore,
    };
  }

  updatePhoto(id: string, updates: Partial<Omit<Photo, 'id' | 'uploadedAt'>>): Photo | null {
    const updateData: Partial<Omit<PhotoRecord, 'id' | 'created_at' | 'updated_at'>> = {};

    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.alt !== undefined) updateData.alt = updates.alt;
    if (updates.category !== undefined) updateData.category = updates.category;
    if (updates.tags !== undefined) updateData.tags = JSON.stringify(updates.tags);
    if (updates.featured !== undefined) updateData.featured = updates.featured;

    const updatedRecord = photoDatabase.updatePhoto(id, updateData);
    return updatedRecord ? this.convertRecordToPhoto(updatedRecord) : null;
  }

  async deletePhoto(id: string): Promise<boolean> {
    return photoDatabase.deletePhoto(id);
  }

  getPhotosByCategory(category: string): Photo[] {
    const result = photoDatabase.getPhotos({ category });
    return result.photos.map(record => this.convertRecordToPhoto(record));
  }

  getFeaturedPhotos(): Photo[] {
    const result = photoDatabase.getPhotos({ featured: true });
    return result.photos.map(record => this.convertRecordToPhoto(record));
  }

  searchPhotos(query: string): Photo[] {
    const result = photoDatabase.getPhotos({ search: query });
    return result.photos.map(record => this.convertRecordToPhoto(record));
  }

  getStats(): {
    totalPhotos: number;
    totalSize: number;
    byCategory: Record<string, number>;
    featuredCount: number;
  } {
    const dbStats = photoDatabase.getPhotoStats();
    return {
      totalPhotos: dbStats.total,
      totalSize: dbStats.totalSize,
      byCategory: dbStats.byCategory,
      featuredCount: dbStats.featured,
    };
  }
}

// Export singleton instance
export const photoManager = new PhotoManager();