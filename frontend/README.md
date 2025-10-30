# 🗨️ Talketeer Frontend
- Click [here](https://github.com/YoYo178/talketeer) to visit application's main repository.

## 🧩 Tech Stack

- **Framework:** React.js (Vite + TypeScript)
- **Styling:** TailwindCSS + shadcn/ui (Radix UI primitives)
- **State Management:** Zustand
- **Networking:** Axios + React Query
- **Real-Time:** Socket.io Client
- **Forms & Validation:** React Hook Form + Zod
- **Routing:** React Router v7
- **UI Enhancements:** Lucide Icons, shadcn/ui (Sonner, Next Themes)

## 🚀 Scripts

| Command | Description |
|----------|-------------|
| `pnpm run dev` | Start the development server |
| `pnpm run build` | Build the production bundle |
| `pnpm run preview` | Preview the built app locally |
| `pnpm run lint` | Run ESLint checks |

## ⚙️ Environment Variables

Create a `.env.<environment>` file in the `frontend/` directory:
  - `<environment>` corresponds to the environment configuration the application is launched in.

```bash
VITE_SERVER_URL=https://your-backend-domain.com
VITE_DEV_SERVER_URL=http://localhost:3000
```
These values tell the frontend where to reach your backend API and Socket.io server.
  - Note: These server URLs are modified before usage, see `api.config.ts`.

## 📁 Project Structure
```bash
/
├── src/
│   ├── @types/           # Custom TypeScript type definitions
│   ├── components/       # Reusable UI components
│   ├── config/           # Configuration files
│   ├── hooks/            # Custom hooks (network, socket, state, UI, etc.)
│   ├── layouts/          # Page layouts based on authentication state
│   ├── lib/              # Managed by shadcn/ui
│   ├── pages/            # Page-level views and routes
│   ├── sockets/          # Socket handlers (only for events emitted by server)
│   ├── types/            # TypeScript definitions
│   ├── utils/            # Utility helpers
│   ├── App.tsx           # Root component
│   └── main.tsx          # Application entry point
│
├── components.json       # shadcn/ui configuration
├── eslint.config.js      # ESLint configuration
├── index.html            # Base HTML file
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite configuration
```

## 🧠 Features

- 🔐 Authenticated routes and JWT handling
- 💬 Real-time room and message synchronization
- ⚡ Typing indicators and live presence updates
- ⭐ Interactive UI with modals, menus, and transitions
- 📱 Responsive layout with dark/light themes

## ⚙️ Things that might be added in future

- 🔐 Google OAuth2 login
- ⭐ Rich text (Markdown, Attachments)
- 💬 Ability to edit and delete messages
- 🌐 Activity messages in chat (System announcements, user joined, user left, etc)

## 🧑‍💻 Author
[-\_YoYo178\_-](https://github.com/YoYo178)