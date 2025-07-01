# ♟️ Pawned Frontend

**A vintage-styled chess game interface built with React + Tailwind CSS**

> This is the frontend for **Pawned**, a retro-themed chess app where players can enjoy AI matches, play locally, or continue saved games — all wrapped in an old-school, nostalgic design.

---

## 🖼️ Preview

![Pawned Screenshot](preview.png)  
> *Screenshot of the retro UI with classic chessboard and stylized components*

---

## 🎯 Features

- 🎮 **Multiple Play Modes**
  - Play vs AI (adjustable difficulty)
  - Local 2-player match
  - Continue saved games

- ⏱️ **Game Mechanics**
  - Timer for each player
  - Move history log
  - Resign and Undo functionality

- 💾 **Retro Design**
  - Custom theme with sepia tones, serif fonts, and retro-styled buttons

- 📱 **Fully Responsive**
  - Optimized for both desktop and mobile play

---

## 🛠 Tech Stack

| Tool              | Purpose                          |
|-------------------|----------------------------------|
| [React](https://reactjs.org/) | Frontend framework                |
| [Vite](https://vitejs.dev/)   | Fast dev/build tooling           |
| [TypeScript](https://www.typescriptlang.org/) | Static typing                 |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS styling     |
| [Lucide Icons](https://lucide.dev/) | Iconography                    |
| [React Router DOM](https://reactrouter.com/) | Navigation & routing         |

---

## 🧪 Development

### 📦 Install dependencies

```bash
npm install

npm run dev

npm run build

src/
├── components/        # Reusable UI components (CustomButton, TopNav, GameCard, etc.)

├── assets/            # Images, icons, and media
├── lib/               # Utility functions (e.g., cn.ts)
├── App.tsx            # Main app layout
└── index.tsx          # Entry point


🌐 Backend Integration
This app is designed to work with the upcoming pawned-backend API built using Node.js and Express, which will handle:

Game state

Player matchmaking

AI logic (via chess.js / Stockfish integration)

📜 License
MIT © [Ctrl Code Solutions]