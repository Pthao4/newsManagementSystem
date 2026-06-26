-- Insert 10 records into SystemAccount
INSERT INTO SystemAccount (AccountName, AccountEmail, AccountRole, AccountPassword) VALUES
('Admin User 1', 'admin1@test.com', 'ADMIN', 'password123'),
('Staff User 1', 'staff1@test.com', 'STAFF', 'password123'),
('User 1', 'user1@test.com', 'USER', 'password123'),
('Staff User 2', 'staff2@test.com', 'STAFF', 'password123'),
('User 2', 'user2@test.com', 'USER', 'password123'),
('Admin User 2', 'admin2@test.com', 'ADMIN', 'password123'),
('Staff User 3', 'staff3@test.com', 'STAFF', 'password123'),
('User 3', 'user3@test.com', 'USER', 'password123'),
('Staff User 4', 'staff4@test.com', 'STAFF', 'password123'),
('User 4', 'user4@test.com', 'USER', 'password123');

-- Insert 10 records into Category
INSERT INTO Category (CategoryName, CategoryDesciption, ParentCategoryID, IsActive) VALUES
('Technology', 'All about technology', NULL, 1),
('Sports', 'Sports news', NULL, 1),
('Politics', 'Politics news', NULL, 1),
('Entertainment', 'Movies and music', NULL, 1),
('Health', 'Health and wellness', NULL, 1),
('AI & ML', 'Artificial Intelligence', 1, 1),
('Football', 'Football news', 2, 1),
('US Politics', 'United States politics', 3, 1),
('Hollywood', 'Hollywood gossip', 4, 1),
('Nutrition', 'Healthy food', 5, 1);

-- Insert 10 records into Tag
INSERT INTO Tag (TagName, Note) VALUES
('Breaking News', 'Urgent news'),
('Local', 'Local area news'),
('Global', 'International news'),
('Trending', 'Currently trending topics'),
('Exclusive', 'Exclusive content'),
('Interview', 'Interviews with people'),
('Review', 'Product or movie reviews'),
('Opinion', 'Opinion pieces'),
('Analysis', 'In-depth analysis'),
('Guide', 'How-to guides');

-- Insert 10 records into NewsArticle
INSERT INTO NewsArticle (NewsTitle, Headline, NewsContent, NewsSource, NewsStatus, CategoryID, CreatedByID, UpdatedByID, CreatedDate, ModifiedDate) VALUES
('Tech Giant Releases New AI', 'New AI Model', 'Content about the new AI model...', 'TechCrunch', 1, 6, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Local Football Team Wins Championship', 'Champions!', 'Content about the football game...', 'Local Sports', 1, 7, 2, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Election Results Announced', 'New President', 'Content about the election...', 'CNN', 1, 8, 3, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('New Movie Breaks Box Office Records', 'Blockbuster', 'Content about the movie...', 'IMDb', 1, 9, 4, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Study Shows Benefits of New Diet', 'Healthy Eating', 'Content about nutrition...', 'Healthline', 1, 10, 5, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Future of Quantum Computing', 'Quantum Leap', 'Content about quantum computers...', 'Wired', 0, 1, 1, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Basketball Finals MVP Announced', 'MVP', 'Content about basketball...', 'ESPN', 1, 2, 2, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Summit on Climate Change', 'Global Warming', 'Content about the summit...', 'BBC', 1, 3, 3, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Music Awards Winners', 'Grammys', 'Content about the awards...', 'Rolling Stone', 1, 4, 4, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Yoga for Beginners', 'Start Yoga', 'Content about yoga poses...', 'Yoga Journal', 1, 5, 5, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert 10 records into NewsTag
INSERT INTO NewsTag (NewsArticleID, TagID) VALUES
(1, 1),
(1, 4),
(2, 2),
(3, 3),
(4, 4),
(5, 10),
(6, 9),
(7, 4),
(8, 3),
(9, 4);

-- Insert 10 records into Attachment
INSERT INTO Attachment (FileName, ContentType, FileSize, FileUrl, NewsArticleID) VALUES
('ai_model.jpg', 'image/jpeg', 102400, 'https://example.com/ai_model.jpg', 1),
('football.png', 'image/png', 204800, 'https://example.com/football.png', 2),
('election.pdf', 'application/pdf', 512000, 'https://example.com/election.pdf', 3),
('movie_poster.jpg', 'image/jpeg', 153600, 'https://example.com/movie_poster.jpg', 4),
('diet_plan.pdf', 'application/pdf', 307200, 'https://example.com/diet_plan.pdf', 5),
('quantum.jpg', 'image/jpeg', 102400, 'https://example.com/quantum.jpg', 6),
('mvp.png', 'image/png', 204800, 'https://example.com/mvp.png', 7),
('climate.pdf', 'application/pdf', 512000, 'https://example.com/climate.pdf', 8),
('awards.jpg', 'image/jpeg', 153600, 'https://example.com/awards.jpg', 9),
('yoga.mp4', 'video/mp4', 10485760, 'https://example.com/yoga.mp4', 10);
