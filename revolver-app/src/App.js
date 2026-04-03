import React, { useState, useEffect, useCallback, useRef } from "react";
import './fonts.css';

// ═══════════════════════════════════════════════
//  Simple localStorage wrapper (replaces window.storage for local dev)
// ═══════════════════════════════════════════════
const storage = {
  async get(key) { const v = localStorage.getItem(key); return v ? { value: v } : null; },
  async set(key, value) { localStorage.setItem(key, value); return { key, value }; },
};

// ═══════════════════════════════════════════════
//  DATA
// ═══════════════════════════════════════════════

const SAMPLE_ALBUMS = [
  { id: "1", title: "Rumours", artist: "Fleetwood Mac", year: 1977, genre: "Rock", cover: "https://upload.wikimedia.org/wikipedia/en/f/fb/FMacRumworsCov.PNG" },
  { id: "2", title: "Kind of Blue", artist: "Miles Davis", year: 1959, genre: "Jazz", cover: "https://upload.wikimedia.org/wikipedia/en/9/9c/MilesDavisKindofBlue.jpg" },
  { id: "3", title: "Abbey Road", artist: "The Beatles", year: 1969, genre: "Rock", cover: "https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg" },
  { id: "4", title: "Purple Rain", artist: "Prince", year: 1984, genre: "Pop/R&B", cover: "https://upload.wikimedia.org/wikipedia/en/9/9c/Princepurplerain.jpg" },
  { id: "5", title: "Thriller", artist: "Michael Jackson", year: 1982, genre: "Pop", cover: "https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png" },
  { id: "6", title: "The Miseducation of Lauryn Hill", artist: "Lauryn Hill", year: 1998, genre: "Hip-Hop/Soul", cover: "https://upload.wikimedia.org/wikipedia/en/6/69/LaurynHillTheMiseducationofLaurynHillalbumcover.jpg" },
  { id: "7", title: "OK Computer", artist: "Radiohead", year: 1997, genre: "Alt Rock", cover: "https://upload.wikimedia.org/wikipedia/en/b/ba/Radioheadokcomputer.png" },
  { id: "8", title: "Blue", artist: "Joni Mitchell", year: 1971, genre: "Folk", cover: "https://upload.wikimedia.org/wikipedia/en/e/e1/Joni_Mitchell_%E2%80%93_Blue.png" },
  { id: "9", title: "Innervisions", artist: "Stevie Wonder", year: 1973, genre: "Soul/Funk", cover: "https://upload.wikimedia.org/wikipedia/en/0/0d/Innervisions.jpg" },
  { id: "10", title: "To Pimp a Butterfly", artist: "Kendrick Lamar", year: 2015, genre: "Hip-Hop", cover: "https://upload.wikimedia.org/wikipedia/en/f/f6/Kendrick_Lamar_-_To_Pimp_a_Butterfly.png" },
  { id: "11", title: "Blonde", artist: "Frank Ocean", year: 2016, genre: "R&B", cover: "https://upload.wikimedia.org/wikipedia/en/a/a0/Blonde_-_Frank_Ocean.png" },
  { id: "12", title: "Wish You Were Here", artist: "Pink Floyd", year: 1975, genre: "Prog Rock", cover: "https://upload.wikimedia.org/wikipedia/en/a/a4/Pink_Floyd%2C_Wish_You_Were_Here_%281975%29.png" },
];

const LOCAL_RELEASES = [
  { id: "L1", title: "Midnight on Main", artist: "The Velvet Coils", year: 2026, genre: "Indie Rock", local: true, city: "Austin, TX", description: "Dreamy psych-rock from the heart of 6th Street" },
  { id: "L2", title: "Concrete Garden", artist: "Jasmine Torres", year: 2026, genre: "Neo-Soul", local: true, city: "Brooklyn, NY", description: "Lush vocal layers over lo-fi beats" },
  { id: "L3", title: "Rust & Gold", artist: "Dead Pines", year: 2025, genre: "Alt-Country", local: true, city: "Nashville, TN", description: "Twangy storytelling with a punk edge" },
  { id: "L4", title: "Frequency Drift", artist: "Neon Orchid", year: 2026, genre: "Electronic", local: true, city: "Detroit, MI", description: "Techno roots meet ambient soundscapes" },
  { id: "L5", title: "Backyard Sessions", artist: "Milo & The Strays", year: 2025, genre: "Garage Rock", local: true, city: "Portland, OR", description: "Raw, unfiltered energy from DIY shows" },
  { id: "L6", title: "Terraza", artist: "Los Cometas", year: 2026, genre: "Latin Funk", local: true, city: "Los Angeles, CA", description: "Cumbia-infused grooves with brass fury" },
];

const GLOBAL_POPULAR = [
  { id: "gp1", title: "GNX", artist: "Kendrick Lamar", year: 2025, genre: "Hip-Hop", plays: "2.1B", trend: "+12%" },
  { id: "gp2", title: "Brat", artist: "Charli XCX", year: 2024, genre: "Pop", plays: "1.8B", trend: "+8%" },
  { id: "gp3", title: "Hit Me Hard and Soft", artist: "Billie Eilish", year: 2024, genre: "Alt Pop", plays: "1.6B", trend: "+5%" },
  { id: "gp4", title: "Short n' Sweet", artist: "Sabrina Carpenter", year: 2024, genre: "Pop", plays: "1.4B", trend: "+15%" },
  { id: "gp5", title: "Cowboy Carter", artist: "Beyonce", year: 2024, genre: "Country/R&B", plays: "1.3B", trend: "+3%" },
  { id: "gp6", title: "The Tortured Poets Department", artist: "Taylor Swift", year: 2024, genre: "Pop", plays: "1.2B", trend: "+2%" },
];

const REGIONAL_POPULAR = [
  { id: "rp1", title: "Midnight on Main", artist: "The Velvet Coils", genre: "Indie Rock", plays: "340K", city: "Austin" },
  { id: "rp2", title: "Terraza", artist: "Los Cometas", genre: "Latin Funk", plays: "280K", city: "Los Angeles" },
  { id: "rp3", title: "Concrete Garden", artist: "Jasmine Torres", genre: "Neo-Soul", plays: "215K", city: "Brooklyn" },
  { id: "rp4", title: "Backyard Sessions", artist: "Milo & The Strays", genre: "Garage Rock", plays: "190K", city: "Portland" },
  { id: "rp5", title: "Frequency Drift", artist: "Neon Orchid", genre: "Electronic", plays: "175K", city: "Detroit" },
];

