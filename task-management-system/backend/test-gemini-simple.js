const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testModel() {
  try {
    console.log('Testing with gemini-1.5-flash-latest...');
    
    // Try the latest model name format
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const result = await model.generateContent('Hello, this is a test message.');
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Success! Model works.');
    console.log('Response:', text);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    console.log('\nTrying gemini-1.5-pro-latest...');
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
      const result = await model.generateContent('Hello, this is a test message.');
      const response = await result.response;
      const text = response.text();
      
      console.log('✅ Success! gemini-1.5-pro-latest works.');
      console.log('Response:', text);
      
    } catch (error2) {
      console.error('❌ gemini-1.5-pro-latest also failed:', error2.message);
      
      console.log('\nTrying text-bison...');
      try {
        const model = genAI.getGenerativeModel({ model: "text-bison" });
        const result = await model.generateContent('Hello, this is a test message.');
        const response = await result.response;
        const text = response.text();
        
        console.log('✅ Success! text-bison works.');
        console.log('Response:', text);
        
      } catch (error3) {
        console.error('❌ All models failed. Please check your API key and permissions.');
        console.log('\nPossible issues:');
        console.log('1. API key might not have access to Gemini models');
        console.log('2. API key might be expired or invalid');
        console.log('3. Need to enable Gemini API in Google Cloud Console');
        console.log('\nPlease visit: https://makersuite.google.com/app/apikey to check your key');
      }
    }
  }
}

testModel();