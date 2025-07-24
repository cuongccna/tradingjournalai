// Test script to verify API connection
const testAPI = async () => {
  console.log('🧪 Testing API connection...');
  
  try {
    const response = await fetch('http://localhost:3002/api/trades', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Test successful!');
      console.log('Data received:', {
        success: data.success,
        dataLength: data.data?.length || 0,
        firstTrade: data.data?.[0]?.symbol || 'N/A'
      });
      return data;
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error('❌ API Test failed:', error);
    throw error;
  }
};

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testAPI };
}

// For browser
if (typeof window !== 'undefined') {
  window.testAPI = testAPI;
}

// Auto-run if in Node.js
if (typeof require !== 'undefined' && require.main === module) {
  testAPI().catch(console.error);
}
