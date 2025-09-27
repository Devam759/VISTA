-- Add Devam Gupta to students table
-- Create students table if it doesn't exist
CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    roll_no VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    room_no VARCHAR(10),
    hostel VARCHAR(10),
    year VARCHAR(10),
    course VARCHAR(50),
    branch VARCHAR(50),
    room_type VARCHAR(20),
    mobile VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Devam Gupta
INSERT INTO students (roll_no, name, room_no, hostel, year, course, branch, room_type, mobile)
VALUES ('2024btech014', 'Devam Gupta', '604', 'BH2', '2nd year', 'AC', '3 seater', 'AC', '7340015201')
ON CONFLICT (roll_no) DO UPDATE SET
    name = EXCLUDED.name,
    room_no = EXCLUDED.room_no,
    hostel = EXCLUDED.hostel,
    year = EXCLUDED.year,
    course = EXCLUDED.course,
    branch = EXCLUDED.branch,
    room_type = EXCLUDED.room_type,
    mobile = EXCLUDED.mobile;
