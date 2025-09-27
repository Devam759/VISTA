#!/usr/bin/env python3
"""
VISTA Database Setup Script
Creates database and tables, then imports BH-2 student data
"""

import mysql.connector
from mysql.connector import Error
import os
import sys
from datetime import datetime

class DatabaseSetup:
    """Database setup and data import utility"""
    
    def __init__(self):
        self.host = 'localhost'
        self.user = 'root'
        self.password = ''  # No password for local MySQL
        self.database = 'vista_attendance'
        
    def create_connection(self, database_name=None):
        """Create database connection"""
        try:
            connection = mysql.connector.connect(
                host=self.host,
                user=self.user,
                password=self.password,
                database=database_name
            )
            return connection
        except Error as e:
            print(f"Error connecting to MySQL: {e}")
            return None
    
    def create_database(self):
        """Create database if it doesn't exist"""
        connection = self.create_connection()
        if connection is None:
            return False
        
        try:
            cursor = connection.cursor()
            
            # Create database
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS {self.database}")
            print(f"Database '{self.database}' created successfully or already exists")
            
            # Use the database
            cursor.execute(f"USE {self.database}")
            
            cursor.close()
            connection.close()
            return True
            
        except Error as e:
            print(f"Error creating database: {e}")
            return False
    
    def create_tables(self):
        """Create database tables"""
        connection = self.create_connection(self.database)
        if connection is None:
            return False
        
        try:
            cursor = connection.cursor()
            
            # Read and execute schema
            schema_file = '../database/vista_schema.sql'
            if os.path.exists(schema_file):
                with open(schema_file, 'r', encoding='utf-8') as file:
                    schema_sql = file.read()
                
                # Split by semicolon and execute each statement
                statements = [stmt.strip() for stmt in schema_sql.split(';') if stmt.strip()]
                
                for statement in statements:
                    if statement and not statement.startswith('--'):
                        try:
                            cursor.execute(statement)
                        except Error as e:
                            if 'already exists' not in str(e).lower():
                                print(f"Warning: {e}")
            
            connection.commit()
            cursor.close()
            connection.close()
            
            print("Database tables created successfully")
            return True
            
        except Error as e:
            print(f"Error creating tables: {e}")
            return False
    
    def import_bh2_data(self):
        """Import BH-2 student data"""
        connection = self.create_connection(self.database)
        if connection is None:
            return False
        
        try:
            cursor = connection.cursor()
            
            # Read the generated SQL file
            sql_file = 'student_import.sql'
            if not os.path.exists(sql_file):
                print(f"SQL file {sql_file} not found. Please run the CSV processor first.")
                return False
            
            with open(sql_file, 'r', encoding='utf-8') as file:
                sql_content = file.read()
            
            # Split by semicolon and execute each statement
            statements = [stmt.strip() for stmt in sql_content.split(';') if stmt.strip() and not stmt.strip().startswith('--')]
            
            success_count = 0
            error_count = 0
            
            for statement in statements:
                try:
                    cursor.execute(statement)
                    success_count += 1
                except Error as e:
                    if 'duplicate entry' not in str(e).lower():
                        print(f"Error executing statement: {e}")
                        print(f"Statement: {statement[:100]}...")
                    error_count += 1
            
            connection.commit()
            cursor.close()
            connection.close()
            
            print(f"Data import completed: {success_count} successful, {error_count} errors")
            return True
            
        except Error as e:
            print(f"Error importing data: {e}")
            return False
    
    def setup_and_import(self):
        """Complete setup and import process"""
        print("Starting VISTA database setup...")
        print("=" * 50)
        
        # Step 1: Create database
        print("Step 1: Creating database...")
        if not self.create_database():
            print("Failed to create database. Exiting.")
            return False
        
        # Step 2: Create tables
        print("Step 2: Creating tables...")
        if not self.create_tables():
            print("Failed to create tables. Exiting.")
            return False
        
        # Step 3: Import BH-2 data
        print("Step 3: Importing BH-2 student data...")
        if not self.import_bh2_data():
            print("Failed to import data. Exiting.")
            return False
        
        print("=" * 50)
        print("Database setup and import completed successfully!")
        print(f"Database: {self.database}")
        print(f"Tables created with BH-2 student data imported")
        return True

def main():
    """Main function"""
    setup = DatabaseSetup()
    
    # Check if SQL file exists
    if not os.path.exists('student_import.sql'):
        print("SQL import file not found. Generating it first...")
        os.system('python standalone_csv_processor.py "../public/FINAL SHEET OF BH-2.csv" sql')
        print()
    
    success = setup.setup_and_import()
    
    if success:
        print("\n✅ Setup completed successfully!")
        print("You can now:")
        print("1. Start the backend server: python app.py")
        print("2. View students in the web interface")
        print("3. Import data for other hostels using the same process")
        sys.exit(0)
    else:
        print("\n❌ Setup failed!")
        print("Please check the error messages above and try again.")
        sys.exit(1)

if __name__ == "__main__":
    main()
