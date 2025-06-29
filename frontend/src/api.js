// MoodBoard-master/frontend/src/api.js

import axios from 'axios';

// This uses the VUE_APP_API_URL from your .env.production file when deployed.
// When you run it locally (`npm run serve`), it will fall back to localhost.
const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:3000',
});

export default apiClient;