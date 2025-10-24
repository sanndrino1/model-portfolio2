'use client'

import { Gallery, Button, CategoryDropdown } from '@/components/ui'
import { useState, useEffect } from 'react'
import type { Photo } from '@/lib/photoManager'

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const categories = [
    { name: 'Всички', count: 0, value: 'all' },
    { name: 'Портрет', count: 0, value: 'portrait' },
    { name: 'Мода', count: 0, value: 'fashion' },
    { name: 'Комерсиални', count: 0, value: 'commercial' },
    { name: 'Редакционни', count: 0, value: 'editorial' },
    { name: 'Красота', count: 0, value: 'beauty' },
    { name: 'Lifestyle', count: 0, value: 'lifestyle' },
    { name: 'Артистични', count: 0, value: 'artistic' },
  ];

  // Load photos from API
  const loadPhotos = async (reset = false) => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory)
      }
      params.append('page', reset ? '1' : page.toString())
      params.append('limit', '12') // По-малко снимки per page

      const response = await fetch(`/api/photos?${params}`)
      const result = await response.json()

      if (result.success) {
        const newPhotos = result.data.photos || []
        
        if (reset) {
          setPhotos(newPhotos)
          setPage(2)
        } else {
          setPhotos(prev => [...prev, ...newPhotos])
          setPage(prev => prev + 1)
        }
        
        setHasMore(newPhotos.length === 12) // Обновено за 12 снимки per page
      }
    } catch (error) {
      console.error('Error loading photos:', error)
    } finally {
      setLoading(false)
    }
  }

  // Load photos on mount and category change
  useEffect(() => {
    setPage(1)
    loadPhotos(true)
  }, [selectedCategory])

  // Convert photos to gallery format
  const galleryImages = photos.map(photo => ({
    id: photo.id,
    src: photo.url,
    thumbnail: photo.thumbnailUrl,
    alt: photo.alt,
    title: photo.title,
    description: photo.description,
    category: photo.category,
    tags: photo.tags,
  }))

  // Update category counts (would be better to get from API)
  const categoriesWithCounts = categories.map(cat => ({
    ...cat,
    count: cat.value === 'all' ? photos.length : photos.filter(p => p.category === cat.value).length
  }))

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Портфолио</h1>
        <p className="mt-2 text-muted-foreground">Разгледайте професионалната ми работа в различни категории</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">Филтър по категория:</span>
          <CategoryDropdown
            categories={categoriesWithCounts.map(c => ({ value: c.value, label: c.name }))}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
            trigger={
              <Button variant="outline" className="justify-between min-w-40">
                {categoriesWithCounts.find(c => c.value === selectedCategory)?.name || 'Изберете категория'}
                <span className="text-xs ml-2">▼</span>
              </Button>
            }
          />
        </div>
        
        <div className="text-sm text-muted-foreground">
          Показани: {galleryImages.length} снимки
        </div>
      </div>

      {/* Traditional Category Buttons (Optional) */}
      <div className="flex flex-wrap gap-4 justify-center">
        {categoriesWithCounts.map((category) => (
          <Button
            key={category.value}
            variant={selectedCategory === category.value ? "primary" : "outline"}
            size="sm"
            className="rounded-full"
            onClick={() => setSelectedCategory(category.value)}
          >
            {category.name} ({category.count})
          </Button>
        ))}
      </div>

      {/* Gallery */}
      {loading && photos.length === 0 ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Зареждане на снимки...</p>
        </div>
      ) : galleryImages.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📷</div>
          <h3 className="text-lg font-medium mb-2">Няма снимки</h3>
          <p className="text-muted-foreground">
            {selectedCategory === 'all' 
              ? 'Все още няма качени снимки в портфолиото.'
              : `Няма снимки в категория "${categoriesWithCounts.find(c => c.value === selectedCategory)?.name}".`
            }
          </p>
        </div>
      ) : (
        <Gallery 
          images={galleryImages}
          columns={{ mobile: 2, tablet: 3, desktop: 4 }}
          gap="sm"
          aspectRatio="square"
          lightbox={true}
          className="mb-8"
        />
      )}

      {/* Load More Button */}
      {hasMore && !loading && galleryImages.length > 0 && (
        <div className="text-center">
          <Button 
            size="lg" 
            onClick={() => loadPhotos(false)}
            disabled={loading}
          >
            {loading ? 'Зареждане...' : 'Покажи още'}
          </Button>
        </div>
      )}
    </div>
  );
}