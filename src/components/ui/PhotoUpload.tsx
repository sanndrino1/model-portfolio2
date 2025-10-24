'use client';

import React, { useState, useCallback } from 'react';
import { Button } from './Button';
import { Modal } from './Modal';
import { Input } from './Input';
import { Textarea } from './Textarea';
import { CategoryDropdown } from './CategoryDropdown';
import { Icon } from './Icon';

interface PhotoUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[], metadata: PhotoMetadata) => Promise<void>;
}

interface PhotoMetadata {
  title: string;
  description: string;
  category: string;
  tags: string[];
  alt: string;
}

interface PreviewFile {
  file: File;
  url: string;
  id: string;
}

const photoCategories = [
  { value: 'portrait', label: 'Портрет' },
  { value: 'fashion', label: 'Мода' },
  { value: 'commercial', label: 'Комерсиални' },
  { value: 'editorial', label: 'Редакционни' },
  { value: 'beauty', label: 'Красота' },
  { value: 'lifestyle', label: 'Lifestyle' },
  { value: 'artistic', label: 'Артистични' },
];

export function PhotoUpload({ isOpen, onClose, onUpload }: PhotoUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<PreviewFile[]>([]);
  const [metadata, setMetadata] = useState<PhotoMetadata>({
    title: '',
    description: '',
    category: 'portrait',
    tags: [],
    alt: '',
  });
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    processFiles(files);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(file => 
      file.type.startsWith('image/')
    );
    processFiles(files);
  }, []);

  const processFiles = (files: File[]) => {
    const newPreviewFiles: PreviewFile[] = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9),
    }));
    
    setSelectedFiles(prev => [...prev, ...newPreviewFiles]);
  };

  const removeFile = (id: string) => {
    setSelectedFiles(prev => {
      const updated = prev.filter(f => f.id !== id);
      // Освобождаване на memory за URL
      const removed = prev.find(f => f.id === id);
      if (removed) {
        URL.revokeObjectURL(removed.url);
      }
      return updated;
    });
  };

  const handleTagAdd = () => {
    if (tagInput.trim() && !metadata.tags.includes(tagInput.trim())) {
      setMetadata(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleTagRemove = (tag: string) => {
    setMetadata(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    setIsUploading(true);
    try {
      await onUpload(selectedFiles.map(f => f.file), metadata);
      
      // Почистване
      selectedFiles.forEach(f => URL.revokeObjectURL(f.url));
      setSelectedFiles([]);
      setMetadata({
        title: '',
        description: '',
        category: 'portrait',
        tags: [],
        alt: '',
      });
      setTagInput('');
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    // Почистване на URLs при затваряне
    selectedFiles.forEach(f => URL.revokeObjectURL(f.url));
    setSelectedFiles([]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Качване на снимки">
      <div className="space-y-6">
        {/* Drag & Drop зона */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver 
              ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
              : 'border-gray-300 dark:border-gray-600'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Icon name="upload" className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-medium mb-2">
            Плъзнете снимки тук или кликнете за избор
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Поддържани формати: JPG, PNG, WebP, AVIF
          </p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="photo-upload"
          />
          <label htmlFor="photo-upload">
            <Button variant="outline" className="cursor-pointer">
              Избери файлове
            </Button>
          </label>
        </div>

        {/* Preview на избраните снимки */}
        {selectedFiles.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium">Избрани снимки ({selectedFiles.length})</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-60 overflow-y-auto">
              {selectedFiles.map((file) => (
                <div key={file.id} className="relative group">
                  <img
                    src={file.url}
                    alt={file.file.name}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeFile(file.id)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 rounded-b-lg">
                    {file.file.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metadata форма */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Заглавие"
              value={metadata.title}
              onChange={(e) => setMetadata(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Въведете заглавие..."
            />
            
            <CategoryDropdown
              categories={photoCategories}
              selected={metadata.category}
              onSelect={(category) => setMetadata(prev => ({ ...prev, category }))}
              trigger={
                <Button variant="outline" className="w-full justify-between">
                  {photoCategories.find(c => c.value === metadata.category)?.label || 'Изберете категория'}
                  <Icon name="chevron-down" className="w-4 h-4" />
                </Button>
              }
            />
          </div>

          <Textarea
            label="Описание"
            value={metadata.description}
            onChange={(e) => setMetadata(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Описание на снимката..."
            rows={3}
          />

          <Input
            label="Alt текст (за достъпност)"
            value={metadata.alt}
            onChange={(e) => setMetadata(prev => ({ ...prev, alt: e.target.value }))}
            placeholder="Описание за screen readers..."
          />

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-2">Тагове</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Добави таг..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleTagAdd())}
                className="flex-1"
              />
              <Button onClick={handleTagAdd} variant="outline">
                Добави
              </Button>
            </div>
            
            {metadata.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {metadata.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    {tag}
                    <button
                      onClick={() => handleTagRemove(tag)}
                      className="w-4 h-4 hover:text-red-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Бутони */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Отказ
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={selectedFiles.length === 0 || isUploading}
            className="min-w-24"
          >
            {isUploading ? 'Качване...' : `Качи (${selectedFiles.length})`}
          </Button>
        </div>
      </div>
    </Modal>
  );
}