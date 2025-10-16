import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');
    
    // ถ้าต้องการข้อมูลเนื้อหาเฉพาะ (by ID หรือ slug)
    if (id || slug) {
      let content;
      
      if (id) {
        content = await prisma.content.findUnique({
          where: { id }
        });
      } else if (slug) {
        content = await prisma.content.findUnique({
          where: { slug }
        });
      }

      if (!content) {
        return NextResponse.json(
          { success: false, error: 'Content not found' },
          { status: 404 }
        );
      }

      // เพิ่ม view count
      await prisma.content.update({
        where: { id: content.id },
        data: { viewCount: { increment: 1 } }
      });

      return NextResponse.json({
        success: true,
        data: {
          id: content.id,
          title: content.title,
          content: content.content,
          excerpt: content.excerpt,
          type: content.type,
          status: content.status,
          publishedAt: content.publishedAt,
          createdAt: content.createdAt,
          updatedAt: content.updatedAt,
          tags: content.tags ? JSON.parse(content.tags) : [],
          slug: content.slug,
          viewCount: content.viewCount + 1
        }
      });
    }
    
    // สร้าง filter conditions
    const whereCondition: any = {};
    
    if (type) {
      whereCondition.type = type.toUpperCase();
    }
    
    if (status) {
      whereCondition.status = status.toUpperCase();
    } else {
      // Default: แสดงเฉพาะเนื้อหาที่ publish แล้ว
      whereCondition.status = 'PUBLISHED';
    }

    const contents = await prisma.content.findMany({
      where: whereCondition,
      orderBy: [
        { publishedAt: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    const formattedContents = contents.map(content => ({
      id: content.id,
      title: content.title,
      content: content.content,
      excerpt: content.excerpt,
      type: content.type,
      status: content.status,
      publishedAt: content.publishedAt,
      createdAt: content.createdAt,
      updatedAt: content.updatedAt,
      tags: content.tags ? JSON.parse(content.tags) : [],
      slug: content.slug,
      viewCount: content.viewCount
    }));

    return NextResponse.json({
      success: true,
      data: formattedContents,
      total: formattedContents.length
    });
  } catch (error) {
    console.error('Error fetching content:', error);
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
      content,
      excerpt,
      type,
      status = 'DRAFT',
      tags = [],
      slug
    } = body;

    if (!title || !content || !type) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // สร้าง slug ถ้าไม่ได้ระบุ
    const finalSlug = slug || title.toLowerCase()
      .replace(/[^a-z0-9ก-๙\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 100);

    // Check if slug already exists
    const existingContent = await prisma.content.findUnique({
      where: { slug: finalSlug }
    });

    if (existingContent) {
      return NextResponse.json(
        { success: false, error: 'Slug already exists' },
        { status: 400 }
      );
    }

    const newContent = await prisma.content.create({
      data: {
        title,
        content,
        excerpt,
        type: type.toUpperCase(),
        status: status.toUpperCase(),
        tags: JSON.stringify(tags),
        slug: finalSlug,
        publishedAt: status.toUpperCase() === 'PUBLISHED' ? new Date() : null
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        id: newContent.id,
        title: newContent.title,
        content: newContent.content,
        excerpt: newContent.excerpt,
        type: newContent.type,
        status: newContent.status,
        publishedAt: newContent.publishedAt,
        createdAt: newContent.createdAt,
        tags: newContent.tags ? JSON.parse(newContent.tags) : [],
        slug: newContent.slug,
        viewCount: newContent.viewCount
      },
      message: 'Content created successfully'
    });
  } catch (error) {
    console.error('Error creating content:', error);
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
        { success: false, error: 'Content ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { 
      title,
      content,
      excerpt,
      type,
      status,
      tags,
      slug
    } = body;

    const updateData: any = {};
    
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (excerpt) updateData.excerpt = excerpt;
    if (type) updateData.type = type.toUpperCase();
    if (status) {
      updateData.status = status.toUpperCase();
      // ถ้าเปลี่ยนเป็น PUBLISHED แล้วยังไม่มี publishedAt ให้เซ็ตเป็นเวลาปัจจุบัน
      if (status.toUpperCase() === 'PUBLISHED') {
        const current = await prisma.content.findUnique({ where: { id } });
        if (current && !current.publishedAt) {
          updateData.publishedAt = new Date();
        }
      }
    }
    if (tags) updateData.tags = JSON.stringify(tags);
    if (slug) updateData.slug = slug;

    const updatedContent = await prisma.content.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updatedContent.id,
        title: updatedContent.title,
        content: updatedContent.content,
        excerpt: updatedContent.excerpt,
        type: updatedContent.type,
        status: updatedContent.status,
        publishedAt: updatedContent.publishedAt,
        createdAt: updatedContent.createdAt,
        updatedAt: updatedContent.updatedAt,
        tags: updatedContent.tags ? JSON.parse(updatedContent.tags) : [],
        slug: updatedContent.slug,
        viewCount: updatedContent.viewCount
      },
      message: 'Content updated successfully'
    });
  } catch (error) {
    console.error('Error updating content:', error);
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
        { success: false, error: 'Content ID is required' },
        { status: 400 }
      );
    }

    await prisma.content.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Content deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting content:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}