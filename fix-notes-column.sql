-- First, check the current type of the notes column
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'projects' AND column_name = 'notes';

-- If notes is TEXT, convert it to TEXT[]
-- This will preserve existing data by converting single strings to arrays
ALTER TABLE projects 
ALTER COLUMN notes TYPE TEXT[] 
USING CASE 
  WHEN notes IS NULL THEN '{}'::TEXT[]
  WHEN notes = '' THEN '{}'::TEXT[]
  ELSE ARRAY[notes]::TEXT[]
END;

-- Set default value
ALTER TABLE projects ALTER COLUMN notes SET DEFAULT '{}';

-- Verify the change
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'projects' AND column_name = 'notes';