const FRIEND_ACTIVITY = [
  { user: "vinyl_sarah", avatar: "S", color: "#c7543a", song: "Dreams", artist: "Fleetwood Mac", status: "listening now", online: true },
  { user: "bassline_mike", avatar: "M", color: "#4a7c59", song: "So What", artist: "Miles Davis", status: "2 min ago", online: true },
  { user: "groove_collective", avatar: "G", color: "#8b6914", song: "Alright", artist: "Kendrick Lamar", status: "5 min ago", online: true },
  { user: "analog_dreams", avatar: "A", color: "#2d5a7b", song: "Nights", artist: "Frank Ocean", status: "12 min ago", online: false },
  { user: "crate_digger_99", avatar: "C", color: "#7c3a6b", song: "Superstition", artist: "Stevie Wonder", status: "30 min ago", online: false },
  { user: "lo_fi_lucy", avatar: "L", color: "#5a4a3a", song: "A Case of You", artist: "Joni Mitchell", status: "1 hr ago", online: false },
];

const ACTIVITY_FEED = [
  { user: "vinyl_sarah", action: "rated", album: "Rumours", rating: 4.5, time: "2 hours ago", avatar: "S" },
  { user: "bassline_mike", action: "added to collection", album: "Kind of Blue", time: "4 hours ago", avatar: "M" },
  { user: "groove_collective", action: "reviewed", album: "To Pimp a Butterfly", rating: 5, time: "6 hours ago", avatar: "G", review: "A masterclass in storytelling through sound." },
  { user: "analog_dreams", action: "rated", album: "Blonde", rating: 4, time: "8 hours ago", avatar: "A" },
  { user: "crate_digger_99", action: "added to collection", album: "Innervisions", time: "12 hours ago", avatar: "C" },
  { user: "vinyl_sarah", action: "reviewed", album: "Blue", rating: 5, time: "1 day ago", avatar: "S", review: "Joni at her most vulnerable and beautiful." },
  { user: "bassline_mike", action: "rated", album: "OK Computer", rating: 4.5, time: "1 day ago", avatar: "M" },
];

const ON_REPEAT = [
  { title: "Dreams", artist: "Fleetwood Mac", plays: 47 },
  { title: "Nights", artist: "Frank Ocean", plays: 38 },
  { title: "Alright", artist: "Kendrick Lamar", plays: 34 },
  { title: "Superstition", artist: "Stevie Wonder", plays: 29 },
  { title: "Come Together", artist: "The Beatles", plays: 25 },
  { title: "Kiss", artist: "Prince", plays: 22 },
];

const STREAMING_SERVICES = [
  { id: "spotify", name: "Spotify", color: "#1DB954", icon: "🟢" },
  { id: "apple", name: "Apple Music", color: "#FC3C44", icon: "🔴" },
  { id: "amazon", name: "Amazon Music", color: "#25D1DA", icon: "🔵" },
  { id: "youtube", name: "YouTube Music", color: "#FF0000", icon: "▶" },
];

const PROFILE_PHOTOS = ["🎵","🎸","🎹","🎷","🥁","🎤","🎶","🎻","🪕","🎺","🪗","🎼"];

// ═══════════════════════════════════════════════
//  COMPONENTS
// ═══════════════════════════════════════════════

function VinylRecord({ size = 120, spinning = false }) {
  return (
    <div style={{ width:size, height:size, animation:spinning?"spin 3s linear infinite":"none", flexShrink:0 }}>
      <svg viewBox="0 0 120 120" width={size} height={size}>
        <circle cx="60" cy="60" r="58" fill="#111" stroke="#333" strokeWidth="1"/>
        {[52,46,40,34,28].map((r,i)=><circle key={r} cx="60" cy="60" r={r} fill="none" stroke="#222" strokeWidth={i%2===0?"0.5":"0.3"} opacity={i%2===0?"0.6":"0.4"}/>)}
        <circle cx="60" cy="60" r="18" fill="#c7543a" stroke="#a84030" strokeWidth="1"/>
        <circle cx="60" cy="60" r="4" fill="#111"/>
      </svg>
    </div>
  );
}

function StarRating({ rating, onRate, size = 20, interactive = true }) {
  const [hover, setHover] = useState(0);
  const handleClick = (v) => {
    if (!interactive || !onRate) return;
    onRate(rating === v ? 0 : v);
  };
  return (
    <div style={{ display:"flex",gap:2,alignItems:"center" }}>
      {[1,2,3,4,5].map(star=>{
        const filled=(hover||rating)>=star, half=!filled&&(hover||rating)>=star-0.5;
        return (
          <div key={star} style={{position:"relative",cursor:interactive?"pointer":"default",width:size,height:size}} onMouseLeave={()=>interactive&&setHover(0)}>
            <div style={{position:"absolute",left:0,top:0,width:"50%",height:"100%",zIndex:2}} onMouseEnter={()=>interactive&&setHover(star-0.5)} onClick={()=>handleClick(star-0.5)}/>
            <div style={{position:"absolute",right:0,top:0,width:"50%",height:"100%",zIndex:2}} onMouseEnter={()=>interactive&&setHover(star)} onClick={()=>handleClick(star)}/>
            <svg viewBox="0 0 24 24" width={size} height={size} style={{display:"block"}}>
              <defs><linearGradient id={`h${star}${size}`}><stop offset="50%" stopColor="#e8a849"/><stop offset="50%" stopColor="#444"/></linearGradient></defs>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill={filled?"#e8a849":half?`url(#h${star}${size})`:"#444"} stroke={filled||half?"#d4943d":"#555"} strokeWidth="1"/>
            </svg>
          </div>
        );
      })}
      {rating>0&&<span style={{fontSize:size*0.7,color:"#e8a849",marginLeft:4,fontFamily:"var(--mono)"}}>{rating.toFixed(1)}</span>}
    </div>
  );
}

function AlbumCover({ album, size = 200, style: extraStyle = {} }) {
  const [err, setErr] = useState(false);
  const C=["#c7543a","#4a7c59","#8b6914","#2d5a7b","#7c3a6b","#5a4a3a"];
  const ci=(album.title||"").length%C.length;
  return (
    <div style={{width:size,height:size,borderRadius:4,overflow:"hidden",background:C[ci],position:"relative",boxShadow:"0 4px 20px rgba(0,0,0,0.5)",...extraStyle}}>
      {!err&&album.cover?(
        <img src={album.cover} alt={album.title} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={()=>setErr(true)}/>
      ):(
        <div style={{width:"100%",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:10,background:`linear-gradient(135deg,${C[ci]},${C[(ci+2)%C.length]})`}}>
          <div style={{fontSize:typeof size==="number"?size*0.14:16,fontWeight:700,color:"#fff",textAlign:"center",lineHeight:1.2,fontFamily:"var(--disp)"}}>{album.title}</div>
          <div style={{fontSize:typeof size==="number"?size*0.07:9,color:"rgba(255,255,255,0.7)",marginTop:3,fontFamily:"var(--mono)"}}>{album.artist}</div>
        </div>
      )}
    </div>
  );
}

