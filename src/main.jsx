import { useEffect, useMemo, useRef, useState } from 'react';
import './styles.css';

const cheers = ['Hebat!', 'Bagus sekali!', 'Kamu berhasil!', 'Luar biasa!'];

function linePoints(x1, y1, x2, y2, count = 24) {
  return Array.from({ length: count }, (_, i) => {
    const t = i / (count - 1);
    return [x1 + (x2 - x1) * t, y1 + (y2 - y1) * t];
  });
}
function polylinePoints(points, steps = 12) {
  return points.slice(0, -1).flatMap((p, i) => {
    const n = points[i + 1];
    return Array.from({ length: steps }, (_, j) => {
      const t = j / steps;
      return [p[0] + (n[0] - p[0]) * t, p[1] + (n[1] - p[1]) * t];
    });
  }).concat([points[points.length - 1]]);
}
function curvePoints() {
  return Array.from({ length: 35 }, (_, i) => {
    const t = i / 34;
    return [0.11 + t * 0.78, 0.52 - Math.sin(t * Math.PI) * 0.28];
  });
}
function housePoints() {
  return polylinePoints([[0.16,0.76],[0.16,0.47],[0.5,0.18],[0.84,0.47],[0.84,0.76],[0.16,0.76]], 14);
}
const levels = [
  { title: 'Garis lurus', subtitle: 'Tarik garis dari titik awal sampai akhir.', icon: '—', tone: 'coral', points: linePoints(0.14, 0.5, 0.86, 0.5) },
  { title: 'Garis horizontal', subtitle: 'Berjalan ke samping, dari kiri ke kanan.', icon: '↔', tone: 'teal', points: linePoints(0.13, 0.5, 0.87, 0.5) },
  { title: 'Garis vertikal', subtitle: 'Naik dan turun dengan pelan.', icon: '↕', tone: 'yellow', points: linePoints(0.5, 0.18, 0.5, 0.82) },
  { title: 'Garis miring', subtitle: 'Ikuti garis yang menanjak.', icon: '╱', tone: 'lavender', points: linePoints(0.16, 0.8, 0.84, 0.2) },
  { title: 'Garis zig-zag', subtitle: 'Naik turun mengikuti sudut-sudutnya.', icon: '〽', tone: 'coral', points: polylinePoints([[0.12,0.7],[0.24,0.3],[0.36,0.7],[0.48,0.3],[0.6,0.7],[0.72,0.3],[0.88,0.7]], 10) },
  { title: 'Garis lengkung', subtitle: 'Seperti senyum yang lembut.', icon: '⌒', tone: 'teal', points: curvePoints() },
  { title: 'Bentuk segitiga', subtitle: 'Ikuti tiga sisi sampai kembali ke awal.', icon: '△', tone: 'yellow', points: polylinePoints([[0.5,0.18],[0.17,0.78],[0.83,0.78],[0.5,0.18]], 16) },
  { title: 'Bentuk segi empat', subtitle: 'Telusuri empat sudutnya.', icon: '□', tone: 'lavender', points: polylinePoints([[0.2,0.22],[0.8,0.22],[0.8,0.78],[0.2,0.78],[0.2,0.22]], 16) },
  { title: 'Bentuk dasar rumah', subtitle: 'Gabungan segitiga dan segi empat.', icon: '⌂', tone: 'coral', points: housePoints() },
  { title: 'Gambar rumah', subtitle: 'Tracing gambar rumah sampai selesai.', icon: '🏠', tone: 'teal', points: polylinePoints([[0.15,0.76],[0.15,0.48],[0.5,0.16],[0.85,0.48],[0.85,0.76],[0.15,0.76],[0.36,0.76],[0.36,0.56],[0.53,0.56],[0.53,0.76],[0.69,0.76],[0.69,0.62],[0.78,0.62],[0.78,0.76]], 12) },
];

function readProgress() {
  try { return JSON.parse(localStorage.getItem('tracing-pola-progress') || '[]'); } catch { return []; }
}
function closestPoint(point, points, from = 0) {
  let best = { index: from, distance: Infinity };
  for (let i = Math.max(0, from - 1); i < points.length - 1; i += 1) {
    const a = points[i], b = points[i + 1];
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const ratio = Math.max(0, Math.min(1, ((point[0]-a[0])*dx + (point[1]-a[1])*dy) / (dx*dx + dy*dy || 1)));
    const q = [a[0] + dx * ratio, a[1] + dy * ratio];
    const distance = Math.hypot(point[0]-q[0], point[1]-q[1]);
    if (distance < best.distance) best = { index: i, distance };
  }
  return best;
}

