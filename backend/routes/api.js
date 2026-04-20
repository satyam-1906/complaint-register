const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const router = express.Router();

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// Complaint Schema
const complaintSchema = new mongoose.Schema({
    author: String,
    name: String,
    email: String,
    mobileNo: String,
    complaint: String,
    photos: [String],
    videos: [String],
    upvotes: { type: Number, default: 0 },
    upvotedBy: [String],
    createdAt: { type: Date, default: Date.now }
});
const Complaint = mongoose.model('Complaint', complaintSchema);

// Auth Middleware
const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Login required' });
    jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid or expired token' });
        req.user = user;
        next();
    });
};

// Multer Storage
const uploadDir = path.join(__dirname, '../uploads/');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Routes

// Auth
router.post('/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error registering user', error: error.message });
    }
});

router.post('/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET || 'fallback_secret');
        res.json({ token, username: user.username });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

// Complaints
router.post('/complaints', authenticate, upload.fields([
    { name: 'photos', maxCount: 5 },
    { name: 'videos', maxCount: 2 }
]), async (req, res) => {
    try {
        const { name, email, mobileNo, complaint } = req.body;
        const author = req.user.username;
        
        // Save relative paths for the static server
        const photoPaths = req.files['photos'] ? req.files['photos'].map(f => `uploads/${path.basename(f.path)}`) : [];
        const videoPaths = req.files['videos'] ? req.files['videos'].map(f => `uploads/${path.basename(f.path)}`) : [];

        const newComplaint = new Complaint({
            author, name, email, mobileNo, complaint,
            photos: photoPaths,
            videos: videoPaths
        });

        await newComplaint.save();
        res.status(201).json({ message: 'Complaint registered successfully!', id: newComplaint._id });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

router.get('/complaints', async (req, res) => {
    try {
        const complaints = await Complaint.find().sort({ upvotes: -1, createdAt: -1 });
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching complaints', error: error.message });
    }
});

router.patch('/complaints/:id/upvote', authenticate, async (req, res) => {
    try {
        const username = req.user.username;
        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
        if (complaint.upvotedBy.includes(username)) {
            return res.status(400).json({ message: 'You have already upvoted this complaint' });
        }
        complaint.upvotedBy.push(username);
        complaint.upvotes += 1;
        await complaint.save();
        res.json({ message: 'Upvoted successfully', upvotes: complaint.upvotes });
    } catch (error) {
        res.status(500).json({ message: 'Error upvoting', error: error.message });
    }
});

module.exports = router;
