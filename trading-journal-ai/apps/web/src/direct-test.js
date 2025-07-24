console.log('🧪 Direct API Test');

// Test với fetch trực tiếp
fetch('http://localhost:3002/api/trades')
  .then(response => {
    console.log('📡 Response status:', response.status);
    console.log('📡 Response ok:', response.ok);
    return response.json();
  })
  .then(data => {
    console.log('✅ Direct fetch success:', data);
  })
  .catch(error => {
    console.error('❌ Direct fetch error:', error);
  });

// Test health endpoint
fetch('http://localhost:3002/health')
  .then(response => response.json())
  .then(data => {
    console.log('✅ Health check:', data);
  })
  .catch(error => {
    console.error('❌ Health check error:', error);
  });

// Test với env variable
console.log('🔧 Environment check:', {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NODE_ENV: process.env.NODE_ENV
});
