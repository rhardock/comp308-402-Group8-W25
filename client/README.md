# Noted - Frontend Micro Frontends

This is the frontend application for Noted, built using a micro frontends architecture with Next.js.

## Architecture

The application is split into three micro frontends:

1. **Auth Micro Frontend (Port 3001)**
   - Handles user authentication
   - Login and registration
   - Protected route management

2. **Notes Micro Frontend (Port 3002)**
   - Main note-taking functionality
   - Dashboard, summary, and home pages
   - PDF upload and processing

3. **Shared UI**
   - Common UI components
   - Shared styling and utilities

## Prerequisites

- Node.js 18.x or higher
- npm 8.x or higher

## Getting Started

1. Install dependencies:
   ```bash
   npm run install:all
   ```

2. Set up environment variables:
   - Copy `.env.local.example` to `.env.local` in each micro frontend directory
   - Update the variables as needed

3. Start the development servers:
   ```bash
   npm run dev
   ```

   This will start all micro frontends:
   - Auth: http://localhost:3001
   - Notes: http://localhost:3002

## Development

Each micro frontend can be developed independently:

- Auth: `npm run dev:auth`
- Notes: `npm run dev:notes`
- Shared UI: `npm run dev:shared`

## Building for Production

1. Build all micro frontends:
   ```bash
   npm run build
   ```

2. Start production servers:
   ```bash
   npm run start
   ```

## API Integration

The frontend expects the following API endpoints:

### Authentication
- POST `/api/auth/login`
- POST `/api/auth/register`
- POST `/api/auth/logout`
- GET `/api/auth/me`

### Notes
- GET `/api/notes`
- GET `/api/notes/:id`
- POST `/api/notes`
- PUT `/api/notes/:id`
- DELETE `/api/notes/:id`
- POST `/api/notes/upload`
- GET `/api/notes/:id/summary`

## Folder Structure

```
client/
├── micro-frontends/
│   ├── auth/               # Authentication & User Management
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── context/
│   │   │   ├── services/
│   │   │   └── app/
│   │   └── package.json
│   │
│   ├── notes/             # Notes Management
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── context/
│   │   │   ├── services/
│   │   │   └── app/
│   │   └── package.json
│   │
│   └── shared-ui/         # Shared Components
│       ├── src/
│       │   ├── components/
│       │   └── styles/
│       └── package.json
│
└── package.json           # Root package.json
```

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Test your changes
4. Submit a pull request

## Troubleshooting

1. If you get module resolution errors:
   ```bash
   npm run install:all
   ```

2. If you get port conflicts:
   - Check if any other services are running on ports 3001 or 3002
   - Update the ports in the respective `.env.local` files

3. For authentication issues:
   - Check if the API URL is correctly set in `.env.local`
   - Verify that the token is being properly stored/retrieved
