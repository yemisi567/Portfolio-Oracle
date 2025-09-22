-- Create market_insights_cache table for storing API results
CREATE TABLE IF NOT EXISTS market_insights_cache (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    country VARCHAR(100) NOT NULL,
    keyword VARCHAR(100) NOT NULL,
    cache_key VARCHAR(255) NOT NULL UNIQUE,
    data JSONB NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_market_insights_cache_country_keyword ON market_insights_cache(country, keyword);
CREATE INDEX IF NOT EXISTS idx_market_insights_cache_expires_at ON market_insights_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_market_insights_cache_key ON market_insights_cache(cache_key);

-- Create job_postings_cache table for storing individual job data
CREATE TABLE IF NOT EXISTS job_postings_cache (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    job_id VARCHAR(255) NOT NULL,
    title TEXT NOT NULL,
    company VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT,
    salary_min INTEGER,
    salary_max INTEGER,
    salary_currency VARCHAR(10),
    experience_level VARCHAR(50),
    job_type VARCHAR(50),
    skills TEXT[],
    country VARCHAR(100) NOT NULL,
    keyword VARCHAR(100) NOT NULL,
    posted_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for job postings
CREATE INDEX IF NOT EXISTS idx_job_postings_cache_country_keyword ON job_postings_cache(country, keyword);
CREATE INDEX IF NOT EXISTS idx_job_postings_cache_job_id ON job_postings_cache(job_id);
CREATE INDEX IF NOT EXISTS idx_job_postings_cache_created_at ON job_postings_cache(created_at);

-- Enable RLS for both tables
ALTER TABLE market_insights_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_postings_cache ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all operations for now, can be restricted later)
CREATE POLICY "Allow all operations on market_insights_cache" ON market_insights_cache FOR ALL USING (true);
CREATE POLICY "Allow all operations on job_postings_cache" ON job_postings_cache FOR ALL USING (true);

-- Create function to clean up expired cache entries
CREATE OR REPLACE FUNCTION cleanup_expired_cache()
RETURNS void AS $$
BEGIN
    DELETE FROM market_insights_cache WHERE expires_at < NOW();
    DELETE FROM job_postings_cache WHERE created_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;
