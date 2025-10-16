import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department');
    const position = searchParams.get('position');
    const id = searchParams.get('id');
    
    // ถ้าต้องการข้อมูลเจ้าหน้าที่คนเดียว
    if (id) {
      const staff = await prisma.staff.findUnique({
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

      if (!staff) {
        return NextResponse.json(
          { success: false, error: 'Staff not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          id: staff.id,
          employeeId: staff.employeeId,
          firstName: staff.user?.firstName,
          lastName: staff.user?.lastName,
          email: staff.user?.email,
          department: staff.department,
          position: staff.position,
          phone: staff.phone,
          office: staff.office,
          bio: staff.bio,
          expertise: staff.expertise ? JSON.parse(staff.expertise) : [],
          avatar: staff.avatar,
          isActive: staff.isActive
        }
      });
    }
    
    // สร้าง filter conditions
    const whereCondition: any = {};
    
    if (department) {
      whereCondition.department = {
        contains: department,
        mode: 'insensitive'
      };
    }
    
    if (position) {
      whereCondition.position = {
        contains: position,
        mode: 'insensitive'
      };
    }

    const staffList = await prisma.staff.findMany({
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
        { department: 'asc' },
        { position: 'asc' },
        { user: { firstName: 'asc' } }
      ]
    });

    const formattedStaff = staffList.map(staff => ({
      id: staff.id,
      employeeId: staff.employeeId,
      firstName: staff.user?.firstName,
      lastName: staff.user?.lastName,
      email: staff.user?.email,
      department: staff.department,
      position: staff.position,
      phone: staff.phone,
      office: staff.office,
      bio: staff.bio,
      expertise: staff.expertise ? JSON.parse(staff.expertise) : [],
      avatar: staff.avatar,
      isActive: staff.isActive
    }));

    return NextResponse.json({
      success: true,
      data: formattedStaff,
      total: formattedStaff.length
    });
  } catch (error) {
    console.error('Error fetching staff:', error);
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
      userId,
      employeeId, 
      department, 
      position,
      phone,
      office,
      bio,
      expertise = [],
      avatar
    } = body;

    if (!userId || !department || !position) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if employee ID already exists (if provided)
    if (employeeId) {
      const existingStaff = await prisma.staff.findUnique({
        where: { employeeId }
      });

      if (existingStaff) {
        return NextResponse.json(
          { success: false, error: 'Employee ID already exists' },
          { status: 400 }
        );
      }
    }

    const newStaff = await prisma.staff.create({
      data: {
        userId,
        employeeId,
        department,
        position,
        phone,
        office,
        bio,
        expertise: JSON.stringify(expertise),
        avatar,
        isActive: true
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
        id: newStaff.id,
        employeeId: newStaff.employeeId,
        firstName: newStaff.user?.firstName,
        lastName: newStaff.user?.lastName,
        email: newStaff.user?.email,
        department: newStaff.department,
        position: newStaff.position,
        phone: newStaff.phone,
        office: newStaff.office,
        bio: newStaff.bio,
        expertise: newStaff.expertise ? JSON.parse(newStaff.expertise) : [],
        avatar: newStaff.avatar,
        isActive: newStaff.isActive
      },
      message: 'Staff created successfully'
    });
  } catch (error) {
    console.error('Error creating staff:', error);
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
        { success: false, error: 'Staff ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { 
      employeeId,
      department, 
      position,
      phone,
      office,
      bio,
      expertise,
      avatar,
      isActive
    } = body;

    const updatedStaff = await prisma.staff.update({
      where: { id },
      data: {
        ...(employeeId && { employeeId }),
        ...(department && { department }),
        ...(position && { position }),
        ...(phone && { phone }),
        ...(office && { office }),
        ...(bio && { bio }),
        ...(expertise && { expertise: JSON.stringify(expertise) }),
        ...(avatar && { avatar }),
        ...(isActive !== undefined && { isActive })
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
        id: updatedStaff.id,
        employeeId: updatedStaff.employeeId,
        firstName: updatedStaff.user?.firstName,
        lastName: updatedStaff.user?.lastName,
        email: updatedStaff.user?.email,
        department: updatedStaff.department,
        position: updatedStaff.position,
        phone: updatedStaff.phone,
        office: updatedStaff.office,
        bio: updatedStaff.bio,
        expertise: updatedStaff.expertise ? JSON.parse(updatedStaff.expertise) : [],
        avatar: updatedStaff.avatar,
        isActive: updatedStaff.isActive
      },
      message: 'Staff updated successfully'
    });
  } catch (error) {
    console.error('Error updating staff:', error);
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
        { success: false, error: 'Staff ID is required' },
        { status: 400 }
      );
    }

    await prisma.staff.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Staff deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting staff:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}