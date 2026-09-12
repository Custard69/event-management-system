# Event Management System

A full-stack Event Management System developed as part of a Software Engineering Intern take-home assessment.

The application allows authenticated users to create, view, update, search, filter, and delete their own events through a responsive web interface.

---

## Features

### Core Features

- User registration
- User login
- JWT-based authentication
- Password hashing using bcrypt
- Create events
- View all events created by the logged-in user
- View individual event details
- Edit events
- Delete events
- Event ownership authorization
- Form validation and meaningful error handling
- Responsive desktop, tablet, and mobile interface
- Logout and delete confirmations

### Bonus Features

- Search events by title or location
- Event title suggestions while searching
- Filter events by:
  - All events
  - Upcoming events
  - Past events

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- Axios
- CSS

### Backend

- NestJS
- TypeScript
- TypeORM
- PostgreSQL

### Authentication & Security

- JSON Web Tokens (JWT)
- bcrypt password hashing
- NestJS Guards
- DTO validation using `class-validator`

---

## Project Structure

```text
event-management-system/
│
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── auth/
│   │   ├── events/
│   │   ├── users/
│   │   ├── app.module.ts
│   │   └── main.ts
│   │
│   └── package.json
│
└── README.md
```

---

## Application Architecture

The project follows a client-server architecture.

```text
React Frontend
      │
      │ HTTP / REST API
      ▼
NestJS Backend
      │
      │ TypeORM
      ▼
PostgreSQL Database
```

The frontend communicates only with the NestJS REST API. Database access is handled by the backend through TypeORM.

---

## Authentication Flow

### Registration

```text
User submits registration form
        ↓
DTO validation
        ↓
Check whether email already exists
        ↓
Hash password using bcrypt
        ↓
Store user in PostgreSQL
```

### Login

```text
User submits email + password
        ↓
Find user by email
        ↓
Compare password using bcrypt
        ↓
Generate JWT
        ↓
Return JWT to frontend
```

### Protected Requests

```text
Frontend API request
        ↓
Axios attaches JWT
        ↓
Authorization: Bearer <token>
        ↓
NestJS JWT Guard
        ↓
JWT verified
        ↓
Request allowed
```

The authenticated user's ID is taken from the verified JWT rather than being supplied by the frontend.

---

## Event Ownership

Every event belongs to the user who created it.

The backend verifies both:

- The requested event ID
- The authenticated user ID

This prevents one user from viewing, updating, or deleting another user's events.

For example:

```text
User A creates Event A
        ↓
User B tries to access Event A
        ↓
Backend ownership check fails
        ↓
404 Event Not Found
```

---

## Prerequisites

Before running the application, make sure the following are installed:

- Node.js
- npm
- PostgreSQL
- Git

---

# Installation

## 1. Clone the Repository

```bash
git clone https://github.com/Custard69/event-management-system.git
```

Move into the project:

```bash
cd event-management-system
```

---

# Backend Setup

## 2. Install Backend Dependencies

```bash
cd server
npm install
```

---

## 3. Create the PostgreSQL Database

Create a PostgreSQL database named:

```text
event_management_db
```

This can be created using pgAdmin or PostgreSQL CLI.

---

## 4. Configure Backend Environment Variables

Create:

```text
server/.env
```

Add:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password
DB_DATABASE=event_management_db

PORT=3000

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN_SECONDS=3600
```

Replace:

```text
your_postgres_password
```

with your PostgreSQL password.

Replace:

```text
your_jwt_secret
```

with a secure random string.

A random JWT secret can be generated with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 5. Start the Backend

```bash
npm run start:dev
```

The backend will run at:

```text
http://localhost:3000
```

During development, TypeORM synchronization is enabled, so the required database tables are created automatically from the entities.

---

# Frontend Setup

Open another terminal from the project root.

## 6. Install Frontend Dependencies

```bash
cd client
npm install
```

---

## 7. Configure Frontend Environment Variables

Create:

```text
client/.env
```

Add:

```env
VITE_API_URL=http://localhost:3000
```

---

## 8. Start the Frontend

```bash
npm run dev
```

The frontend will normally run at:

```text
http://localhost:5173
```

Open this URL in a browser.

---

# API Endpoints

## Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Authenticate a user |
| GET | `/auth/profile` | Access authenticated user information |

## Events

All event endpoints require a valid JWT.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/events` | Create an event |
| GET | `/events` | Get the logged-in user's events |
| GET | `/events/:id` | Get event details |
| PATCH | `/events/:id` | Update an event |
| DELETE | `/events/:id` | Delete an event |

---

# Event Data

Each event contains:

```text
title
description
date
time
location
```

Example:

```json
{
  "title": "Project Meeting",
  "description": "Discuss the upcoming software release.",
  "date": "2026-09-20",
  "time": "10:30",
  "location": "Colombo"
}
```

---

# Validation and Error Handling

The backend validates incoming requests using DTOs and NestJS `ValidationPipe`.

Examples handled by the application include:

- Invalid email addresses
- Short or invalid passwords
- Duplicate email registration
- Invalid login credentials
- Invalid event details
- Invalid event UUIDs
- Missing authentication tokens
- Invalid or expired JWTs
- Attempts to access another user's event

Meaningful HTTP responses are returned where appropriate, including:

```text
400 Bad Request
401 Unauthorized
404 Not Found
409 Conflict
```

---

# Security

The project includes several security measures:

- Passwords are never stored as plain text.
- Passwords are hashed using bcrypt.
- JWTs are signed using a server-side secret.
- Protected endpoints use a JWT Guard.
- Event ownership is derived from the authenticated JWT.
- A user cannot modify another user's event.
- Environment variables are excluded from Git.

For this project, the frontend stores the JWT in `localStorage` for simple session persistence.

For a production system, an HttpOnly and Secure cookie-based approach could be considered depending on the application's architecture and security requirements.

---

# Search and Filtering

The Events page supports:

### Search

Events can be searched by:

- Event title
- Location

The search input also provides event-title suggestions.

### Filters

Events can be filtered into:

- All Events
- Upcoming
- Past

For this project, filtering is performed on the client because each user is expected to have a relatively small set of events.

For a larger production application, searching and filtering could be moved to the backend together with pagination.

---

# Responsive Design

The application is designed to work across desktop, tablet, and mobile screen sizes.

Responsive behavior includes:

- Three-column event layout on larger screens
- Two-column event layout on tablet screens
- Single-column event layout on mobile
- Responsive authentication pages
- Forms that resize to smaller screens
- Search and filter controls that stack on mobile
- Responsive navigation/header controls
- Mobile-friendly buttons

---

# User Interface

The application includes:

- Branded Login and Registration pages
- Event dashboard
- Event cards
- Event creation form
- Event details page
- Event editing form
- Empty states
- Loading states
- Error messages
- Logout confirmation
- Delete confirmation
- 404 page

---

# Build

## Frontend Production Build

From the `client` directory:

```bash
npm run build
```

## Backend Production Build

From the `server` directory:

```bash
npm run build
```

---

# Future Improvements

With additional development time, the system could be extended with:

- Calendar view
- Public and private events
- Email notifications
- Upcoming-event reminders
- Backend search and filtering
- Refresh tokens
- HttpOnly cookie authentication
 

---

## Author

Developed as a Software Engineering Intern take-home assessment.