function App() {
  const [screen, setScreen] = useState('home');
  const [index, setIndex] = useState(0);
  const [completed, setCompleted] = useState(readProgress);
  const [notice, setNotice] = useState('');
  const [musicOn, setMusicOn] = useState(false);
  const audioRef = useRef(null);
  useEffect(() => { localStorage.setItem('tracing-pola-progress', JSON.stringify(completed)); }, [completed]);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.loop = true;
    audio.volume = 0.22;
    if (musicOn) audio.play().catch(() => setMusicOn(false));
    else audio.pause();
  }, [musicOn]);
  const finish = (i) => {
    setCompleted((current) => current.includes(i) ? current : [...current, i]);
    setNotice(cheers[Math.floor(Math.random() * cheers.length)]);
    window.setTimeout(() => setNotice(''), 2200);
  };
  return <div className="app-shell">
    <audio ref={audioRef} src="/audio/tracing-ceria.mp3" preload="metadata" />
    <header className="topbar"><button className="brand" onClick={() => setScreen('home')}><span className="brand-mark">✦</span><span><strong>Jejak Ceria</strong><small>tracing pola</small></span></button><div className="top-actions"><button className={`music-toggle ${musicOn ? 'on' : ''}`} onClick={() => setMusicOn((value) => !value)} aria-label={musicOn ? 'Matikan lagu' : 'Nyalakan lagu'}>{musicOn ? '♫ Lagu on' : '♫ Lagu off'}</button><span className="progress-pill">★ <b>{completed.length}</b> / {levels.length} selesai</span>{screen !== 'home' && <button className="home-link" onClick={() => setScreen('home')}>⌂ Beranda</button>}</div></header>
    <main className="main-content">
      {screen === 'home' ? <Home completed={completed} onStart={() => { setMusicOn(true); setScreen('levels'); }} /> : screen === 'levels' ? <LevelSelect completed={completed} onBack={() => setScreen('home')} onPick={(i) => { setIndex(i); setScreen('game'); }} /> : <TracingGame level={levels[index]} index={index} completed={completed} onBack={() => setScreen('levels')} onSelect={(i) => setIndex(i)} onComplete={() => finish(index)} />}
    </main>
    <footer>Belajar pelan-pelan, tangan makin terampil ✦</footer>{notice && <div className="toast">★ {notice}</div>}
  </div>;
}

function Home({ completed, onStart }) {
  const pct = Math.round((completed.length / levels.length) * 100);
  return <section className="home page-enter"><div className="hero-copy"><div className="eyebrow"><i /> Kegiatan tracing untuk si kecil</div><h1>Ikuti jejaknya,<br /><em>buat pola ceria!</em></h1><p>Kenali garis dan bentuk dasar sambil melatih fokus, koordinasi mata-tangan, serta kesiapan menulis.</p><button className="button primary" onClick={onStart}>✍ Mulai tracing <span>→</span></button><div className="progress-card"><div><b>Perjalananmu</b><strong>{pct}% selesai</strong></div><div className="track"><i style={{ width: `${Math.max(3, pct)}%` }} /></div><small>{completed.length ? 'Teruskan, kamu hebat!' : 'Belum mulai — ayo coba satu pola!'}</small></div></div><div className="hero-art"><div className="sun" /><div className="paper-card"><div className="paper-title">Pola hari ini <span>✦</span></div><div className="mini-path"><div className="mini-line" /><div className="mini-zig" /><div className="mini-circle" /></div><div className="speech">Pelan-pelan, pasti bisa!</div></div><span className="sticker star">★</span><span className="sticker heart">♥</span></div><div className="home-feature"><span>👀</span><b>Fokus</b><small>lihat jalurnya</small><span>🖐️</span><b>Motorik halus</b><small>ikuti dengan tangan</small><span>🌟</span><b>Rasa percaya diri</b><small>rayakan setiap langkah</small></div></section>;
}

function LevelSelect({ completed, onBack, onPick }) {
  return <section className="subpage page-enter"><button className="back" onClick={onBack}>← Kembali</button><div className="intro"><div className="eyebrow"><i /> Pilih pola</div><h1>Mulai dari yang sederhana</h1><p>Setiap pola punya langkah kecil. Pilih satu dan ikuti garis putus-putusnya.</p></div><div className="level-grid">{levels.map((level, i) => <button key={level.title} className={`level-card ${level.tone} ${completed.includes(i) ? 'done' : ''}`} onClick={() => onPick(i)}><span className="level-number">{completed.includes(i) ? '✓' : String(i + 1).padStart(2, '0')}</span><span className="level-icon">{level.icon}</span><span className="level-text"><b>{level.title}</b><small>{level.subtitle}</small></span><span className="level-arrow">→</span></button>)}</div></section>;
}

