# SimpleResume

Transforming Your Professional Profile Into a Standout Resume

## Project Structure

```
simpleresu.me/
├── frontend/          # Next.js frontend application
├── backend/           # Express TypeScript API server
└── package.json       # Root monorepo configuration
```

## Getting Started

### Prerequisites

- Node.js (v20 or higher)
- npm or yarn

### Installation

1. Install dependencies for all packages:

```bash
npm install
```

This will automatically install dependencies for the frontend, backend, and root workspace.

### Development

Run both frontend and backend concurrently:

```bash
npm run dev
```

This will start:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api-docs

Or run them separately:

```bash
# Frontend only
npm run dev:frontend

# Backend only
npm run dev:backend
```

### API Documentation

The backend includes interactive Swagger documentation. Once the backend is running, visit:

**Swagger UI**: [http://localhost:3001/api-docs](http://localhost:3001/api-docs)

Features:
- Interactive API testing
- Complete endpoint documentation
- Request/response examples
- Schema definitions

### Available Scripts

#### Root Level

- `npm run dev` - Run both frontend and backend concurrently
- `npm run dev:frontend` - Run only the frontend
- `npm run dev:backend` - Run only the backend
- `npm run build` - Build both frontend and backend
- `npm run build:frontend` - Build only the frontend
- `npm run build:backend` - Build only the backend
- `npm run start` - Start production backend server

#### Frontend (cd frontend)

- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

#### Backend (cd backend)

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Backend API Endpoints

Base URL: `http://localhost:3001/api`

### Resumes

- `GET /api/resumes` - Get all resumes
- `GET /api/resumes/:id` - Get a single resume by ID
- `POST /api/resumes` - Create a new resume
- `PUT /api/resumes/:id` - Update a resume
- `DELETE /api/resumes/:id` - Delete a resume

### Health Check

- `GET /health` - API health check endpoint

## Environment Variables

### Backend

Create a `.env` file in the `backend` directory:

```env
PORT=3001
NODE_ENV=development
```

## Building for Production

```bash
# Build both frontend and backend
npm run build

# Start production server
npm run start
```

## Technology Stack

### Frontend
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Radix UI
- Framer Motion

### Backend
- Node.js
- Express
- TypeScript
- Swagger/OpenAPI

## License

MIT
