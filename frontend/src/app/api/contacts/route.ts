import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const id = searchParams.get('id');
    
    if (id) {
      const contact = await prisma.contact.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      });

      if (!contact) {
        return NextResponse.json(
          { success: false, error: 'Contact not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          id: contact.id,
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          subject: contact.subject,
          message: contact.message,
          category: contact.category,
          priority: contact.priority,
          status: contact.status,
          createdAt: contact.createdAt,
          updatedAt: contact.updatedAt,
          user: contact.user
        }
      });
    }
    
    const whereCondition: any = {};
    if (category) {
      whereCondition.category = category;
    }
    if (status) {
      whereCondition.status = status.toUpperCase();
    }

    const contacts = await prisma.contact.findMany({
      where: whereCondition,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json({
      success: true,
      data: contacts.map(contact => ({
        id: contact.id,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        subject: contact.subject,
        message: contact.message,
        category: contact.category,
        priority: contact.priority,
        status: contact.status,
        createdAt: contact.createdAt,
        user: contact.user
      })),
      total: contacts.length
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
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
      name,
      email,
      phone,
      subject,
      message,
      category = 'general',
      priority = 'MEDIUM',
      userId
    } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newContact = await prisma.contact.create({
      data: {
        name,
        email,
        phone,
        subject,
        message,
        category,
        priority: priority.toUpperCase(),
        userId
      },
      include: {
        user: {
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
        id: newContact.id,
        name: newContact.name,
        email: newContact.email,
        phone: newContact.phone,
        subject: newContact.subject,
        message: newContact.message,
        category: newContact.category,
        priority: newContact.priority,
        status: newContact.status,
        createdAt: newContact.createdAt,
        user: newContact.user
      },
      message: 'Contact message created successfully'
    });
  } catch (error) {
    console.error('Error creating contact:', error);
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
        { success: false, error: 'Contact ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const updateData: any = {};
    
    Object.keys(body).forEach(key => {
      if (key === 'priority' || key === 'status') {
        updateData[key] = body[key].toUpperCase();
      } else if (body[key] !== undefined) {
        updateData[key] = body[key];
      }
    });

    const updatedContact = await prisma.contact.update({
      where: { id },
      data: updateData,
      include: {
        user: {
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
        id: updatedContact.id,
        name: updatedContact.name,
        email: updatedContact.email,
        phone: updatedContact.phone,
        subject: updatedContact.subject,
        message: updatedContact.message,
        category: updatedContact.category,
        priority: updatedContact.priority,
        status: updatedContact.status,
        createdAt: updatedContact.createdAt,
        updatedAt: updatedContact.updatedAt,
        user: updatedContact.user
      },
      message: 'Contact updated successfully'
    });
  } catch (error) {
    console.error('Error updating contact:', error);
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
        { success: false, error: 'Contact ID is required' },
        { status: 400 }
      );
    }

    await prisma.contact.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}