function TracingGame({ level, index, completed, onBack, onSelect, onComplete }) {
  const canvasRef = useRef(null); const [phase, setPhase] = useState('ready'); const [pointerDown, setPointerDown] = useState(false); const [active, setActive] = useState(0); const [stroke, setStroke] = useState([]); const points = level.points;
  useEffect(() => { setPhase('ready'); setPointerDown(false); setActive(0); setStroke([]); }, [index, level]);
  useEffect(() => { const canvas = canvasRef.current; if (!canvas) return; const draw = () => { const rect = canvas.getBoundingClientRect(); const ratio = devicePixelRatio || 1; canvas.width = rect.width * ratio; canvas.height = rect.height * ratio; const ctx = canvas.getContext('2d'); ctx.scale(ratio, ratio); ctx.clearRect(0, 0, rect.width, rect.height); const px = ([x,y]) => [x*rect.width,y*rect.height]; const path = (items, color, width, dash=[]) => { ctx.beginPath(); ctx.setLineDash(dash); ctx.lineCap='round'; ctx.lineJoin='round'; ctx.strokeStyle=color; ctx.lineWidth=width; items.forEach((p,i)=>{const [x,y]=px(p); i?ctx.lineTo(x,y):ctx.moveTo(x,y);}); ctx.stroke(); }; path(points,'#b5d8d1',Math.max(18,rect.width*.035),[11,13]); path(points,'#fffef8',Math.max(7,rect.width*.013)); if(stroke.length>1) path(stroke,'#1ba89b',Math.max(11,rect.width*.024)); const [sx,sy]=px(points[0]),[fx,fy]=px(points[points.length-1]); [[sx,sy,'#f47c62','S'],[fx,fy,'#f7c948','★']].forEach(([x,y,c,t])=>{ctx.beginPath();ctx.arc(x,y,19,0,Math.PI*2);ctx.fillStyle=c;ctx.fill();ctx.lineWidth=4;ctx.strokeStyle='#fff';ctx.stroke();ctx.fillStyle='#fff';ctx.font='900 13px Nunito, sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(t,x,y);}); }; draw(); window.addEventListener('resize',draw); return ()=>window.removeEventListener('resize',draw); }, [points, stroke]);
  const point = (e) => { const r=canvasRef.current.getBoundingClientRect(); return [Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),Math.max(0,Math.min(1,(e.clientY-r.top)/r.height))]; };
  const dist = (a,b) => Math.hypot(a[0]-b[0],a[1]-b[1]);
  const start = (e) => { const p=point(e); if(dist(p,points[0])>.16){setPhase('mistake');return;} e.currentTarget.setPointerCapture?.(e.pointerId); setPointerDown(true);setPhase('playing');setActive(0);setStroke([p]); };
  const move = (e) => { if(!pointerDown)return; const p=point(e); const near=closestPoint(p,points,active); if(near.distance>.22){setPointerDown(false);setPhase('mistake');return;} setStroke(s=>[...s,p]); const next=Math.min(points.length-1,Math.max(active,near.index+1)); setActive(next); if(next>=points.length-1 && dist(p,points[points.length-1])<.17){setPointerDown(false);setPhase('done');onComplete();} };
  const end = () => { if(pointerDown){setPointerDown(false); if(phase==='playing')setPhase('mistake');} };
  const retry = () => {setPhase('ready');setPointerDown(false);setActive(0);setStroke([]);};
  return <section className="game-page page-enter"><div className="game-top"><button className="back" onClick={onBack}>← Semua pola</button><div className="game-title"><div className="eyebrow"><i /> Pola {index+1} dari {levels.length}</div><h1>{level.title}</h1><p>{level.subtitle}</p></div><span className="step-badge">{completed.includes(index) ? '✓ Selesai' : 'Sedang belajar'}</span></div><div className="game-layout"><div className="play-card"><div className="play-head"><span className="instruction">👆 <b>{phase==='done'?'Hebat, selesai!':phase==='mistake'?'Tidak apa-apa, coba lagi':'Ikuti garis putus-putus'}</b><small>{phase==='done'?'Kamu sudah sampai di bintang.':phase==='mistake'?'Mulai lagi dari titik S.':'Mulai dari S, lalu menuju bintang.'}</small></span><span className={`shape-badge ${level.tone}`}>{level.icon}</span></div><div className="canvas-wrap"><canvas ref={canvasRef} onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerCancel={end} /><span className="canvas-note">{phase==='ready'?'Sentuh titik S untuk mulai':''}{phase==='done'?'★ Selesai dengan hebat!':''}</span></div><div className="play-bottom"><span className={phase==='mistake'?'warn':''}>{phase==='mistake'?'↻ Ikuti garisnya lebih pelan.':phase==='done'?'✦ Jejakmu rapi!':'♡ Kamu pasti bisa!'}</span><div><button className="button ghost" onClick={retry}>↻ Ulangi</button>{phase==='done' && <button className="button primary" onClick={() => index+1<levels.length ? onSelect(index+1) : onBack()}>{index+1<levels.length?'Pola berikutnya →':'Kembali ke semua pola'}</button>}</div></div></div><aside className="side-rail"><b>Urutan belajar</b>{levels.map((item,i)=><button key={item.title} className={`${i===index?'active ':''}${completed.includes(i)?'done':''}`} onClick={()=>onSelect(i)}><span>{completed.includes(i)?'✓':i+1}</span><small>{item.title}</small></button>)}</aside></div></section>;
}

export default App;
