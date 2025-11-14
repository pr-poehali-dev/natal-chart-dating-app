-- Add gender column to users table
ALTER TABLE users ADD COLUMN gender VARCHAR(10);

-- Add check constraint to ensure valid values
ALTER TABLE users ADD CONSTRAINT users_gender_check CHECK (gender IN ('male', 'female', 'other'));

-- Create index for faster filtering
CREATE INDEX idx_users_gender ON users(gender);