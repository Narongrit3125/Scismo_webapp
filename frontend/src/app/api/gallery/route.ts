import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const id = searchParams.get('id');
    
    // ถ้าต้องการข้อมูลแกลเลอรี่เฉพาะ
    if (id) {
      const gallery = await prisma.gallery.findUnique({
        where: { id }
      });

      if (!gallery) {
        return NextResponse.json(
          { success: false, error: 'Gallery not found' },
          { status: 404 }
        );
      }

      // เพิ่ม view count
      await prisma.gallery.update({
        where: { id },
        data: { viewCount: { increment: 1 } }
      });

      return NextResponse.json({
        success: true,
        data: {
          id: gallery.id,
          title: gallery.title,
          description: gallery.description,
          categoryId: gallery.categoryId,
          images: gallery.images ? JSON.parse(gallery.images) : [],
          eventDate: gallery.eventDate,
          viewCount: gallery.viewCount + 1,
          createdAt: gallery.createdAt,
          updatedAt: gallery.updatedAt
        }
      });
    }
    
    // สร้าง filter conditions
    const whereCondition: any = {};
    
    if (category) {
      whereCondition.categoryId = category;
    }

    const galleries = await prisma.gallery.findMany({
      where: whereCondition,
      orderBy: [
        { eventDate: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    const formattedGalleries = galleries.map(gallery => ({
      id: gallery.id,
      title: gallery.title,
      description: gallery.description,
      categoryId: gallery.categoryId,
      images: gallery.images ? JSON.parse(gallery.images) : [],
      eventDate: gallery.eventDate,
      viewCount: gallery.viewCount,
      createdAt: gallery.createdAt,
      updatedAt: gallery.updatedAt
    }));

    return NextResponse.json({
      success: true,
      data: formattedGalleries,
      total: formattedGalleries.length
    });
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      title,
      description,
      categoryId,
      images = [],
      date
    } = body;

    if (!title || !categoryId || !date) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newGallery = await prisma.gallery.create({
      data: {
        title,
        description,
        categoryId,
        images: JSON.stringify(images),
        eventDate: new Date(date),
        uploadedBy: 'system' // TODO: ใช้ user ID จาก session
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        id: newGallery.id,
        title: newGallery.title,
        description: newGallery.description,
        categoryId: newGallery.categoryId,
        images: newGallery.images ? JSON.parse(newGallery.images) : [],
        eventDate: newGallery.eventDate,
        viewCount: newGallery.viewCount,
        createdAt: newGallery.createdAt
      },
      message: 'Gallery created successfully'
    });
  } catch (error) {
    console.error('Error creating gallery:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Gallery ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { 
      title,
      description,
      categoryId,
      images,
      date
    } = body;

    const updateData: any = {};
    
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (images) updateData.images = JSON.stringify(images);
    if (date) updateData.eventDate = new Date(date);

    const updatedGallery = await prisma.gallery.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updatedGallery.id,
        title: updatedGallery.title,
        description: updatedGallery.description,
        categoryId: updatedGallery.categoryId,
        images: updatedGallery.images ? JSON.parse(updatedGallery.images) : [],
        eventDate: updatedGallery.eventDate,
        viewCount: updatedGallery.viewCount,
        createdAt: updatedGallery.createdAt,
        updatedAt: updatedGallery.updatedAt
      },
      message: 'Gallery updated successfully'
    });
  } catch (error) {
    console.error('Error updating gallery:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Gallery ID is required' },
        { status: 400 }
      );
    }

    await prisma.gallery.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Gallery deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting gallery:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}