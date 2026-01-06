import { NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

/**
 * Endpoint to keep Supabase active
 */
export async function GET() {
  try {
    const { data, error } = await DatabaseService.supabase
      .from('user_profiles')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Health check failed:', error);
      return NextResponse.json(
        {
          status: 'error',
          message: 'Database connection check failed',
          timestamp: new Date().toISOString(),
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      status: 'healthy',
      message: 'Supabase connection is active',
      timestamp: new Date().toISOString(),
      database: 'connected',
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

