import { NextRequest, NextResponse } from 'next/server';
import { photoManager } from '@/lib/photoManager';
import { auditLogger } from '@/lib/auditLog';

interface Params {
  params: {
    photoId: string;
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const photo = photoManager.getPhoto(params.photoId);
    
    if (!photo) {
      return NextResponse.json(
        { success: false, error: 'Снимката не е намерена' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: photo,
    });
  } catch (error) {
    console.error('Get photo error:', error);
    return NextResponse.json(
      { success: false, error: 'Грешка при зареждане на снимката' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const body = await request.json();
    const { title, description, category, tags, alt, featured } = body;

    // Валидация
    if (!title || !category || !alt) {
      return NextResponse.json(
        { success: false, error: 'Заглавие, категория и alt текст са задължителни' },
        { status: 400 }
      );
    }

    const photo = photoManager.getPhoto(params.photoId);
    if (!photo) {
      return NextResponse.json(
        { success: false, error: 'Снимката не е намерена' },
        { status: 404 }
      );
    }

    // Обновяване
    const updatedPhoto = photoManager.updatePhoto(params.photoId, {
      title,
      description,
      category,
      tags: tags || [],
      alt,
      featured: featured || false,
    });

    // Audit log
    await auditLogger.log({
      action: 'update',
      resource: 'photo',
      resourceId: params.photoId,
      userId: 'admin', // TODO: Взети от auth context
      metadata: {
        changes: {
          title: photo.title !== title ? { from: photo.title, to: title } : undefined,
          category: photo.category !== category ? { from: photo.category, to: category } : undefined,
          featured: photo.featured !== featured ? { from: photo.featured, to: featured } : undefined,
        },
      },
      description: `Обновена снимка "${title}"`,
    });

    return NextResponse.json({
      success: true,
      data: updatedPhoto,
      message: 'Снимката е успешно обновена',
    });

  } catch (error) {
    console.error('Update photo error:', error);
    return NextResponse.json(
      { success: false, error: 'Грешка при обновяването на снимката' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const photo = photoManager.getPhoto(params.photoId);
    if (!photo) {
      return NextResponse.json(
        { success: false, error: 'Снимката не е намерена' },
        { status: 404 }
      );
    }

    // Изтриване
    const success = await photoManager.deletePhoto(params.photoId);
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Грешка при изтриването на снимката' },
        { status: 500 }
      );
    }

    // Audit log
    await auditLogger.log({
      action: 'delete',
      resource: 'photo',
      resourceId: params.photoId,
      userId: 'admin', // TODO: Взети от auth context
      metadata: {
        deletedPhoto: {
          title: photo.title,
          category: photo.category,
          filename: photo.filename,
        },
      },
      description: `Изтрита снимка "${photo.title}"`,
    });

    return NextResponse.json({
      success: true,
      message: 'Снимката е успешно изтрита',
    });

  } catch (error) {
    console.error('Delete photo error:', error);
    return NextResponse.json(
      { success: false, error: 'Грешка при изтриването на снимката' },
      { status: 500 }
    );
  }
}