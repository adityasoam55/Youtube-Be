# YouTube Clone - Backend

A robust Node.js/Express backend for a YouTube-like social video platform. Handles user authentication, video management, comments, likes/dislikes, and file uploads with Cloudinary integration.

## 🌟 Features

### Authentication & Authorization

- JWT-based user authentication
- Secure password hashing with bcrypt
- Protected endpoints with middleware
- Token-based request validation
- User registration and login

### Video Management

- Upload videos with metadata (title, description, category)
- Store videos locally or on Cloudinary
- Fetch all videos or filter by category
- Get video details including uploader info
- Track video views
- Edit and delete videos (author-only)
- Suggest videos based on category

### Engagement

- Like/dislike videos with user tracking
- Add, edit, and delete comments
- Author-only comment edit/delete permissions
- Real-time comment updates

### User Profile

- Store user information (username, email, avatar, banner)
- Update profile details
- Upload profile pictures to Cloudinary
- Store channel description
- User channel videos retrieval

### Media Handling

- Multer for file uploads with disk storage
- Cloudinary integration for image hosting
- Image validation (type & size checking)
- Automatic cleanup of temporary files
- Support for multiple upload types

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer
- **Cloud Storage**: Cloudinary
- **Environment**: dotenv
- **CORS**: cors middleware

## 📋 Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB Atlas** account (or local MongoDB)
- **Cloudinary** account (for image hosting)
- **npm** or **yarn** package manager

## 🚀 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/adityasoam55/Youtube-Be.git
cd Youtube-Be
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

Create a `.env` file in the project root with the following variables:

```env
# Server
PORT=5000

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/youtube_db

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Start the server

**Development mode (with nodemon)**:

```bash
npm run dev
```

**Production mode**:

```bash
npm start
```

Server will run at `http://localhost:5000`

## 📁 Project Structure

```
Youtube-Be/
├── config/
│   └── cloudinary.js       # Cloudinary configuration
├── controllers/
│   ├── authController.js   # Login/Register handlers
│   ├── videoController.js  # Video CRUD operations
│   ├── commentController.js# Comment operations
│   └── userController.js   # User profile & avatar
├── middleware/
│   ├── authMiddleware.js   # JWT verification
│   └── multerDisk.js       # File upload configuration
├── models/
│   ├── User.model.js       # User schema
│   └── Video.model.js      # Video schema
├── routes/
│   ├── authRoutes.js       # Auth endpoints
│   ├── videoRoutes.js      # Video endpoints
│   ├── commentRoutes.js    # Comment endpoints
│   └── userRoutes.js       # User endpoints
├── db.js                   # MongoDB connection
├── server.js               # Express app setup
├── package.json            # Dependencies
└── .env                    # Environment variables
```

## 🔌 API Endpoints

### Authentication

#### Register

```
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123"
}

Response: { userId, username, email, token }
```

#### Login

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response: { userId, username, email, avatar, token }
```

### Videos

#### Get all videos (with optional category filter)

```
GET /api/videos
Query params: category=Frontend

Response: [{ videoId, title, description, uploader, views, ... }]
```

#### Get video by ID

```
GET /api/videos/:videoId

Response: { videoId, title, description, uploader, likes, dislikes, comments, ... }
```

#### Upload video

```
POST /api/videos/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

Fields:
- title (required)
- description
- category
- thumbnailUrl
- videoUrl or videoFile

Response: { message, video }
```

#### Update video

```
PUT /api/videos/channel/:videoId
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated title",
  "description": "Updated description",
  "category": "Backend"
}

Response: { message, video }
```

#### Delete video

```
DELETE /api/videos/channel/:videoId
Authorization: Bearer {token}

Response: { message }
```

#### Increment view count

```
PUT /api/videos/:videoId/view

Response: { views }
```

#### Toggle like

```
PUT /api/videos/:videoId/like
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": "user123"
}

Response: { likes: [] }
```

#### Toggle dislike

```
PUT /api/videos/:videoId/dislike
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": "user123"
}

Response: { dislikes: [] }
```

#### Get suggested videos

```
GET /api/videos/suggest/:category/:videoId

Response: [{ videoId, title, ... }]
```

#### Get channel videos

```
GET /api/videos/channel/my-videos
Authorization: Bearer {token}

Response: [{ videoId, title, ... }]
```

### Comments

#### Get comments for a video

```
GET /api/comments/:videoId

Response: [{ commentId, userId, username, text, avatar, ... }]
```

#### Add comment

```
POST /api/comments/:videoId
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": "user123",
  "username": "johndoe",
  "avatar": "url_to_avatar",
  "text": "Great video!"
}

Response: { message, comment }
```

#### Edit comment

```
PUT /api/comments/:commentId
Authorization: Bearer {token}
Content-Type: application/json

{
  "text": "Updated comment text"
}

Response: { message, comment }
```

#### Delete comment

```
DELETE /api/comments/:commentId
Authorization: Bearer {token}

