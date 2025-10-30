import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const isPublic = searchParams.get('public');
    const id = searchParams.get('id');
    
    if (id) {
      const document = await prisma.document.findUnique({
        where: { id }
      });

      if (!document) {
        return NextResponse.json(
          { success: false, error: 'Document not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          id: document.id,
          title: document.title,
          description: document.description,
          fileName: document.fileName,
          fileUrl: document.fileUrl,
          fileSize: document.fileSize,
          type: document.type,
          isPublic: document.isPublic,
          downloadCount: document.downloadCount,
          uploadedBy: document.uploadedBy,
          createdAt: document.createdAt,
          updatedAt: document.updatedAt
        }
      });
    }
    
    const whereCondition: any = {};
    if (type) {
      whereCondition.type = type;
    }
    if (isPublic !== null) {
      whereCondition.isPublic = isPublic === 'true';
    }

    const documents = await prisma.document.findMany({
      where: whereCondition,
      orderBy: [
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json({
      success: true,
      data: documents.map(document => ({
        id: document.id,
        title: document.title,
        description: document.description,
        fileName: document.fileName,
        fileUrl: document.fileUrl,
        fileSize: document.fileSize,
        type: document.type,
        isPublic: document.isPublic,
        downloadCount: document.downloadCount,
        uploadedBy: document.uploadedBy,
        createdAt: document.createdAt
      })),
      total: documents.length
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
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
      fileName,
      fileUrl,
      fileSize,
      type = 'document',
      isPublic = false,
      uploadedBy
    } = body;

    if (!title || !fileName || !fileUrl || !uploadedBy) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newDocument = await prisma.document.create({
      data: {
        title,
        description,
        fileName,
        fileUrl,
        fileSize: fileSize || 0,
        type,
        isPublic,
        uploadedBy
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        id: newDocument.id,
        title: newDocument.title,
        description: newDocument.description,
        fileName: newDocument.fileName,
        fileUrl: newDocument.fileUrl,
        fileSize: newDocument.fileSize,
        type: newDocument.type,
        isPublic: newDocument.isPublic,
        downloadCount: newDocument.downloadCount,
        uploadedBy: newDocument.uploadedBy,
        createdAt: newDocument.createdAt
      },
      message: 'Document created successfully'
    });
  } catch (error) {
    console.error('Error creating document:', error);
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
        { success: false, error: 'Document ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const updateData: any = {};
    
    Object.keys(body).forEach(key => {
      if (body[key] !== undefined && key !== 'tags') {
        updateData[key] = body[key];
      }
    });

    const updatedDocument = await prisma.document.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updatedDocument.id,
        title: updatedDocument.title,
        description: updatedDocument.description,
        fileName: updatedDocument.fileName,
        fileUrl: updatedDocument.fileUrl,
        fileSize: updatedDocument.fileSize,
        type: updatedDocument.type,
        isPublic: updatedDocument.isPublic,
        downloadCount: updatedDocument.downloadCount,
        uploadedBy: updatedDocument.uploadedBy,
        createdAt: updatedDocument.createdAt,
        updatedAt: updatedDocument.updatedAt
      },
      message: 'Document updated successfully'
    });
  } catch (error) {
    console.error('Error updating document:', error);
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
        { success: false, error: 'Document ID is required' },
        { status: 400 }
      );
    }

    await prisma.document.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Special endpoint for tracking downloads
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const action = searchParams.get('action');
    
    if (!id || action !== 'download') {
      return NextResponse.json(
        { success: false, error: 'Invalid parameters' },
        { status: 400 }
      );
    }

    const updatedDocument = await prisma.document.update({
      where: { id },
      data: {
        downloadCount: {
          increment: 1
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updatedDocument.id,
        downloadCount: updatedDocument.downloadCount
      },
      message: 'Download count updated'
    });
  } catch (error) {
    console.error('Error updating download count:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}