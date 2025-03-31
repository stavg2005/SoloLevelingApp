// server/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const userRoutes = require('./routes/userRoutes');
const dungeonRoutes = require('./routes/dungeonRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/dungeons', dungeonRoutes);

app.get('/api/hello', (req, res) => {
  res.json({message: 'Hello from SoloLeveling Server!'});
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
