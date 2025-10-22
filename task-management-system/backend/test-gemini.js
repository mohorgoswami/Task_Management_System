const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    console.log('Testing Gemini API connection...');
    console.log('API Key:', process.env.GEMINI_API_KEY ? 'Set' : 'Not Set');
    
    // Try to list available models
    const models = await genAI.listModels();
    
    console.log('\nAvailable models:');
    for (const model of models) {
      console.log(`- ${model.name} (${model.displayName})`);
      console.log(`  Supported methods: ${model.supportedGenerationMethods.join(', ')}`);
    }
    
  } catch (error) {
    console.error('Error listing models:', error);
    
    // Try with common model names
    const modelsToTry = [
      'gemini-pro',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'models/gemini-pro',
      'models/gemini-1.5-pro',
      'models/gemini-1.5-flash'
    ];
    
    console.log('\nTrying different model names:');
    
    for (const modelName of modelsToTry) {
      try {
        console.log(`Testing ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Hello, this is a test.');
        const response = await result.response;
        const text = response.text();
        console.log(`✅ ${modelName} works!`);
        console.log(`Response: ${text.substring(0, 100)}...`);
        break; // Stop at first working model
      } catch (err) {
        console.log(`❌ ${modelName} failed: ${err.message}`);
      }
    }
  }
}

listModels();