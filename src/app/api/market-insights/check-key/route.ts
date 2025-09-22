import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const rapidApiKey = process.env.RAPIDAPI_KEY;
    
    return NextResponse.json({
      success: true,
      debug: {
        rapidApiKey: rapidApiKey ? `Set (length: ${rapidApiKey.length})` : 'Not set',
        firstChars: rapidApiKey ? rapidApiKey.substring(0, 8) + '...' : 'N/A',
        lastChars: rapidApiKey ? '...' + rapidApiKey.substring(rapidApiKey.length - 4) : 'N/A',
        nodeEnv: process.env.NODE_ENV,
        allEnvVars: Object.keys(process.env).filter(key => 
          key.includes('RAPIDAPI') || 
          key.includes('LINKEDIN') || 
          key.includes('API')
        )
      }
    });

  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Debug failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
