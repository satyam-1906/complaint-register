const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Paths
const frontendDir = path.resolve(__dirname, '..', 'frontend');
const uploadsDir = path.resolve(__dirname, 'uploads');

console.log('--- SERVER STARTUP ---');
console.log('Frontend Directory:', frontendDir);
console.log('Uploads Directory:', uploadsDir);

// Static Serving
app.use(express.static(frontendDir));
app.use('/uploads', express.static(uploadsDir));

// API
app.use('/api', apiRoutes);

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(frontendDir, 'index.html'));
});

// DB & Listen
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB Connected');
        app.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`);
        });
    })
    .catch(err => console.error('Database connection error:', err));
