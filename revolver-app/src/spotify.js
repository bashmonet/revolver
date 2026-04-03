const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;

let token = null;
let tokenExpiry = 0;

async function getToken() {
  if (token && Date.now() < tokenExpiry) return token;
  const resp = await fetch("/spotify-auth/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
  });
  const data = await resp.json();
  console.log("[Spotify] token response:", data);
  token = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
  return token;
}

async function spotifyFetch(path) {
  const t = await getToken();
  console.log("[Spotify] fetching:", path, "token:", t?.slice(0,20));
  const resp = await fetch("/spotify-api/v1" + path, {
    headers: { Authorization: "Bearer " + t },
  });
  const data = await resp.json();
  console.log("[Spotify] response:", data);
  return data;
}


export async function searchAlbums(query) {
  const q = encodeURIComponent(query);
  const [p1, p2, p3] = await Promise.all([
    spotifyFetch(`/search?q=${q}&type=album&limit=10&offset=0&market=US`),
    spotifyFetch(`/search?q=${q}&type=album&limit=10&offset=10&market=US`),
    spotifyFetch(`/search?q=${q}&type=album&limit=10&offset=20&market=US`),
  ]);
  return [
    ...(p1.albums?.items || []),
    ...(p2.albums?.items || []),
    ...(p3.albums?.items || []),
  ].map(formatAlbum);
}

export async function getNewReleases() {
  const data = await spotifyFetch("/search?q=year:2024&type=album&limit=10&market=US");
  return (data.albums?.items || []).map(formatAlbum);
}

export async function getAlbumDetails(spotifyId) {
  const data = await spotifyFetch(`/albums/${spotifyId}`);
  return {
    ...formatAlbum(data),
    tracks: (data.tracks?.items || []).map(t => ({
      id: t.id,
      title: t.name,
      duration: msToTime(t.duration_ms),
      trackNumber: t.track_number,
    })),
    label: data.label,
    popularity: data.popularity,
  };
}

function formatAlbum(a) {
  return {
    id: "sp-" + a.id,
    spotifyId: a.id,
    title: a.name,
    artist: a.artists?.[0]?.name || "Unknown",
    year: a.release_date ? parseInt(a.release_date.slice(0, 4)) : null,
    genre: "",
    cover: a.images?.[0]?.url || null,
    spotifyUrl: a.external_urls?.spotify,
  };
}

function msToTime(ms) {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
