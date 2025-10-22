const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testAvailableModels() {
  console.log('🔍 Testing common Gemini model names...\n');
  
  const commonModels = [
    'gemini-pro',
    'gemini-1.5-pro',
    'gemini-1.5-flash',
    'gemini-1.0-pro',
    'gemini-1.5-pro-latest',
    'gemini-1.5-flash-latest',
    'gemini-1.5-flash-001',
    'gemini-1.5-pro-001',
    'gemini-pro-vision',
    'text-bison-001'
  ];
  
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  let workingModel = null;
  
  for (const modelName of commonModels) {
    try {
      console.log(`🧪 Testing ${modelName}...`);
      
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        generationConfig: { 
          temperature: 0.7,
          maxOutputTokens: 100,
        }
      });
      
      const result = await model.generateContent('Hello! Please respond with just "Test successful" to confirm this model works.');
      const response = await result.response;
      const text = response.text();
      
      console.log(`✅ ${modelName} WORKS!`);
      console.log(`📝 Response: ${text.trim()}`);
      console.log(`🎯 SUCCESS: Use "${modelName}" in your aiController.js\n`);
      
      if (!workingModel) {
        workingModel = modelName;
      }
      
    } catch (testError) {
      const status = testError.status || 'Unknown';
      const message = testError.message || testError.toString();
      console.log(`❌ ${modelName} failed: [${status}] ${message.split('\n')[0]}\n`);
    }
  }
  
  if (workingModel) {
    console.log(`🎉 RECOMMENDATION: Use "${workingModel}" as your model name`);
    console.log(`📋 Update your aiController.js to use: model: "${workingModel}"`);
  } else {
    console.log('😞 No working models found. Please check:');
    console.log('   1. Your API key is valid and active');
    console.log('   2. You have billing enabled on your Google Cloud project');
    console.log('   3. The Generative AI API is enabled');
  }
}

testAvailableModels().catch(console.error);