import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const id = searchParams.get('id');
    
    // ถ้าต้องการข้อมูลฟอร์มเฉพาะ
    if (id) {
      const form = await prisma.form.findUnique({
        where: { id },
        include: {
          submissions: {
            orderBy: { createdAt: 'desc' }
          }
        }
      });

      if (!form) {
        return NextResponse.json(
          { success: false, error: 'Form not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          id: form.id,
          title: form.title,
          description: form.description,
          type: form.type,
          fields: form.fields ? JSON.parse(form.fields) : [],
          status: form.status,
          settings: form.settings ? JSON.parse(form.settings) : {},
          submissionCount: form.submissions.length,
          createdAt: form.createdAt,
          updatedAt: form.updatedAt,
          submissions: form.submissions.map(sub => ({
            id: sub.id,
            data: sub.data ? JSON.parse(sub.data) : {},
            status: sub.status,
            createdAt: sub.createdAt
          }))
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
      // Default: แสดงเฉพาะฟอร์มที่ active
      whereCondition.status = 'ACTIVE';
    }

    const forms = await prisma.form.findMany({
      where: whereCondition,
      orderBy: [
        { createdAt: 'desc' }
      ]
    });

    const formattedForms = forms.map(form => ({
      id: form.id,
      title: form.title,
      description: form.description,
      type: form.type,
      status: form.status,
      submissionCount: 0,
      createdAt: form.createdAt,
      updatedAt: form.updatedAt
    }));

    return NextResponse.json({
      success: true,
      data: formattedForms,
      total: formattedForms.length
    });
  } catch (error) {
    console.error('Error fetching forms:', error);
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
      fields = [],
      status = 'ACTIVE',
      settings = {}
    } = body;

    if (!title || !type) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newForm = await prisma.form.create({
      data: {
        title,
        description,
        type: type.toUpperCase(),
        fields: JSON.stringify(fields),
        status: status.toUpperCase(),
        settings: JSON.stringify(settings)
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        id: newForm.id,
        title: newForm.title,
        description: newForm.description,
        type: newForm.type,
        fields: newForm.fields ? JSON.parse(newForm.fields) : [],
        status: newForm.status,
        settings: newForm.settings ? JSON.parse(newForm.settings) : {},
        submissionCount: 0,
        createdAt: newForm.createdAt
      },
      message: 'Form created successfully'
    });
  } catch (error) {
    console.error('Error creating form:', error);
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
        { success: false, error: 'Form ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { 
      title,
      description,
      type,
      fields,
      status,
      settings
    } = body;

    const updateData: any = {};
    
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (type) updateData.type = type.toUpperCase();
    if (fields) updateData.fields = JSON.stringify(fields);
    if (status) updateData.status = status.toUpperCase();
    if (settings) updateData.settings = JSON.stringify(settings);

    const updatedForm = await prisma.form.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updatedForm.id,
        title: updatedForm.title,
        description: updatedForm.description,
        type: updatedForm.type,
        fields: updatedForm.fields ? JSON.parse(updatedForm.fields) : [],
        status: updatedForm.status,
        settings: updatedForm.settings ? JSON.parse(updatedForm.settings) : {},
        submissionCount: 0,
        createdAt: updatedForm.createdAt,
        updatedAt: updatedForm.updatedAt
      },
      message: 'Form updated successfully'
    });
  } catch (error) {
    console.error('Error updating form:', error);
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
        { success: false, error: 'Form ID is required' },
        { status: 400 }
      );
    }

    await prisma.form.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Form deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting form:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}