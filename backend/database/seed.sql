-- Sample data for testing
USE vista;

-- Insert sample students (password: 123, hashed with bcrypt)
-- Hash for '123': $2a$10$rN8qLXzH5Y5yZxGxH5yZxeO5yZxGxH5yZxGxH5yZxGxH5yZxGxH5y
INSERT INTO students (roll_no, name, course, year, hostel, room_no, mobile_no, password) VALUES
('2024btech014', 'Sample Student', 'B.Tech CS', 2, 'Hostel A', 'A-101', '9876543210', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8qV8Nh8Nh8Nh8Nh8Nh8Nh8Nh8Nh8N'),
('2024btech015', 'Test Student', 'B.Tech CS', 2, 'Hostel A', 'A-102', '9876543211', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8qV8Nh8Nh8Nh8Nh8Nh8Nh8Nh8Nh8N');

-- Insert sample warden (password: 123)
INSERT INTO wardens (name, hostel, mobile, password) VALUES
('karan', 'Hostel A', '9876543200', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8qV8Nh8Nh8Nh8Nh8Nh8Nh8Nh8Nh8N');

-- Insert sample campus polygon (example: JKLU campus boundary)
INSERT INTO campus_polygon (lat, lng, point_order) VALUES
(26.9124, 75.7873, 1),
(26.9134, 75.7883, 2),
(26.9144, 75.7873, 3),
(26.9134, 75.7863, 4);
