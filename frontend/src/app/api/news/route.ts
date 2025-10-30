import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');
    
    // ถ้าต้องการข้อมูลข่าวเฉพาะ (by ID หรือ slug)
    if (id || slug) {
      let news;
      
      if (id) {
        news = await prisma.news.findUnique({
          where: { id },
          include: {
            author: {
              select: {
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        });
      } else if (slug) {
        news = await prisma.news.findUnique({
          where: { slug },
          include: {
            author: {
              select: {
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        });
      }

      if (!news) {
        return NextResponse.json(
          { success: false, error: 'News not found' },
          { status: 404 }
        );
      }

      // เพิ่ม view count
      await prisma.news.update({
        where: { id: news.id },
        data: { viewCount: { increment: 1 } }
      });

      return NextResponse.json({
        success: true,
        data: {
          id: news.id,
          title: news.title,
          content: news.content,
          excerpt: news.excerpt,
          priority: news.priority,
          status: news.status,
          publishedAt: news.publishedAt,
          createdAt: news.createdAt,
          updatedAt: news.updatedAt,
          slug: news.slug,
          viewCount: news.viewCount + 1,
          image: news.image,
          author: {
            firstName: news.author?.firstName || '',
            lastName: news.author?.lastName || '',
            email: news.author?.email || ''
          }
        }
      });
    }
    
    // สร้าง filter conditions
    const whereCondition: any = {};
    
    if (category) {
      whereCondition.categoryId = category;
    }
    
    if (status) {
      whereCondition.status = status.toUpperCase();
    } else {
      // Default: แสดงเฉพาะข่าวที่ publish แล้ว
      whereCondition.status = 'PUBLISHED';
    }
    
    if (priority) {
      whereCondition.priority = priority.toUpperCase();
    }

    const newsList = await prisma.news.findMany({
      where: whereCondition,
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: [
        { priority: 'desc' },
        { publishedAt: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    const formattedNews = newsList.map(news => ({
      id: news.id,
      title: news.title,
      content: news.content,
      excerpt: news.excerpt,
      categoryId: news.categoryId,
      priority: news.priority,
      status: news.status,
      publishedAt: news.publishedAt,
      createdAt: news.createdAt,
      updatedAt: news.updatedAt,
      slug: news.slug,
      viewCount: news.viewCount,
      image: news.image,
      author: {
        firstName: news.author.firstName,
        lastName: news.author.lastName,
        email: news.author.email
      }
    }));

    return NextResponse.json({
      success: true,
      data: formattedNews,
      total: formattedNews.length
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received news data:', body);
    
    const { 
      title,
      content,
      excerpt,
      categoryId,
      priority = 'MEDIUM',
      status = 'DRAFT',
      tags = [],
      slug,
      image
    } = body;

    console.log('Extracted fields:', {
      title,
      content: content?.substring(0, 50) + '...',
      excerpt,
      categoryId,
      priority,
      status,
      tags,
      slug,
      image
    });

    if (!title || !content || !categoryId) {
      console.log('Missing fields validation failed:', {
        title: !!title,
        content: !!content,
        categoryId: !!categoryId
      });
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, content, categoryId' },
        { status: 400 }
      );
    }

    // ใช้ admin user แรกที่พบในระบบ (ไม่ต้องพึ่ง authorId จาก session)
    console.log('Finding admin user...');
    
    let author = await prisma.user.findFirst({
      where: {
        role: 'ADMIN'
      }
    });

    if (!author) {
      // ถ้าไม่มี admin ใช้ user คนแรกที่เจอ
      author = await prisma.user.findFirst();
    }

    if (!author) {
      console.log('No users found in database');
      return NextResponse.json(
        { success: false, error: 'No users available in system' },
        { status: 500 }
      );
    }

    console.log('Using author:', { id: author.id, email: author.email, name: `${author.firstName} ${author.lastName}` });

    // ใช้ slug ที่ส่งมาจาก frontend (ที่สร้างด้วย generateSlug แล้ว)
    const finalSlug = slug || title.toLowerCase()
      .replace(/[^a-z0-9ก-๙\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 100) + '-' + Date.now();

    // Check if slug already exists (แต่ไม่น่าจะเกิดขึ้นเพราะมี timestamp)
    const existingNews = await prisma.news.findUnique({
      where: { slug: finalSlug }
    });

    if (existingNews) {
      // ถ้ายังซ้ำอยู่ ให้เพิ่ม random number
      const randomSuffix = Math.floor(Math.random() * 1000);
      const finalSlugWithRandom = finalSlug + '-' + randomSuffix;
      
      const newNews = await prisma.news.create({
        data: {
          title,
          content,
          excerpt,
          authorId: author.id, // ใช้ author.id ที่หาเจอแทน authorId
          categoryId: categoryId,
          priority: priority.toUpperCase(),
          status: status.toUpperCase(),
          slug: finalSlugWithRandom,
          image: image || null,
          publishedAt: status.toUpperCase() === 'PUBLISHED' ? new Date() : null
        },
        include: {
          author: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      });

      return NextResponse.json({
        success: true,
        data: newNews
      });
    }

    const newNews = await prisma.news.create({
      data: {
        title,
        content,
        excerpt,
        authorId: author.id, // ใช้ author.id ที่หาเจอแทน authorId
        categoryId: categoryId,
        priority: priority.toUpperCase(),
        status: status.toUpperCase(),
        slug: finalSlug,
        image: image || null,
        publishedAt: status.toUpperCase() === 'PUBLISHED' ? new Date() : null
      },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        id: newNews.id,
        title: newNews.title,
        content: newNews.content,
        excerpt: newNews.excerpt,
        categoryId: newNews.categoryId,
        priority: newNews.priority,
        status: newNews.status,
        publishedAt: newNews.publishedAt,
        createdAt: newNews.createdAt,
        slug: newNews.slug,
        viewCount: newNews.viewCount,
        image: newNews.image,
        author: {
          firstName: newNews.author.firstName,
          lastName: newNews.author.lastName,
          email: newNews.author.email
        }
      },
      message: 'News created successfully'
    });
  } catch (error) {
    console.error('Error creating news:', error);
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
        { success: false, error: 'News ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { 
      title,
      content,
      excerpt,
      categoryId,
      priority,
      status,
      tags,
      slug,
      image
    } = body;

    const updateData: any = {};
    
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (excerpt) updateData.excerpt = excerpt;
    if (categoryId) updateData.categoryId = categoryId;
    if (priority) updateData.priority = priority.toUpperCase();
    if (status) {
      updateData.status = status.toUpperCase();
      // ถ้าเปลี่ยนเป็น PUBLISHED แล้วยังไม่มี publishedAt ให้เซ็ตเป็นเวลาปัจจุบัน
      if (status.toUpperCase() === 'PUBLISHED') {
        const current = await prisma.news.findUnique({ where: { id } });
        if (current && !current.publishedAt) {
          updateData.publishedAt = new Date();
        }
      }
    }
    if (tags) updateData.tags = JSON.stringify(tags);
    if (slug) updateData.slug = slug;
    if (image) updateData.image = image;

    const updatedNews = await prisma.news.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updatedNews.id,
        title: updatedNews.title,
        content: updatedNews.content,
        excerpt: updatedNews.excerpt,
        categoryId: updatedNews.categoryId,
        priority: updatedNews.priority,
        status: updatedNews.status,
        publishedAt: updatedNews.publishedAt,
        createdAt: updatedNews.createdAt,
        updatedAt: updatedNews.updatedAt,
        slug: updatedNews.slug,
        viewCount: updatedNews.viewCount,
        image: updatedNews.image,
        author: {
          firstName: updatedNews.author.firstName,
          lastName: updatedNews.author.lastName,
          email: updatedNews.author.email
        }
      },
      message: 'News updated successfully'
    });
  } catch (error) {
    console.error('Error updating news:', error);
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
        { success: false, error: 'News ID is required' },
        { status: 400 }
      );
    }

    await prisma.news.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'News deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting news:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