function AlbumModal({ album, onClose, ratings, onRate, collection, onToggleCollection, reviews, onReview }) {
  const r=ratings[album.id]||0, inC=collection.includes(album.id);
  const review=reviews[album.id]||"";
  const [confirmRemove, setConfirmRemove] = useState(false);

  const handleRemoveConfirmed = () => {
    onRate(album.id, 0);
    onReview(album.id, "");
    onToggleCollection(album.id);
    setConfirmRemove(false);
  };

  const handleCollectionClick = () => {
    if (inC) { setConfirmRemove(true); } else { onToggleCollection(album.id); }
  };

  return (
    <div style={{position:"fixed",inset:0,zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.85)",backdropFilter:"blur(8px)",padding:20}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:"linear-gradient(180deg,#2a2018,#1a1410)",borderRadius:16,maxWidth:480,width:"100%",padding:28,border:"1px solid rgba(232,168,73,0.2)",position:"relative",boxShadow:"0 20px 60px rgba(0,0,0,0.7)"}}>
        <button onClick={onClose} style={{position:"absolute",top:10,right:14,background:"none",border:"none",color:"#888",fontSize:22,cursor:"pointer"}}>✕</button>
        <div style={{display:"flex",gap:20,marginBottom:20}}>
          <AlbumCover album={album} size={140}/>
          <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center"}}>
            <h2 style={{fontFamily:"var(--disp)",color:"#f0e6d3",fontSize:20,margin:0,lineHeight:1.2}}>{album.title}</h2>
            <p style={{fontFamily:"var(--mono)",color:"#e8a849",fontSize:13,margin:"5px 0"}}>{album.artist}</p>
            <p style={{fontFamily:"var(--mono)",color:"#887766",fontSize:11}}>{album.year} · {album.genre}</p>
            {album.city&&<p style={{fontFamily:"var(--mono)",color:"#c7543a",fontSize:11,marginTop:3}}>📍 {album.city}</p>}
            {album.plays&&<p style={{fontFamily:"var(--mono)",color:"#4a7c59",fontSize:11,marginTop:3}}>▶ {album.plays} streams</p>}
          </div>
        </div>
        {album.description&&<p style={{fontFamily:"var(--mono)",color:"#aa9977",fontSize:12,lineHeight:1.6,margin:"0 0 16px",fontStyle:"italic"}}>"{album.description}"</p>}
        <div style={{marginBottom:14}}>
          <label style={{fontFamily:"var(--mono)",color:"#887766",fontSize:10,textTransform:"uppercase",letterSpacing:2}}>Your Rating</label>
          <div style={{marginTop:6}}><StarRating rating={r} onRate={v=>onRate(album.id,v)} size={26}/></div>
        </div>
        <div style={{marginBottom:16}}>
          <label style={{fontFamily:"var(--mono)",color:"#887766",fontSize:10,textTransform:"uppercase",letterSpacing:2,display:"block",marginBottom:6}}>Your Review</label>
          <textarea
            value={review}
            onChange={e=>onReview(album.id,e.target.value)}
            placeholder="Write your thoughts on this album..."
            rows={3}
            style={{width:"100%",padding:"9px 11px",borderRadius:8,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(232,168,73,0.15)",color:"#f0e6d3",fontFamily:"var(--mono)",fontSize:12,outline:"none",resize:"vertical",lineHeight:1.6,boxSizing:"border-box"}}
          />
        </div>

        {confirmRemove ? (
          <div style={{borderRadius:8,background:"rgba(199,84,58,0.1)",border:"1px solid rgba(199,84,58,0.3)",padding:"14px 16px"}}>
            <p style={{fontFamily:"var(--mono)",color:"#f0e6d3",fontSize:12,marginBottom:12,lineHeight:1.5}}>Remove from collection? Your rating and review will also be deleted.</p>
            <div style={{display:"flex",gap:8}}>
              <button onClick={handleRemoveConfirmed} style={{flex:1,padding:"9px 0",borderRadius:7,background:"rgba(199,84,58,0.25)",border:"1px solid #c7543a",color:"#c7543a",fontFamily:"var(--mono)",fontSize:12,cursor:"pointer"}}>Yes, Remove</button>
              <button onClick={()=>setConfirmRemove(false)} style={{flex:1,padding:"9px 0",borderRadius:7,background:"rgba(232,168,73,0.08)",border:"1px solid rgba(232,168,73,0.2)",color:"#e8a849",fontFamily:"var(--mono)",fontSize:12,cursor:"pointer"}}>Cancel</button>
            </div>
          </div>
        ) : (
          <button onClick={handleCollectionClick} style={{width:"100%",padding:"11px 0",borderRadius:8,background:inC?"rgba(199,84,58,0.2)":"rgba(232,168,73,0.12)",border:`1px solid ${inC?"#c7543a":"rgba(232,168,73,0.3)"}`,color:inC?"#c7543a":"#e8a849",fontFamily:"var(--mono)",fontSize:13,cursor:"pointer"}}>
            {inC?"✓ In Collection — Remove?":"+ Add to Collection"}
          </button>
        )}
      </div>
    </div>
  );
}

function Top4Picker({ type, current, onSave, onClose, allAlbums }) {
  const [selected, setSelected] = useState(current||[]);
  const [query, setQuery] = useState("");
  const songList=[
    {id:"s1",title:"Dreams",artist:"Fleetwood Mac"},{id:"s2",title:"So What",artist:"Miles Davis"},
    {id:"s3",title:"Come Together",artist:"The Beatles"},{id:"s4",title:"When Doves Cry",artist:"Prince"},
    {id:"s5",title:"Billie Jean",artist:"Michael Jackson"},{id:"s6",title:"Everything Is Everything",artist:"Lauryn Hill"},
    {id:"s7",title:"Paranoid Android",artist:"Radiohead"},{id:"s8",title:"A Case of You",artist:"Joni Mitchell"},
    {id:"s9",title:"Superstition",artist:"Stevie Wonder"},{id:"s10",title:"Alright",artist:"Kendrick Lamar"},
    {id:"s11",title:"Nights",artist:"Frank Ocean"},{id:"s12",title:"Wish You Were Here",artist:"Pink Floyd"},
    {id:"s13",title:"Space Oddity",artist:"David Bowie"},{id:"s14",title:"Purple Rain",artist:"Prince"},
    {id:"s15",title:"Bohemian Rhapsody",artist:"Queen"},{id:"s16",title:"Respect",artist:"Aretha Franklin"},
  ];
  const pool=type==="songs"?songList:allAlbums;
  const filtered=pool.filter(i=>i.title.toLowerCase().includes(query.toLowerCase())||i.artist.toLowerCase().includes(query.toLowerCase()));
  const toggle=item=>{if(selected.find(s=>s.id===item.id))setSelected(selected.filter(s=>s.id!==item.id));else if(selected.length<4)setSelected([...selected,item]);};
  return (
    <div style={{position:"fixed",inset:0,zIndex:1001,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.9)",backdropFilter:"blur(10px)",padding:20}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:"linear-gradient(180deg,#2a2018,#1a1410)",borderRadius:16,maxWidth:440,width:"100%",maxHeight:"80vh",display:"flex",flexDirection:"column",border:"1px solid rgba(232,168,73,0.2)"}}>
        <div style={{padding:"20px 20px 14px",borderBottom:"1px solid rgba(232,168,73,0.1)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <h3 style={{fontFamily:"var(--disp)",color:"#e8a849",fontSize:17}}>Pick Your Top 4 {type==="songs"?"Songs":"Albums"}</h3>
            <button onClick={onClose} style={{background:"none",border:"none",color:"#888",fontSize:18,cursor:"pointer"}}>✕</button>
          </div>
          <div style={{fontSize:11,color:"#887766",fontFamily:"var(--mono)",marginBottom:10}}>{selected.length}/4 selected</div>
          <input type="text" placeholder={`Search ${type}...`} value={query} onChange={e=>setQuery(e.target.value)} style={{width:"100%",padding:"9px 12px",borderRadius:8,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(232,168,73,0.12)",color:"#f0e6d3",fontFamily:"var(--mono)",fontSize:12,outline:"none"}}/>
        </div>
        {selected.length>0&&(
          <div style={{padding:"10px 20px",display:"flex",gap:6,flexWrap:"wrap",borderBottom:"1px solid rgba(232,168,73,0.1)"}}>
            {selected.map(i=><span key={i.id} onClick={()=>toggle(i)} style={{padding:"3px 8px",borderRadius:16,background:"rgba(232,168,73,0.12)",border:"1px solid rgba(232,168,73,0.25)",color:"#e8a849",fontSize:10,fontFamily:"var(--mono)",cursor:"pointer"}}>{i.title} ✕</span>)}
          </div>
        )}
        <div style={{flex:1,overflowY:"auto",padding:"6px 20px 14px"}}>
          {filtered.map(item=>{
            const sel=selected.find(s=>s.id===item.id),dis=!sel&&selected.length>=4;
            return (
              <div key={item.id} onClick={()=>!dis&&toggle(item)} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:"1px solid rgba(232,168,73,0.04)",cursor:dis?"not-allowed":"pointer",opacity:dis?0.3:1}}>
                <div style={{width:18,height:18,borderRadius:3,border:`2px solid ${sel?"#e8a849":"#554433"}`,background:sel?"#e8a849":"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#1a1410",flexShrink:0}}>{sel&&"✓"}</div>
                <div><div style={{fontFamily:"var(--disp)",fontSize:13,color:"#f0e6d3"}}>{item.title}</div><div style={{fontFamily:"var(--mono)",fontSize:10,color:"#887766"}}>{item.artist}</div></div>
              </div>
            );
          })}
        </div>
        <div style={{padding:"14px 20px",borderTop:"1px solid rgba(232,168,73,0.1)"}}>
          <button onClick={()=>{onSave(selected);onClose();}} style={{width:"100%",padding:"11px",borderRadius:8,background:"rgba(232,168,73,0.12)",border:"1px solid rgba(232,168,73,0.25)",color:"#e8a849",fontFamily:"var(--mono)",fontSize:13,cursor:"pointer"}}>Save Top 4</button>
        </div>
      </div>
    </div>
  );
}

function ProfilePanel({ onClose, profile, setProfile, connectedServices, toggleService, topSongs, topAlbums, setPickerOpen, save }) {
  return (
    <div style={{position:"fixed",inset:0,zIndex:1002,display:"flex",justifyContent:"flex-end"}} onClick={onClose}>
      <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(4px)"}}/>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:400,height:"100%",background:"linear-gradient(180deg,#201a14,#0d0a08)",borderLeft:"1px solid rgba(232,168,73,0.12)",overflowY:"auto",position:"relative",animation:"slideIn 0.3s ease",boxShadow:"-10px 0 40px rgba(0,0,0,0.5)"}}>
        <div style={{padding:"18px 18px 14px",borderBottom:"1px solid rgba(232,168,73,0.1)",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,background:"rgba(32,26,20,0.95)",backdropFilter:"blur(8px)",zIndex:2}}>
          <h2 style={{fontFamily:"var(--disp)",color:"#e8a849",fontSize:20}}>Your Profile</h2>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#887766",fontSize:18,cursor:"pointer"}}>✕</button>
        </div>
        <div style={{padding:18}}>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",marginBottom:22}}>
            <div style={{width:74,height:74,borderRadius:"50%",background:"linear-gradient(135deg,#c7543a,#e8a849)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:34,border:"3px solid rgba(232,168,73,0.3)",marginBottom:8}}>{profile.avatar}</div>
            <div style={{display:"flex",gap:3,flexWrap:"wrap",justifyContent:"center",maxWidth:200,marginBottom:10}}>
              {PROFILE_PHOTOS.map(e=>(
                <button key={e} onClick={()=>{const p={...profile,avatar:e};setProfile(p);save("rev-profile",p);}} style={{width:26,height:26,borderRadius:"50%",border:profile.avatar===e?"2px solid #e8a849":"1px solid #333",background:profile.avatar===e?"rgba(232,168,73,0.15)":"rgba(255,255,255,0.03)",fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{e}</button>
              ))}
            </div>
            <input value={profile.name} onChange={e=>{const p={...profile,name:e.target.value};setProfile(p);save("rev-profile",p);}} style={{fontFamily:"var(--disp)",fontSize:18,color:"#e8a849",background:"transparent",border:"none",borderBottom:"1px solid rgba(232,168,73,0.2)",textAlign:"center",outline:"none",width:"80%",padding:"3px 0"}} placeholder="Your username"/>
          </div>
          <div style={{marginBottom:20}}>
            <label style={{fontFamily:"var(--mono)",color:"#887766",fontSize:9,textTransform:"uppercase",letterSpacing:2,display:"block",marginBottom:5}}>Bio</label>
            <textarea value={profile.bio} onChange={e=>{const p={...profile,bio:e.target.value};setProfile(p);save("rev-profile",p);}} placeholder="Tell the world about your taste..." rows={3} style={{width:"100%",padding:"9px 11px",borderRadius:8,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(232,168,73,0.1)",color:"#f0e6d3",fontFamily:"var(--mono)",fontSize:11,outline:"none",resize:"vertical",lineHeight:1.6}}/>
          </div>
          <div style={{marginBottom:20}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <label style={{fontFamily:"var(--mono)",color:"#c7543a",fontSize:9,textTransform:"uppercase",letterSpacing:2}}>♫ Top 4 Songs</label>
              <button onClick={()=>setPickerOpen("songs")} style={{background:"none",border:"1px solid rgba(199,84,58,0.2)",borderRadius:4,color:"#c7543a",padding:"2px 7px",fontSize:8,cursor:"pointer",fontFamily:"var(--mono)"}}>{topSongs.length>0?"Edit":"+ Pick"}</button>
            </div>
            {topSongs.length===0?(
              <div style={{padding:14,borderRadius:8,border:"1px dashed rgba(199,84,58,0.15)",textAlign:"center",color:"#554433",fontSize:11}}>Pick your favorites</div>
            ):(
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
                {topSongs.map((s,i)=>(
                  <div key={s.id} style={{padding:"7px 9px",borderRadius:5,background:"rgba(199,84,58,0.06)",border:"1px solid rgba(199,84,58,0.08)"}}>
                    <span style={{fontSize:8,color:"#c7543a",fontWeight:700}}>#{i+1}</span>
                    <div style={{fontFamily:"var(--disp)",fontSize:11,color:"#f0e6d3",marginTop:1}}>{s.title}</div>
                    <div style={{fontSize:8,color:"#887766"}}>{s.artist}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{marginBottom:20}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <label style={{fontFamily:"var(--mono)",color:"#e8a849",fontSize:9,textTransform:"uppercase",letterSpacing:2}}>◉ Top 4 Albums</label>
              <button onClick={()=>setPickerOpen("albums")} style={{background:"none",border:"1px solid rgba(232,168,73,0.2)",borderRadius:4,color:"#e8a849",padding:"2px 7px",fontSize:8,cursor:"pointer",fontFamily:"var(--mono)"}}>{topAlbums.length>0?"Edit":"+ Pick"}</button>
            </div>
            {topAlbums.length===0?(
              <div style={{padding:14,borderRadius:8,border:"1px dashed rgba(232,168,73,0.12)",textAlign:"center",color:"#554433",fontSize:10}}>Pick your favorites</div>
            ):(
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:5}}>
                {topAlbums.map((a,i)=>(
                  <div key={a.id} style={{textAlign:"center"}}>
                    <AlbumCover album={a} size="100%" style={{width:"100%",height:0,paddingBottom:"100%",borderRadius:4}}/>
                    <div style={{fontSize:7,color:"#e8a849",fontWeight:700,marginTop:3}}>#{i+1}</div>
                    <div style={{fontFamily:"var(--disp)",fontSize:8,color:"#f0e6d3",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.title}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{marginBottom:20}}>
            <label style={{fontFamily:"var(--mono)",color:"#e8a849",fontSize:9,textTransform:"uppercase",letterSpacing:2,display:"block",marginBottom:8}}>🔁 On Repeat</label>
            {Object.values(connectedServices).some(v=>v)?(
              <div>{ON_REPEAT.map((t,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid rgba(232,168,73,0.04)"}}>
                  <div style={{display:"flex",alignItems:"center",gap:7}}>
                    <span style={{fontFamily:"var(--mono)",fontSize:9,color:"#554433",width:14}}>{i+1}</span>
                    <div><div style={{fontFamily:"var(--disp)",fontSize:11,color:"#f0e6d3"}}>{t.title}</div><div style={{fontSize:8,color:"#887766"}}>{t.artist}</div></div>
                  </div>
                  <span style={{fontSize:8,color:"#4a7c59",fontFamily:"var(--mono)"}}>{t.plays} plays</span>
                </div>
              ))}</div>
            ):(
              <div style={{padding:14,borderRadius:8,border:"1px dashed rgba(232,168,73,0.1)",textAlign:"center",color:"#554433",fontSize:10}}>🎧 Connect a streaming service to see your most played</div>
            )}
          </div>
          <div style={{marginBottom:16}}>
            <label style={{fontFamily:"var(--mono)",color:"#e8a849",fontSize:9,textTransform:"uppercase",letterSpacing:2,display:"block",marginBottom:8}}>🎧 Streaming Services</label>
            <div style={{display:"flex",flexDirection:"column",gap:5}}>
              {STREAMING_SERVICES.map(s=>{
                const on=connectedServices[s.id];
                return (
                  <div key={s.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 11px",borderRadius:8,background:on?`${s.color}08`:"rgba(255,255,255,0.02)",border:`1px solid ${on?s.color+"25":"rgba(255,255,255,0.04)"}`}}>
                    <div style={{display:"flex",alignItems:"center",gap:7}}>
                      <span style={{fontSize:13}}>{s.icon}</span>
                      <span style={{fontFamily:"var(--mono)",fontSize:11,color:on?s.color:"#887766"}}>{s.name}</span>
                    </div>
                    <button onClick={()=>toggleService(s.id)} style={{padding:"3px 9px",borderRadius:14,fontSize:8,fontFamily:"var(--mono)",textTransform:"uppercase",letterSpacing:1,cursor:"pointer",background:on?`${s.color}18`:"transparent",border:`1px solid ${on?s.color+"35":"#554433"}`,color:on?s.color:"#887766"}}>
                      {on?"Connected ✓":"Connect"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════════

export default function App() {
  const [tab, setTab] = useState("browse");
  const [ratings, setRatings] = useState({});
  const [reviews, setReviews] = useState({});
  const [collection, setCollection] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [connectedServices, setConnectedServices] = useState({});
  const [topSongs, setTopSongs] = useState([]);
  const [topAlbums, setTopAlbums] = useState([]);
  const [pickerOpen, setPickerOpen] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profile, setProfile] = useState({ name:"crate_digger", bio:"", avatar:"🎵" });
  const [browseSection, setBrowseSection] = useState("discover");
  const searchTimeout = useRef(null);

  const sv=(k,v)=>{try{storage.set(k,typeof v==="string"?v:JSON.stringify(v));}catch{}};

  useEffect(()=>{
    async function load(){
      try{const r=await storage.get("rev-ratings");if(r?.value)setRatings(JSON.parse(r.value));}catch{}
      try{const rv=await storage.get("rev-reviews");if(rv?.value)setReviews(JSON.parse(rv.value));}catch{}
      try{const c=await storage.get("rev-collection");if(c?.value)setCollection(JSON.parse(c.value));}catch{}
      try{const s=await storage.get("rev-services");if(s?.value)setConnectedServices(JSON.parse(s.value));}catch{}
      try{const t=await storage.get("rev-top-songs");if(t?.value)setTopSongs(JSON.parse(t.value));}catch{}
      try{const t=await storage.get("rev-top-albums");if(t?.value)setTopAlbums(JSON.parse(t.value));}catch{}
      try{const p=await storage.get("rev-profile");if(p?.value)setProfile(JSON.parse(p.value));}catch{}
      setLoaded(true);
    }
    load();
  },[]);

  const handleRate=useCallback((id,r)=>{setRatings(p=>{const n={...p,[id]:r};if(r===0){const m={...n};delete m[id];sv("rev-ratings",m);return m;}sv("rev-ratings",n);return n;});},[]);
  const handleReview=useCallback((id,text)=>{setReviews(p=>{const n={...p,[id]:text};if(!text){const m={...n};delete m[id];sv("rev-reviews",m);return m;}sv("rev-reviews",n);return n;});},[]);
  const handleToggleCollection=useCallback(id=>{setCollection(p=>{const n=p.includes(id)?p.filter(i=>i!==id):[...p,id];sv("rev-collection",n);return n;});},[]);
  const toggleService=id=>{setConnectedServices(p=>{const n={...p,[id]:!p[id]};sv("rev-services",n);return n;});};

  const handleSearch=useCallback(q=>{
    setSearchQuery(q);
    if(searchTimeout.current)clearTimeout(searchTimeout.current);
    if(!q.trim()){setSearchResults(null);return;}
    searchTimeout.current=setTimeout(async()=>{
      setSearching(true);
      try{
        const resp=await fetch(`https://musicbrainz.org/ws/2/release-group?query=${encodeURIComponent(q)}&type=album&limit=12&fmt=json`,{headers:{Accept:"application/json"}});
        const data=await resp.json();
        setSearchResults((data["release-groups"]||[]).map(rg=>({
          id:`mb-${rg.id}`,title:rg.title,artist:rg["artist-credit"]?.[0]?.name||"Unknown",
          year:rg["first-release-date"]?.substring(0,4)||"—",genre:rg.tags?.[0]?.name||"Album",
          cover:`https://coverartarchive.org/release-group/${rg.id}/front-250`,
        })));
      }catch{setSearchResults([]);}
      setSearching(false);
    },500);
  },[]);

  const allAlbums=[...SAMPLE_ALBUMS,...LOCAL_RELEASES];
  const collectionAlbums=allAlbums.filter(a=>collection.includes(a.id));

  const tabs=[
    {id:"browse",label:"Browse",icon:"◉"},
    {id:"collection",label:"Collection",icon:"◈"},
    {id:"local",label:"Local",icon:"⌖"},
    {id:"activity",label:"Activity",icon:"◎"},
  ];

  const browseSubs=[
    {id:"discover",label:"Discover"},
    {id:"friends",label:"Friends"},
    {id:"popular",label:"Global"},
    {id:"regional",label:"Near You"},
  ];

  if(!loaded)return(
    <div style={{minHeight:"100vh",background:"#0d0a08",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:14}}>
      <VinylRecord size={70} spinning/><span style={{fontFamily:"var(--mono)",color:"#554433",fontSize:11,letterSpacing:3,textTransform:"uppercase"}}>Loading...</span>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(180deg,#1a1410,#0d0a08)",color:"#f0e6d3",fontFamily:"var(--mono)"}}>
      <header style={{padding:"14px 18px 0",borderBottom:"1px solid rgba(232,168,73,0.1)",background:"linear-gradient(180deg,rgba(42,32,24,0.97),rgba(26,20,16,0.95))",position:"sticky",top:0,zIndex:100,backdropFilter:"blur(12px)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
          <div style={{display:"flex",alignItems:"center",gap:9}}>
            <VinylRecord size={26} spinning/>
            <h1 style={{fontFamily:"var(--logo)",fontSize:36,background:"linear-gradient(135deg,#e8a849 20%,#c7543a 80%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:2}}>Revolver</h1>
          </div>
          <button onClick={()=>setProfileOpen(true)} style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#c7543a,#e8a849)",border:"2px solid rgba(232,168,73,0.3)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,transition:"transform 0.2s"}}
            onMouseEnter={e=>e.currentTarget.style.transform="scale(1.1)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
            {profile.avatar}
          </button>
        </div>
        <nav style={{display:"flex",gap:0,overflowX:"auto"}}>
          {tabs.map(t=>(
            <button key={t.id} onClick={()=>{setTab(t.id);setSearchQuery("");setSearchResults(null);}}
              style={{padding:"7px 11px",border:"none",cursor:"pointer",fontFamily:"var(--disp)",fontSize:11,letterSpacing:1.5,background:tab===t.id?"rgba(232,168,73,0.1)":"transparent",color:tab===t.id?"#e8a849":"#776655",borderBottom:tab===t.id?"2px solid #e8a849":"2px solid transparent",whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:4}}>
              <span style={{fontSize:11}}>{t.icon}</span> {t.label}
              {t.id==="collection"&&collection.length>0&&<span style={{marginLeft:3,background:"#c7543a",color:"#fff",borderRadius:10,padding:"1px 5px",fontSize:8}}>{collection.length}</span>}
            </button>
          ))}
        </nav>
      </header>

      <main style={{padding:"18px",maxWidth:900,margin:"0 auto"}}>
        {tab==="browse"&&(
          <div style={{animation:"fadeIn 0.4s ease"}}>
            <div style={{display:"flex",gap:5,marginBottom:16,flexWrap:"wrap"}}>
              {browseSubs.map(s=>(
                <button key={s.id} onClick={()=>setBrowseSection(s.id)}
                  style={{padding:"5px 12px",borderRadius:18,fontFamily:"var(--disp)",fontSize:10,letterSpacing:1,cursor:"pointer",border:`1px solid ${browseSection===s.id?"rgba(232,168,73,0.3)":"rgba(255,255,255,0.06)"}`,background:browseSection===s.id?"rgba(232,168,73,0.1)":"transparent",color:browseSection===s.id?"#e8a849":"#776655",transition:"all 0.2s"}}>
                  {s.label}
                </button>
              ))}
            </div>

            {browseSection==="discover"&&(
              <>
                <div style={{marginBottom:18,position:"relative"}}>
                  <input type="text" placeholder="Search albums, artists..." value={searchQuery} onChange={e=>handleSearch(e.target.value)}
                    style={{width:"100%",padding:"11px 13px 11px 36px",borderRadius:10,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(232,168,73,0.1)",color:"#f0e6d3",fontFamily:"var(--mono)",fontSize:12,outline:"none"}}/>
                  <span style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",fontSize:13,opacity:0.4}}>🔍</span>
                  {searching&&<span style={{position:"absolute",right:11,top:"50%",transform:"translateY(-50%)"}}><VinylRecord size={15} spinning/></span>}
                </div>
                {searchResults&&<p style={{color:"#887766",fontSize:9,marginBottom:10,textTransform:"uppercase",letterSpacing:1.5}}>{searchResults.length} results from MusicBrainz</p>}
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:12}}>
                  {(searchResults||SAMPLE_ALBUMS).map((album,i)=>(
                    <div key={album.id} onClick={()=>setSelectedAlbum(album)} style={{cursor:"pointer",animation:`slideUp 0.4s ease ${i*0.03}s both`,transition:"transform 0.2s"}}
                      onMouseEnter={e=>e.currentTarget.style.transform="translateY(-3px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
                      <AlbumCover album={album} size="100%" style={{width:"100%",height:0,paddingBottom:"100%"}}/>
                      <div style={{marginTop:5}}>
                        <div style={{fontFamily:"var(--disp)",fontSize:11,color:"#f0e6d3",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{album.title}</div>
                        <div style={{fontSize:9,color:"#887766",marginTop:1}}>{album.artist}</div>
                        {ratings[album.id]&&<StarRating rating={ratings[album.id]} size={9} interactive={false}/>}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {browseSection==="friends"&&(
              <div>
                <h3 style={{fontFamily:"var(--disp)",fontSize:16,color:"#e8a849",marginBottom:12}}>Friends Listening Now</h3>
                {FRIEND_ACTIVITY.map((f,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:11,padding:"11px 0",borderBottom:"1px solid rgba(232,168,73,0.04)",animation:`slideUp 0.3s ease ${i*0.04}s both`}}>
                    <div style={{position:"relative"}}>
                      <div style={{width:36,height:36,borderRadius:"50%",background:`linear-gradient(135deg,${f.color},${f.color}88)`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--disp)",fontSize:14,color:"#fff"}}>{f.avatar}</div>
                      {f.online&&<div style={{position:"absolute",bottom:0,right:0,width:9,height:9,borderRadius:"50%",background:"#1DB954",border:"2px solid #1a1410"}}/>}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontFamily:"var(--mono)",fontSize:11,color:"#e8a849",fontWeight:700}}>{f.user}</div>
                      <div style={{display:"flex",alignItems:"center",gap:4,marginTop:1}}>
                        {f.online&&<span style={{display:"inline-block",width:5,height:5,background:"#1DB954",borderRadius:"50%",animation:"pulse 2s infinite"}}/>}
                        <span style={{fontFamily:"var(--disp)",fontSize:11,color:"#f0e6d3"}}>{f.song}</span>
                        <span style={{color:"#554433",fontSize:9}}>·</span>
                        <span style={{fontSize:9,color:"#887766"}}>{f.artist}</span>
                      </div>
                    </div>
                    <span style={{fontSize:8,color:"#554433",fontFamily:"var(--mono)",flexShrink:0}}>{f.status}</span>
                  </div>
                ))}
              </div>
            )}

            {browseSection==="popular"&&(
              <div>
                <h3 style={{fontFamily:"var(--disp)",fontSize:16,color:"#e8a849",marginBottom:3}}>Most Popular Worldwide</h3>
                <p style={{fontSize:9,color:"#665544",marginBottom:12,fontFamily:"var(--mono)"}}>Based on global streaming data</p>
                {GLOBAL_POPULAR.map((a,i)=>(
                  <div key={a.id} onClick={()=>setSelectedAlbum(a)} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 0",borderBottom:"1px solid rgba(232,168,73,0.04)",cursor:"pointer",animation:`slideUp 0.3s ease ${i*0.05}s both`}}>
                    <div style={{fontFamily:"var(--disp)",fontSize:18,color:i<3?"#e8a849":"#554433",width:24,textAlign:"center"}}>{i+1}</div>
                    <AlbumCover album={a} size={44}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontFamily:"var(--disp)",fontSize:13,color:"#f0e6d3",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.title}</div>
                      <div style={{fontSize:9,color:"#887766"}}>{a.artist} · {a.genre}</div>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <div style={{fontSize:10,color:"#e8a849",fontFamily:"var(--mono)"}}>{a.plays}</div>
                      <div style={{fontSize:8,color:"#4a7c59"}}>{a.trend}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {browseSection==="regional"&&(
              <div>
                <h3 style={{fontFamily:"var(--disp)",fontSize:16,color:"#c7543a",marginBottom:3}}>Popular In Your Area</h3>
                <p style={{fontSize:9,color:"#665544",marginBottom:12,fontFamily:"var(--mono)"}}>Trending near you</p>
                {REGIONAL_POPULAR.map((a,i)=>(
                  <div key={a.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",marginBottom:8,borderRadius:8,background:"linear-gradient(135deg,rgba(199,84,58,0.06),rgba(232,168,73,0.03))",border:"1px solid rgba(199,84,58,0.1)",animation:`slideUp 0.3s ease ${i*0.06}s both`,cursor:"pointer",transition:"all 0.2s"}}
                    onMouseEnter={e=>{e.currentTarget.style.background="linear-gradient(135deg,rgba(199,84,58,0.12),rgba(232,168,73,0.06))";}}
                    onMouseLeave={e=>{e.currentTarget.style.background="linear-gradient(135deg,rgba(199,84,58,0.06),rgba(232,168,73,0.03))";}}>
                    <div style={{fontFamily:"var(--disp)",fontSize:16,color:i<3?"#c7543a":"#554433",width:20,textAlign:"center"}}>{i+1}</div>
                    <AlbumCover album={a} size={40}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontFamily:"var(--disp)",fontSize:12,color:"#f0e6d3"}}>{a.title}</div>
                      <div style={{fontSize:9,color:"#887766"}}>{a.artist} · {a.genre}</div>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <div style={{fontSize:9,color:"#c7543a",fontFamily:"var(--mono)"}}>📍 {a.city}</div>
                      <div style={{fontSize:9,color:"#e8a849",fontFamily:"var(--mono)"}}>{a.plays}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab==="collection"&&(
          <div style={{animation:"fadeIn 0.4s ease"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
              <h2 style={{fontFamily:"var(--disp)",fontSize:18,color:"#e8a849"}}>Your Collection</h2>
              <span style={{fontSize:10,color:"#887766"}}>{collectionAlbums.length} album{collectionAlbums.length!==1?"s":""}</span>
            </div>
            {collectionAlbums.length===0?(
              <div style={{textAlign:"center",padding:"40px 0",color:"#665544"}}><VinylRecord size={56}/><p style={{marginTop:10,fontSize:11}}>Your crate is empty.</p></div>
            ):(
              <div style={{display:"flex",flexDirection:"column",gap:7}}>
                {collectionAlbums.map((album,i)=>(
                  <div key={album.id} onClick={()=>setSelectedAlbum(album)} style={{display:"flex",gap:10,padding:9,borderRadius:7,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(232,168,73,0.06)",cursor:"pointer",transition:"all 0.2s",animation:`slideUp 0.3s ease ${i*0.04}s both`}}>
                    <AlbumCover album={album} size={46}/>
                    <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center"}}>
                      <div style={{fontFamily:"var(--disp)",fontSize:12,color:"#f0e6d3"}}>{album.title}</div>
                      <div style={{fontSize:9,color:"#887766"}}>{album.artist} · {album.year}</div>
                      {ratings[album.id]&&<StarRating rating={ratings[album.id]} size={10} interactive={false}/>}
                    </div>
                    <button onClick={e=>{e.stopPropagation();handleToggleCollection(album.id);}} style={{background:"none",border:"1px solid rgba(199,84,58,0.2)",borderRadius:4,color:"#c7543a",padding:"2px 6px",fontSize:8,cursor:"pointer",fontFamily:"var(--mono)",alignSelf:"center"}}>Remove</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab==="local"&&(
          <div style={{animation:"fadeIn 0.4s ease"}}>
            <h2 style={{fontFamily:"var(--disp)",fontSize:18,color:"#c7543a",marginBottom:3}}>Local Releases</h2>
            <p style={{fontSize:9,color:"#887766",marginBottom:14}}>Fresh sounds from artists in your area</p>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {LOCAL_RELEASES.map((album,i)=>(
                <div key={album.id} onClick={()=>setSelectedAlbum(album)} style={{display:"flex",gap:14,padding:14,borderRadius:10,background:"linear-gradient(135deg,rgba(199,84,58,0.06),rgba(232,168,73,0.03))",border:"1px solid rgba(199,84,58,0.1)",cursor:"pointer",transition:"all 0.3s",animation:`slideUp 0.4s ease ${i*0.06}s both`}}>
                  <AlbumCover album={album} size={72}/>
                  <div style={{flex:1}}>
                    <div style={{display:"inline-block",padding:"1px 5px",borderRadius:3,background:"rgba(199,84,58,0.15)",color:"#c7543a",fontSize:8,textTransform:"uppercase",letterSpacing:1.5,marginBottom:3}}>📍 {album.city}</div>
                    <h3 style={{fontFamily:"var(--disp)",fontSize:14,color:"#f0e6d3",margin:"2px 0"}}>{album.title}</h3>
                    <p style={{fontSize:10,color:"#e8a849"}}>{album.artist}</p>
                    <p style={{fontSize:9,color:"#887766"}}>{album.year} · {album.genre}</p>
                    <p style={{fontSize:10,color:"#aa9977",marginTop:4,fontStyle:"italic",lineHeight:1.5}}>{album.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==="activity"&&(
          <div style={{animation:"fadeIn 0.4s ease"}}>
            <h2 style={{fontFamily:"var(--disp)",fontSize:18,color:"#e8a849",marginBottom:16}}>Activity Feed</h2>
            {ACTIVITY_FEED.map((item,i)=>(
              <div key={i} style={{display:"flex",gap:9,padding:"10px 0",borderBottom:"1px solid rgba(232,168,73,0.04)",animation:`slideUp 0.3s ease ${i*0.04}s both`}}>
                <div style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#c7543a,#e8a849)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--disp)",fontSize:12,color:"#fff",flexShrink:0}}>{item.avatar}</div>
                <div style={{flex:1}}>
                  <p style={{fontSize:11,lineHeight:1.5}}>
                    <span style={{color:"#e8a849",fontWeight:700}}>{item.user}</span>
                    <span style={{color:"#887766"}}> {item.action} </span>
                    <span style={{color:"#f0e6d3",fontFamily:"var(--disp)"}}>{item.album}</span>
                  </p>
                  {item.rating&&<div style={{marginTop:2}}><StarRating rating={item.rating} size={9} interactive={false}/></div>}
                  {item.review&&<p style={{fontSize:10,color:"#aa9977",marginTop:3,fontStyle:"italic",padding:"4px 8px",borderLeft:"2px solid rgba(232,168,73,0.15)",lineHeight:1.5}}>"{item.review}"</p>}
                  <p style={{fontSize:8,color:"#554433",marginTop:2}}>{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {selectedAlbum&&<AlbumModal album={selectedAlbum} onClose={()=>setSelectedAlbum(null)} ratings={ratings} onRate={handleRate} collection={collection} onToggleCollection={handleToggleCollection} reviews={reviews} onReview={handleReview}/>}
      {pickerOpen&&<Top4Picker type={pickerOpen} current={pickerOpen==="songs"?topSongs:topAlbums} allAlbums={allAlbums} onSave={items=>{if(pickerOpen==="songs"){setTopSongs(items);sv("rev-top-songs",items);}else{setTopAlbums(items);sv("rev-top-albums",items);}}} onClose={()=>setPickerOpen(null)}/>}
      {profileOpen&&<ProfilePanel onClose={()=>setProfileOpen(false)} profile={profile} setProfile={setProfile} connectedServices={connectedServices} toggleService={toggleService} topSongs={topSongs} topAlbums={topAlbums} setPickerOpen={setPickerOpen} save={sv}/>}

      <footer style={{textAlign:"center",padding:"28px 18px 16px",color:"#2a1a0a",fontSize:8,letterSpacing:2.5,textTransform:"uppercase"}}>Revolver · Spin · Rate · Collect</footer>
    </div>
  );
}
