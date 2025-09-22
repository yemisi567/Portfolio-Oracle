import { useQuery } from '@tanstack/react-query';

interface MarketInsightsParams {
  countries?: string[];
  keywords?: string[];
  limit?: number;
}

interface SkillData {
  skill: string;
  count: number;
  percentage: number;
}

interface RoleData {
  role: string;
  count: number;
}

interface CountryInsight {
  country: string;
  totalJobs: number;
  topSkills: SkillData[];
  topRoles: RoleData[];
  avgSalary: number;
  skillsCount: number;
}

interface GlobalTrends {
  topSkills: SkillData[];
  totalSkills: number;
  avgSkillsPerJob: number;
}

interface MarketInsightsData {
  countryInsights: Record<string, CountryInsight>;
  globalTrends: GlobalTrends;
  trendingRoles: RoleData[];
  summary: {
    totalJobs: number;
    countriesAnalyzed: number;
    topSkills: SkillData[];
    topRoles: RoleData[];
  };
  metadata: {
    totalJobs: number;
    countries: string[];
    keywords: string[];
    generatedAt: string;
    message?: string;
  };
}

export function useMarketInsights(params: MarketInsightsParams = {}) {
  const {
    countries = ['United States', 'United Kingdom', 'Canada'],
    keywords = ['software engineer', 'frontend developer', 'backend developer', 'full stack developer', 'data scientist'],
    limit = 20
  } = params;

  return useQuery({
    queryKey: ['marketInsights', countries, keywords, limit],
    queryFn: async (): Promise<MarketInsightsData> => {
      const searchParams = new URLSearchParams();
      searchParams.set('countries', countries.join(','));
      searchParams.set('keywords', keywords.join(','));
      searchParams.set('limit', limit.toString());

      const response = await fetch(`/api/market-insights/trending-skills?${searchParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch market insights');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch market insights');
      }

      return result.data;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 2,
    retryDelay: 1000,
  });
}

export function useLinkedInJobs(params: {
  keywords?: string;
  locationId?: string;
  datePosted?: string;
  sort?: string;
  limit?: number;
} = {}) {
  const {
    keywords = 'software engineer',
    locationId = '92000000',
    datePosted = 'anyTime',
    sort = 'mostRelevant',
    limit = 50
  } = params;

  return useQuery({
    queryKey: ['linkedinJobs', keywords, locationId, datePosted, sort, limit],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      searchParams.set('keywords', keywords);
      searchParams.set('locationId', locationId);
      searchParams.set('datePosted', datePosted);
      searchParams.set('sort', sort);
      searchParams.set('limit', limit.toString());

      const response = await fetch(`/api/market-insights/linkedin-jobs?${searchParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch LinkedIn jobs');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch LinkedIn jobs');
      }

      return result.data;
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    retryDelay: 1000,
  });
}
