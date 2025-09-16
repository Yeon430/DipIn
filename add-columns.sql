-- Add missing columns to existing user_profiles table
-- This preserves existing data while adding new columns

-- Add new columns to user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS major VARCHAR(100),
ADD COLUMN IF NOT EXISTS grade VARCHAR(50),
ADD COLUMN IF NOT EXISTS interests TEXT[],
ADD COLUMN IF NOT EXISTS goal VARCHAR(100);

-- Update existing records with default values if needed
UPDATE user_profiles 
SET 
  major = 'computer',
  grade = '1',
  interests = ARRAY['Frontend'],
  goal = 'skill'
WHERE major IS NULL;

-- Verify the changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
ORDER BY ordinal_position;











