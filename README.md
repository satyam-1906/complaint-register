# 📢 Complaint Register

A modern, full-stack web application designed to streamline the process of registering and managing citizen complaints. The platform allows users to submit detailed complaints with multimedia support (photos & videos), which can then be viewed and upvoted by the community.

---

## 🚀 Features

- **🔐 User Authentication**: Secure registration and login system powered by JWT and Bcrypt.
- **📝 Detailed Submissions**: Submit complaints with specific details, including full name, email, and mobile number.
- **📸 Multimedia Support**: Upload up to 5 photos and 2 videos per complaint to provide visual evidence.
- **⚡ Real-time Feed**: Browse a list of all complaints, automatically sorted by popularity (upvotes) and date.
- **👍 Community Engagement**: Authenticated users can upvote complaints to increase their visibility.
- **📱 Responsive Design**: Fully responsive UI that works seamlessly across desktops, tablets, and mobile devices.
- **☁️ Vercel-Ready**: Pre-configured for serverless deployment on Vercel.

---

## 🛠️ Tech Stack

### Backend
- **Node.js & Express**: Core server logic.
- **MongoDB & Mongoose**: NoSQL database for flexible data modeling.
- **JWT (JSON Web Tokens)**: Secure stateless authentication.
- **Multer**: Middleware for handling `multipart/form-data` and file uploads.
- **Bcryptjs**: Password hashing for secure user data storage.

### Frontend
- **HTML5 & CSS3**: Modern, semantic structure and glassmorphism styling.
- **Vanilla JavaScript**: Dynamic interactions and API communication without heavy frameworks.

### Deployment
- **Vercel**: Optimized for serverless execution.

---

## 📂 Project Structure

```text
Complaint Register/
├── backend/            # Express server and API routes
│   ├── routes/         # API endpoint definitions
│   ├── uploads/        # Directory for temporary file storage
│   └── server.js      # Main entry point (Vercel compatible)
├── frontend/           # Static frontend files
│   ├── css/            # Style definitions (global.css)
│   ├── js/             # Frontend logic (AJAX, Auth, UI)
│   ├── index.html      # Home page (View complaints)
│   ├── auth.html       # Login/Register page
│   └── complaints.html # Submit complaint page
├── vercel.json         # Vercel deployment configuration
├── .env                # Environment variables (Local development)
└── package.json        # Project dependencies and scripts
```

---

## ⚙️ Local Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/satyam-1906/complaint-register.git
cd complaint-register
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and add the following:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### 4. Run the application
**Development mode (auto-refresh with nodemon):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The application will be available at `http://localhost:3000`.

---

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Create a new user account.
- `POST /api/auth/login` - Authenticate user and receive a JWT.

### Complaints
- `POST /api/complaints` - Register a new complaint (Requires Auth + Media).
- `GET /api/complaints` - Fetch all complaints.
- `PATCH /api/complaints/:id/upvote` - Upvote a specific complaint (Requires Auth).

---

## ☁️ Deployment

This project is configured for easy deployment on **Vercel**. 

1. Push your code to a GitHub repository.
2. Connect your repository to Vercel.
3. Add your Environment Variables (`MONGODB_URI`, `JWT_SECRET`) in the Vercel Dashboard.
4. Deployment happens automatically!

---

## 📜 License
This project is licensed under the MIT License.

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
