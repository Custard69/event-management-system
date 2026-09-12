\# Event Management System



A full-stack Event Management System developed as a Software Engineering Intern take-home assessment.



\## Tech Stack



\### Frontend

\- React

\- TypeScript

\- Vite

\- Tailwind CSS



\### Backend

\- NestJS

\- TypeScript

\- TypeORM

\- PostgreSQL



\### Authentication

\- JWT

\- bcrypt

Day	Main goal	Status
Day 1 — Tue, Sep 8	Project setup + DB + authentication	✅ Finished
Day 2 — Wed, Sep 9	Event CRUD backend + ownership authorization	🟡 In progress
Day 3 — Thu, Sep 10	React authentication + My Events + Create Event	⏳ Next
Day 4 — Fri, Sep 11	Complete frontend CRUD + validation + responsive UI	⏳
Day 5 — Sat, Sep 12	Testing + README + polish + bonus feature(s)	⏳
Day 1 — completed ✅

You finished the foundation:

Git repository
GitHub repository

client/
→ React + TypeScript + Vite

server/
→ NestJS + TypeScript

PostgreSQL
TypeORM

User entity
Event entity
User → Events relationship

Registration
DTO validation
ValidationPipe
bcrypt password hashing

Login
JWT generation
JWT verification
JwtAuthGuard
Protected routes

This was actually the most concept-heavy day because you had to understand several new backend concepts.

Day 2 — where we are now 🟡

Tonight's target is:

Event CRUD backend

POST   /events
GET    /events
GET    /events/:id
PATCH  /events/:id
DELETE /events/:id

Plus the important ownership rule:

User A → can only access User A's events
User B → cannot view/edit/delete User A's events

You've already created:

CreateEventDto
UpdateEventDto
EventsService
EventsController
JWT protection on /events
ownership-aware queries

You're currently around the point of getting the Event routes running cleanly and testing them in Postman.

What I want you to finish tonight

Don't start frontend tonight unless you have extra time.

Finish these tests:

1. GET /events without JWT
   → 401

2. POST /events with JWT
   → creates event

3. GET /events
   → returns logged-in user's events

4. GET /events/:id
   → returns event

5. PATCH /events/:id
   → updates event

6. DELETE /events/:id
   → deletes event

7. User A creates event
   User B tries to access it
   → 404

Then commit:

git add .
git commit -m "feat: implement authenticated event CRUD"
git push

If we complete that tonight, the backend is essentially finished.



------------------TECH STACK---------------------
FRONTEND
React
TypeScript
Vite
CSS
React Router
Axios

        ↓ REST API

BACKEND
NestJS
TypeScript
TypeORM
JWT
bcrypt

        ↓

PostgreSQL