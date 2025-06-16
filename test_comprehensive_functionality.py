
#!/usr/bin/env python3

import requests
import json
import time
import sys

def test_api_endpoints():
    """Test all critical API endpoints"""
    base_url = "http://localhost:3000"
    
    endpoints = [
        "/api/system-design-questions",
        "/api/system-design-frameworks", 
        "/api/companies",
        "/api/questions?questionType=behavioral",
        "/api/questions?questionType=system_design"
    ]
    
    print("Testing API endpoints...")
    
    for endpoint in endpoints:
        try:
            response = requests.get(f"{base_url}{endpoint}", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    count = len(data)
                elif isinstance(data, dict) and 'companies' in data:
                    count = len(data['companies'])
                else:
                    count = "N/A"
                print(f"✅ {endpoint} - Status: {response.status_code}, Count: {count}")
            else:
                print(f"❌ {endpoint} - Status: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ {endpoint} - Error: {e}")
            return False
    
    return True

def test_authentication():
    """Test authentication flow"""
    base_url = "http://localhost:3000"
    
    print("\nTesting authentication...")
    
    # Test valid login
    try:
        response = requests.post(f"{base_url}/api/auth/login", 
                               json={"username": "admin", "password": "adminadmin"},
                               timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get('message') == 'Login successful':
                print("✅ Valid login successful")
            else:
                print("❌ Valid login failed - unexpected response")
                return False
        else:
            print(f"❌ Valid login failed - Status: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Valid login failed - Error: {e}")
        return False
    
    # Test invalid login
    try:
        response = requests.post(f"{base_url}/api/auth/login", 
                               json={"username": "invalid", "password": "invalid"},
                               timeout=10)
        if response.status_code == 401:
            print("✅ Invalid login correctly rejected")
        else:
            print(f"❌ Invalid login not rejected - Status: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Invalid login test failed - Error: {e}")
        return False
    
    return True

def test_page_loads():
    """Test that all pages load without errors"""
    base_url = "http://localhost:3000"
    
    # Login first to get session
    session = requests.Session()
    login_response = session.post(f"{base_url}/api/auth/login", 
                                 json={"username": "admin", "password": "adminadmin"})
    
    if login_response.status_code != 200:
        print("❌ Could not login for page tests")
        return False
    
    pages = [
        "/dashboard",
        "/question-bank", 
        "/system-design-questions",
        "/story-templates",
        "/company-values",
        "/system-design-strategy",
        "/interview-strategy",
        "/progress-tracker",
        "/interview-notes",
        "/faq"
    ]
    
    print("\nTesting page loads...")
    
    for page in pages:
        try:
            response = session.get(f"{base_url}{page}", timeout=15)
            if response.status_code == 200:
                # Check for common error patterns
                content = response.text
                if "Cannot read properties of undefined" in content:
                    print(f"❌ {page} - Contains undefined property errors")
                    return False
                elif "Failed to fetch" in content:
                    print(f"❌ {page} - Contains fetch errors")
                    return False
                else:
                    print(f"✅ {page} - Loads successfully")
            else:
                print(f"❌ {page} - Status: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ {page} - Error: {e}")
            return False
    
    return True

def test_database_connectivity():
    """Test database operations"""
    base_url = "http://localhost:3000"
    
    print("\nTesting database connectivity...")
    
    # Test data retrieval from different tables
    tests = [
        ("Questions", "/api/questions?questionType=behavioral"),
        ("System Design Questions", "/api/system-design-questions"),
        ("Companies", "/api/companies"),
        ("Frameworks", "/api/system-design-frameworks")
    ]
    
    for test_name, endpoint in tests:
        try:
            response = requests.get(f"{base_url}{endpoint}", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    print(f"✅ {test_name} - {len(data)} records retrieved")
                elif isinstance(data, dict) and data.get('companies') and len(data['companies']) > 0:
                    print(f"✅ {test_name} - {len(data['companies'])} records retrieved")
                else:
                    print(f"❌ {test_name} - No data returned")
                    return False
            else:
                print(f"❌ {test_name} - Status: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ {test_name} - Error: {e}")
            return False
    
    return True

def check_documentation_files():
    """Check that documentation files were generated"""
    import os
    
    print("\nChecking documentation files...")
    
    required_files = [
        "behavioral-questions.md",
        "behavioral-questions.pdf", 
        "behavioral-questions-with-answers.md",
        "behavioral-questions-with-answers.pdf",
        "system-design-questions.md",
        "system-design-questions.pdf",
        "system-design-questions-with-answers.md", 
        "system-design-questions-with-answers.pdf",
        "company-values-and-strategies.md",
        "company-values-and-strategies.pdf"
    ]
    
    missing_files = []
    for file in required_files:
        if os.path.exists(file):
            size = os.path.getsize(file)
            print(f"✅ {file} - {size} bytes")
        else:
            print(f"❌ {file} - Missing")
            missing_files.append(file)
    
    return len(missing_files) == 0

def main():
    """Run comprehensive functionality tests"""
    print("🚀 Starting Comprehensive Functionality Tests\n")
    
    tests = [
        ("API Endpoints", test_api_endpoints),
        ("Authentication", test_authentication), 
        ("Database Connectivity", test_database_connectivity),
        ("Page Loads", test_page_loads),
        ("Documentation Files", check_documentation_files)
    ]
    
    results = {}
    
    for test_name, test_func in tests:
        print(f"\n{'='*50}")
        print(f"Running {test_name} Tests")
        print('='*50)
        
        try:
            result = test_func()
            results[test_name] = result
            if result:
                print(f"✅ {test_name} - PASSED")
            else:
                print(f"❌ {test_name} - FAILED")
        except Exception as e:
            print(f"❌ {test_name} - ERROR: {e}")
            results[test_name] = False
    
    # Summary
    print(f"\n{'='*50}")
    print("TEST SUMMARY")
    print('='*50)
    
    passed = sum(1 for result in results.values() if result)
    total = len(results)
    
    for test_name, result in results.items():
        status = "PASSED" if result else "FAILED"
        emoji = "✅" if result else "❌"
        print(f"{emoji} {test_name}: {status}")
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 ALL TESTS PASSED! The application is fully functional.")
        return 0
    else:
        print("⚠️  Some tests failed. Please review the issues above.")
        return 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
