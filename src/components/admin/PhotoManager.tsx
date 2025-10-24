'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { CategoryDropdown } from '../ui/CategoryDropdown';
import { PhotoUpload } from '../ui/PhotoUpload';
import { Gallery } from '../ui/Gallery';
import { Icon } from '../ui/Icon';
import { Badge } from '../ui/Badge';
import { Dropdown } from '../ui/Dropdown';
import type { Photo } from '@/lib/photoManager';

const photoCategories = [
  { value: 'all', label: 'Всички' },
  { value: 'portrait', label: 'Портрет' },
  { value: 'fashion', label: 'Мода' },
  { value: 'commercial', label: 'Комерсиални' },
  { value: 'editorial', label: 'Редакционни' },
  { value: 'beauty', label: 'Красота' },
  { value: 'lifestyle', label: 'Lifestyle' },
  { value: 'artistic', label: 'Артистични' },
];

interface PhotoEditData {
  title: string;
  description: string;
  category: string;
  tags: string[];
  alt: string;
  featured: boolean;
}

export function PhotoManager() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [editData, setEditData] = useState<PhotoEditData>({
    title: '',
    description: '',
    category: 'portrait',
    tags: [],
    alt: '',
    featured: false,
  });
  const [tagInput, setTagInput] = useState('');

  // Зареждане на снимки
  const loadPhotos = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      
      const response = await fetch(`/api/photos?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setPhotos(result.data.photos || []);
      }
    } catch (error) {
      console.error('Error loading photos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPhotos();
  }, [selectedCategory]);

  // Филтриране по search term
  const filteredPhotos = photos.filter(photo =>
    photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    photo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    photo.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Upload handler
  const handleUpload = async (files: File[], metadata: any) => {
    try {
      const formData = new FormData();
      formData.append('title', metadata.title);
      formData.append('description', metadata.description);
      formData.append('category', metadata.category);
      formData.append('tags', metadata.tags.join(','));
      formData.append('alt', metadata.alt);

      files.forEach((file, index) => {
        formData.append(`file_${index}`, file);
      });

      const response = await fetch('/api/photos', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        await loadPhotos(); // Презареждане на списъка
      } else {
        alert(result.error || 'Грешка при качването');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Грешка при качването на снимките');
    }
  };

  // Edit handlers
  const startEdit = (photo: Photo) => {
    setEditingPhoto(photo);
    setEditData({
      title: photo.title,
      description: photo.description,
      category: photo.category,
      tags: [...photo.tags],
      alt: photo.alt,
      featured: photo.featured,
    });
    setTagInput('');
  };

  const handleEditSave = async () => {
    if (!editingPhoto) return;

    try {
      const response = await fetch(`/api/photos/${editingPhoto.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });

      const result = await response.json();
      if (result.success) {
        setEditingPhoto(null);
        await loadPhotos();
      } else {
        alert(result.error || 'Грешка при записването');
      }
    } catch (error) {
      console.error('Edit error:', error);
      alert('Грешка при записването на промените');
    }
  };

  const handleDelete = async (photo: Photo) => {
    if (!confirm(`Сигурни ли сте, че искате да изтриете "${photo.title}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/photos/${photo.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      if (result.success) {
        await loadPhotos();
      } else {
        alert(result.error || 'Грешка при изтриването');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Грешка при изтриването на снимката');
    }
  };

  // Tag management
  const addTag = () => {
    if (tagInput.trim() && !editData.tags.includes(tagInput.trim())) {
      setEditData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setEditData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Управление на снимки</h2>
        <Button onClick={() => setIsUploadOpen(true)}>
          <Icon name="plus" className="w-4 h-4 mr-2" />
          Качи снимки
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Търсене по заглавие, описание или тагове..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <CategoryDropdown
            categories={photoCategories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
            trigger={
              <Button variant="outline" className="min-w-40 justify-between">
                {photoCategories.find(c => c.value === selectedCategory)?.label}
                <Icon name="chevron-down" className="w-4 h-4" />
              </Button>
            }
          />
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {filteredPhotos.length}
          </div>
          <div className="text-sm text-gray-500">Показани снимки</div>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {photos.filter(p => p.featured).length}
          </div>
          <div className="text-sm text-gray-500">Избрани</div>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {new Set(photos.map(p => p.category)).size}
          </div>
          <div className="text-sm text-gray-500">Категории</div>
        </Card>
      </div>

      {/* Photos Grid */}
      {loading ? (
        <div className="text-center py-8">
          <Icon name="spinner" className="w-8 h-8 animate-spin mx-auto mb-2" />
          <p>Зареждане на снимки...</p>
        </div>
      ) : filteredPhotos.length === 0 ? (
        <Card className="p-8 text-center">
          <Icon name="image" className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium mb-2">Няма намерени снимки</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Опитайте с различни филтри'
              : 'Качете първите си снимки'
            }
          </p>
          {!searchTerm && selectedCategory === 'all' && (
            <Button onClick={() => setIsUploadOpen(true)}>
              Качи снимки
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPhotos.map((photo) => (
            <Card key={photo.id} className="overflow-hidden">
              <div className="relative aspect-square">
                <img
                  src={photo.thumbnailUrl}
                  alt={photo.alt}
                  className="w-full h-full object-cover"
                />
                {photo.featured && (
                  <Badge 
                    variant="success" 
                    className="absolute top-2 left-2"
                  >
                    Избрана
                  </Badge>
                )}
                
                <div className="absolute top-2 right-2">
                  <Dropdown
                    onSelect={(action) => {
                      if (action === 'edit') startEdit(photo);
                      if (action === 'delete') handleDelete(photo);
                    }}
                    trigger={
                      <Button size="sm" variant="outline" className="w-8 h-8 p-0 bg-white/90">
                        <Icon name="more-vertical" className="w-4 h-4" />
                      </Button>
                    }
                  >
                    <div className="py-1">
                      <button className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left">
                        Редактирай
                      </button>
                      <button className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left text-red-600">
                        Изтрий
                      </button>
                    </div>
                  </Dropdown>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-medium mb-1 truncate">{photo.title}</h3>
                <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                  {photo.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <Badge variant="outline">
                    {photoCategories.find(c => c.value === photo.category)?.label}
                  </Badge>
                  <span className="text-xs text-gray-400">
                    {new Date(photo.createdAt).toLocaleDateString('bg-BG')}
                  </span>
                </div>
                
                {photo.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {photo.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-100 dark:bg-gray-800 text-xs px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {photo.tags.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{photo.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <PhotoUpload
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={handleUpload}
      />

      {/* Edit Modal */}
      {editingPhoto && (
        <Modal
          isOpen={true}
          onClose={() => setEditingPhoto(null)}
          title={`Редактиране на "${editingPhoto.title}"`}
        >
          <div className="space-y-4">
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={editingPhoto.url}
                alt={editingPhoto.alt}
                className="w-full h-full object-cover"
              />
            </div>

            <Input
              label="Заглавие"
              value={editData.title}
              onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
            />

            <Textarea
              label="Описание"
              value={editData.description}
              onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />

            <CategoryDropdown
              categories={photoCategories.filter(c => c.value !== 'all')}
              selected={editData.category}
              onSelect={(category) => setEditData(prev => ({ ...prev, category }))}
              trigger={
                <Button variant="outline" className="w-full justify-between">
                  {photoCategories.find(c => c.value === editData.category)?.label}
                  <Icon name="chevron-down" className="w-4 h-4" />
                </Button>
              }
            />

            <Input
              label="Alt текст"
              value={editData.alt}
              onChange={(e) => setEditData(prev => ({ ...prev, alt: e.target.value }))}
            />

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-2">Тагове</label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Добави таг..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1"
                />
                <Button onClick={addTag} variant="outline">
                  Добави
                </Button>
              </div>
              
              {editData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {editData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="w-4 h-4 hover:text-red-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Featured toggle */}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editData.featured}
                onChange={(e) => setEditData(prev => ({ ...prev, featured: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <span className="text-sm">Избрана снимка (показва се на корицата)</span>
            </label>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setEditingPhoto(null)}>
                Отказ
              </Button>
              <Button onClick={handleEditSave}>
                Запази промените
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}