// Test Alpha Vantage API with provided key
const testApiKey = '7XAV4WFPA7VC6KY7';

async function testAlphaVantageAPI() {
  try {
    const response = await fetch(`https://www.alphavantage.co/query?function=NEWS_SENTIMENT&topics=financial_markets&apikey=${testApiKey}&limit=5`);
    const data = await response.json();
    
    console.log('API Response Status:', response.status);
    console.log('API Response Data:', JSON.stringify(data, null, 2));
    
    if (data.feed && data.feed.length > 0) {
      console.log('\n✅ SUCCESS: Alpha Vantage API working correctly!');
      console.log(`Found ${data.feed.length} news articles`);
      
      // Show first article
      const firstArticle = data.feed[0];
      console.log('\nFirst Article:');
      console.log('Title:', firstArticle.title);
      console.log('Summary:', firstArticle.summary);
      console.log('Source:', firstArticle.source);
      console.log('Published:', firstArticle.time_published);
      console.log('Sentiment Score:', firstArticle.overall_sentiment_score);
    } else if (data.Note) {
      console.log('\n⚠️ WARNING: API rate limit reached');
      console.log('Message:', data.Note);
    } else {
      console.log('\n❌ ERROR: Unexpected response format');
      console.log('Response:', data);
    }
  } catch (error) {
    console.error('\n❌ ERROR: Failed to fetch from Alpha Vantage');
    console.error('Error:', error.message);
  }
}

// Run the test
testAlphaVantageAPI();
