# 🎵 Revolver — Letterboxd for Music

A vinyl/retro-themed music rating app where you can rate albums, build your collection, discover local releases, and connect with friends.

## Quick Start

1. **Install Node.js** if you don't have it: https://nodejs.org (LTS version)

2. **Open Terminal** and navigate to this folder:
   ```
   cd revolver-app
   ```

3. **Install dependencies:**
   ```
   npm install
   ```

4. **Start the app:**
   ```
   npm start
   ```

5. The app will open in your browser at **http://localhost:3000**

## Fonts
The app uses three custom fonts (already included in `public/fonts/`):
- **Milestone** — Script font for the "Revolver" logo
- **Milky Vintage** — Display font for titles, tabs, album names
- **Bellerose** — Body font for general text

## Features
- 🔍 Search real albums via MusicBrainz API
- ⭐ Rate albums with half-star precision
- 📀 Build your personal collection
- 👤 Customizable profile with Top 4 songs & albums
- 🎧 Connect streaming services (Spotify, Apple Music, Amazon, YouTube Music)
- 🔁 On Repeat section synced with streaming
- 👥 Friend activity feed
- 🌍 Global & regional popularity charts
- 📍 Local releases spotlight
- 💾 All data persists in localStorage

## Project Structure
```
revolver-app/
├── public/
│   ├── index.html
│   └── fonts/
│       ├── MilestoneFreeVersion-Script.otf
│       ├── MilkyVintage-Regular.ttf
│       └── Bellerose.ttf
├── src/
│   ├── index.js
│   ├── App.js
│   └── fonts.css
├── package.json
└── README.md
```
