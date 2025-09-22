import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function DELETE() {
  try {
    // Clear market insights cache
    const { error: marketInsightsError } = await supabaseServer
      .from('market_insights_cache')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (marketInsightsError) {
      console.error('Error clearing market insights cache:', marketInsightsError);
    }

    // Clear job postings cache
    const { error: jobPostingsError } = await supabaseServer
      .from('job_postings_cache')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (jobPostingsError) {
      console.error('Error clearing job postings cache:', jobPostingsError);
    }

    return NextResponse.json({
      success: true,
      message: 'Cache cleared successfully'
    });

  } catch (error) {
    console.error('Error clearing cache:', error);
    return NextResponse.json(
      { error: 'Failed to clear cache' },
      { status: 500 }
    );
  }
}
