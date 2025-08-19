# Chatbot Setup Instructions

## API Key Configuration

To use the chatbot functionality, you need to set up an API key from OpenRouter:

1. Go to [OpenRouter](https://openrouter.ai/keys) and create an API key
2. Copy the API key
3. Update the `app.json` file in your project root to include your API key in the `extra` section:

```json
{
  "expo": {
    // ... other configuration
    "extra": {
      "OPENROUTER_API_KEY": "your_actual_api_key_here"
    }
  }
}
```

4. Replace `your_actual_api_key_here` with your copied API key

## Common Issues

### 401 Unauthorized Error
This error occurs when:
- The API key is missing
- The API key is invalid
- The API key has been revoked

To fix this:
1. Verify that you have updated the `app.json` file with your API key in the `extra` section
2. Check that your API key is correctly copied into the file
3. Restart your development server after making changes to the `app.json` file

### Environment Variables Not Loading
In Expo/React Native, environment variables are handled differently than in Node.js applications. This project uses `expo-constants` to access configuration values from the `app.json` file.

Make sure:
1. Your API key is correctly placed in the `extra` section of `app.json`
2. You're importing `Constants` from `expo-constants` in your components
3. You're accessing the value using `Constants.expoConfig?.extra?.OPENROUTER_API_KEY`

## Model Information

The chatbot uses the DeepSeek Chat model through OpenRouter. For more information about this model and other available models, visit [OpenRouter Models](https://openrouter.ai/models).
