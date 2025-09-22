/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseServer } from '@/lib/supabase-server';

export interface CachedMarketData {
  countryInsights: Record<string, any>;
  globalTrends: {
    topSkills: Array<{ skill: string; count: number; percentage: number }>;
    totalSkills: number;
    avgSkillsPerJob: number;
  };
  trendingRoles: Array<{ role: string; count: number }>;
  summary: {
    totalJobs: number;
    countriesAnalyzed: number;
    topSkills: Array<{ skill: string; count: number; percentage: number }>;
    topRoles: Array<{ role: string; count: number }>;
  };
}

export interface CachedJobData {
  jobId: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  experienceLevel?: string;
  jobType?: string;
  skills: string[];
  country: string;
  keyword: string;
  postedDate?: string;
}

export class CacheService {
  private static readonly CACHE_DURATION_HOURS = 24; // Cache for 24 hours
  private static readonly JOB_CACHE_DAYS = 7; // Keep job data for 7 days

  private static generateCacheKey(country: string, keyword: string): string {
    return `market_insights_${country.toLowerCase().replace(/\s+/g, '_')}_${keyword.toLowerCase().replace(/\s+/g, '_')}`;
  }


  static async getMarketInsights(country: string, keyword: string): Promise<CachedMarketData | null> {
    try {
      const cacheKey = this.generateCacheKey(country, keyword);
      
      const { data, error } = await supabaseServer
        .from('market_insights_cache')
        .select('data, expires_at')
        .eq('cache_key', cacheKey)
        .single();

      if (error || !data) {
        return null;
      }

      // Check if cache is expired
      if (new Date(data.expires_at) < new Date()) {
        // Delete expired cache
        await this.deleteMarketInsights(country, keyword);
        return null;
      }

      return data.data as CachedMarketData;
    } catch (error) {
      console.error('Error getting cached market insights:', error);
      return null;
    }
  }


  static async saveMarketInsights(
    country: string, 
    keyword: string, 
    data: CachedMarketData
  ): Promise<boolean> {
    try {
      const cacheKey = this.generateCacheKey(country, keyword);
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + this.CACHE_DURATION_HOURS);

      const { error } = await supabaseServer
        .from('market_insights_cache')
        .upsert({
          country,
          keyword,
          cache_key: cacheKey,
          data,
          expires_at: expiresAt.toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving market insights to cache:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error saving market insights to cache:', error);
      return false;
    }
  }

  static async getJobPostings(country: string, keyword: string, limit: number = 50): Promise<CachedJobData[]> {
    try {
      const { data, error } = await supabaseServer
        .from('job_postings_cache')
        .select('*')
        .eq('country', country)
        .eq('keyword', keyword)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error getting cached job postings:', error);
        return [];
      }

      return data?.map(job => ({
        jobId: job.job_id,
        title: job.title,
        company: job.company,
        location: job.location,
        description: job.description,
        salary: job.salary_min || job.salary_max ? {
          min: job.salary_min,
          max: job.salary_max,
          currency: job.salary_currency
        } : undefined,
        experienceLevel: job.experience_level,
        jobType: job.job_type,
        skills: job.skills || [],
        country: job.country,
        keyword: job.keyword,
        postedDate: job.posted_date
      })) || [];
    } catch (error) {
      console.error('Error getting cached job postings:', error);
      return [];
    }
  }

  static async saveJobPostings(jobs: CachedJobData[]): Promise<boolean> {
    try {
      if (jobs.length === 0) return true;

      const jobRecords = jobs.map(job => ({
        job_id: job.jobId,
        title: job.title,
        company: job.company,
        location: job.location,
        description: job.description,
        salary_min: job.salary?.min,
        salary_max: job.salary?.max,
        salary_currency: job.salary?.currency,
        experience_level: job.experienceLevel,
        job_type: job.jobType,
        skills: job.skills,
        country: job.country,
        keyword: job.keyword,
        posted_date: job.postedDate
      }));

      const { error } = await supabaseServer
        .from('job_postings_cache')
        .upsert(jobRecords, { 
          onConflict: 'job_id,country,keyword',
          ignoreDuplicates: false 
        });

      if (error) {
        console.error('Error saving job postings to cache:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error saving job postings to cache:', error);
      return false;
    }
  }

 
  static async deleteMarketInsights(country: string, keyword: string): Promise<boolean> {
    try {
      const cacheKey = this.generateCacheKey(country, keyword);
      
      const { error } = await supabaseServer
        .from('market_insights_cache')
        .delete()
        .eq('cache_key', cacheKey);

      if (error) {
        console.error('Error deleting market insights cache:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting market insights cache:', error);
      return false;
    }
  }

  static async cleanupExpiredCache(): Promise<boolean> {
    try {
      const { error } = await supabaseServer.rpc('cleanup_expired_cache');
      
      if (error) {
        console.error('Error cleaning up expired cache:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error cleaning up expired cache:', error);
      return false;
    }
  }

 
  static async hasRecentData(country: string, keyword: string): Promise<boolean> {
    try {
      const cacheKey = this.generateCacheKey(country, keyword);
      
      const { data, error } = await supabaseServer
        .from('market_insights_cache')
        .select('expires_at')
        .eq('cache_key', cacheKey)
        .single();

      if (error || !data) {
        return false;
      }

      return new Date(data.expires_at) > new Date();
    } catch (error) {
      console.error('Error checking recent data:', error);
      return false;
    }
  }
}
