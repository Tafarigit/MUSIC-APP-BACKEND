-- Insert test users (ensuring at least one user exists)
INSERT INTO users (id, username, email, password)
VALUES 
  (gen_random_uuid(), 'testuser1', 'test1@example.com', 'hashedpassword1'),
  (gen_random_uuid(), 'testuser2', 'test2@example.com', 'hashedpassword2')
ON CONFLICT (username) DO NOTHING; 

-- Ensure at least one user exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users) THEN
    RAISE EXCEPTION 'No users found. Cannot insert songs!';
  END IF;
END $$;

-- Insert test songs
INSERT INTO songs (id, title, artist, album, genre, release_date, duration, user_id)
VALUES 
  (gen_random_uuid(), 'Song One', 'Artist One', 'Album One', 'Rock', '2023-01-01', 210, (SELECT id FROM users LIMIT 1)),
  (gen_random_uuid(), 'Song Two', 'Artist Two', 'Album Two', 'Hip-Hop', '2023-02-15', 180, (SELECT id FROM users LIMIT 1 OFFSET 1))
ON CONFLICT DO NOTHING;


-- Insert test purchases
INSERT INTO purchases (id, user_id, song_id, purchase_date, price)
VALUES 
  (gen_random_uuid(), (SELECT id FROM users LIMIT 1), (SELECT id FROM songs LIMIT 1), NOW(), 9.99),
  (gen_random_uuid(), (SELECT id FROM users LIMIT 1 OFFSET 1), (SELECT id FROM songs LIMIT 1 OFFSET 1), NOW(), 12.99);
