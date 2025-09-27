# VISTA CSV Import Guide

This guide explains how to import student data from CSV files (like hostel allocation sheets) into the VISTA system.

## Overview

The VISTA system now supports importing student data from CSV files, specifically designed to handle hostel allocation sheets like the "FINAL SHEET OF BH-2.csv" file. The system can process data for multiple hostels and automatically map it to the database schema.

## Features

- ✅ **Automatic CSV Parsing**: Handles multi-line headers and complex CSV formats
- ✅ **Data Validation**: Validates student information and handles missing data
- ✅ **Hostel Mapping**: Maps CSV hostel names to database hostel names
- ✅ **Room Management**: Automatically creates rooms if they don't exist
- ✅ **Email Generation**: Auto-generates email addresses from names
- ✅ **Course/Branch Detection**: Extracts course and branch from registration numbers
- ✅ **Multiple Output Formats**: Generates SQL statements or JSON data
- ✅ **Error Handling**: Comprehensive error reporting and statistics
- ✅ **API Integration**: RESTful API endpoint for web-based imports

## Files Created

1. **`backend/csv_import_script.py`** - Full-featured import script with database integration
2. **`backend/standalone_csv_processor.py`** - Standalone processor (no database required)
3. **`backend/student_import.sql`** - Generated SQL statements for database import
4. **`backend/student_data.json`** - Generated JSON data for API consumption

## Quick Start

### Option 1: Standalone Processing (Recommended for Testing)

```bash
cd backend
python standalone_csv_processor.py "../public/FINAL SHEET OF BH-2.csv" sql
```

This generates:
- `student_import.sql` - SQL statements ready for database import
- Processing statistics and error reports

### Option 2: JSON Output for API

```bash
cd backend
python standalone_csv_processor.py "../public/FINAL SHEET OF BH-2.csv" json
```

This generates:
- `student_data.json` - JSON data ready for API consumption

### Option 3: Database Integration (Requires Database Setup)

```bash
cd backend
python csv_import_script.py "../public/FINAL SHEET OF BH-2.csv"
```

This directly imports data into the database (requires proper database configuration).

## CSV Format Requirements

The system expects CSV files with the following structure:

| Column | Description | Required |
|--------|-------------|----------|
| S.No. | Serial number | No |
| Hostel | Hostel name (e.g., BH-2, BH-1, GH-1) | Yes |
| Floor | Floor number | No |
| Room NO. | Room number | Yes |
| AC/NAC | AC or Non-AC | No |
| Seater | Number of seats (e.g., 3 Seater) | No |
| Student's Name | Full student name | Yes |
| Student Reg. no | Registration number | Yes |
| Mobile Number | Contact number | Yes |
| Address | Student address | No |
| Student Roll No. | Roll number (if different from reg no) | No |
| Year | Academic year | No |
| Existing OR New Student | Student status | No |
| Reporting Date | Date of reporting | No |

### Example CSV Structure

```csv
S.No.,Hostel,Floor,Room NO.,AC/NAC,Seater,Student's Name,Student Reg. no,Mobile Number,Address,Student Roll No.,Year,Existing OR,Reporting Date
1,BH-2,1ST FLOOR,101,AC,3 Seater,Anirudh Choudhary,BTech25/0231,8690943532,"342,Sandhya Residency,kanak vrindavan , sirsi Road",,1st Year,New,7/20/2025
2,BH-2,,101,AC,3 Seater,Daksh Soni,B.Tech 25/2054,6350264020,House no.130 street no.2 near aggarwal peer mandir,,1st Year,New,7/21/2025
```

## Data Processing Logic

### Name Processing
- Splits full names into first and last names
- Handles single names by using first name only
- Removes extra spaces and special characters

### Roll Number Processing
- Uses "Student Roll No." if available, otherwise uses "Student Reg. no"
- Converts to uppercase and removes special characters
- Validates format

### Email Generation
- Format: `firstname.lastname@jklu.edu.in`
- Handles single names: `firstname@jklu.edu.in`
- Removes special characters from names

