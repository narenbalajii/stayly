# Stayly

Stayly is a modern Airbnb-style property discovery and booking platform built progressively.

## Stack
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL (Database)

## Architecture
The application follows a standard full-stack Next.js architecture where both the frontend React components and backend API routes reside in the same repository. Prisma is used to interface with a PostgreSQL database.

## Project Structure
- `app/` - Next.js App Router (pages and API endpoints)
- `components/` - Reusable React components
- `lib/` - Shared utilities and libraries (e.g., Prisma client)
- `prisma/` - Database schema and migrations
- `public/` - Static assets

## Setup Instructions

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Copy `.env.example` to `.env` and fill in the required values.
   ```bash
   cp .env.example .env
   ```
   *Note: A live PostgreSQL connection string is required in `.env` under `DATABASE_URL` for the database features to work.*

3. **Database Setup**
   Once your `.env` is configured with a valid PostgreSQL URL, run the migrations:
   ```bash
   npx prisma migrate dev
   ```

4. **Development Server**
   Start the development server:
   ```bash
   npm run dev
   ```

## Prisma Commands
- `npx prisma generate` - Generates the Prisma Client
- `npx prisma studio` - Opens the visual database browser
- `npx prisma validate` - Validates the schema file
- `npx prisma migrate dev` - Applies database schema changes

## Current Implementation Status
- **Stage 3 & 4 (Foundation):** COMPLETED
  - Next.js, Tailwind, TypeScript initialized.
  - Prisma configured with PostgreSQL schema (User, Property, PropertyImage, Booking).
- **Stage 5+:** Pending
  - Authentication, Authorization, Booking UI, Host/Admin Dashboards, etc., are planned for future stages.

## Future Stages
Refer to the Master Full-Stack Development Specification for detailed future stages, including Authentication (Auth.js), Host/Guest experiences, and image storage (Cloudinary).
