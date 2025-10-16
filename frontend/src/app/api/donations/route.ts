import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const id = searchParams.get('id');
    
    if (id) {
      const campaign = await prisma.donationCampaign.findUnique({
        where: { id },
        include: {
          donations: {
            orderBy: { createdAt: 'desc' }
          }
        }
      });

      if (!campaign) {
        return NextResponse.json(
          { success: false, error: 'Campaign not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          id: campaign.id,
          title: campaign.title,
          description: campaign.description,
          targetAmount: campaign.targetAmount,
          currentAmount: campaign.currentAmount,
          startDate: campaign.startDate,
          endDate: campaign.endDate,
          status: campaign.status,
          category: campaign.category,
          image: campaign.image,
          donorCount: campaign.donorCount,
          createdAt: campaign.createdAt,
          donations: campaign.donations.map(donation => ({
            id: donation.id,
            donorName: donation.donorName,
            amount: donation.amount,
            message: donation.message,
            isAnonymous: donation.isAnonymous,
            createdAt: donation.createdAt
          }))
        }
      });
    }
    
    const whereCondition: any = {};
    if (status) {
      whereCondition.status = status.toUpperCase();
    } else {
      whereCondition.status = 'ACTIVE';
    }

    const campaigns = await prisma.donationCampaign.findMany({
      where: whereCondition,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: campaigns,
      total: campaigns.length
    });
  } catch (error) {
    console.error('Error fetching donations:', error);
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
      targetAmount,
      startDate,
      endDate,
      category,
      image,
      createdBy
    } = body;

    if (!title || !description || !targetAmount || !startDate || !endDate || !category || !createdBy) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newCampaign = await prisma.donationCampaign.create({
      data: {
        title,
        description,
        targetAmount: parseFloat(targetAmount),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        category,
        image,
        createdBy
      }
    });

    return NextResponse.json({
      success: true,
      data: newCampaign,
      message: 'Campaign created successfully'
    });
  } catch (error) {
    console.error('Error creating campaign:', error);
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
        { success: false, error: 'Campaign ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const updateData: any = {};
    
    Object.keys(body).forEach(key => {
      if (key === 'targetAmount') {
        updateData[key] = parseFloat(body[key]);
      } else if (key === 'startDate' || key === 'endDate') {
        updateData[key] = new Date(body[key]);
      } else if (body[key] !== undefined) {
        updateData[key] = body[key];
      }
    });

    const updatedCampaign = await prisma.donationCampaign.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      data: updatedCampaign,
      message: 'Campaign updated successfully'
    });
  } catch (error) {
    console.error('Error updating campaign:', error);
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
        { success: false, error: 'Campaign ID is required' },
        { status: 400 }
      );
    }

    await prisma.donationCampaign.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Campaign deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}