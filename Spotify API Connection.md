# Spotify API Connection

## Overview

Revolver uses the Spotify Web API to power album search, artwork, and metadata. We use the **Client Credentials** flow, which gives access to all public Spotify catalog data without requiring users to log in to Spotify.

---

## Auth Flow: Client Credentials

- App authenticates using a **Client ID** and **Client Secret** registered on the Spotify Developer Dashboard
- These credentials are stored in a `.env` file (never committed to git)
- The app fetches a short-lived access token at startup and refreshes it automatically
- All API calls use this token — no individual user login required

---

## Spotify Developer Setup (Steps We Took)

1. Log in at [developer.spotify.com](https://developer.spotify.com) with your Spotify account
2. Click your username → **Dashboard** → **Create app**
3. Fill in app name and description
4. For **Redirect URI**, use `https://localhost:3000` (Spotify now rejects `http://` as insecure)
5. Check **Web API** and save
6. From the app dashboard, click **Settings** to find your **Client ID** and **Client Secret**
7. Add both to `revolver-app/.env` (see below)

---

## Environment Variables

Stored in `revolver-app/.env` (gitignored — never committed):

```
REACT_APP_SPOTIFY_CLIENT_ID=your_client_id_here
REACT_APP_SPOTIFY_CLIENT_SECRET=your_client_secret_here
```

The dev server must be restarted after creating or changing `.env` for the values to take effect.

---

## Files Added

| File | Purpose |
|---|---|
| `src/spotify.js` | Token management and all Spotify API calls |
| `.env` | Credentials (gitignored) |
| `.gitignore` | Excludes `.env` and `node_modules` from git |

---

## Endpoints Used

| Endpoint | Purpose |
|---|---|
| `POST https://accounts.spotify.com/api/token` | Fetch access token |
| `GET /v1/search?type=album` | Search Spotify's full album catalog |
| `GET /v1/browse/new-releases` | Fetch new releases for the Discover section |
| `GET /v1/albums/{id}` | Get full album details and tracklist |

---

## Implementation Details

### Token Management (`src/spotify.js`)

- Token is fetched using Client Credentials and cached in memory with its expiry time
- Auto-refreshes before expiry on each API call so the app never uses a stale token
- **CORS fix:** Credentials are sent in the request body (not the `Authorization` header) to avoid triggering a CORS preflight that Spotify blocks from browser contexts:

```js
body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`
```

### Search (`App.js`)

- Replaced the previous MusicBrainz search with Spotify's `/search` endpoint
- Returns real album title, artist, year, and artwork URL
- Debounced at 400ms

### Discovery / Browse (`App.js`)

- On app load, fetches Spotify's `/browse/new-releases` and displays them in the Discover section
- Falls back to hardcoded sample albums if the fetch hasn't completed yet

---

## Known Limitations & Future Work

**Client Secret in browser (dev only)**
For local development the Client Secret lives in `.env` and is bundled into the frontend. This is acceptable for local use but should not be deployed publicly. For production, token fetching should move to a serverless function (Vercel, Netlify, Cloudflare Workers) so the secret never reaches the browser.

**No genre data**
Spotify's album search results do not include genre. Genre is available on artist objects via a separate `/artists/{id}` call, which we haven't implemented yet.

**User-specific endpoints (not yet implemented)**
The following would require each user to connect their own Spotify account via the PKCE flow:
- Their saved/liked albums
- Listening history
- Playback control
- Currently playing track
