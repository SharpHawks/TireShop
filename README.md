
# TireTrekker

A modern web application for managing tire inventory and recommendations.

## Prerequisites

- Node.js 20 or higher
- NPM (Node Package Manager)

## Setup Instructions

1. Clone the repository

```bash
git clone <your-repository-url>
cd tiretrekker
```

2. Install dependencies

```bash
npm install
```

3. Database Setup

The application uses a Neon Postgres database. You'll need to:
- Create a `.env` file in the root directory
- Add your database connection string:
```
DATABASE_URL=your_neon_database_url
SESSION_SECRET=your_session_secret
```

4. Run Database Migrations

```bash
npm run db:push
```

5. Start Development Server

```bash
npm run dev
```

The application will start on http://0.0.0.0:5000

## Features

- User Authentication
- Tire Inventory Management 
- Smart Tire Recommendations
- Interactive UI with Real-time Updates

## Project Structure

- `/client` - React frontend application
- `/server` - Express backend API
- `/shared` - Shared types and schemas
- `/public` - Static assets

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Type check TypeScript
- `npm run db:push` - Push database schema changes

## Tech Stack

- Frontend: React, TypeScript, Tailwind CSS
- Backend: Express.js, TypeScript
- Database: Neon Postgres
- ORM: Drizzle
- UI Components: Shadcn/ui

## Environment Variables

The application requires the following environment variables:

```
DATABASE_URL=your_neon_database_url
SESSION_SECRET=your_session_secret
```

Make sure to set these in your `.env` file before starting the application.

## Testing

Run the test suite:

```bash
npm run test
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
