-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    skill_level VARCHAR(20) NOT NULL CHECK (skill_level IN ('beginner', 'intermediate', 'advanced')),
    primary_stack VARCHAR(50) NOT NULL CHECK (primary_stack IN (
        'frontend-development', 'backend-development', 'full-stack-development', 'mobile-development',
        'devops-cloud', 'data-science-ai', 'ui-ux-design', 'product-management', 'project-management',
        'digital-marketing', 'cybersecurity', 'game-development', 'blockchain-development',
        'quality-assurance', 'technical-writing', 'sales-engineering', 'customer-success', 'business-analytics'
    )),
    goals TEXT[] DEFAULT '{}',
    interests TEXT[] DEFAULT '{}',
    additional_skills TEXT,
    target_industry VARCHAR(50) DEFAULT 'general',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    description TEXT,
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    tech_stack TEXT[] DEFAULT '{}',
    requirements TEXT[] DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'in-progress', 'completed')),
    repository_name VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create milestones table
CREATE TABLE IF NOT EXISTS milestones (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    estimated_hours INTEGER NOT NULL,
    detection_hint TEXT,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create market_insights table
CREATE TABLE IF NOT EXISTS market_insights (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    skill VARCHAR(100) NOT NULL,
    popularity_score DECIMAL(5,2) NOT NULL,
    growth_rate DECIMAL(5,2) NOT NULL,
    average_salary INTEGER NOT NULL,
    country VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create job_trends table
CREATE TABLE IF NOT EXISTS job_trends (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    role VARCHAR(100) NOT NULL,
    demand VARCHAR(20) NOT NULL CHECK (demand IN ('high', 'medium', 'low')),
    growth_rate DECIMAL(5,2) NOT NULL,
    average_salary INTEGER NOT NULL,
    required_skills TEXT[] DEFAULT '{}',
    country VARCHAR(100) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_milestones_project_id ON milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_milestones_completed ON milestones(completed);
CREATE INDEX IF NOT EXISTS idx_market_insights_country ON market_insights(country);
CREATE INDEX IF NOT EXISTS idx_market_insights_category ON market_insights(category);
CREATE INDEX IF NOT EXISTS idx_job_trends_country ON job_trends(country);
CREATE INDEX IF NOT EXISTS idx_job_trends_demand ON job_trends(demand);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_milestones_updated_at BEFORE UPDATE ON milestones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_trends ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for projects
CREATE POLICY "Users can view own projects" ON projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own projects" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON projects FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for milestones
CREATE POLICY "Users can view project milestones" ON milestones FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM projects WHERE projects.id = milestones.project_id AND projects.user_id = auth.uid()
    )
);
CREATE POLICY "Users can insert project milestones" ON milestones FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM projects WHERE projects.id = milestones.project_id AND projects.user_id = auth.uid()
    )
);
CREATE POLICY "Users can update project milestones" ON milestones FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM projects WHERE projects.id = milestones.project_id AND projects.user_id = auth.uid()
    )
);
CREATE POLICY "Users can delete project milestones" ON milestones FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM projects WHERE projects.id = milestones.project_id AND projects.user_id = auth.uid()
    )
);

-- Create RLS policies for market_insights (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view market insights" ON market_insights FOR SELECT USING (auth.role() = 'authenticated');

-- Create RLS policies for job_trends (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view job trends" ON job_trends FOR SELECT USING (auth.role() = 'authenticated'); 


-- Create password_reset_tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for password_reset_tokens
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_used ON password_reset_tokens(used);

-- Enable RLS for password_reset_tokens
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for password_reset_tokens (no user access needed, only system access)
CREATE POLICY "System can manage password reset tokens" ON password_reset_tokens FOR ALL USING (false); 