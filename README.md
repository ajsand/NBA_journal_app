# NBA Fan Journal

A web-based personal journal application for NBA fans to record their thoughts, analysis, and insights about games, players, and teams.

## Features

- Create and edit journal entries with rich text formatting
- Tag entries with teams, players, and custom categories
- Search and filter entries by type, date range, and tags
- Offline with local data storage
- Desktop shortcut launcher

## Prerequisites

- Node.js 20.0.0 or higher
- npm 10.0.0 or higher

## Installation

1. Clone repo:
```bash
git clone https://github.com/ajsand/journal_app.git
cd journal_app
```

2. Install dependencies:
```bash
npm install
```

3. Create desktop shortcut (optional):
```bash
npm run create-shortcut
```

## Running Application

There are two ways to run this application:

1. Using desktop shortcut:
   - Double-click "NBA Fan Journal" shortcut on your desktop
   - Application will open in your default browser
   - To close, simply close terminal window that opens

2. Using npm commands:
   ```bash
   npm run start
   ```
   The application will automatically open in your default browser at `http://localhost:3000`.

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- DexieJS (IndexedDB)
- React Router
- React Quill
- Lucide React Icons

## Data Storage

All data is stored locally in your browser using IndexedDB through DexieJS.
