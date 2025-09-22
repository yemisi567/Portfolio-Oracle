-- Add challenges column (array of strings) - only if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'challenges'
    ) THEN
        ALTER TABLE projects ADD COLUMN challenges TEXT[] DEFAULT '{}';
    END IF;
END $$;

-- Add resources column (JSON array for structured resource data) - only if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'resources'
    ) THEN
        ALTER TABLE projects ADD COLUMN resources JSONB DEFAULT '[]';
    END IF;
END $$;

-- Verify the new columns exist
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'projects' 
AND column_name IN ('challenges', 'resources')
ORDER BY column_name;
