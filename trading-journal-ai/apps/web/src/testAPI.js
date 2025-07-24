import { api } from './lib/api';

async function testAPI() {
  try {
    console.log('🧪 Testing API connection...');
    const result = await api.trades.list();
    console.log('✅ API Test Result:', result);
    console.log('📊 Result type:', typeof result);
    console.log('📊 Is array:', Array.isArray(result));
    console.log('📊 Length:', result?.length);
  } catch (error) {
    console.error('❌ API Test Failed:', error);
  }
}

// Chạy test khi load page
if (typeof window !== 'undefined') {
  testAPI();
}

export default testAPI;
