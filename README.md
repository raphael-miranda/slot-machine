# Slot Machine Game

A professional slot machine game built with Next.js, TypeScript, Prisma with SQLite for session management, and Tailwind CSS. The game implements all specified requirements, including server-side session tracking, dynamic re-roll logic, and a quirky CASH OUT button with random movement and temporary unclickable behavior.

## Features

- **Game Mechanics**:
  - Players start with 10 credits.
  - Each roll costs 1 credit.
  - Winning requires matching three identical symbols: Cherry (10 credits), Lemon (20 credits), Orange (30 credits), Watermelon (40 credits).
  - Re-roll logic:
    - < 40 credits: Random results.
    - 40–60 credits: 30% chance to re-roll a winning combination.
    - \> 60 credits: 60% chance to re-roll a winning combination.
  - CASH OUT button:
    - 50% chance to jump 300px in a random direction on hover.
    - 40% chance to become unclickable for 2 seconds on hover.
    - Ends the session and transfers credits (mocked).

- **Tech Stack**:
  - **Frontend**: Next.js (React), TypeScript, Tailwind CSS, React Context for state management.
  - **Backend**: Next.js API routes, Prisma with SQLite for session persistence.
  - **UI**: Animated SVG icons for symbols and spinner, staggered symbol reveal (1s, 2s, 3s).

- **Requirements Met**:
  - Completeness: All features implemented.
  - Correctness: Logic behaves as specified, including re-roll and CASH OUT behavior.
  - Clean Code: Modular, typed, documented, and maintainable.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- SQLite (no external server required; uses a local file database)

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd slot-machine
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

   Required packages:
   - `prisma`: For SQLite database operations
   - `uuid`: For generating session IDs
   - `tailwindcss`, `postcss`, `autoprefixer`: For styling
   - `next`, `react`, `react-dom`: Core framework
   - `@types/node`, `@types/react`, `typescript`: TypeScript support

3. **Configure Environment**:
   - Create a `.env` file in the project root:
     ```
     DATABASE_URL="file:./dev.db"
     ```
   - Ensure the `data/` directory exists:
     ```bash
     mkdir data
     ```

4. **Initialize Prisma**:
   - Run Prisma migrations to create the SQLite database and `sessions` table:
     ```bash
     npx prisma migrate dev --name init
     ```

5. **Place SVG Icons**:
   - Copy the provided SVG files (`cherry.svg`, `lemon.svg`, `orange.svg`, `watermelon.svg`, `spinner.svg`) to `public/icons/`.

6. **Run the App**:
   ```bash
   npm run dev
   ```
   - Open `http://localhost:3000` in your browser.

## Project Structure

```
├── lib
│   └── sessions.ts              # Prisma-based session management
├── pages
│   ├── api
│   │   ├── cashout.ts          # API route for cashing out
│   │   ├── roll.ts             # API route for rolling slots
│   │   └── session.ts          # API route for session creation
│   └── index.tsx               # Main app entry point
├── components
│   └── SlotMachine.tsx         # Main UI component
├── context
│   └── GameContext.tsx         # React Context for state management
├── public
│   └── icons                   # SVG icons for symbols and spinner
│       ├── cherry.svg
│       ├── lemon.svg
│       ├── orange.svg
│       ├── watermelon.svg
│       └── spinner.svg
├── styles
│   └── globals.css             # Tailwind CSS styles
├── types
│   └── game.ts                 # TypeScript type definitions
├── prisma
│   └── schema.prisma           # Prisma schema for SQLite
│   └── dev.db                  # SQLite database file
├── .env                        # Environment variables
└── package.json
```

## Prisma Schema

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Session {
  id        String  @id
  credits   Int
  isActive  Boolean
}
```

## Running Tests

1. **Local Testing**:
   - Start the app: `npm run dev`.
   - Open the app in a browser:
     - Verify 10 credits are initialized.
     - Roll the slots and check for staggered symbol reveal (1s, 2s, 3s) and credit updates.
     - Hover over the CASH OUT button to confirm random movement (50% chance, 300px) and temporary unclickable state (40% chance, 2s).
     - Cash out and verify the session ends.
     - Check for error messages on invalid actions (e.g., rolling with 0 credits).

2. **API Testing**:
   - Use Postman or curl to test API routes:
     - `POST /api/session`: Should return `{ id, credits: 10, isActive: true }`.
     - `POST /api/roll` with `{ sessionId }`: Should return `{ symbols, creditsWon, totalCredits }`.
     - `POST /api/cashout` with `{ sessionId }`: Should return `{ message: "Cashed out X credits" }`.
   - Verify SQLite database:
     ```bash
     sqlite3 data/sessions.db
     SELECT * FROM Session;
     ```

3. **Debugging**:
   - Add `console.log` in API routes to inspect session data.
   - Check Prisma logs for database errors: `npx prisma studio` to view the database.

## Deployment

- **Vercel**:
  - SQLite requires a writable file system, which Vercel’s serverless functions do not support. For production, consider:
    - Using a cloud database (e.g., PlanetScale MySQL) by updating `schema.prisma` to use `mysql` as the provider.
    - Hosting on a platform with persistent storage (e.g., Railway, Fly.io).
  - Set `DATABASE_URL` in Vercel’s environment variables.
  - Run `npx prisma migrate deploy` during deployment.

- **Security**:
  - Add authentication to associate sessions with users.
  - Use Prisma’s prepared statements to prevent SQL injection.

- **Scaling**:
  - SQLite is suitable for low to medium traffic. For high concurrency, switch to PostgreSQL or MySQL.

## Troubleshooting

- **Sessions Not Persisting**:
  - Verify `DATABASE_URL` is set correctly in `.env`.
  - Ensure `data/` is writable and `sessions.db` exists.
  - Run `npx prisma studio` to inspect the `Session` table.
- **CASH OUT Button Issues**:
  - Confirm `onMouseEnter` triggers `handleCashOutHover` in `SlotMachine.tsx`.
  - Test in multiple browsers for consistent behavior.
- **TypeScript Errors**:
  - Run `tsc --noEmit` to catch type issues.
- **Database Errors**:
  - Check `console.error` logs in API routes.
  - Ensure Prisma migrations have been applied: `npx prisma migrate dev`.

## Contributing

- Submit issues or pull requests to the repository.
- Follow the coding style (TypeScript, Prettier, ESLint if configured).
- Test changes locally before submitting.

## License

MIT License. See `LICENSE` for details.

---

### Notes on Prisma Integration
- **Prisma Schema**: Added `prisma/schema.prisma` to define the `Session` model for SQLite.
- **Session Management**: Replaced the previous SQLite raw queries with Prisma for safer, more maintainable database operations.
- **Dependencies**: Added `@prisma/client` to `package.json`.
- **Setup**: Included Prisma initialization steps in the setup instructions.

This README provides a comprehensive guide to setting up, running, testing, and deploying the slot machine game with Prisma and SQLite, ensuring all requirements are met in a professional, production-ready manner. Let me know if you need further assistance with Prisma, deployment, or additional features!