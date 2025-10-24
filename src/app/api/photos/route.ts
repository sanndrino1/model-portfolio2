import { NextRequest, NextResponse } from 'next/server';
import { photoManager } from '@/lib/photoManager';
import { auditLogger } from '@/lib/auditLog';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const photos = photoManager.getPhotos({
      category,
      tags,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: photos,
    });
  } catch (error) {
    console.error('Get photos error:', error);
    return NextResponse.json(
      { success: false, error: 'Грешка при зареждане на снимките' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Извличане на metadata
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const tags = (formData.get('tags') as string)?.split(',').filter(Boolean) || [];
    const alt = formData.get('alt') as string;

    // Извличане на файлове
    const files: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('file_') && value instanceof File) {
        files.push(value);
      }
    }

    if (files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Няма избрани файлове' },
        { status: 400 }
      );
    }

    // Валидация
    if (!title || !category || !alt) {
      return NextResponse.json(
        { success: false, error: 'Заглавие, категория и alt текст са задължителни' },
        { status: 400 }
      );
    }

    // Проверка на файловете
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { success: false, error: `Файлът ${file.name} не е изображение` },
          { status: 400 }
        );
      }
      
      // Проверка на размера (макс 10MB)
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, error: `Файлът ${file.name} е прекалено голям (макс 10MB)` },
          { status: 400 }
        );
      }
    }

    // Качване на снимките
    const uploadedPhotos = [];
    for (const file of files) {
      const photo = await photoManager.uploadPhoto(file, {
        title: files.length === 1 ? title : `${title} - ${file.name}`,
        description,
        category,
        tags,
        alt: files.length === 1 ? alt : `${alt} - ${file.name}`,
      });
      uploadedPhotos.push(photo);
    }

    // Audit log
    await auditLogger.log({
      action: 'create',
      resource: 'photo',
      resourceId: uploadedPhotos.map(p => p.id).join(','),
      userId: 'admin', // TODO: Взети от auth context
      metadata: {
        count: uploadedPhotos.length,
        category,
        tags,
      },
      description: `Качени ${uploadedPhotos.length} снимки в категория "${category}"`,
    });

    return NextResponse.json({
      success: true,
      data: uploadedPhotos,
      message: `Успешно качени ${uploadedPhotos.length} снимки`,
    });

  } catch (error) {
    console.error('Upload photos error:', error);
    return NextResponse.json(
      { success: false, error: 'Грешка при качването на снимките' },
      { status: 500 }
    );
  }
}