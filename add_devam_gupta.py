#!/usr/bin/env python3
"""
Add Devam Gupta to the database via API call
"""

import requests
import json

def add_devam_gupta():
    """Add Devam Gupta via API call"""
    try:
        # Railway backend URL
        backend_url = "https://postgres-production-49c0.up.railway.app"
        
        # First, get a token by logging in
        login_data = {
            "email": "bhuwanesh@jklu.edu.in",
            "password": "123"
        }
        
        print("🔐 Logging in to get authentication token...")
        login_response = requests.post(f"{backend_url}/auth/mock-login", json=login_data)
        
        if login_response.status_code != 200:
            print(f"❌ Login failed: {login_response.text}")
            return False
        
        login_result = login_response.json()
        token = login_result.get('token')
        
        if not token:
            print("❌ No token received from login")
            return False
        
        print("✅ Login successful, token received")
        
        # Now call the add-devam-gupta endpoint
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        print("📝 Adding Devam Gupta to database...")
        add_response = requests.post(f"{backend_url}/admin/add-devam-gupta", headers=headers)
        
        if add_response.status_code == 200:
            result = add_response.json()
            print("✅ Devam Gupta added successfully!")
            print(f"📋 Student Details:")
            print(f"   Name: {result['student']['name']}")
            print(f"   Roll No: {result['student']['roll_no']}")
            print(f"   Room: {result['student']['room_no']}")
            print(f"   Hostel: {result['student']['hostel']}")
            print(f"   Year: {result['student']['year']}")
            print(f"   Course: {result['student']['course']}")
            print(f"   Branch: {result['student']['branch']}")
            print(f"   Mobile: {result['student']['mobile']}")
            print(f"   Email: {result['student']['email']}")
            return True
        else:
            print(f"❌ Failed to add Devam Gupta: {add_response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("🎯 Adding Devam Gupta to Railway PostgreSQL database via API...")
    print("📊 Details: BH-2, Room 604, AC, 3 Seater, 2nd year")
    print("📱 Mobile: 7340015201, Roll: 2024BTech014")
    print()
    
    success = add_devam_gupta()
    if success:
        print("\n🎉 Devam Gupta successfully added to database!")
        print("🔄 The students list should now show Devam Gupta's details.")
    else:
        print("\n💥 Failed to add Devam Gupta to database.")
