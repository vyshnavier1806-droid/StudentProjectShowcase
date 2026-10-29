# Student Project Showcase – ProjectHub

## 📌 About the Project

Student Project Showcase is a web-based application developed to provide a centralized platform for students to showcase, explore, and manage academic projects. The application encourages innovation and knowledge sharing by allowing users to discover projects across different technical categories.

## 🎯 Objectives

- Provide a platform for students to showcase their academic projects.
- Enable users to search and filter projects by category.
- Allow students to submit project details and relevant links.
- Store and retrieve project information using MongoDB.
- Provide user registration and login functionality.
- Demonstrate full-stack web development concepts.

## ✨ Features

- **Project Listing:** Displays student projects in an organized card layout.
- **Search Functionality:** Helps users find projects by keywords.
- **Category Filtering:** Organizes projects into categories such as Web Development, Artificial Intelligence, Machine Learning, Cybersecurity, and Mobile Application.
- **Project Submission:** Allows users to submit project details, descriptions, and technologies.
- **Project Details:** Provides additional information about individual projects.
- **User Authentication:** Includes registration and login interfaces.
- **Project Management:** Supports project editing and deletion where permitted.
- **Database Integration:** Stores project and user information in MongoDB.
- **Project Links:** Supports optional GitHub and live demo links.

## 🛠️ Technologies Used

### Frontend
- React.js
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- MongoDB Compass

### Development Tools
- Visual Studio Code
- npm
- Git and GitHub

## 🏗️ System Architecture

The application follows a client-server architecture.

1. **Frontend:** React.js provides the user interface and handles user interactions.
2. **Backend:** Node.js and Express.js process requests and expose API endpoints.
3. **Database:** MongoDB stores project records and user information.
4. **Communication:** The frontend communicates with the backend through API requests, and the backend interacts with MongoDB to retrieve or update data.

## 📂 Project Structure

```text
StudentProjectShowcase/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── App.css
        ├── Auth.jsx
        ├── Auth.css
        ├── index.css
        ├── main.jsx
        ├── components/
        ├── pages/
        └── services/
            └── api.js
```

## ⚙️ Installation and Setup

### Prerequisites

Install the following before running the application:

- Node.js and npm
- MongoDB connection or MongoDB Atlas account
- Visual Studio Code (recommended)

### 1. Clone the Repository

```bash
git clone https://github.com/vyshnavier1806-droid/StudentProjectShowcase.git
cd StudentProjectShowcase
```

### 2. Configure the Backend

```bash
cd backend
npm install
```

Configure the MongoDB connection and other environment variables according to the backend configuration.

Start the backend server:

```bash
node server.js
```

### 3. Configure the Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite in your browser.

## 🗄️ Database Design

The application uses MongoDB as its database.

### Projects Collection

Stores information related to student projects, including:

- Project title
- Description
- Category
- Technologies used
- Author and owner information
- Project cover image
- GitHub link
- Live demo link
- Creation and update timestamps

### Users Collection

Stores user-related information required for account management and authentication, according to the implemented backend schema.

## 🔄 Application Workflow

1. Users open the ProjectHub homepage.
2. They browse, search, or filter the available projects.
3. Users can register or log in to access account-related features.
4. Project details can be submitted through the project submission form.
5. The frontend sends requests to the backend API.
6. The backend processes the requests and communicates with MongoDB.
7. Stored project information is retrieved and displayed in the interface.

## 🚀 Future Enhancements

- Advanced project filtering and sorting.
- Project ratings, reviews, and comments.
- Admin dashboard for project moderation.
- Improved mobile responsiveness.
- Notifications for project updates.
- Enhanced security and access control.

## 🎓 Conclusion

Student Project Showcase – ProjectHub demonstrates the practical integration of frontend development, backend server programming, and database management. By combining React.js, Node.js, Express.js, and MongoDB, the application provides an organized platform for presenting and discovering academic projects. The system can be extended with additional features to improve collaboration and project discovery within the student community.

## 👩‍💻 Author

**Vyshnavi E R**

Student Project Showcase – Academic Project
