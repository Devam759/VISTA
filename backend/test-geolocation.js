// Quick test script to verify geolocation endpoint works
// Run: node test-geolocation.js

const testLocation = async () => {
  const testCoords = {
    latitude: 26.9136,
    longitude: 75.7858,
    accuracy: 220
  };

  try {
    const response = await fetch('http://localhost:5000/debug/geolocation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testCoords)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error:', response.status, errorText);
      return;
    }

    const data = await response.json();
    console.log('✅ Success!');
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('\n💡 Make sure:');
    console.log('   1. Backend server is running: cd backend && npm start');
    console.log('   2. Database is configured and running');
    console.log('   3. Campus polygon is seeded in database');
  }
};

// Test health endpoint first
const testHealth = async () => {
  try {
    const response = await fetch('http://localhost:5000/health');
    const data = await response.json();
    console.log('🏥 Health Check:', JSON.stringify(data, null, 2));
    return data.status === 'healthy';
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    return false;
  }
};

(async () => {
  console.log('Testing backend connection...\n');
  
  const healthy = await testHealth();
  console.log('');
  
  if (healthy) {
    await testLocation();
  } else {
    console.log('⚠️  Backend is not healthy. Fix issues before testing geolocation.');
  }
})();

