"""
Load Hostel Data into Database

This script loads the processed hostel data into the database.
"""
import os
import csv
from pathlib import Path
from urllib.parse import quote_plus
from datetime import datetime
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database configuration
DB_URI = os.getenv('DATABASE_URL')
if not DB_URI:
    db_type = os.getenv('DB_TYPE', 'sqlite').lower()
    if db_type == 'mysql':
        user = os.getenv('DB_USER', 'root')
        password = quote_plus(os.getenv('DB_PASSWORD', ''))
        host = os.getenv('DB_HOST', '127.0.0.1')
        port = os.getenv('DB_PORT', '3306')
        name = os.getenv('DB_NAME', 'vista')
        DB_URI = f"mysql+pymysql://{user}:{password}@{host}:{port}/{name}"
    elif db_type == 'postgresql':
        user = os.getenv('DB_USER', 'postgres')
        password = quote_plus(os.getenv('DB_PASSWORD', ''))
        host = os.getenv('DB_HOST', '127.0.0.1')
        port = os.getenv('DB_PORT', '5432')
        name = os.getenv('DB_NAME', 'vista')
        DB_URI = f"postgresql://{user}:{password}@{host}:{port}/{name}"
    else:
        DB_URI = 'sqlite:///vista.db'
engine = create_engine(DB_URI)
Session = sessionmaker(bind=engine)
session = Session()
SQL_DIALECT = engine.dialect.name

BASE_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = BASE_DIR / 'public' / 'processed_data'

def load_users():
    """Load users from CSV into database"""
    print("Loading users...")
    with (DATA_DIR / 'bh2_users.csv').open('r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Convert string boolean to Python boolean
            row['is_active'] = row['is_active'].lower() == 'true'
            
            stmt = _upsert_statement(
                "users",
                [
                    "id",
                    "email",
                    "password_hash",
                    "role",
                    "first_name",
                    "last_name",
                    "phone",
                    "is_active",
                    "created_at",
                ],
                [
                    "email",
                    "first_name",
                    "last_name",
                    "phone",
                    "is_active",
                ],
            )
            session.execute(stmt, row)
    session.commit()
    print("Users loaded successfully!")

def load_rooms():
    """Load rooms from CSV into database"""
    print("Loading rooms...")
    with (DATA_DIR / 'bh2_rooms.csv').open('r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Convert string values to appropriate types
            row['hostel_id'] = int(row['hostel_id'])
            row['capacity'] = int(row['capacity'])
            row['current_occupancy'] = int(row['current_occupancy'])
            row['is_active'] = row['is_active'].lower() == 'true'
            
            stmt = _upsert_statement(
                "rooms",
                [
                    "id",
                    "hostel_id",
                    "room_number",
                    "room_type",
                    "capacity",
                    "current_occupancy",
                    "is_active",
                    "created_at",
                ],
                [
                    "hostel_id",
                    "room_number",
                    "room_type",
                    "capacity",
                    "current_occupancy",
                    "is_active",
                ],
            )
            session.execute(stmt, row)
    session.commit()
    print("Rooms loaded successfully!")

def load_students():
    """Load students from CSV into database"""
    print("Loading students...")
    with (DATA_DIR / 'bh2_students.csv').open('r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Convert string values to appropriate types
            for field in ['id', 'user_id', 'hostel_id', 'room_id', 'semester', 'admission_year']:
                if row[field]:
                    row[field] = int(row[field])
                else:
                    row[field] = None
            
            row['is_active'] = row['is_active'].lower() == 'true'
            
            stmt = _upsert_statement(
                "students",
                [
                    "id",
                    "user_id",
                    "roll_number",
                    "hostel_id",
                    "room_id",
                    "course",
                    "branch",
                    "semester",
                    "admission_year",
                    "is_active",
                    "created_at",
                ],
                [
                    "roll_number",
                    "hostel_id",
                    "room_id",
                    "course",
                    "branch",
                    "semester",
                    "admission_year",
                    "is_active",
                ],
            )
            session.execute(stmt, row)
    session.commit()
    print("Students loaded successfully!")

def main():
    try:
        print("Starting data loading process...")
        load_hostel()
        load_users()
        load_rooms()
        load_students()
        print("All data loaded successfully!")
    except Exception as e:
        session.rollback()
        print(f"Error loading data: {str(e)}")
    finally:
        session.close()

def load_hostel():
    print("Loading hostels...")
    with (DATA_DIR / 'bh2_hostels.csv').open('r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            row['id'] = int(row['id'])
            row['total_rooms'] = int(row['total_rooms'])
            row['total_capacity'] = int(row['total_capacity'])
            row['is_active'] = row['is_active'].lower() == 'true'

            stmt = _upsert_statement(
                "hostels",
                [
                    "id",
                    "name",
                    "type",
                    "warden_name",
                    "warden_phone",
                    "total_rooms",
                    "total_capacity",
                    "address",
                    "is_active",
                    "created_at",
                ],
                [
                    "name",
                    "type",
                    "warden_name",
                    "warden_phone",
                    "total_rooms",
                    "total_capacity",
                    "address",
                    "is_active",
                ],
            )
            session.execute(stmt, row)
    session.commit()
    print("Hostels loaded successfully!")

def _upsert_statement(table: str, columns, update_columns):
    insert_cols = ", ".join(columns)
    value_cols = ", ".join(f":{col}" for col in columns)

    if SQL_DIALECT == "sqlite":
        update_clause = ",\n                    ".join(
            f"{col} = EXCLUDED.{col}" for col in update_columns
        )
        sql = f"""
                INSERT INTO {table} ({insert_cols})
                VALUES ({value_cols})
                ON CONFLICT (id) DO UPDATE SET
                    {update_clause}
        """
    elif SQL_DIALECT in {"mysql", "mariadb"}:
        update_clause = ",\n                    ".join(
            f"{col} = VALUES({col})" for col in update_columns
        )
        sql = f"""
                INSERT INTO {table} ({insert_cols})
                VALUES ({value_cols})
                ON DUPLICATE KEY UPDATE
                    {update_clause}
        """
    else:
        update_clause = ",\n                    ".join(
            f"{col} = EXCLUDED.{col}" for col in update_columns
        )
        sql = f"""
                INSERT INTO {table} ({insert_cols})
                VALUES ({value_cols})
                ON CONFLICT (id) DO UPDATE SET
                    {update_clause}
        """

    return text(sql)

if __name__ == "__main__":
    main()
