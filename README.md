# College Lost and Found Portal

A beginner-friendly MERN stack course project for reporting and finding items lost on campus.

## Features in this starter
- Responsive React homepage in a clean white-and-blue theme
- Browse and search lost/found listings
- Create an item report through a form
- Express REST API with server-side validation
- MongoDB persistence when `MONGODB_URI` is configured
- Friendly empty, loading, and error states

Authentication, ownership checks, admin moderation, and deployment are planned next milestones. Do not treat this starter as production-ready until those are implemented and tested.

## Requirements
- Node.js and npm
- MongoDB local instance or MongoDB Atlas connection string

## Run locally

### 1. Start the backend
```bash
cd server
npm install
cp .env.example .env
# Edit .env and set MONGODB_URI
npm run dev
```
The API runs at `http://localhost:5000` by default.

### 2. Start the frontend in a second terminal
```bash
cd client
npm install
cp .env.example .env
npm run dev
```
Open the local URL printed by Vite (usually `http://localhost:5173`).

## Environment variables
See `server/.env.example` and `client/.env.example`. Never commit real `.env` files or secrets.

## API endpoints
- `GET /api/items?search=&type=` — list items
- `POST /api/items` — create a lost/found report
- `GET /api/items/:id` — get one report
- `PATCH /api/items/:id/status` — update report status
- `GET /api/health` — health check

## Suggested next milestones
1. Add authentication and password hashing.
2. Enforce item ownership and admin roles on the server.
3. Add image uploads using a managed image service.
4. Test API routes and end-to-end flows.
5. Deploy the frontend, API, and database; update CORS and environment variables.
