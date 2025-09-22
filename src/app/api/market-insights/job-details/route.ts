import { NextRequest, NextResponse } from 'next/server';
import { CacheService } from '@/lib/services/cache-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country') || 'United States';
    const keyword = searchParams.get('keyword') || 'software engineer';
    const limit = parseInt(searchParams.get('limit') || '20');

    console.log(`Fetching job details for ${country} - ${keyword}`);

    // Get job postings from cache
    const jobs = await CacheService.getJobPostings(country, keyword, limit);

    if (jobs.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          jobs: [],
          totalJobs: 0,
          message: 'No job data available. This might be due to API rate limits or no jobs found for the selected criteria.'
        },
        metadata: {
          country,
          keyword,
          generatedAt: new Date().toISOString(),
          source: 'cache'
        }
      });
    }

    // Generate salary ranges based on country
    const generateSalaryRange = (country: string, jobTitle: string) => {
      const salaryRanges: Record<string, { min: number; max: number; currency: string }> = {
        "United States": { min: 80000, max: 180000, currency: "USD" },
        "United Kingdom": { min: 45000, max: 100000, currency: "GBP" },
        "Canada": { min: 70000, max: 140000, currency: "CAD" },
        "Germany": { min: 50000, max: 100000, currency: "EUR" },
        "Australia": { min: 80000, max: 150000, currency: "AUD" },
        "Netherlands": { min: 45000, max: 90000, currency: "EUR" },
        "Singapore": { min: 60000, max: 120000, currency: "SGD" },
        "Japan": { min: 5000000, max: 12000000, currency: "JPY" },
        "France": { min: 40000, max: 85000, currency: "EUR" },
        "India": { min: 800000, max: 2000000, currency: "INR" },
      };

      const baseRange = salaryRanges[country] || salaryRanges["United States"];
      
      // Adjust based on job type
      let multiplier = 1;
      if (jobTitle.toLowerCase().includes("senior") || jobTitle.toLowerCase().includes("lead")) {
        multiplier = 1.3;
      } else if (jobTitle.toLowerCase().includes("junior") || jobTitle.toLowerCase().includes("entry")) {
        multiplier = 0.7;
      } else if (jobTitle.toLowerCase().includes("architect") || jobTitle.toLowerCase().includes("principal")) {
        multiplier = 1.5;
      }

      const min = Math.round(baseRange.min * multiplier);
      const max = Math.round(baseRange.max * multiplier);

      // Format based on currency
      const formatSalary = (amount: number) => {
        if (baseRange.currency === "JPY" || baseRange.currency === "INR") {
          return amount.toLocaleString();
        }
        return amount.toLocaleString();
      };

      return {
        min,
        max,
        currency: baseRange.currency,
        display: `${baseRange.currency === "USD" ? "$" : baseRange.currency === "EUR" ? "€" : baseRange.currency === "GBP" ? "£" : baseRange.currency === "JPY" ? "¥" : baseRange.currency === "INR" ? "₹" : baseRange.currency}${formatSalary(min)} - ${baseRange.currency === "USD" ? "$" : baseRange.currency === "EUR" ? "€" : baseRange.currency === "GBP" ? "£" : baseRange.currency === "JPY" ? "¥" : baseRange.currency === "INR" ? "₹" : baseRange.currency}${formatSalary(max)}`
      };
    };

    // Process jobs for display
    const processedJobs = jobs.map(job => {
      const generatedSalary = generateSalaryRange(country, job.title);
      
      return {
        id: job.jobId,
        title: job.title,
        company: job.company,
        location: job.location,
        description: job.description,
        salary: job.salary ? {
          min: job.salary.min,
          max: job.salary.max,
          currency: job.salary.currency,
          display: job.salary.min && job.salary.max 
            ? `${job.salary.currency || '$'}${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}`
            : job.salary.min 
            ? `${job.salary.currency || '$'}${job.salary.min.toLocaleString()}+`
            : job.salary.max
            ? `Up to ${job.salary.currency || '$'}${job.salary.max.toLocaleString()}`
            : generatedSalary.display
        } : generatedSalary,
        experienceLevel: job.experienceLevel || 'Not specified',
        jobType: job.jobType || 'Not specified',
        skills: job.skills,
        postedDate: job.postedDate,
        country: job.country,
        keyword: job.keyword
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        jobs: processedJobs,
        totalJobs: processedJobs.length
      },
      metadata: {
        country,
        keyword,
        generatedAt: new Date().toISOString(),
        source: 'cache'
      }
    });

  } catch (error) {
    console.error('Error fetching job details:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch job details',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
