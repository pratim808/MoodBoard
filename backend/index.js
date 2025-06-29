// MoodBoard-master/backend/index.js

const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');

const app = express();

// IMPORTANT: Render provides a persistent disk at this path.
// We will configure this in the Render dashboard.
const UPLOADS_DIR = '/var/data/uploads';

// Ensure the upload directory exists
if (!fs.existsSync(UPLOADS_DIR)){
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// CORS configuration for production
// We will set FRONTEND_URL in Render's environment variables
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  optionsSuccessStatus: 200 // For legacy browser support
};
app.use(cors(corsOptions));


// Middleware
app.use(express.json());
app.use(fileUpload());

// Serve the uploaded images statically
app.use('/uploads', express.static(UPLOADS_DIR));

let feed = [];

// API Endpoint to get the feed
app.get('/feed', (req, res) => {
  res.json(feed.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
});

// API Endpoint to create a new post
app.post('/post', (req, res) => {
  const { text } = req.body;
  let imagePath = null;

  if (req.files && req.files.image) {
    const imageFile = req.files.image;
    // Use a timestamp to create a unique filename
    const uniqueFilename = `${Date.now()}_${imageFile.name}`;
    const destinationPath = path.join(UPLOADS_DIR, uniqueFilename);
    
    imageFile.mv(destinationPath, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }
    });

    imagePath = `/uploads/${uniqueFilename}`;
  }

  const newEntry = {
    text,
    image: imagePath,
    timestamp: new Date().toISOString()
  };

  feed.push(newEntry);
  res.status(201).send(newEntry);
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Render provides the PORT environment variable
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});