Response: { message }
```

### User Profile

#### Get logged-in user

```
GET /api/users/me
Authorization: Bearer {token}

Response: { userId, username, email, avatar, banner, channelDescription, ... }
```

#### Update user

```
PUT /api/users/update
Authorization: Bearer {token}
Content-Type: application/json

{
  "username": "newname",
  "channelDescription": "My channel"
}

Response: { userId, username, channelDescription, ... }
```

#### Upload avatar

```
PUT /api/users/avatar
Authorization: Bearer {token}
Content-Type: multipart/form-data

Field: avatar (image file)

Response: { message, user }
```

#### Upload banner

```
PUT /api/users/banner
Authorization: Bearer {token}
Content-Type: multipart/form-data

Field: banner (image file)

Response: { message, user }
```

## 📊 Database Schemas

### User Schema

```javascript
{
  userId: String (unique),
  username: String (required),
  email: String (required, unique),
  password: String (hashed, required),
  avatar: String (Cloudinary URL),
  banner: String (Cloudinary URL),
  channelDescription: String,
  channels: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Video Schema

```javascript
{
  videoId: String (unique),
  title: String (required),
  description: String,
  videoUrl: String (required),
  thumbnailUrl: String,
  uploader: String (userId),
  uploaderName: String,
  uploaderAvatar: String,
  category: String,
  views: Number,
  likes: [String] (userId array),
  dislikes: [String] (userId array),
  comments: [ObjectId],
  uploadDate: Date,
  updatedAt: Date
}
```

### Comment Schema

```javascript
{
  commentId: String (unique),
  videoId: String,
  userId: String,
  username: String,
  avatar: String,
  text: String (required),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Authentication & Security

### JWT Flow

1. User registers or logs in
2. Backend generates JWT token with user ID
3. Client stores token in localStorage
4. Client includes token in `Authorization: Bearer {token}` header
5. Middleware verifies token on protected routes
6. Invalid/expired tokens return 401 Unauthorized

### Password Security

- Passwords hashed with bcryptjs (saltRounds: 10)
- Stored password never sent to client
- Password compared during login using bcrypt compare

### Protected Routes

All protected endpoints require valid JWT token. The `authMiddleware` validates:

- Token presence in Authorization header
- Valid Bearer format
- Token signature and expiration

## 🖼️ File Upload Flow

1. **Multer Reception**: File received and stored temporarily in `temp_uploads/`
2. **Validation**: File checked for type and size (max 10MB for avatars)
3. **Cloudinary Upload**: File uploaded to Cloudinary with folder organization
4. **DB Storage**: Cloudinary URL saved to user/video document
5. **Cleanup**: Temporary local file deleted
6. **Response**: Returns user/video with updated URL

## 🚀 Deployment

### Render (Recommended)

1. Push code to GitHub
2. Connect repository to Render
3. Set environment variables in Render dashboard:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
4. Deploy automatically on push

### Alternative: Heroku, Railway, or other platforms

Similar process - set env vars and connect GitHub repo.

## 🔧 Available Scripts

```bash
npm start       # Start production server
npm run dev     # Start dev server with nodemon
npm test        # Run tests (if configured)
npm run lint    # Run ESLint (if configured)
```

## 🐛 Troubleshooting

### MongoDB connection error

- Verify `MONGODB_URI` in `.env`
- Check IP whitelist on MongoDB Atlas (allow 0.0.0.0 for development)
- Ensure credentials are URL-encoded if containing special characters

### Cloudinary upload fails

- Verify `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- Check temp_uploads folder exists (auto-created on first upload)
- Verify file size is under 10MB limit

### CORS errors

- Frontend URL may need to be added to CORS whitelist
- Edit `server.js` CORS configuration if needed

### Token invalid/expired

- Token expires after set duration (default: 7 days)
- Client should re-login to get fresh token
- Implement token refresh logic if needed

## 📝 Environment Setup Example

Create `.env`:

```env
PORT=5000

MONGODB_URI=mongodb+srv://user:pass@cluster0.abc.mongodb.net/youtube_clone

JWT_SECRET=your_very_long_and_secret_key_12345

CLOUDINARY_CLOUD_NAME=dxxxxxxxx
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=abcdefghij
```

## 🎯 Future Enhancements

- [ ] Video streaming optimization (HLS)
- [ ] User subscriptions system
- [ ] Notifications service
- [ ] Analytics & metrics
- [ ] Video trimming/editing
- [ ] Playlist management
- [ ] Advanced search with Elasticsearch
- [ ] Rate limiting
- [ ] Video moderation system
- [ ] Admin dashboard

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 👨‍💻 Author

**Aditya Som**

- GitHub: [@adityasoam55](https://github.com/adityasoam55)

## 📧 Support

For issues, questions, or suggestions, please open an issue on GitHub or contact the author.

---

**Frontend Repository**: [Youtube-Fe](https://github.com/adityasoam55/Youtube-Fe)

**Live API**: [https://youtube-be-0qhc.onrender.com](https://youtube-be-0qhc.onrender.com)
