# 🗨️ Talketeer Backend
- Click [here](https://github.com/YoYo178/talketeer) to visit application's main repository.

## 🚀 Tech Stack

- **Framework:** Express.js (with TypeScript)
- **Database & ODM:** MongoDB + Mongoose
- **Real-Time Communication:** Socket.io
- **Authentication:** JWT (Access & Refresh Tokens)
- **Email Service:** Nodemailer
- **Validation:** Zod
- **Security:** Argon2 (Migrated from bcrypt)
- **Environment Management:** Node's native env file feature
- **Architecture:** Modular service-based structure (Controllers, Services, Routes, Models)

## 📁 Folder Structure

```bash
backend/
├── config/
│ ├── .env                # General env file (Loaded first)
│ └── .env.<environment>  # Environment specific env file (Overrides general env variables)
│
├── src/
│ ├── @types/             # Custom TypeScript type definitions
│ ├── common/             # Common constants
│ ├── config/             # API, DB, Token, Room, etc configuration files
│ ├── controllers/        # Route logic
│ ├── middlewares/        # Auth, validation, and error handlers
│ ├── models/             # Mongoose schemas
│ ├── routes/             # Express route definitions
│ ├── schemas/            # Zod schemas
│ ├── services/           # Centralized logic shared across routes and controllers
│ ├── sockets/            # Socket.io event handlers
│ ├── types/              # TypeScript definitions
│ └── utils/              # Utility helpers
│
├── .dockerignore         # Docker ignore file
├── .editorconfig         # Editor configuration file
├── .gitignore            # Git ignore file
├── .prettierignore       # Prettier ignore file
├── .prettierrc           # Prettier configuration file
├── Dockerfile            # Docker file of the application
├── oxlint.config.js      # Oxlint configuration
├── tsconfig.json         # TypeScript configuration file
```

## ⚙️ Environment Variables
Rename `.env.example` to `.env` or `.env.<environment>` found in the `backend/config` directory and add values accordingly.

## 🧠 Development

Run the backend in development mode with:

```bash
pnpm run dev
```

To build and run the production version:

```bash
pnpm run build
pnpm start
```

## 🧰 Scripts
| Command	| Description |
|---------|-------------|
| pnpm run dev	| Run in watch mode using tsx |
| pnpm run build	| Compile TypeScript to JavaScript |
| pnpm start |	Start compiled server |
| pnpm run lint | Run Oxlint checks |

## 🧱 Design Decisions
- Service-based architecture to keep controllers clean
- Typed Socket events using TypeScript generics
- Access/Refresh token system for secure, scalable authentication
- Centralized error handling with consistent response structure
- Event-driven socket logic for real-time synchronization

## 🧑‍💻 Author
[-\_YoYo178\_-](https://github.com/YoYo178)