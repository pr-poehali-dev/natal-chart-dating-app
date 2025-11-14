-- Create users table with birth data
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    birth_date DATE NOT NULL,
    birth_time TIME NOT NULL,
    birth_city VARCHAR(100) NOT NULL,
    birth_latitude DECIMAL(10, 8),
    birth_longitude DECIMAL(11, 8),
    zodiac_sign VARCHAR(20),
    moon_sign VARCHAR(20),
    ascendant_sign VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create natal_charts table
CREATE TABLE IF NOT EXISTS natal_charts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    sun_sign VARCHAR(20) NOT NULL,
    moon_sign VARCHAR(20) NOT NULL,
    ascendant VARCHAR(20) NOT NULL,
    mercury VARCHAR(20),
    venus VARCHAR(20),
    mars VARCHAR(20),
    jupiter VARCHAR(20),
    saturn VARCHAR(20),
    chart_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create compatibility_cache table for synastry calculations
CREATE TABLE IF NOT EXISTS compatibility_cache (
    id SERIAL PRIMARY KEY,
    user1_id INTEGER REFERENCES users(id),
    user2_id INTEGER REFERENCES users(id),
    compatibility_score INTEGER NOT NULL CHECK (compatibility_score >= 0 AND compatibility_score <= 100),
    compatibility_details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user1_id, user2_id)
);

-- Create chats table
CREATE TABLE IF NOT EXISTS chats (
    id SERIAL PRIMARY KEY,
    user1_id INTEGER REFERENCES users(id),
    user2_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user1_id, user2_id)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    chat_id INTEGER REFERENCES chats(id),
    sender_id INTEGER REFERENCES users(id),
    message_text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_interactions table (likes, views)
CREATE TABLE IF NOT EXISTS user_interactions (
    id SERIAL PRIMARY KEY,
    from_user_id INTEGER REFERENCES users(id),
    to_user_id INTEGER REFERENCES users(id),
    interaction_type VARCHAR(20) NOT NULL CHECK (interaction_type IN ('view', 'like', 'match')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(from_user_id, to_user_id, interaction_type)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_natal_charts_user_id ON natal_charts(user_id);
CREATE INDEX IF NOT EXISTS idx_compatibility_user1 ON compatibility_cache(user1_id);
CREATE INDEX IF NOT EXISTS idx_compatibility_user2 ON compatibility_cache(user2_id);
CREATE INDEX IF NOT EXISTS idx_chats_user1 ON chats(user1_id);
CREATE INDEX IF NOT EXISTS idx_chats_user2 ON chats(user2_id);
CREATE INDEX IF NOT EXISTS idx_messages_chat ON messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_interactions_from ON user_interactions(from_user_id);
CREATE INDEX IF NOT EXISTS idx_interactions_to ON user_interactions(to_user_id);