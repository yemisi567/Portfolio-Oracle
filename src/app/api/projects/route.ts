import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '../../../lib/database';


// Get all projects for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('user-id');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 401 }
      );
    }

    const projects = await DatabaseService.getUserProjects(userId);

    return NextResponse.json({
      success: true,
      data: projects
    });

  } catch (error) {
    console.error('Error getting projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get projects' },
      { status: 500 }
    );
  }
}

// Create a new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, summary, description, difficulty, techStack, requirements, milestones, challenges, resources, notes, userId } = body;

    if (!title || !summary || !difficulty || !userId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const project = await DatabaseService.createProject({
      userId,
      title,
      summary,
      description: description || '',
      difficulty,
      techStack: techStack || [],
      requirements: requirements || [],
      milestones: milestones || [],
      challenges: challenges || [],
      resources: resources || [],
      notes: notes || [],
      status: 'planned',
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Failed to create project' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: project
    });

  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    );
  }
} 