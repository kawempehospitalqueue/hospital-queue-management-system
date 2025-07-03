# Hospital Queue Management System

## Overview

The **Hospital Queue Management System** is a web-based application designed to streamline patient registration, queue management, and doctor-patient interactions in hospitals. It helps reduce waiting times, improve efficiency, and ensure a smooth flow of patients through the hospital.

## Features

- **Patient Registration:** Auto-generates patient numbers upon registration.
- **User Authentication:** Secure login system using `passport-local-mongoose`.
- **Queue Management:** Real-time patient queue system powered by `socket.io`.
- **Session Management:** `express-session` used for secure session handling.
- **Admin Panel:** Role-based access control for managing hospital operations.
- **Notifications:** Real-time updates for patient queue status.
- **File Uploads:** `multer` for handling file uploads.
- **Time Management:** `moment.js` for handling date and time operations.

## Technologies Used

- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** Passport.js, Passport-Local-Mongoose
- **Frontend:** Pug (for templating), JavaScript, CSS
- **Real-time Communication:** Socket.io
- **Session Management:** Express-session
- **Environment Variables:** Dotenv
- **HTTP Requests:** Axios

## Installation

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v16 or later recommended)
- **MongoDB** (Local or Cloud instance)

### Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/hospital-queue-management.git
   cd hospital-queue-management
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the following:
     ```env
     DATABASE_URL=your_mongodb_connection_string
     PORT=your_server_port_numvber
     ```
4. Start the development server:
   ```sh
   npm run dev
   ```
   Or start the production server:
   ```sh
   npm start
   ```

## Scripts

- `npm start`: Starts the server in production mode.
- `npm run dev`: Runs the server with nodemon for live-reloading.

## License

This project is licensed under the ISC License and was developed by group 4

