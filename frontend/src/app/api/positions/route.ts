import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const isActive = searchParams.get('isActive');
    const id = searchParams.get('id');
    
    // ถ้าต้องการข้อมูลตำแหน่งเฉพาะ
    if (id) {
      const position = await prisma.position.findUnique({
        where: { id }
      });

      if (!position) {
        return NextResponse.json(
          { success: false, error: 'Position not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          id: position.id,
          title: position.title,
          description: position.description,
          type: position.type,
          level: position.level,
          isActive: position.isActive,
          createdAt: position.createdAt
        }
      });
    }
    
    // สร้าง filter conditions
    const whereCondition: any = {};
    
    if (type) {
      whereCondition.type = type.toUpperCase();
    }
    
    if (isActive !== null) {
      whereCondition.isActive = isActive === 'true';
    } else {
      // Default: แสดงเฉพาะตำแหน่งที่ active
      whereCondition.isActive = true;
    }

    const positions = await prisma.position.findMany({
      where: whereCondition,
      orderBy: [
        { level: 'desc' },
        { title: 'asc' }
      ]
    });

    const formattedPositions = positions.map(position => ({
      id: position.id,
      title: position.title,
      description: position.description,
      type: position.type,
      level: position.level,
      isActive: position.isActive,
      createdAt: position.createdAt
    }));

    return NextResponse.json({
      success: true,
      data: formattedPositions,
      total: formattedPositions.length
    });
  } catch (error) {
    console.error('Error fetching positions:', error);
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
      type,
      level = 0,
      isActive = true
    } = body;

    if (!title || !type) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if title already exists
    const existingPosition = await prisma.position.findUnique({
      where: { title }
    });

    if (existingPosition) {
      return NextResponse.json(
        { success: false, error: 'Position title already exists' },
        { status: 400 }
      );
    }

    const newPosition = await prisma.position.create({
      data: {
        title,
        description,
        type: type.toUpperCase(),
        level: parseInt(level),
        isActive
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        id: newPosition.id,
        title: newPosition.title,
        description: newPosition.description,
        type: newPosition.type,
        level: newPosition.level,
        isActive: newPosition.isActive,
        createdAt: newPosition.createdAt
      },
      message: 'Position created successfully'
    });
  } catch (error) {
    console.error('Error creating position:', error);
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
        { success: false, error: 'Position ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { 
      title,
      description,
      type,
      level,
      isActive
    } = body;

    const updateData: any = {};
    
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (type) updateData.type = type.toUpperCase();
    if (level !== undefined) updateData.level = parseInt(level);
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedPosition = await prisma.position.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updatedPosition.id,
        title: updatedPosition.title,
        description: updatedPosition.description,
        type: updatedPosition.type,
        level: updatedPosition.level,
        isActive: updatedPosition.isActive,
        createdAt: updatedPosition.createdAt
      },
      message: 'Position updated successfully'
    });
  } catch (error) {
    console.error('Error updating position:', error);
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
        { success: false, error: 'Position ID is required' },
        { status: 400 }
      );
    }

    await prisma.position.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Position deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting position:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}