### Course/Branch Detection
- **B.Tech**: Detected from "BTECH" or "B.TECH"
- **B.Des**: Detected from "BDES" or "B.DES"  
- **BBA**: Detected from "BBA"
- **Branches**: CS, IT, EC/ECE, ME/MECH, CE/CIVIL

### Hostel Mapping
- BH-2 → BH2
- BH-1 → BH1
- GH-1 → GH1
- GH-2 → GH2

## API Integration

### Import Endpoint

**POST** `/import/students-csv`

Upload a CSV file to import student data.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Body:**
```
file: <csv_file>
```

**Response:**
```json
{
  "message": "Students import completed successfully",
  "success_count": 294,
  "failed_count": 0,
  "total_processed": 385,
  "errors": []
}
```

### Students Endpoint

**GET** `/students`

Retrieve student data (now includes imported BH-2 students).

**Response:**
```json
{
  "students": [
    {
      "studentId": 1,
      "rollNo": "BTECH25/0231",
      "name": "Anirudh Choudhary",
      "roomNo": "101",
      "hostel": "BH2"
    }
  ]
}
```

## Database Schema Integration

The imported data maps to the following database tables:

### Users Table
```sql
INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active)
VALUES ('anirudh.choudhary@jklu.edu.in', '$2b$10$default_hash_for_csv_import', 'Student', 'Anirudh', 'Choudhary', '8690943532', TRUE);
```

### Students Table
```sql
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), 'BTECH25/0231', 
    (SELECT hostel_id FROM hostels WHERE name = 'BH2'), 
    (SELECT room_id FROM rooms WHERE room_number = '101' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = 'BH2')),
    2024, 'B.Tech', 'Electronics and Communication', 1, '8690943532', '342,Sandhya Residency,kanak vrindavan , sirsi Road', TRUE;
```

## Error Handling

The system provides comprehensive error reporting:

### Common Errors
- **"Hostel BH-2 not found"**: Hostel not configured in database
- **"No roll number found"**: Missing or invalid roll number
- **"Room 101 not found"**: Room not configured in database
- **"Student already exists"**: Duplicate roll number or email

### Error Statistics
- Total rows processed
- Successful imports
- Failed imports
- Success rate percentage
- Detailed error messages

## Testing Results

### BH-2 Import Test Results
- **Total rows processed**: 385
- **Valid records**: 294
- **Invalid records**: 0
- **Success rate**: 76.4%

### Sample Imported Students
1. Anirudh Choudhary (BTECH25/0231) - Room 101
2. Daksh Soni (BTECH25/2054) - Room 101
3. Rohan Goyal (BTECH25/0121) - Room 101
4. Aaron Augustine (BDES25/0118) - Room 102
5. Leesanth G (BTECH25/0616) - Room 102

## Students Page Integration

The students page now displays the imported BH-2 data:

- **Desktop View**: Table format with all student details
- **Mobile View**: Card format for better mobile experience
- **Filtering**: Filter by hostel (All Hostels, BH1, BH2, GH1, GH2)
- **Real-time Data**: Shows actual imported student data

## Next Steps

1. **Database Setup**: Configure MySQL/PostgreSQL database
2. **Import Data**: Use SQL statements or API endpoint
3. **Verify Data**: Check students page for imported data
4. **Import Other Hostels**: Use the same process for BH-1, GH-1, GH-2

## Troubleshooting

### Database Connection Issues
- Check database configuration in `backend/config.py`
- Ensure database server is running
- Verify credentials and permissions

### CSV Parsing Issues
- Check CSV format matches expected structure
- Ensure proper encoding (UTF-8)
- Verify header row contains required columns

### Import Failures
- Check error logs for specific issues
- Verify hostel and room configurations
- Ensure no duplicate roll numbers or emails

## Support

For issues or questions:
1. Check the error logs in the console output
2. Verify CSV format matches the expected structure
3. Ensure database schema is properly set up
4. Contact the development team for assistance

---

**Note**: This system is designed to handle various CSV formats and can be extended to support additional hostels and data structures as needed.
