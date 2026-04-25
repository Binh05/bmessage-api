# BMessage - Backend API

![NodeJS](https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white) ![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101) ![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens) ![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=Cloudinary&logoColor=white) ![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)

The official backend REST API and WebSocket server for **BMessage**, a real-time chat application.

## 🚀 Core Features

- **User Authentication:** Secure registration and login, powered by JSON Web Tokens (JWT).
- **Real-Time Communication:** Instant messaging with online statuses using **Socket.io**.
- **Media Uploads:** Seamless image and avatar uploads handled securely via **Cloudinary**.
- **Database:** Fast and scalable data persistence using **MongoDB**.
- **API Documentation:** Interactive and detailed API specifications with **Swagger UI**.

## 🛠️ Technologies Used

- **Node.js** & **Express.js** - Server environment and web framework
- **MongoDB** & **Mongoose** - NoSQL database and Object Data Modeling (ODM)
- **Socket.io** - Bi-directional real-time event-based communication
- **JSON Web Token (JWT)** - Stateless, secure authorization model
- **Cloudinary** - Cloud-based media storage and optimization
- **Swagger / OpenAPI** - Standardized API documentation and testing

## 📦 Getting Started

### Prerequisites

Make sure you have the following installed on your local machine:

- Node.js (v16 or higher)
- MongoDB (local or Atlas cluster)

### Installation

1. **Clone the repository** (if you haven't already):

   ```bash
   git clone <your-repo-url>
   cd BMessage-Project/bmessage-api
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root of your `bmessage-api` directory and add the following required variables:

   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # MongoDB Configuration
   MONGODB_URI=your_mongodb_connection_string

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=7d

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

### Running the Application

**Development Mode:**

```bash
npm run dev
```

The server will start on `http://localhost:5000` by default.

## 📚 API Documentation (Swagger)

This API includes an interactive Swagger interface. Once your server is up and running, you can explore the API endpoints, view request/response schemas, and test endpoints directly from your browser.

- **Swagger UI Path:** `http://localhost:5000/api-docs` (or the equivalent route you set up for swagger in your app)

Make sure to log in and authorize via the "Authorize" button in the Top Right of Swagger UI using your `Bearer <JWT_TOKEN>` for protected routes.

---

_Maintained by the BMessage Development Team._
