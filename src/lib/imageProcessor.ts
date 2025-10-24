import sharp from 'sharp';
import { join } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { randomUUID } from 'crypto';

export interface ImageProcessingOptions {
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp' | 'avif';
  generateThumbnail?: boolean;
  thumbnailSize?: number;
  generateMedium?: boolean;
  mediumSize?: number;
}

export interface ProcessedImage {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  thumbnailUrl?: string;
  mediumUrl?: string;
  width: number;
  height: number;
  fileSize: number;
  mimeType: string;
  metadata: {
    format: string;
    space: string;
    channels: number;
    density?: number;
    hasProfile: boolean;
    hasAlpha: boolean;
  };
}

class ImageProcessor {
  private uploadDir: string;
  private publicPath: string;

  constructor() {
    this.uploadDir = join(process.cwd(), 'public', 'uploads', 'photos');
    this.publicPath = '/uploads/photos';
    
    // Ensure upload directory exists
    this.ensureDirectoryExists(this.uploadDir);
    this.ensureDirectoryExists(join(this.uploadDir, 'thumbnails'));
    this.ensureDirectoryExists(join(this.uploadDir, 'medium'));
  }

  private ensureDirectoryExists(dirPath: string) {
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
    }
  }

  private generateFilename(originalName: string, suffix?: string): string {
    const id = randomUUID();
    const ext = originalName.split('.').pop()?.toLowerCase() || 'jpg';
    const baseName = originalName.replace(/\.[^/.]+$/, '');
    const safeName = baseName.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
    
    return suffix 
      ? `${id}-${safeName}-${suffix}.${ext}`
      : `${id}-${safeName}.${ext}`;
  }

  async processImage(
    file: File | Buffer, 
    originalName: string,
    options: ImageProcessingOptions = {}
  ): Promise<ProcessedImage> {
    const {
      quality = 90,
      format = 'jpeg',
      generateThumbnail = true,
      thumbnailSize = 300,
      generateMedium = true,
      mediumSize = 800
    } = options;

    try {
      // Convert File to Buffer if needed
      const buffer = file instanceof File ? Buffer.from(await file.arrayBuffer()) : file;
      
      // Generate unique filenames
      const id = randomUUID();
      const filename = this.generateFilename(originalName);
      const thumbnailFilename = generateThumbnail ? this.generateFilename(originalName, 'thumb') : undefined;
      const mediumFilename = generateMedium ? this.generateFilename(originalName, 'medium') : undefined;

      // Get image metadata
      const image = sharp(buffer);
      const metadata = await image.metadata();
      
      if (!metadata.width || !metadata.height) {
        throw new Error('Invalid image: unable to read dimensions');
      }

      // Process main image
      const processedMain = await image
        .resize({ 
          width: Math.min(metadata.width, 2048), 
          height: Math.min(metadata.height, 2048),
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({ quality, progressive: true })
        .toBuffer();

      // Save main image
      const mainPath = join(this.uploadDir, filename);
      writeFileSync(mainPath, processedMain);

      let thumbnailUrl: string | undefined;
      let mediumUrl: string | undefined;

      // Generate thumbnail
      if (generateThumbnail && thumbnailFilename) {
        const thumbnail = await image
          .resize(thumbnailSize, thumbnailSize, {
            fit: 'cover',
            position: 'center'
          })
          .jpeg({ quality: 85 })
          .toBuffer();

        const thumbnailPath = join(this.uploadDir, 'thumbnails', thumbnailFilename);
        writeFileSync(thumbnailPath, thumbnail);
        thumbnailUrl = `${this.publicPath}/thumbnails/${thumbnailFilename}`;
      }

      // Generate medium size
      if (generateMedium && mediumFilename) {
        const medium = await image
          .resize({ 
            width: mediumSize, 
            height: mediumSize,
            fit: 'inside',
            withoutEnlargement: true
          })
          .jpeg({ quality })
          .toBuffer();

        const mediumPath = join(this.uploadDir, 'medium', mediumFilename);
        writeFileSync(mediumPath, medium);
        mediumUrl = `${this.publicPath}/medium/${mediumFilename}`;
      }

      // Get final image info
      const finalMetadata = await sharp(processedMain).metadata();

      return {
        id,
        filename,
        originalName,
        url: `${this.publicPath}/${filename}`,
        thumbnailUrl,
        mediumUrl,
        width: finalMetadata.width!,
        height: finalMetadata.height!,
        fileSize: processedMain.length,
        mimeType: `image/${format}`,
        metadata: {
          format: finalMetadata.format || 'unknown',
          space: finalMetadata.space || 'unknown',
          channels: finalMetadata.channels || 0,
          density: finalMetadata.density,
          hasProfile: Boolean(finalMetadata.icc),
          hasAlpha: Boolean(finalMetadata.hasAlpha),
        }
      };

    } catch (error) {
      console.error('Error processing image:', error);
      throw new Error(`Failed to process image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async generateThumbnail(imagePath: string, size: number = 300): Promise<string> {
    try {
      const filename = this.generateFilename('thumbnail', 'thumb');
      const thumbnailPath = join(this.uploadDir, 'thumbnails', filename);

      await sharp(imagePath)
        .resize(size, size, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ quality: 85 })
        .toFile(thumbnailPath);

      return `${this.publicPath}/thumbnails/${filename}`;
    } catch (error) {
      console.error('Error generating thumbnail:', error);
      throw new Error('Failed to generate thumbnail');
    }
  }

  async resizeImage(
    imagePath: string, 
    width: number, 
    height?: number,
    options: { fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside'; quality?: number } = {}
  ): Promise<string> {
    try {
      const { fit = 'inside', quality = 90 } = options;
      const filename = this.generateFilename('resized', `${width}x${height || width}`);
      const outputPath = join(this.uploadDir, filename);

      await sharp(imagePath)
        .resize(width, height, { fit })
        .jpeg({ quality })
        .toFile(outputPath);

      return `${this.publicPath}/${filename}`;
    } catch (error) {
      console.error('Error resizing image:', error);
      throw new Error('Failed to resize image');
    }
  }

  async optimizeImage(imagePath: string, quality: number = 85): Promise<string> {
    try {
      const filename = this.generateFilename('optimized', 'opt');
      const outputPath = join(this.uploadDir, filename);

      await sharp(imagePath)
        .jpeg({ quality, progressive: true })
        .toFile(outputPath);

      return `${this.publicPath}/${filename}`;
    } catch (error) {
      console.error('Error optimizing image:', error);
      throw new Error('Failed to optimize image');
    }
  }

  async getImageInfo(imagePath: string): Promise<{
    width: number;
    height: number;
    format: string;
    size: number;
    metadata: sharp.Metadata;
  }> {
    try {
      const metadata = await sharp(imagePath).metadata();
      const stats = await sharp(imagePath).stats();
      
      return {
        width: metadata.width || 0,
        height: metadata.height || 0,
        format: metadata.format || 'unknown',
        size: metadata.size || 0,
        metadata
      };
    } catch (error) {
      console.error('Error getting image info:', error);
      throw new Error('Failed to get image information');
    }
  }
}

// Export singleton instance
export const imageProcessor = new ImageProcessor();
export default ImageProcessor;