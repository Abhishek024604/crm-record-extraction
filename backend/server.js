require('dotenv').config();
const express = require('express');
const cors = require('cors');
const uploadRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/api', uploadRoutes);

// Health check route for Render deployment
app.get('/', (req, res) => {
  res.send('CRM Extraction Backend is running! The API endpoint is at /api/upload');
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
