const testAPI = async () => {
  try {
    console.log('🧪 Testing backend API...');
    
    // Test basic connection
    const response = await fetch('http://localhost:3002/api/trades', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('📡 Response status:', response.status);
    console.log('📡 Response ok:', response.ok);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Response:', data);
      console.log('📊 Data structure:', {
        success: data.success,
        dataType: Array.isArray(data.data) ? 'array' : typeof data.data,
        dataLength: data.data?.length || 'N/A'
      });
    } else {
      console.error('❌ API Error:', response.statusText);
    }
  } catch (error) {
    console.error('💥 Connection Error:', error.message);
  }
};

// Auto run test
testAPI();
