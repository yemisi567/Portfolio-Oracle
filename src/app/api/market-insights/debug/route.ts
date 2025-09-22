import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const rapidApiKey = process.env.RAPIDAPI_KEY;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    
    return NextResponse.json({
      success: true,
      debug: {
        rapidApiKey: rapidApiKey ? 'Set (length: ' + rapidApiKey.length + ')' : 'Not set',
        siteUrl: siteUrl || 'Not set',
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
