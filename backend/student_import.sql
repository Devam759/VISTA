-- VISTA Student Data Import
-- Generated on: 2025-09-27 08:48:11
-- Total records: 294

-- BH2 Students (294 students)

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('anirudh.choudhary@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Anirudh', 'Choudhary', '8690943532', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/0231', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '101' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8690943532', '342,Sandhya Residency,kanak vrindavan , sirsi Road', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('daksh.soni@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Daksh', 'Soni', '6350264020', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2054', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '101' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '6350264020', 'House no.130 street no.2 near aggarwal peer mandir', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('rohan.goyal@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Rohan', 'Goyal', '9729309927', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/0121', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '101' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9729309927', 'Charkhi Dadri', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('aaron.augustine@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Aaron', 'Augustine', '7093504232', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BDES25/0118', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '102' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Des', 'Computer Science', 1, '7093504232', 'Secunderabad', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('leesanth.g@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Leesanth', 'G', '7093504232', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/0616', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '102' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '7093504232', 'Secunderabad', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('myadam.samarth@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Myadam', 'Samarth', '9182501817', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/1325', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '102' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9182501817', '2-2-1152/A/D,New Nallakunta,Hyderabad', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('mrinal.khandal@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Mrinal', 'Khandal', '8875903661', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2021', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '103' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8875903661', 'Shivarpanam,j-426/1 sangam vihar near vijayvargiya lawn new mandi road dausa', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('parth.mundra@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Parth', 'Mundra', '9664098829', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BBA25/0320', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '103' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'BBA', 'Computer Science', 1, '9664098829', 'Pagara house,khoja gate road, Bundi Rajasthan', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('rishikesh.bhardwaj@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Rishikesh', 'Bhardwaj', '9204425929', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2205', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '103' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9204425929', 'House no. 2 , road no. 6, Indrapuri ,PO -keshari Nagar , Patna, Bihar , 800024', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('ankush.panda@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Ankush', 'Panda', '8240832834', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BDES25/0238', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '104' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Des', 'Computer Science', 1, '8240832834', 'Manisudha Apt. Flat no.3D&E, 8/A Shyamashree pally, P.O- NCP, Barrackpore, Kolkata-700122, W.B', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('abhirama.karthikeyasreyastuttagunta@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Abhirama', 'Karthikeya Sreyas Tuttagunta', '9100668862', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2313', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '104' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9100668862', '11-1-1 Lalitha gift house main road Ramachandrapuram A.P 533255', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('doddaka.jayadeepnagasai@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Doddaka', 'Jayadeep Naga Sai', '7997485729', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2547', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '104' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '7997485729', 'Sarada colony 11th lane opposite , guntur , Andra pradesh', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('ashutosh.yadav@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Ashutosh', 'Yadav', '9259068512', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2794', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '105' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9259068512', 'Ak Inter College Road Barnahal Mainpuri', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('rishabh.kalwar@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Rishabh', 'Kalwar', '6377130687', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2067', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '105' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '6377130687', 'V/po mali mohalla kishangarh arain, ajmer (rajasthan)', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('vaibhav.jain@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Vaibhav', 'Jain', '8740080070', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/1425', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '105' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8740080070', '51 vishwakarma nagar 2 maharani farm durgapura jaipur', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('heramb.sharma@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Heramb', 'Sharma', '6377827962', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2432', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '106' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '6377827962', '36/345 Shiv Mandir Wali Gali Loha Khan Police Line Ajmer', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('krish.bhola@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Krish', 'Bhola', '7073517788', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BBA25/0088', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '106' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'BBA', 'Computer Science', 1, '7073517788', 'Near Mori K Hanuman JiRampura', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('lakshay@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Lakshay', '', '9817856544', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2294', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '106' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9817856544', 'House no. 1841, Sector 4, Karnal, Haryana', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('aman.anchaliya@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Aman', 'Anchaliya', '9549696968', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BBA25/0340', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '107' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'BBA', 'Computer Science', 1, '9549696968', 'Anchaliya niwash bhura chowk nokha', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('bhavya.doshi@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Bhavya', 'Doshi', '7014763106', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BBA25/0340', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '107' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'BBA', 'Computer Science', 1, '7014763106', 'Aananda society flat no 302 vyas colony Nagaur Rajasthan', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('vansh.doshi@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Vansh', 'Doshi', '8302159015', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BBA25/0267', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '107' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'BBA', 'Computer Science', 1, '8302159015', 'Near gehlot gas agency, amar hostel', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('nakkalapally.omruthik@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Nakkalapally', 'Omruthik', '9014857921', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/0998', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '108' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9014857921', '4-7-25/8 Attapur Hyderabad telangana', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('parth.dhoot@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Parth', 'Dhoot', '9145941190', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/1969', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '108' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9145941190', 'C2 second floor , A Block , Alankar Residency buildingDev heritage lane , 100 ft ROAD , Kankroli, Rajsamand , Rajasthan', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('sunay.kundalwal@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Sunay', 'Kundalwal', '8619804776', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/0043', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '108' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8619804776', 'B-76 nakul path lalkothi jaipur rajasthan 302015', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('abhishek@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Abhishek', '', '9235245386', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2025', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '109' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9235245386', 'Vimaur Imiliya Gurudayal , Gonda , Uttar Pradesh', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('chirag.kumar@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Chirag', 'Kumar', '7488645235', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/0875', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '109' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '7488645235', 'Aakha Bishaput, Ujiyapur, Samastipur,Bihar', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('rahul.tahid@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Rahul', 'Tahid', '9079940294', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'MDES25/0033', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '109' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Computer Science', 1, '9079940294', 'T-4,17-D, Anukiran colony', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('badrinadh.goru@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Badrinadh', 'Goru', '7013288812', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2117', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '110' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '7013288812', 'Veavers colony,Palakonda , Parvathipuram Manyam, Andhra Pradesh 532440', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('manant.srivastava@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Manant', 'Srivastava', '9451021467', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2118', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '110' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9451021467', '1221, C1 1st Street, IIT Jodhpur, Jodhpur-342037', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('shivam.srivastava@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Shivam', 'Srivastava', '7460932017', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2386', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '110' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '7460932017', 'Chakia, Chandauli l, Uttarpradesh', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('manan.verma@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Manan', 'Verma', '9662349319', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/1767', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '111' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9662349319', 'F,504 Shri jee villa Sevasi Canal road, Vadodara 390021, Gujarat', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('shivang.singhal@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Shivang', 'Singhal', '9784032687', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2373', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '111' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9784032687', 'Opp sdm court mohan nagar hindaun city', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('swarn.joshi@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Swarn', 'Joshi', '9371061051', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2256', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '111' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9371061051', '42,gali no 7,agarpura colony, near oswal jain temple,banswara', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('pedapalli.bhaskar@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Pedapalli', 'Bhaskar', '6303236298', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/0614', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '112' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '6303236298', '5-40,Vemavaram(village),Surepalli(post),Bhattiprolu(MD),Bapatla(Dist), Andhrapradesh,522256', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('raghuraj.singhshekhawat@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Raghuraj', 'Singh Shekhawat', '8955983385', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2620', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '112' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8955983385', 'VPO - POSANI SIKAR 332031', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('rudrapal.singhshekhawat@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Rudrapal', 'Singh Shekhawat', '7737472264', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2614', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '112' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '7737472264', 'VPO POSANI SIKAR RAJ 332031', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('annu.kumarhadi@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Annu', 'Kumar Hadi', '8102694896', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2603', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '113' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8102694896', 'Gaddi Mahalla, Giridih, Jharkhand', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('brijesh.kumarkoiri@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Brijesh', 'Kumar Koiri', '6295277386', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2593', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '113' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '6295277386', 'Jambad Colliery Benyadih (Kajora) Durgapur West Bengal', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('kota.reddykarthikreddy@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Kota', 'Reddy Karthik Reddy', '7032839289', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/1372', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '113' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '7032839289', '4-161/84, happy homes, darsi,Prakasam district, 523247, Andhra Pradesh', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('kuntrapakam.nipunprathisthreddy@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Kuntrapakam', 'Nipun Prathisth Reddy', '7386871155', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/1540', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '114' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '7386871155', '23-8-158,new Balaji colony,air bypass road,Tirupati, 517502', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('mukesh.chinthamani@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Mukesh', 'Chinthamani', '8074703767', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2705', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '114' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8074703767', 'Mathukuvari Palli , Bodireddigaripalle, Chittoor, Andhra Pradesh', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('hemanth.harinageshwarvanapalli@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Hemanth', 'Harinageshwar Vanapalli', '9440262666', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2553', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '114' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9440262666', '67-26/231, simhachala nagar, sanitorium, Rajahmundry, 533103 - andhrapradesh', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('amit.ranjanpradhan@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Amit', 'Ranjan Pradhan', '9801253005', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2075', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '115' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9801253005', 'Barnaiya Raja Ram post Dhebwa Gopalganj Bihar', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('ayush.jaiswal@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Ayush', 'Jaiswal', '9473326155', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/0423', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '115' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9473326155', '2nd floor Chadan Niwas Road no 4 Kurji Kothiya Patna-10', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('yuvraj.singh@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Yuvraj', 'Singh', '9166884991', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2821', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '115' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9166884991', '261,BHAJERA,VAI-MENDIPUR BALAJI', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('harshawardhan@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Harshawardhan', '', '9460652938', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2466', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '116' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9460652938', 'Kuchaman city,Nagaur', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('mohit.suwalka@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Mohit', 'Suwalka', '8005961269', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/0174', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '116' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8005961269', 'Gangapur, bhilwara', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('priyanshu.kumar@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Priyanshu', 'Kumar', '9891660352', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2545', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '116' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9891660352', 'H no 18 shiv colony maruti kunj rd bhondsi gurgaon', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('valmiki.rishi@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Valmiki', 'Rishi', '9353908651', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/1551', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '201' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9353908651', 'Type c -80 , north block , Donimalai township , Bellary , Karnataka', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('kallu.ashwinreddy@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Kallu', 'Ashwin Reddy', '9704896270', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/1548', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '201' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9704896270', 'Flat no.529, vasavi indraprastha apartments, Czech colony street no.1, sanath nagar', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('veda.prakashdevalapalli@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Veda', 'Prakash Devalapalli', '7075150829', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2290', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '201' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '7075150829', 'Flat no 76 ,lakshmi Narayana nilayam,paparayadu Nagar, kukatpalli,hyderabad', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('gandla.vipuleshwar@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Gandla', 'Vipuleshwar', '9666120156', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/1682', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '202' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9666120156', 'Jogipet, dayanand road, near gouni, Sangareddy', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('sirimamilla.abhishek@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Sirimamilla', 'Abhishek', '7075356599', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/0539', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '202' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '7075356599', 'Shakthi sai nagar,mallapur,hyd-500076', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('varun.raothumula@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Varun', 'Rao Thumula', '8309740155', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/1472', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '202' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8309740155', 'Flat 202. Ramadevi Residency, Godavarikhani,Peddapalli,Telangana', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('avneesh.kumardubey@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Avneesh', 'Kumar Dubey', '8448172686', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/1758', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '203' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8448172686', 'Gaur siddhartham Tower-B flat no 1609, siddharth vihar ghaziabad uttar Pradesh', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('hardik.kumawat@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Hardik', 'Kumawat', '9001023997', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BBA25/0199', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '203' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'BBA', 'Computer Science', 1, '9001023997', 'Near new Post office, Kuchaman City, Rajasthan', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('shouryaveer.bishnoi@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Shouryaveer', 'Bishnoi', '9828692129', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/1157', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '203' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9828692129', '1/355 housing board, Jawahar Nagar ,Sri Ganganagar', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('arunil.jain@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Arunil', 'Jain', '8890301492', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2606', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '204' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8890301492', 'A-52,Rajdarbar City,Bijainagar', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('udit.mishra@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Udit', 'Mishra', '9509908119', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/1882', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '204' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9509908119', 'T364,B16,Ashiana Town, Bhiwadi, Rajasthan, 301019', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('shabd.srivastava@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Shabd', 'Srivastava', '7011114613', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/1893', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '204' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '7011114613', 'C-3/274, Janakpuri', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('akshat.murarka@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Akshat', 'Murarka', '9153498719', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2461', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '205' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9153498719', 'Patna', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('bhukya.srikanthnayak@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Bhukya', 'Srikanth Nayak', '7675094480', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/1869', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '205' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '7675094480', '8-8-45/c, Dilkushnagar,Chintal, Hyderabad', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('tanishq.daiya@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Tanishq', 'Daiya', '7611964099', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2387', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '205' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '7611964099', '115-116 RAVINDRA NAGAR - A, AIRPORT ROAD, JAGATPURA', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('bhavya.jain@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Bhavya', 'Jain', '9672750183', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/0284', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '206' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9672750183', 'Kumhar Mohalla , Ward N-13 , Bijainagar , rajasthan -305624', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('chandan.pritsingh@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Chandan', 'Prit Singh', '8003055834', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/0259', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '206' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8003055834', 'Paota - 303106', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('kanishk.gupta@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Kanishk', 'Gupta', '8233018941', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/0345', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '206' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8233018941', 'F-1 , 158, Dhaka nagar , Sirsi road , opp. Upasna building, Jaipur', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('pradhuman.thanvi@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Pradhuman', 'Thanvi', '6375455266', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/1113', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '207' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '6375455266', 'Laxmipura, Phalodi', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('srinivasa.sangeethaddepalli@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Srinivasa', 'Sangeeth Addepalli', '8977868159', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/0022', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '207' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8977868159', '8-3-658/3, neni's nest , jayaprakash nagar Hyderabad 73', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('yashwanth.chandaka@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Yashwanth', 'Chandaka', '', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/1095', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '207' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('tanmay.sharma@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Tanmay', 'Sharma', '6367830722', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BBA25/0181', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '208' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'BBA', 'Computer Science', 1, '6367830722', 'H no 173 sangam vihar bundi road', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('yashwardhan.khatri@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Yashwardhan', 'Khatri', '8000437511', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/0407', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '208' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8000437511', 'Ward no. 10 near sanghi das ji ki haveli, sumer pura, phalodi', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('yatharth.chaturvedi@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Yatharth', 'Chaturvedi', '8529958544', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BBA25/0197', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '208' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'BBA', 'Computer Science', 1, '8529958544', '80 PRATAP NAGAR DADABARI KOTA', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('karan.nishad@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Karan', 'Nishad', '9198721362', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BBA25/0063', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '209' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'BBA', 'Computer Science', 1, '9198721362', 'Kushinagar, uttar pardesh', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('rampe.varun@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Rampe', 'Varun', '6300045447', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/1673', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '209' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '6300045447', 'Hyderabad', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('uduthala.ashwit@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Uduthala', 'Ashwit', '9347487107', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/1598', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '209' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9347487107', 'Rajanna bhavi Hyderabad Telangana', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('konda.trigun@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Konda', 'Trigun', '9063042223', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2589', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '210' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9063042223', 'Amalapuram', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('duppalapudi.hruday@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Duppalapudi', 'Hruday', '9491975608', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/0954', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '210' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9491975608', 'D.no:-3-158, vepagunta, Visakhapatnam, Andhra Pradesh', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('kolluri.jeshwanth@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Kolluri', 'Jeshwanth', '7093467925', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2062', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '210' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '7093467925', 'H.No:175/1,Jamalpuram, parvathagiri, warangal (506365),Telangana', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('sahil@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Sahil', '', '9053480115', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2626', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '211' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9053480115', 'Rajpura ateli mandi m/garh haryana 123021', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('naveen.tholiya@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Naveen', 'Tholiya', '', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2291', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '211' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('deepak@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Deepak', '', '8854904497', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2544', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '211' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8854904497', 'Raniwara', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('pendota.daiwik@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Pendota', 'Daiwik', '9849860859', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/0989', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '212' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9849860859', '4-7-15/84/1 New Raghavendra Nagar, Nacharam, Hyderabad', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('vanikuppala.dinesh@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Vanikuppala', 'Dinesh', '8341912025', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/0560', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '212' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8341912025', 'Manikeshwari nagar,ou campus,hydtelangana', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('a.tarundeep@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'A.', 'Tarundeep', '7675074126', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/1977', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '212' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '7675074126', '23-3-558,sulthan shahi near moghalpura police stations,hyderabad', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('aman.kumawat@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Aman', 'Kumawat', '9509120066', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2225', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '213' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9509120066', 'Bad ki dhani,kachroda, phulera, jaipur ,rajasthan', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('manan.pancholi@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Manan', 'pancholi', '7300165971', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BBA25/0133', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '213' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'BBA', 'Computer Science', 1, '7300165971', '81 suncity kankroli Rajsamand Rajasthan', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('chirag.data@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Chirag', 'Data', '6367739953', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2535', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '213' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '6367739953', 'Cinema road,ward no.9 khairthal (Alwar)', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('shiva.ch@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Shiva', 'Ch', '6303766034', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/1563', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '214' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '6303766034', 'Karimnagar, telangana', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('k.abhayranjithreddy@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'K.', 'Abhay Ranjith Reddy', '6303766034', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/1422', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '214' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '6303766034', 'Karimnagar, telangana', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('janapaati.rohit@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Janapaati', 'Rohit', '8309571278', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/1154', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '214' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8309571278', 'MRO OFFICE ROAD NEAR DIVYARAMAM VEMPALLI', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('arpulu.saisiddartha@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Arpulu', 'Saisiddartha', '', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2115', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '215' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '', 'Wanaparthy telangana', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('boggarapu.luthergraham@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Boggarapu', 'Luthergraham', '6309334175', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2229', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '215' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '6309334175', 'Nandyal', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('siva.prasadpenneti@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Siva', 'Prasadpenneti', '8639218840', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/1318', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '215' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8639218840', 'Rajamundry park Street', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('daksh.vashistha@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Daksh', 'Vashistha', '8306693215', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2914', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '216' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8306693215', 'Lachhmangarh, Sikar', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('shashank.sangwan@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Shashank', 'Sangwan', '958883901', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/3014', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '216' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '958883901', 'Vidhya vihar ward no 17 pilani', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('jayesh.agarwal@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Jayesh', 'Agarwal', '9251077811', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2795', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '216' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9251077811', 'Salasar bus stand sikar', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('arham.bothra@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Arham', 'Bothra', '9079933040', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BBA25/0282', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '301' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'BBA', 'Computer Science', 1, '9079933040', 'Ward no 29 addsar bass Shri dungharghar', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('bhavy.raj@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Bhavy', 'Raj', '7300076056', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BBA25/0336', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '301' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'BBA', 'Computer Science', 1, '7300076056', 'krishna complex, E 21, Trident Rd, Haridas Ji Ki Magri, Shavri Colony, Udaipur, Rajasthan 313001', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('naman.mahlawat@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Naman', 'Mahlawat', '8114413997', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/1665', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '301' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8114413997', '280 Scheme 3', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('anuj.swarnkar@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Anuj', 'Swarnkar', '7568776359', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BBA25/0357', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '302' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'BBA', 'Computer Science', 1, '7568776359', 'Sunaro ka mohallah , bade mandir ke pass , barliyas , Bhilwara', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('arnav.rawat@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Arnav', 'Rawat', '9682601220', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/1908', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '302' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9682601220', 'c4h 156C janak puri new delhi', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('mallareddi.charan@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Mallareddi', 'Charan', '9692912166', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BBA25/0286', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '302' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'BBA', 'Computer Science', 1, '9692912166', 'Sec-A Q.No-288 Bondamunda', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('a.varunteja@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'A.', 'Varun Teja', '9573857352', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/0580', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '303' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9573857352', 'HYDERABAD, TELAGANA', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('baratam.sankarnarayana@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Baratam', 'Sankar Narayana', '9603419007', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/0988', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '303' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9603419007', 'Srikakulam Andhra Pradesh', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('gottimukkala.vishwaroopachary@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Gottimukkala', 'Vishwaroopa Chary', '9849676054', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/1066', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '303' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9849676054', 'Nalgonda, telangana', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('aditya.chaudhary@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Aditya', 'Chaudhary', '9596524810', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/1777', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '304' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9596524810', 'Upper shiva nagar, ward no. 16, kathua, jammu and kashmir', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('aditya.saxena@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Aditya', 'Saxena', '9685325591', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2293', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '304' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9685325591', 'Cmig 103 ayodhya extension bhopal', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('prabhav.goyal@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Prabhav', 'Goyal', '9971105431', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/1776', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '304' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9971105431', '5D, 327, Tower Apartment, 9D block Pritampura, Delhi', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('eishit.gupta@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Eishit', 'Gupta', '7292013525', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2474', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '305' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '7292013525', 'Kedar apartment sector-9 Rohini Delhi-110085', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('ishan.sharma@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Ishan', 'Sharma', '7851897206', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2474', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '305' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '7851897206', 'D-30 Jawahar nagar Bharatpur', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('mradul.saxena@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Mradul', 'Saxena', '8767289743', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2713', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '305' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8767289743', '303, A block, Mudra Elegance, Parda Rd, Atladara, West Vadodara, Vadodara, Gujarat', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('divit.chaturvedi@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Divit', 'Chaturvedi', '9602138785', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BBA25/0157', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '306' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'BBA', 'Computer Science', 1, '9602138785', 'A-302, shreenath estate,station road,kota', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('kunal.singhshekhawat@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Kunal', 'Singh Shekhawat', '9414174221', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BBA25/0105', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '306' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'BBA', 'Computer Science', 1, '9414174221', '51 shree ram nagar GA', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('ritik.sharma@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Ritik', 'Sharma', '8306936227', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2583', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '306' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8306936227', 'ritiksharma172006@gmail.com', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('ashutosh.gupta@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Ashutosh', 'Gupta', '9509619872', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2232', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '307' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9509619872', 'Nayabass alwar rajasthan', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('ishvit.bharadwaj@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Ishvit', 'Bharadwaj', '6375056015', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/0301', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '307' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '6375056015', '4,krishna colony, Ramnagar, Ajmer', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('tarun.kumarsaini@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Tarun', 'Kumar Saini', '8302833015', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2785', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '307' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8302833015', 'Balaji mandir ke pass Ganeshpur Nawalgarh', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('bhanupratap.singh@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Bhanupratap', 'Singh', '9256609205', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/0280', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '308' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9256609205', 'P27 om shiv villa near petals international school sumel road purani chungi agra road jaipur', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('mohammed.abdulzuhaib@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Mohammed', 'Abdul Zuhaib', '7337008129', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2333', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '308' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '7337008129', 'Maadhuri palace,opp shanti aasramam,lawsons bay colony,Pedda waltair', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('purushottam.kumarsingh@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Purushottam', 'Kumar Singh', '7007619284', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2764', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '308' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '7007619284', 'Bokaro, Jharkhand', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('priyanshu.singhshekhawat@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Priyanshu', 'Singh Shekhawat', '8529950424', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2991', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '309' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8529950424', 'P. No. 17 sanjay nagar niwaru road', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('prince.pincha@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Prince', 'Pincha', '6376437613', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/3046', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '309' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '6376437613', 'G-60/4 Shyam Vihar Colony, Shastri Nagar, Bhilwara', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('kaushal.malvi@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Kaushal', 'Malvi', '9644679988', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/0792', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '309' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9644679988', '15, Sudama Nagar Ext., Ramtekri, Mandsaur (M.P.) 458001', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('ajay.kumarajaythorati@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Ajay', 'Kumar Ajaythorati', '', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2383', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '310' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('bhanu.pratapsinghkhangarot@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Bhanu', 'Pratap Singh Khangarot', '9799850952', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2885', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '401' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9799850952', 'Pt.Fateh lal nagar , Madanganj- Kishangarh', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('bhavishya.kathpalia@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Bhavishya', 'Kathpalia', '7988868012', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BDES25/0446', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '401' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Des', 'Computer Science', 1, '7988868012', 'Hisar, Haryana', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('kunal.singh@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Kunal', 'Singh', '', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2768', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '401' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '', 'Krish city,Tapukra', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('ayush.kherada@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Ayush', 'Kherada', '', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/1725', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '402' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '', '1-J-8 old housing board, Shastri nagar, bhilwara.', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('naman.maheshwari@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Naman', 'Maheshwari', '', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2055', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '402' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '', '5G7, talwandi ,kota', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('shivam.kerwal@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Shivam', 'Kerwal', '', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2893', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '402' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '', '3-C-35 Mahaveer Nagar vistar yojana, kota', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('abhimanyu.singhkatiyar@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Abhimanyu', 'Singh Katiyar', '', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2312', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '403' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '', 'Shivpujan nagar, Near railway crossing Ahor road jalore', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('vibhor.vyas@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Vibhor', 'Vyas', '', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2872', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '403' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '', '21,janta colony, pali', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('chirayu.sharma@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'CHIRAYU', 'SHARMA', '', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2441', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '403' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '', 'FD-8/15 , VIDYASAGAR PALLY, JYANGRA, RAJARHAT, North 24 Parganas', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('chanchal.karanani@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Chanchal', 'Karanani', '', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2955', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '404' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '', 'Himmstar,nokha, Bikaner', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('arjun.giri@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Arjun', 'Giri', '', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BDES25/0429', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '404' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Des', 'Computer Science', 1, '', 'BM 15/2 New Vijay Enclave 3EME Center Bairagarh', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('anurag.singh@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Anurag', 'Singh', '9166863747', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BBA25/0395', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '404' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'BBA', 'Computer Science', 1, '9166863747', 'Ram nagar pl.no-40, BJS colony,jodhpur', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('kamalakar.abhisek@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Kamalakar', 'Abhisek', '7842915292', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/0714', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '405' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '7842915292', '5-69, Gangunta, Thukivakam, Renigunta, Chittor, Andhra Pradesh', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('m.jaiavivesh@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'M', 'Jai Avivesh', '', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/1865', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '405' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '', '3-24-1, Rajahmundry, Andhra Pradesh', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('k.govrdhanreddy@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'K.', 'Govrdhan Reddy', '8328070620', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2082', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '406' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8328070620', 'India, Andhra Pradesh,Kadapa dist,Kadapa,Badvel, Kapu street,516227', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('nandamuri.nagasaimanikantadhanush@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Nandamuri', 'Naga Sai manikanta dhanush', '', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/0765', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '406' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '', 'Vijayawada', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('pankaj.singhmahta@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Pankaj', 'singh Mahta', '', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BBA25/0372', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '407' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'BBA', 'Computer Science', 1, '', 'E 41 South ex part 1', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('atharv.mandal@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Atharv', 'Mandal', '', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2459', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '407' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '', '403,park veiw rajat city , balaji market , kota', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('raghav.sharma@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Raghav', 'Sharma', '', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2631', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '407' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '', 'udaipuriya chomu jaipur', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('jainam.jain@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Jainam', 'Jain', '', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2087', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '408' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '', 'Shubham The mall , Bhilwara road , near inani residency', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('sneh.toshniwal@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Sneh', 'Toshniwal', '', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2206', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '408' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '', 'Pani ki tanki ke samne balto ka Kheda', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('krish.gupta@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Krish', 'gupta', '', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2268', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '408' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '', 'Purani anaj mandi gangapur city', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('muriki.praneeth@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Muriki', 'Praneeth', '8179053216', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH199', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '501' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8179053216', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('devendra@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Devendra', '', '8003010663', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BBA017', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '501' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'BBA', 'Computer Science', 1, '8003010663', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('adesh.singh@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Adesh', 'Singh', '8081961884', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH208', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '501' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8081961884', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('vikash.saran@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Vikash', 'Saran', '', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BBA25/0398', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '502' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'BBA', 'Computer Science', 1, '', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('tarun.saran@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Tarun', 'Saran', '8905119974', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/3054', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '502' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8905119974', 'Sarano ka bas pal village jodhpur', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('yash.gill@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Yash', 'Gill', '9521734317', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2409', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '502' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9521734317', 'Gill on ki dha, ni lakh bhar, bhorki, jhunjhunu', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('achal.manojchoudhari@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Achal', 'Manoj Choudhari', '8830586152', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2804', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '503' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8830586152', 'Kismat complex saraf peth vita, Maharashtra', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('deepak.kumarnehrta@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Deepak', 'Kumar Nehrta', '7842655429', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/3009', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '503' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '7842655429', 'Katavaram,mahabubnagar, Hyderabad', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('arshey.rai@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Arshey', 'Rai', '', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2428', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '503' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '', '194A wazidpur north sadar jaunpur', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('vakamalla.sasidhar@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Vakamalla', 'Sasidhar', '', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2974', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '504' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '', '9-1-12 ,bavanarayana nagar,badvel,YSR kadapa,516227', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('mandava.rohitchowdary@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Mandava', 'Rohit Chowdary', '9963566067', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2300', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '504' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9963566067', '6-34Gorlamitta,SN Padu madal,prakasam district, Andrapradesh', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('bonthu.rajeshnaidu@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Bonthu', 'Rajeshnaidu', '9347194279', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/0808', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '504' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9347194279', '20-969/10,MVR police colony, yanamalakuduru, Vijayawada', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('kartiken.ranjan@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Kartiken', 'Ranjan', '8521634961', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/3030', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '505' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8521634961', 'Rahul Nagar road no.3, MIT, Muzaffarpur, bihar - 842003', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('tanish.jain@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Tanish', 'Jain', '9462679538', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2182', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '505' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9462679538', '66 Hira Bagh colony, Gali no 3, university road, udaipur', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('saransh.patidar@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Saransh', 'Patidar', '', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2476', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '505' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '', 'Ramgarh', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('nellori.revanthsai@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Nellori', 'Revanth Sai', '8500862614', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2801', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '506' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8500862614', 'Flat 508 Ashoka Avenue Ashok Nagar Kurnool', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('kurugodu.paalisaathvik@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Kurugodu', 'Paali Saathvik', '', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/0716', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '506' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '', 'Flat 508 Ashoka Avenue Ashok Nagar Kurnool 518005', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('paturi.thripurasatyasai@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Paturi', 'Thripura Satya Sai', '8639474645', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/1600', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '506' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8639474645', 'West godavari, andra pradesh', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('raavi.narendrachowdary@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Raavi', 'Narendra Chowdary', '', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/1978', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '507' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '', 'Timmasamudran Jaladanki mandal', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('kamboji.venkatasaisathwik@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Kamboji', 'Venkatasai Sathwik', '9492717940', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/0489', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '507' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9492717940', '15/118, pula bazaar, pathapeta, dhone', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('pandilla.rohithkrishna@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Pandilla', 'Rohithkrishna', '', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2737', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '507' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('pradeep.choudhary@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Pradeep', 'Choudhary', '9414409336', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH174', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '509' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9414409336', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('ashok.choudhary@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Ashok', 'Choudhary', '9785886071', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH173', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '509' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9785886071', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('nakul.gupta@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Nakul', 'Gupta', '6367716135', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH201', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '509' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '6367716135', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('aman.prakash@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Aman', 'Prakash', '7033676488', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH021', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '510' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '7033676488', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('sk.wasimalam@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'SK', 'Wasim Alam', '6203563955', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BDES030', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '510' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Des', 'Computer Science', 1, '6203563955', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('tejendra@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Tejendra', '', '0', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH184', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '510' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Computer Science', 1, '0', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('d.vskushalkumar@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'D', 'V S Kushal Kumar', '8820039944', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH163', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '511' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8820039944', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('shaik.farooqafrooz@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Shaik', 'Farooq Afrooz', '6300230521', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH105', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '511' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '6300230521', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('avula.shivashankar@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Avula', 'Shiva Shankar', '9177672381', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH250', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '511' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9177672381', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('raj.kamoi@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Raj', 'Kamoi', '8107254224', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH214', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '512' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8107254224', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('advet.gupta@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Advet', 'Gupta', '9179783789', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH042', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '512' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9179783789', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('ankit.kumar@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Ankit', 'Kumar', '6204201966', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH251', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '512' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '6204201966', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('vacant@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Vacant', '', '0', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '0', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '513' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Computer Science', 1, '0', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('deepanshu.singhsekhawat@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Deepanshu', 'Singh Sekhawat', '0', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH182', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '513' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Computer Science', 1, '0', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('bhawesh.chandnani@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Bhawesh', 'Chandnani', '7877775484', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH241', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '513' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '7877775484', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('garv.panwar@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Garv', 'Panwar', '7300295081', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BBA025', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '514' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'BBA', 'Computer Science', 1, '7300295081', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('jayesh.kumar@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Jayesh', 'Kumar', '6376522947', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH130', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '514' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '6376522947', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('yuvaraj.singhrathore@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Yuvaraj', 'Singh Rathore', '9680053904', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH152', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '514' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9680053904', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('mayank.shankarpathak@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Mayank', 'Shankar Pathak', '9131171030', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH064', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '515' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9131171030', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('saksham.saini@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Saksham', 'Saini', '6377334561', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH068', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '515' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '6377334561', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('pragyansh.mishra@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Pragyansh', 'Mishra', '7597291845', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH037', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '515' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '7597291845', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('dhananjay.sharma@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Dhananjay', 'Sharma', '7357904367', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH259', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '516' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '7357904367', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('sharma.lokesh@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Sharma', 'Lokesh', '9898230461', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH224', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '516' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9898230461', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('anuj.singhsekhwat@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Anuj', 'Singh Sekhwat', '7073831107', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH039', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '516' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '7073831107', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('ishit.agarwal@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Ishit', 'Agarwal', '9783590261', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH106', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '601' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9783590261', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('parv.sharma@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Parv', 'Sharma', '9116501747', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH086', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '601' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9116501747', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('priyank.sharma@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Priyank', 'Sharma', '6367145607', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH149', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '601' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '6367145607', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('aman.pratapsingh@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Aman', 'Pratap Singh', '9456608637', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH136', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '602' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9456608637', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('kartavya.garhwal@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Kartavya', 'Garhwal', '8233848184', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH079', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '602' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8233848184', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('harshvardhan.singhshekhawat@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Harshvardhan', 'singh Shekhawat', '7239866875', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH089', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '602' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '7239866875', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('bhavishy.garg@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Bhavishy', 'Garg', '7742810096', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH087', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '603' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '7742810096', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('devansh.pundir@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Devansh', 'pundir', '8439505770', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH024', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '603' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8439505770', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('yojit.lohar@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Yojit', 'Lohar', '8003383599', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH093', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '603' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8003383599', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('prashant.singh@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Prashant', 'singh', '8302840321', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH099', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '604' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8302840321', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('devam.gupta@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Devam', 'Gupta', '7340015201', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH014', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '604' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '7340015201', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('yash.mangal@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Yash', 'mangal', '8306755102', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BBA097', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '604' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'BBA', 'Computer Science', 1, '8306755102', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('rakshit.khandelwal@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Rakshit', 'Khandelwal', '7849999713', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BDES025', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '605' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Des', 'Computer Science', 1, '7849999713', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('parag.milindtonape@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Parag', 'milind tonape', '', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BDES019', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '605' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Computer Science', 1, '', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('ansh.paul@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Ansh', 'Paul', '9424446681', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BDES004', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '605' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Des', 'Computer Science', 1, '9424446681', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('zuber.khan@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Zuber', 'khan', '9549474606', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH050', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '606' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9549474606', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('budige.gurusatrath@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Budige', 'Guru Satrath', '9032422764', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH047', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '606' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9032422764', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('yash.mishra@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Yash', 'Mishra', '7007689708', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH057', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '606' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '7007689708', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('ayaan.mathur@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Ayaan', 'Mathur', '6378136157', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH063', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '607' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '6378136157', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('nikhilesh.singhpanwar@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Nikhilesh', 'Singh Panwar', '6377966199', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH006', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '607' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '6377966199', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('ashish.beniwal@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Ashish', 'Beniwal', '8696459416', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH112', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '607' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8696459416', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('keshav.maheswari@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Keshav', 'Maheswari', '7877227621', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH196', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '608' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '7877227621', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('ayush.sharma@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Ayush', 'Sharma', '8936860125', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH170', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '608' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8936860125', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('darshil.garg@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Darshil', 'Garg', '9376772392', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH189', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '608' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9376772392', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('roshan.jangir@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Roshan', 'jangir', '7877552810', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH147', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '609' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '7877552810', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('yug.jain@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Yug', 'jain', '9358210803', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH122', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '609' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9358210803', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('navdeep.shrishrimal@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Navdeep', 'Shrishrimal', '7568500730', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BBA056', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '609' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'BBA', 'Computer Science', 1, '7568500730', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('vansh.sharma@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Vansh', 'Sharma', '0', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH198', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '610' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Computer Science', 1, '0', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('sajal.kumarmishra@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Sajal', 'Kumar Mishra', '7000962912', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH113', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '610' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '7000962912', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('atharv.mehrotra@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Atharv', 'Mehrotra', '6387183983', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH248', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '610' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '6387183983', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('vacant@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Vacant', '', '0', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '0', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '611' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Computer Science', 1, '0', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('vacant@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Vacant', '', '0', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '0', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '611' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Computer Science', 1, '0', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('vacant@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Vacant', '', '0', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '0', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '611' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Computer Science', 1, '0', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('vaibhav.khandelwal@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Vaibhav', 'Khandelwal', '6367511127', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH110', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '612' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '6367511127', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('nikunj.katta@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Nikunj', 'Katta', '6375198706', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH167', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '612' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '6375198706', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('mohit.khurana@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Mohit', 'Khurana', '8905744728', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH155', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '612' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8905744728', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('harshit.mundra@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Harshit', 'Mundra', '8562088149', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH186', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '613' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8562088149', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('priyanshu.jain@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Priyanshu', 'Jain', '9256868293', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH179', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '613' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9256868293', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('lakshya.agarwal@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Lakshya', 'Agarwal', '8529592955', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH144', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '613' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8529592955', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('aditya.nayak@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Aditya', 'Nayak', '9116727168', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH032', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '614' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9116727168', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('aryan.gupta@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Aryan', 'Gupta', '8302958564', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH036', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '614' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8302958564', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('syed.faizalizaidi@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Syed', 'Faiz Ali Zaidi', '6350612878', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH255', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '614' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '6350612878', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('aryan.jain@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Aryan', 'Jain', '6377317903', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH129', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '615' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '6377317903', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('parth.lavit@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Parth', 'Lavit', '7340215561', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH212', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '615' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '7340215561', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('hardik.lavti@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Hardik', 'Lavti', '9216388389', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH213', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '615' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9216388389', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('lakshit.pareek@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Lakshit', 'Pareek', '9216333707', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH254', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '616' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9216333707', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('jayash.gahlot@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Jayash', 'Gahlot', '8306274199', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH245', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '616' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8306274199', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('ankit.joshi@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Ankit', 'Joshi', '9354116261', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH076', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '616' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9354116261', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('harshwardhan.singhdeora@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Harshwardhan', 'singh Deora', '8955769287', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BBA034', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '701' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'BBA', 'Computer Science', 1, '8955769287', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('anant.gupta@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Anant', 'Gupta', '8764880898', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BBA007', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '701' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'BBA', 'Computer Science', 1, '8764880898', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('tanmay.joshi@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Tanmay', 'joshi', '9024720510', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BBA089', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '701' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'BBA', 'Computer Science', 1, '9024720510', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('akshit.singhal@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Akshit', 'Singhal', '8890976061', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH115', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '702' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8890976061', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('devansh.srivastava@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Devansh', 'Srivastava', '7050260475', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH049', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '702' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '7050260475', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('bhanu.pratp@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Bhanu', 'Pratp', '9343794029', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BBA013', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '702' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'BBA', 'Computer Science', 1, '9343794029', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('vaibhav.sharma@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Vaibhav', 'Sharma', '9413240808', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH084', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '703' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9413240808', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('tanmay.shekhawat@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Tanmay', 'Shekhawat', '7627061003', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH181', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '703' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '7627061003', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('tejendra.singh@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Tejendra', 'Singh', '6377506786', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH184', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '703' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '6377506786', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('divyam.saini@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Divyam', 'Saini', '7014112565', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH048', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '704' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '7014112565', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('vacant@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Vacant', '', '0', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '0', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '704' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Computer Science', 1, '0', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('kartik.singh@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Kartik', 'Singh', '9997727827', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH148', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '704' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9997727827', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('rudra.spavanfanindram@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Rudra', 'S pavan Fanindra M', '9912207455', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024MDES002', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '705' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Computer Science', 1, '9912207455', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('mahesh.gehlot@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Mahesh', 'Gehlot', '9636340953', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BBA046', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '705' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'BBA', 'Computer Science', 1, '9636340953', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('anmol.anuragi@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Anmol', 'Anuragi', '6267625174', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BDES003', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '705' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Des', 'Computer Science', 1, '6267625174', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('mayank.gautam@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Mayank', 'Gautam', '8949349516', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH001', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '706' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8949349516', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('gourang.tak@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Gourang', 'Tak', '8058477540', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH090', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '706' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8058477540', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('arjun.singhtanwar@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Arjun', 'Singh Tanwar', '9166130402', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH018', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '706' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9166130402', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('aman.gupta@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Aman', 'Gupta', '8950739040', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH162', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '707' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8950739040', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('adityavarvardan.singhchouhan@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Adityavarvardan', 'singh chouhan', '8955738808', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH118', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '707' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8955738808', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('krishna.agarwal@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Krishna', 'Agarwal', '8279263509', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH252', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '707' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8279263509', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('aditya.somani@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Aditya', 'Somani', '8233116585', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH262', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '708' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8233116585', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('aryan.chaturvedi@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Aryan', 'Chaturvedi', '9368644137', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH265', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '708' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9368644137', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('kartik.phulwari@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Kartik', 'Phulwari', '7877080919', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH275', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '708' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '7877080919', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('vacant@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Vacant', '', '0', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '0', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '709' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Computer Science', 1, '0', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('vacant@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Vacant', '', '0', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '0', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '709' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Computer Science', 1, '0', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('vacant@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Vacant', '', '0', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '0', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '709' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Computer Science', 1, '0', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('harsh.bindal@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Harsh', 'Bindal', '7597713625', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH223', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '710' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '7597713625', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('madhav.garg@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Madhav', 'garg', '7017198900', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH025', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '710' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '7017198900', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('mayank.soni@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Mayank', 'Soni', '9799901191', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH044', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '710' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9799901191', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('satvik.agarwal@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Satvik', 'Agarwal', '8272031402', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH190', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '711' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8272031402', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('kartik.sharma@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Kartik', 'Sharma', '8769329369', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH092', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '711' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8769329369', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('rahul.verma@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Rahul', 'Verma', '0', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BBA068', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '711' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Computer Science', 1, '0', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('shivam.lakshkar@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Shivam', 'Lakshkar', '9929935561', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BBA080', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '712' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'BBA', 'Computer Science', 1, '9929935561', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('ayush.sharma@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Ayush', 'Sharma', '', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH085', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '712' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Computer Science', 1, '', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('rohit.kumar@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Rohit', 'kumar', '7878898535', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH060', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '712' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '7878898535', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('udit.yadav@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Udit', 'Yadav', '8607143505', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH228', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '713' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8607143505', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('naman.goyal@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Naman', 'Goyal', '6377992203', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH172', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '713' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '6377992203', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('vivaan.mishra@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Vivaan', 'Mishra', '9336785425', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH226', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '713' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9336785425', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('lokesh.dhariwal@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Lokesh', 'Dhariwal', '6371599630', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BBA045', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '714' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'BBA', 'Computer Science', 1, '6371599630', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('ansh.gupta@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Ansh', 'Gupta', '9166083618', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH095', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '714' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9166083618', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('garv.sharma@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Garv', 'Sharma', '7852865011', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH029', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '714' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '7852865011', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('mehul.maheshwari@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Mehul', 'Maheshwari', '7976901518', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH071', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '715' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '7976901518', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('keshav.bilwal@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Keshav', 'Bilwal', '8233008805', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH232', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '715' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8233008805', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('kashar.dagdi@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Kashar', 'Dagdi', '9829030999', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH244', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '715' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9829030999', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('tawab@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Tawab', '', '7300003990', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH273', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '716' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '7300003990', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('arjun.rajaram@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Arjun', 'Rajaram', '9310480690', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH131', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '716' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9310480690', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('parikshit.jangid@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Parikshit', 'Jangid', '9887650405', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '2024BTECH026', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '716' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9887650405', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('vidhaan.pshah@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Vidhaan', 'Pshah', '7357252112', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2911', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '801' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '7357252112', '1169-a Rani sati nagar , nirman Naga , jaipur', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('ravi.teja@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Ravi', 'Teja', '7416090030', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2710', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '802' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '7416090030', '19-4-299 ashok nagar , Godavarikhani, Ramagundam', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('mangu.nihas@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Mangu', 'Nihas', '8008659769', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '8/4/2025', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '802' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8008659769', 'Nirmal,Gayatri township', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('k.akshenderrddy@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'K.', 'Akshenderrddy', '', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2131', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '802' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('dhru.kumar@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Dhru', 'Kumar', '', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2423', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '803' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '', '', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('mohammed.ozairshah@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Mohammed', 'Ozair Shah', '8829852070', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2875', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '803' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8829852070', 'Nai chowki Road, Behind ganesh temple, Rajnagar, Rajsamand', TRUE;

INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('chirag.negi@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Chirag', 'Negi', '9829633388', TRUE);
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/2654', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '803' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '9829633388', 'Plot.no5,6 ,Murlipura, jaipur', TRUE;

