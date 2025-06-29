<!-- MoodBoard-master/frontend/src/App.vue -->

<template>
  <div style="max-width: 600px; margin: 20px auto; font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
    <h1 style="color: #333; text-align: center;">MoodBoard</h1>
    <MoodForm @posted="fetchFeed" />
    <h2 style="color: #555; margin-top: 20px;">Mood Feed</h2>
    <div v-for="entry in entries" :key="entry.timestamp" style="margin-bottom: 15px; padding: 10px; background-color: #fff; border-radius: 5px; border: 1px solid #ddd;">
      <p style="margin: 0; color: #444;">{{ entry.text }}</p>
      
      <!-- CHANGE #1: Use the dynamic backendUrl for the image source -->
      <img v-if="entry.image" :src="`${backendUrl}${entry.image}`" alt="Mood image" style="max-width: 100%; height: auto; margin-top: 10px; border-radius: 5px;" />
      
      <!-- (Optional but good) Format the date to be more readable -->
      <small style="color: #777; display: block; margin-top: 5px;">{{ new Date(entry.timestamp).toLocaleString() }}</small>
    </div>
  </div>
</template>

<script>
import MoodForm from './components/MoodForm.vue';
// CHANGE #2: Import our new central API client instead of axios directly
import apiClient from './api';

export default {
  components: {
    MoodForm
  },
  data() {
    return {
      entries: [],
      // CHANGE #3: Add the backendUrl to our component's data
      // This allows the template to access it for image paths.
      backendUrl: process.env.VUE_APP_API_URL || 'http://localhost:3000'
    };
  },
  methods: {
    async fetchFeed() {
      try {
        // CHANGE #4: Use the apiClient to make the request
        const response = await apiClient.get('/feed');
        this.entries = response.data;
      } catch (error) {
        console.error('Error fetching feed:', error);
      }
    }
  },
  created() {
    this.fetchFeed();
  }
};
</script>