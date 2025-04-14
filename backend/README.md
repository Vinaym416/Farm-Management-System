# Backend Project Documentation

This README file provides an overview of the backend application, including setup instructions, usage, and relevant information for developers.

## Project Structure

The backend application is structured as follows:

```
backend
├── src
│   ├── controllers
│   │   ├── authController.js      # Handles authentication-related requests
│   │   └── userController.js      # Handles user-related requests
│   ├── models
│   │   └── userModel.js           # Defines the user model for database interactions
│   ├── routes
│   │   └── authRoutes.js          # Defines authentication routes
│   ├── config
│   │   └── dbConfig.js            # Database connection configuration
│   ├── middleware
│   │   └── authMiddleware.js       # Middleware for protecting routes
│   └── app.js                      # Entry point of the application
├── package.json                    # NPM package configuration
├── .env                            # Environment variables for the application
└── README.md                       # Project documentation
```

## Setup Instructions

### 1. Install Dependencies

Run the following command in the backend directory to install the necessary packages:

```
npm install express mysql2 dotenv
```

### 2. Set Up Environment Variables

Create a `.env` file in the backend directory with the following content:

```
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
```

### 3. Database Configuration

In `src/config/dbConfig.js`, set up the MySQL connection using the provided configuration.

### 4. Create User Model

In `src/models/userModel.js`, define the user model to interact with the MySQL database.

### 5. Authentication Controller

In `src/controllers/authController.js`, implement the login function to verify user credentials.

### 6. Set Up Routes

In `src/routes/authRoutes.js`, define the login route and connect it to the authentication controller.

### 7. Middleware for Authentication

In `src/middleware/authMiddleware.js`, create middleware functions to protect routes as needed.

### 8. Integrate Routes in App

In `src/app.js`, set up the Express server and include the authentication routes.

### 9. Connect Frontend to Backend

Update the frontend application to send requests to the backend API for authentication.

### 10. Test the Application

Ensure that the backend is running and test the login functionality from the frontend. Verify that users are redirected to the appropriate dashboard based on their roles.

## Usage

To start the backend server, run the following command:

```
node src/app.js
```

The server will listen on the specified port (default is 5000). You can then access the API endpoints defined in the routes.

## Conclusion

This backend application provides a robust foundation for user authentication and role-based access control. By following the setup instructions, you can quickly get the application up and running.