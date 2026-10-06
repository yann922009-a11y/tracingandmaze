import { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const cheers = ['Hebat!', 'Bagus sekali!', 'Kamu berhasil!', 'Luar biasa!'];
const mazeAvatars = ['👧', '👦', '🧒', '👩', '👨'];

const tracingLevels = [
  { title: 'Garis lurus', subtitle: 'Tarik garis dari titik awal sampai akhir', icon: '—', difficulty: 'Mudah', points: linePoints(0.12, 0.5, 0.88, 0.5) },
  { title: 'Garis horizontal', subtitle: 'Jalan dari kiri ke kanan', icon: '↔️', difficulty: 'Mudah', points: linePoints(0.12, 0.5, 0.88, 0.5) },
  { title: 'Garis vertikal', subtitle: 'Naik turun menuju tujuan', icon: '↕️', difficulty: 'Mudah', points: linePoints(0.5, 0.12, 0.5, 0.88) },
  { title: 'Garis miring', subtitle: 'Ikuti garis yang menanjak', icon: '↗️', difficulty: 'Mudah', points: linePoints(0.14, 0.82, 0.86, 0.18) },
  { title: 'Garis zig-zag', subtitle: 'Ikuti jalan naik turun', icon: '⚡', difficulty: 'Sedang', points: polylinePoints([[0.12, 0.76], [0.24, 0.3], [0.36, 0.76], [0.48, 0.3], [0.6, 0.76], [0.72, 0.3], [0.88, 0.76]], 10) },
  { title: 'Garis lengkung', subtitle: 'Jalan lembut seperti senyum', icon: '〰️', difficulty: 'Sedang', points: [[0.12, 0.66], [0.22, 0.48], [0.34, 0.36], [0.46, 0.34], [0.58, 0.4], [0.68, 0.54], [0.78, 0.7], [0.88, 0.78]] },
  { title: 'Bentuk segitiga', subtitle: 'Ikuti tiga sisinya', icon: '△', difficulty: 'Sedang', points: polylinePoints([[0.5, 0.18], [0.16, 0.78], [0.84, 0.78], [0.5, 0.18]], 16) },
  { title: 'Bentuk segi empat', subtitle: 'Telusuri empat sudutnya', icon: '□', difficulty: 'Sedang', points: polylinePoints([[0.2, 0.22], [0.8, 0.22], [0.8, 0.78], [0.2, 0.78], [0.2, 0.22]], 16) },
  { title: 'Bentuk dasar rumah', subtitle: 'Gabungan segitiga dan segi empat', icon: '⌂', difficulty: 'Lebih sulit', points: polylinePoints([[0.14, 0.78], [0.14, 0.48], [0.5, 0.18], [0.86, 0.48], [0.86, 0.78]], 14) },
  { title: 'Gambar rumah', subtitle: 'Tracing rumah sampai selesai', icon: '🏠', difficulty: 'Lebih sulit', points: polylinePoints([[0.12, 0.78], [0.12, 0.48], [0.5, 0.16], [0.88, 0.48], [0.88, 0.78], [0.72, 0.78], [0.72, 0.58], [0.58, 0.58], [0.58, 0.78]], 14) }
];

const mazeLevels = [
  { title: 'Anak → Ibu', subtitle: 'Cari jalan menuju Ibu', icon: '👧 → 👩', startIcon: '👧', finishIcon: '👩', difficulty: 'Mudah', path: [[0,0],[0,1],[0,2],[1,2],[2,2],[2,3],[2,4],[3,4],[4,4],[4,5],[4,6],[5,6],[5,7]], deadEnds: [[1,0],[2,0],[3,1],[3,5],[5,1],[1,5]] },
  { title: 'Anak → Ayah', subtitle: 'Lewati tikungan kecil', icon: '👦 → 👨', startIcon: '👦', finishIcon: '👨', difficulty: 'Mudah', path: [[5,0],[4,0],[4,1],[3,1],[2,1],[2,2],[2,3],[1,3],[1,4],[1,5],[2,5],[3,5],[3,6],[3,7]], deadEnds: [[5,1],[5,3],[4,3],[0,2],[0,5],[4,6],[2,7]] },
  { title: 'Kakak → Adik', subtitle: 'Pilih belokan yang tepat', icon: '🧒 → 🧒', startIcon: '🧒', finishIcon: '👶', difficulty: 'Sedang', path: [[0,0],[1,0],[2,0],[2,1],[2,2],[3,2],[3,3],[3,4],[2,4],[1,4],[1,5],[1,6],[2,6],[3,6],[4,6],[4,7]], deadEnds: [[0,1],[0,3],[2,3],[4,2],[5,4],[0,6],[5,6]] },
  { title: 'Kakek/Nenek → Rumah', subtitle: 'Jalurnya makin berliku', icon: '👵 → 🏠', startIcon: '👵', finishIcon: '🏠', difficulty: 'Sedang', path: [[5,0],[5,1],[4,1],[3,1],[3,2],[3,3],[4,3],[4,4],[3,4],[2,4],[2,5],[1,5],[1,6],[0,6],[0,7]], deadEnds: [[4,0],[2,1],[1,2],[2,3],[5,3],[5,5],[3,6],[2,7]] },
  { title: 'Semua keluarga → Rumah', subtitle: 'Petualangan keluarga terakhir', icon: '👨‍👩‍👧‍👦 → 🏠', startIcon: '👨‍👩‍👧‍👦', finishIcon: '🏠', difficulty: 'Lebih sulit', path: [[0,0],[0,1],[1,1],[1,2],[2,2],[2,3],[3,3],[3,2],[4,2],[4,3],[4,4],[3,4],[3,5],[2,5],[2,6],[1,6],[1,7],[2,7],[3,7],[4,7],[5,7]], deadEnds: [[0,3],[0,5],[2,0],[3,1],[5,1],[5,3],[5,5],[4,6],[0,7]] }
];

function linePoints(x1, y1, x2, y2, count = 18) {
  return Array.from({ length: count }, (_, i) => {
    const t = i / (count - 1);
    return [x1 + (x2 - x1) * t, y1 + (y2 - y1) * t];
  });
}

function wavePoints() {
  return Array.from({ length: 25 }, (_, i) => {
    const x = 0.12 + (0.76 * i) / 24;
    const y = 0.5 + Math.sin(i / 2.2) * 0.16;
    return [x, y];
  });
}

function circlePoints() {
  return Array.from({ length: 34 }, (_, i) => {
    const t = (Math.PI * 1.82 * i) / 33 - Math.PI * 0.91;
    return [0.5 + Math.cos(t) * 0.29, 0.5 + Math.sin(t) * 0.29];
  });
}

function polylinePoints(points, steps = 10) {
  return points.slice(0, -1).flatMap((point, index) => {
    const next = points[index + 1];
    return Array.from({ length: steps }, (_, step) => {
      const t = step / steps;
      return [point[0] + (next[0] - point[0]) * t, point[1] + (next[1] - point[1]) * t];
    });
  }).concat([points[points.length - 1]]);
}

function closestPointOnPath(point, points, fromIndex, lookAhead = points.length - 1) {
  let closest = { index: fromIndex, distance: Infinity, point: points[fromIndex] };
  for (let index = Math.max(0, fromIndex - 1); index < Math.min(points.length - 1, lookAhead); index += 1) {
    const start = points[index];
    const end = points[index + 1];
    const dx = end[0] - start[0];
    const dy = end[1] - start[1];
    const lengthSquared = dx * dx + dy * dy || 1;
    const ratio = Math.max(0, Math.min(1, ((point[0] - start[0]) * dx + (point[1] - start[1]) * dy) / lengthSquared));
    const projected = [start[0] + dx * ratio, start[1] + dy * ratio];
    const distance = Math.hypot(point[0] - projected[0], point[1] - projected[1]);
    if (distance < closest.distance) closest = { index, distance, point: projected };
  }
  return closest;
}

function traceAccuracy(samples, points) {
  if (!samples.length) return 0;
  const totalDistance = samples.reduce((total, sample) => total + closestPointOnPath(sample, points, 0).distance, 0);
  return Math.max(0, Math.min(1, 1 - (totalDistance / samples.length) / 0.18));
}

function readProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem('keluargaku-progress') || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveProgress(progress) {
  try {
    localStorage.setItem('keluargaku-progress', JSON.stringify(progress));
  } catch {
    // Game tetap berjalan meskipun storage browser tidak tersedia.
  }
}

const audioState = { context: null, musicTimer: null, musicOn: false, musicIndex: 0 };

function getAudioContext() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    if (!audioState.context) audioState.context = new AudioContext();
    if (audioState.context.state === 'suspended') audioState.context.resume();
    return audioState.context;
  } catch {
    return null;
  }
}

function playTone(frequency, duration = 0.12, type = 'sine', volume = 0.06, delay = 0) {
  const context = getAudioContext();
  if (!context) return;
  const startAt = context.currentTime + delay;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startAt);
  gain.gain.setValueAtTime(0.001, startAt);
  gain.gain.exponentialRampToValueAtTime(volume, startAt + 0.025);
  gain.gain.exponentialRampToValueAtTime(0.001, startAt + duration);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start(startAt);
  oscillator.stop(startAt + duration + 0.03);
}

function playMoveSound() {
  playTone(520, 0.07, 'triangle', 0.035);
}

function playCollisionSound() {
  playTone(190, 0.12, 'square', 0.035);
  playTone(120, 0.18, 'sawtooth', 0.025, 0.08);
}

function playSuccessSound() {
  [523.25, 659.25, 783.99, 1046.5].forEach((frequency, index) => playTone(frequency, 0.3, 'sine', 0.1, index * 0.1));
}

function startBackgroundMusic() {
  const context = getAudioContext();
  if (!context || audioState.musicTimer) { audioState.musicOn = Boolean(context); return audioState.musicOn; }
  const melody = [261.63, 329.63, 392, 329.63, 293.66, 349.23, 440, 349.23];
  audioState.musicOn = true;
  audioState.musicIndex = 0;
  const playNext = () => {
    if (!audioState.musicOn) return;
    playTone(melody[audioState.musicIndex % melody.length], 0.42, 'sine', 0.018);
    audioState.musicIndex += 1;
  };
  playNext();
  audioState.musicTimer = window.setInterval(playNext, 560);
  return true;
}

function stopBackgroundMusic() {
  audioState.musicOn = false;
  if (audioState.musicTimer) window.clearInterval(audioState.musicTimer);
  audioState.musicTimer = null;
}


function App() {
  const [screen, setScreen] = useState('home');
  const [mode, setMode] = useState('tracing');
  const [levelIndex, setLevelIndex] = useState(0);
  const [completed, setCompleted] = useState(readProgress);
  const [notice, setNotice] = useState('');
  const [musicOn, setMusicOn] = useState(false);
  const audioRef = useRef(null);

  const totalComplete = completed.length;
  const allDone = totalComplete >= tracingLevels.length + mazeLevels.length;
  const activeLevels = mode === 'tracing' ? tracingLevels : mazeLevels;

  useEffect(() => {
    saveProgress(completed);
  }, [completed]);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(''), 3200);
    return () => window.clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.loop = true;
    audio.volume = 0.22;
    if (musicOn) audio.play().catch(() => setMusicOn(false));
    else audio.pause();
  }, [musicOn]);

  function openGame(nextMode = 'tracing') {
    setMusicOn(true);
    setMode(nextMode);
    setScreen('game-select');
  }

  function startLevel(nextMode, index) {
    setMusicOn(true);
    setMode(nextMode);
    setLevelIndex(index);
    setScreen(nextMode);
  }

  function finishLevel(type, index) {
    const key = `${type}-${index}`;
    setCompleted((current) => current.includes(key) ? current : [...current, key]);
    setNotice(cheers[Math.floor(Math.random() * cheers.length)]);
    playSuccessSound();
    if (completed.length + (completed.includes(key) ? 0 : 1) >= tracingLevels.length + mazeLevels.length) {
      window.setTimeout(() => setScreen('completion'), 1200);
    }
  }

  function toggleMusic() {
    setMusicOn((current) => !current);
  }

  function handleExit() {
    setNotice('Sampai jumpa! Kamu bisa menutup tab ini ya.');
  }

  return (
    <div className="app-shell">
      <audio ref={audioRef} src="/audio/tracing-ceria.mp3" preload="metadata" />
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <Header screen={screen} completed={totalComplete} musicOn={musicOn} onToggleMusic={toggleMusic} onHome={() => setScreen('home')} onGame={() => openGame(mode)} />
      <main className="main-content">
        {screen === 'home' && <Home completed={completed} allDone={allDone} onGame={() => openGame('tracing')} onMaterial={() => setScreen('material')} onGuide={() => setScreen('guide')} onExit={handleExit} />}
        {screen === 'game-select' && <GameSelect completed={completed} onPick={(nextMode) => startLevel(nextMode, 0)} onBack={() => setScreen('home')} />}
        {screen === 'material' && <Material onBack={() => setScreen('home')} />}
        {screen === 'guide' && <Guide onBack={() => setScreen('home')} />}
        {screen === 'tracing' && <TracingGame level={tracingLevels[levelIndex]} index={levelIndex} total={tracingLevels.length} completed={completed} onComplete={() => finishLevel('tracing', levelIndex)} onBack={() => setScreen('game-select')} onSelect={(index) => setLevelIndex(index)} />}
        {screen === 'maze' && <MazeGame level={mazeLevels[levelIndex]} index={levelIndex} total={mazeLevels.length} completed={completed} onComplete={() => finishLevel('maze', levelIndex)} onBack={() => setScreen('game-select')} onSelect={(index) => setLevelIndex(index)} />}
        {screen === 'completion' && <Completion onHome={() => setScreen('home')} onGame={() => openGame('tracing')} />}
      </main>
      {notice && <div className="toast" role="status"><span className="toast-star">★</span>{notice}</div>}
      <footer className="site-footer"><span>Made for little explorers</span><span>•</span><span>Belajar pelan-pelan, tumbuh bersama</span></footer>
    </div>
  );
}

function Header({ screen, completed, musicOn, onToggleMusic, onHome, onGame }) {
  const isHome = screen === 'home';
  return (
    <header className="topbar">
      <button className="brand" onClick={onHome} aria-label="Kembali ke beranda">
        <span className="brand-mark"><span>★</span></span>
        <span className="brand-copy"><strong>Keluargaku</strong><small>tracing & maze</small></span>
      </button>
      <div className="topbar-right"><button className={`audio-toggle ${musicOn ? 'is-on' : ''}`} onClick={onToggleMusic} aria-label="Nyalakan atau matikan musik">{musicOn ? '♫ Musik' : '♫ Suara'}</button>
        {!isHome && <button className="mini-link" onClick={onHome}>⌂ Beranda</button>}
        {isHome && <button className="mini-link" onClick={onGame}>Ayo bermain <span>→</span></button>}
        <div className="progress-pill"><span className="pill-star">★</span><strong>{completed}</strong><span>/ 15 level</span></div>
      </div>
    </header>
  );
}

function Home({ completed, allDone, onGame, onMaterial, onGuide, onExit }) {
  const progress = Math.round((completed.length / 15) * 100);
  return (
    <section className="home-page page-enter"><div className="menu-cloud menu-cloud-one"><i /><i /><i /></div><div className="menu-cloud menu-cloud-two"><i /><i /><i /></div><div className="menu-cloud menu-cloud-three"><i /><i /><i /></div>
      <div className="hero-copy">
        <div className="eyebrow"><span className="eyebrow-dot" /> Petualangan belajar untuk si kecil</div>
        <h1>Kenali keluarga,<br /><span>ikuti jejaknya!</span></h1>
        <p className="hero-lead">Ayo mengenal keluarga sambil bermain. Latih tangan, mata, dan fokusmu lewat tracing seru dan maze penuh kejutan.</p>
        <div className="hero-actions">
          <button className="button button-primary button-large" onClick={onGame}><span className="button-icon">🎮</span> Mulai bermain <span className="button-arrow">→</span></button>
          <button className="button button-ghost button-large" onClick={onMaterial}><span className="button-icon">📖</span> Lihat materi</button>
        </div>
        <div className="home-links"><button onClick={onGuide}>Cara bermain <span>↗</span></button><span className="link-dot">•</span><button onClick={onExit}>Keluar</button></div>
        <div className="progress-card">
          <div className="progress-card-top"><span><span className="mini-sparkle">✦</span> Perjalananmu</span><strong>{progress}% selesai</strong></div>
          <div className="progress-track"><span style={{ width: `${Math.max(progress, 4)}%` }} /></div>
          <div className="progress-card-bottom"><span>{completed.length === 0 ? 'Belum mulai — ayo coba satu level!' : 'Teruskan, kamu hebat!'}</span><span>{completed.length}/15</span></div>
        </div>
      </div>
      <div className="hero-art-wrap">
        <div className="art-sun" />
        <div className="art-cloud cloud-one" /><div className="art-cloud cloud-two" />
        <div className="family-card">
          <div className="family-card-label"><span className="label-dot" /> Keluarga ceria</div>
          <FamilyIllustration />
          <div className="family-speech">Ayo, kita mulai! <span>✦</span></div>
        </div>
        <div className="float-sticker sticker-heart">♥</div><div className="float-sticker sticker-star">★</div><div className="float-sticker sticker-flower">✿</div>
        <div className="art-ground"><span>•</span><span>•</span><span>•</span><span>•</span><span>•</span></div>
      </div>
      <div className="feature-strip">
        <Feature icon="✍️" title="Tracing" text="Ikuti garis & bentuk" color="coral" onClick={onGame} />
        <Feature icon="🧩" title="Maze" text="Temukan jalan pulang" color="teal" onClick={onGame} />
        <Feature icon="💛" title="Tanpa takut salah" text="Coba pelan-pelan" color="yellow" onClick={onGuide} />
      </div>
      {allDone && <div className="done-banner"><span>🎉</span><div><strong>Semua permainan selesai!</strong><small>Penghargaanmu sudah menunggu.</small></div><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Lihat lagi ↑</button></div>}
    </section>
  );
}

function FamilyIllustration() {
  return (
    <div className="family-illustration" aria-label="Ilustrasi keluarga tersenyum">
      <div className="family-character grandma"><span className="char-hair">◒</span><span className="char-face">👵</span><small>Nenek</small></div>
      <div className="family-character dad"><span className="char-face">👨</span><small>Ayah</small></div>
      <div className="family-character child"><span className="char-face">👧</span><small>Aku</small></div>
      <div className="family-character mom"><span className="char-face">👩</span><small>Ibu</small></div>
      <div className="family-character grandpa"><span className="char-face">👴</span><small>Kakek</small></div>
    </div>
  );
}

function Feature({ icon, title, text, color, onClick }) {
  return <button className={`feature-card feature-${color}`} onClick={onClick}><span className="feature-icon">{icon}</span><span><strong>{title}</strong><small>{text}</small></span><span className="feature-chevron">›</span></button>;
}

function GameSelect({ completed, onPick, onBack }) {
  const traceDone = completed.filter((key) => key.startsWith('tracing-')).length;
  const mazeDone = completed.filter((key) => key.startsWith('maze-')).length;
  return (
    <section className="subpage page-enter">
      <PageIntro eyebrow="Pilih petualangan" title="Mau bermain yang mana?" description="Setiap permainan punya misi kecil. Pilih satu, lalu ikuti langkahnya." onBack={onBack} />
      <div className="mode-cards">
        <button className="mode-card mode-tracing" onClick={() => onPick('tracing')}>
          <div className="mode-card-top"><span className="mode-icon">✍️</span><span className="mode-count">{traceDone}/10 selesai</span></div>
          <div className="mode-doodle doodle-line" />
          <h2>TRACING</h2><p>Ikuti garis, bentuk, dan pola dengan jari atau mouse.</p>
          <div className="mode-card-bottom"><span>Mulai dari garis lurus</span><b>→</b></div>
        </button>
        <button className="mode-card mode-maze" onClick={() => onPick('maze')}>
          <div className="mode-card-top"><span className="mode-icon">🧩</span><span className="mode-count">{mazeDone}/5 selesai</span></div>
          <div className="mode-doodle doodle-maze"><i /><i /><i /></div>
          <h2>MAZE</h2><p>Cari jalan yang benar dari START menuju keluarga.</p>
          <div className="mode-card-bottom"><span>Temukan jalan pulang</span><b>→</b></div>
        </button>
      </div>
      <div className="learning-note"><span>💡</span><p><strong>Tips kecil:</strong> tidak perlu terburu-buru. Mata lihat jalur, tangan mengikuti.</p></div>
    </section>
  );
}

function PageIntro({ eyebrow, title, description, onBack }) {
  return <div className="page-intro"><button className="back-button" onClick={onBack}>← <span>Kembali</span></button><div className="eyebrow"><span className="eyebrow-dot" /> {eyebrow}</div><h1>{title}</h1><p>{description}</p></div>;
}

function Material({ onBack }) {
  return (
    <section className="subpage page-enter info-page">
      <PageIntro eyebrow="Ruang belajar" title="Kenali cara bermainnya" description="Sebelum mulai, kenalan dulu dengan dua permainan kecil kita." onBack={onBack} />
      <div className="info-grid">
        <article className="info-card info-coral"><div className="info-card-icon">✍️</div><span className="info-kicker">PERMAINAN 01</span><h2>Tracing</h2><p>Tracing adalah kegiatan mengikuti garis, bentuk, atau pola menggunakan jari atau mouse.</p><p>Permainan ini membantu melatih koordinasi mata dan tangan, ketelitian, kerapian, dan kemampuan menulis dasar.</p><div className="info-tip"><span>✦</span> Pelan-pelan, ikuti jejaknya.</div></article>
        <article className="info-card info-teal"><div className="info-card-icon">🧩</div><span className="info-kicker">PERMAINAN 02</span><h2>Maze</h2><p>Maze adalah permainan mencari jalan yang benar menuju tujuan.</p><p>Permainan ini membantu melatih fokus, kesabaran, kemampuan menentukan arah, dan pemecahan masalah.</p><div className="info-tip"><span>✦</span> Lihat jalan, lalu pilih.</div></article>
      </div>
      <div className="skill-row"><Skill icon="👀" text="Fokus" /><Skill icon="🖐️" text="Motorik halus" /><Skill icon="🧠" text="Berpikir" /><Skill icon="💛" text="Sabar" /></div>
    </section>
  );
}

function Skill({ icon, text }) { return <div className="skill-chip"><span>{icon}</span><strong>{text}</strong></div>; }

function Guide({ onBack }) {
  const tracingSteps = ['Klik tombol Game.', 'Pilih permainan Tracing.', 'Ikuti garis atau pola yang tersedia.', 'Gunakan jari atau mouse dengan hati-hati.', 'Selesaikan tracing sampai titik akhir.'];
  const mazeSteps = ['Klik tombol Game.', 'Pilih permainan Maze.', 'Mulai dari titik START.', 'Cari jalan yang benar menuju tujuan.', 'Hindari jalan buntu.', 'Selesaikan maze sampai FINISH.'];
  return (
    <section className="subpage page-enter info-page">
      <PageIntro eyebrow="Teman bermain" title="Cara bermain" description="Ikuti langkahnya. Kalau belum pas, tidak apa-apa—kita coba lagi." onBack={onBack} />
      <div className="guide-grid"><GuideCard icon="✍️" title="Cara Tracing" steps={tracingSteps} color="coral" /><GuideCard icon="🧩" title="Cara Maze" steps={mazeSteps} color="teal" /></div>
      <div className="soft-reminder"><span className="reminder-icon">🌼</span><div><strong>Ingat ya!</strong><p>Kalau keluar jalur atau bertemu jalan buntu, tidak ada yang gagal. Tarik napas, tekan <b>Coba lagi</b>, dan cari pelan-pelan.</p></div></div>
    </section>
  );
}

function GuideCard({ icon, title, steps, color }) { return <article className={`guide-card guide-${color}`}><div className="guide-title"><span>{icon}</span><h2>{title}</h2></div><ol>{steps.map((step, index) => <li key={step}><span>{index + 1}</span><p>{step}</p></li>)}</ol></article>; }

function LevelRail({ levels, mode, current, completed, onSelect }) {
  return <div className="level-rail"><div className="level-rail-head"><span><span className="mini-sparkle">✦</span> Pilih level</span><small>{levels.length} tantangan</small></div><div className="level-list">{levels.map((level, index) => { const key = `${mode}-${index}`; const done = completed.includes(key); return <button key={level.title} className={`level-chip ${index === current ? 'active' : ''} ${done ? 'done' : ''}`} onClick={() => onSelect(index)}><span className="level-number">{done ? '✓' : index + 1}</span><span className="level-chip-copy"><strong>{level.title}</strong><small>{level.difficulty}</small></span><span className="level-chip-arrow">{index === current ? '●' : '›'}</span></button>; })}</div></div>;
}

function GameHeader({ type, level, index, total, completed, onBack }) {
  const label = type === 'tracing' ? 'Tracing' : 'Maze';
  const done = completed.filter((key) => key.startsWith(`${type}-`)).length;
  return <div className="game-header"><button className="back-button" onClick={onBack}>← <span>Kembali ke pilihan game</span></button><div className="game-heading"><div className="eyebrow"><span className="eyebrow-dot" /> {label} · Level {index + 1}</div><h1>{level.title}</h1><p>{level.subtitle}</p></div><div className="game-progress"><span>{done}/{total} selesai</span><div className="progress-track"><span style={{ width: `${Math.max(8, (done / total) * 100)}%` }} /></div></div></div>;
}

function TracingGame({ level, index, total, completed, onComplete, onBack, onSelect }) {
  const canvasRef = useRef(null);
  const [phase, setPhase] = useState('ready');
  const [activePoint, setActivePoint] = useState(0);
  const [stroke, setStroke] = useState([]);
  const [traceSamples, setTraceSamples] = useState([]);
  const [stars, setStars] = useState(0);
  const [feedback, setFeedback] = useState('Mulai dari titik START, ya.');
  const [pointerDown, setPointerDown] = useState(false);
  const points = level.points;

  useEffect(() => {
    setPhase('ready'); setActivePoint(0); setStroke([]); setTraceSamples([]); setStars(0); setFeedback('Mulai dari titik START, ya.'); setPointerDown(false);
  }, [index, level]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      const ctx = canvas.getContext('2d');
      ctx.scale(ratio, ratio);
      ctx.clearRect(0, 0, rect.width, rect.height);
      const toPx = ([x, y]) => [x * rect.width, y * rect.height];
      const drawPath = (items, style, width, dash = []) => {
        if (!items.length) return;
        ctx.beginPath(); ctx.setLineDash(dash); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.miterLimit = 2; ctx.strokeStyle = style; ctx.lineWidth = width;
        items.forEach((point, pointIndex) => { const [x, y] = toPx(point); pointIndex ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke(); ctx.setLineDash([]);
      };
      drawPath(points, '#8fc8ff', Math.max(14, rect.width * 0.025), [12, 12]);
      drawPath(points, '#f4fbff', Math.max(5, rect.width * 0.009));
      if (stroke.length > 1) drawPath(stroke, '#1ba89b', Math.max(10, rect.width * 0.022));
      const [sx, sy] = toPx(points[0]); const [fx, fy] = toPx(points[points.length - 1]);
      ctx.beginPath(); ctx.arc(sx, sy, 17, 0, Math.PI * 2); ctx.fillStyle = '#4285f4'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = '#fff'; ctx.stroke();
      ctx.beginPath(); ctx.arc(fx, fy, 17, 0, Math.PI * 2); ctx.fillStyle = '#f7c948'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = '#fff'; ctx.stroke();
      ctx.font = '800 13px Nunito, Arial Rounded MT Bold, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#fff'; ctx.fillText('S', sx, sy); ctx.fillText('★', fx, fy);
    };
    draw(); window.addEventListener('resize', draw); return () => window.removeEventListener('resize', draw);
  }, [points, stroke, phase]);

  const getPoint = (event) => { const rect = canvasRef.current.getBoundingClientRect(); return [Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)), Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height))]; };
  const distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  const start = (event) => { if (phase === 'done') return; const point = getPoint(event); if (distance(point, points[0]) > 0.14) { setFeedback('Sentuh titik START dulu, ya.'); return; } event.currentTarget.setPointerCapture?.(event.pointerId); setPhase('playing'); setPointerDown(true); setActivePoint(0); setStroke([point]); setTraceSamples([point]); setStars(0); setFeedback('Bagus, ikuti garisnya dengan gayamu!'); };
  const move = (event) => {
    if (!pointerDown || phase !== 'playing') return;
    const point = getPoint(event);
    const closest = closestPointOnPath(point, points, activePoint, Math.min(points.length - 1, activePoint + 12));
    const isForward = closest.index >= Math.max(0, activePoint - 1);
    setTraceSamples((current) => [...current, point]);
    if (isForward && closest.distance < 0.19) {
      const nextIndex = Math.min(points.length - 1, Math.max(activePoint, closest.index + 1));
      setActivePoint(nextIndex);
      setStroke((current) => [...current, point]);
      const atFinish = nextIndex >= points.length - 1 && distance(point, points[points.length - 1]) < 0.24;
      if (atFinish) {
        const samples = [...traceSamples, point];
        const score = traceAccuracy(samples, points);
        const earnedStars = score >= 0.9 ? 3 : score >= 0.65 ? 2 : 1;
        setStars(earnedStars); setPointerDown(false); setPhase('done'); setFeedback(`${Math.round(score * 100)}% rapi — ${earnedStars === 3 ? 'sempurna!' : 'hebat, kamu berhasil!'}`); onComplete();
      }
    } else if (closest.distance > 0.25) {
      setPointerDown(false); setPhase('mistake'); setFeedback('Coba ikuti arah garisnya lagi.');
    }
  };
  const end = () => { if (!pointerDown || phase !== 'playing') return; setPointerDown(false); setPhase('mistake'); setFeedback('Coba ikuti garisnya lagi.'); };
  const retry = () => { setPhase('ready'); setActivePoint(0); setStroke([]); setTraceSamples([]); setStars(0); setFeedback('Mulai lagi dari titik START, ya.'); };
  const progress = Math.round((activePoint / (points.length - 1)) * 100);

  return <section className="game-page page-enter"><GameHeader type="tracing" level={level} index={index} total={total} completed={completed} onBack={onBack} /><div className="game-layout"><div className="game-main"><div className="play-card tracing-card"><div className="play-card-top"><div className="play-instruction"><span className="instruction-bubble">👆</span><div><strong>{phase === 'done' ? 'Selesai dengan hebat!' : phase === 'mistake' ? 'Tidak apa-apa, coba lagi' : 'Ikuti garis putus-putus'}</strong><small>{phase === 'done' ? 'Lihat bintang di ujung jalur.' : 'Mulai di titik merah dan menuju bintang kuning.'}</small></div></div><span className="difficulty-badge">{level.difficulty}</span></div><div className="canvas-wrap"><canvas ref={canvasRef} onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerCancel={end} className={`tracing-canvas ${phase === 'playing' ? 'is-playing' : ''}`} /><div className="canvas-decoration canvas-leaf">✦</div><div className="canvas-decoration canvas-flower">✿</div>{phase === 'ready' && <div className="start-hint">Sentuh <b>START</b>, lalu ikuti garis dengan bebas</div>}{phase === 'done' && <div className="success-stamp"><span>★</span><strong>Hebat!</strong><small>{'★'.repeat(stars)} · {stars === 3 ? 'Sangat rapi' : stars === 2 ? 'Cukup rapi' : 'Tetap hebat'}</small></div>}</div><div className="play-card-bottom"><div className="feedback-line"><span className={phase === 'mistake' ? 'feedback-warn' : phase === 'done' ? 'feedback-good' : ''}>{phase === 'done' ? '✦' : phase === 'mistake' ? '↻' : '♡'}</span>{feedback}</div><div className="game-actions"><button className="button button-ghost" onClick={retry}>↻ Ulangi</button>{phase === 'done' && <button className="button button-primary" onClick={() => index + 1 < total ? onSelect(index + 1) : onBack()}>{index + 1 < total ? 'Level berikutnya →' : 'Kembali ke game'}</button>}</div></div></div><div className="progress-under"><span>Progress jalur</span><div className="progress-track"><span style={{ width: `${Math.max(3, progress)}%` }} /></div><strong>{progress}%</strong></div></div><LevelRail levels={tracingLevels} mode="tracing" current={index} completed={completed} onSelect={onSelect} /></div></section>;
}

function MazeGame({ level, index, total, completed, onComplete, onBack, onSelect }) {
  const [status, setStatus] = useState('ready');
  const [trail, setTrail] = useState([]);
  const [pathIndex, setPathIndex] = useState(0);
  const [feedback, setFeedback] = useState('Mulai dari kotak START.');
  const [dragging, setDragging] = useState(false);
  const [playerIcon, setPlayerIcon] = useState(level.startIcon);
  const path = level.path;
  useEffect(() => { setStatus('ready'); setTrail([]); setPathIndex(0); setPlayerIcon(level.startIcon); setFeedback('Mulai dari kotak START.'); setDragging(false); }, [index, level]);
  const same = (a, b) => a && b && a[0] === b[0] && a[1] === b[1];
  const cellFromEvent = (event) => { const rect = event.currentTarget.getBoundingClientRect(); const col = Math.max(0, Math.min(7, Math.floor(((event.clientX - rect.left) / rect.width) * 8))); const row = Math.max(0, Math.min(5, Math.floor(((event.clientY - rect.top) / rect.height) * 6))); return [row, col]; };
  const activate = () => { setStatus('playing'); setTrail([path[0]]); setPathIndex(0); setFeedback('Bagus! Ikuti jalan menuju rumah.'); };
  const processCell = (cell, currentIndex = pathIndex) => {
    if (status === 'done' || status === 'mistake') return;
    if (same(cell, path[currentIndex])) return;
    const nextIndex = path.findIndex((step, stepIndex) => stepIndex > currentIndex && same(step, cell));
    const isForwardOnPath = nextIndex > currentIndex;
    if (isForwardOnPath) {
      playMoveSound();
      setPathIndex(nextIndex);
      setTrail((currentTrail) => [...currentTrail, ...path.slice(currentIndex + 1, nextIndex + 1)]);
      if (nextIndex === path.length - 1) { setDragging(false); setStatus('done'); setFeedback('Kamu menemukan jalan!'); onComplete(); }
    } else {
      setDragging(false); playCollisionSound(); setStatus('mistake'); setFeedback('Ups, kamu tertabrak! Silakan coba lagi.');
    }
  };
  const begin = (event) => { const cell = cellFromEvent(event); if (!same(cell, path[0])) { setFeedback('Cari kotak START yang merah, ya.'); return; } event.currentTarget.setPointerCapture?.(event.pointerId); activate(); setDragging(true); };
  const move = (event) => { if (!dragging || status !== 'playing') return; processCell(cellFromEvent(event)); };
  const end = () => { if (dragging && status === 'playing') { setDragging(false); setStatus('mistake'); setFeedback('Jalannya belum sampai. Yuk coba lagi.'); } };
  const moveBy = (rowDelta, colDelta) => {
    if (status === 'done' || status === 'mistake') return;
    const currentIndex = status === 'ready' ? 0 : pathIndex;
    const current = path[currentIndex];
    const target = [current[0] + rowDelta, current[1] + colDelta];
    if (status === 'ready') activate();
    processCell(target, currentIndex);
  };
  const retry = () => { setStatus('ready'); setTrail([]); setPathIndex(0); setFeedback('Mulai dari kotak START, ya.'); };
  const cellClass = (row, col) => { const cell = [row, col]; const pathPosition = path.findIndex((item) => same(item, cell)); const trailPosition = trail.findIndex((item) => same(item, cell)); const dead = level.deadEnds.some((item) => same(item, cell)); return `${pathPosition >= 0 ? 'route-cell' : 'empty-cell'} ${trailPosition >= 0 ? 'trail-cell' : ''} ${same(cell, path[pathIndex]) ? 'player-cell' : ''} ${dead ? 'dead-cell' : ''} ${same(cell, path[0]) ? 'start-cell' : ''} ${same(cell, path[path.length - 1]) ? 'finish-cell' : ''}`; };
  return <section className="game-page page-enter"><GameHeader type="maze" level={level} index={index} total={total} completed={completed} onBack={onBack} /><div className="game-layout"><div className="game-main"><div className="play-card maze-card"><div className="play-card-top"><div className="play-instruction"><span className="instruction-bubble">🧭</span><div><strong>{status === 'done' ? 'Jalurnya ketemu!' : status === 'mistake' ? 'Jalan buntu bukan masalah' : 'Cari jalan menuju tujuan'}</strong><small>{status === 'done' ? 'Keluarga sudah menunggumu.' : 'Geser dengan tangan atau pakai tombol arah.'}</small></div></div><span className="difficulty-badge">{level.difficulty}</span></div><div className="character-picker"><span className="picker-label">Pilih temanmu:</span>{mazeAvatars.map((avatar) => <button key={avatar} className={`avatar-option ${playerIcon === avatar ? 'selected' : ''}`} onClick={() => status === 'ready' && setPlayerIcon(avatar)} aria-label={`Pilih karakter ${avatar}`}>{avatar}</button>)}</div><div className="maze-board-wrap"><div className="maze-board" onPointerDown={begin} onPointerMove={move} onPointerUp={end} onPointerCancel={end}>{Array.from({ length: 6 }).map((_, row) => Array.from({ length: 8 }).map((__, col) => <div className={`maze-cell ${cellClass(row, col)}`} key={`${row}-${col}`}><span className="cell-marker">{same([row, col], path[path.length - 1]) && status === 'done' ? <><b>{level.finishIcon}</b><small>FINISH</small></> : same([row, col], path[pathIndex]) ? <><b>{playerIcon}</b><small>{pathIndex === 0 ? 'START' : 'JALAN'}</small></> : same([row, col], path[0]) ? <><b>{level.startIcon}</b><small>START</small></> : level.deadEnds.some((deadEnd) => same(deadEnd, [row, col])) ? '·' : ''}</span></div>))}</div><div className="maze-story"><div><span>{level.startIcon}</span><small>Mulai</small></div><b>··· → ···</b><div><span>{level.finishIcon}</span><small>Tujuan</small></div></div><div className="maze-side-note"><span>👆</span><small>Geser pelan<br />ikuti jalurnya</small></div>{status === 'ready' && <div className="maze-start-hint">Geser dari <b>START</b> atau pakai tombol arah</div>}{status === 'done' && <div className="success-stamp maze-success"><span>★</span><strong>Luar biasa!</strong><small>Jalan ditemukan</small></div>}{status === 'mistake' && <div className="collision-popup" role="alert"><div className="collision-icon">💥</div><strong>Anda tertabrak!</strong><p>Jalan ini buntu.</p><button className="button button-primary" onClick={retry}>Silakan coba lagi</button></div>}</div><div className="maze-controls" aria-label="Kontrol arah maze"><button className="maze-control maze-up" onClick={() => moveBy(-1, 0)} aria-label="Ke atas">↑</button><button className="maze-control maze-left" onClick={() => moveBy(0, -1)} aria-label="Ke kiri">←</button><button className="maze-control maze-down" onClick={() => moveBy(1, 0)} aria-label="Ke bawah">↓</button><button className="maze-control maze-right" onClick={() => moveBy(0, 1)} aria-label="Ke kanan">→</button></div><div className="play-card-bottom"><div className="feedback-line"><span className={status === 'mistake' ? 'feedback-warn' : status === 'done' ? 'feedback-good' : ''}>{status === 'done' ? '✦' : status === 'mistake' ? '↻' : '♡'}</span>{feedback}</div><div className="game-actions"><button className="button button-ghost" onClick={retry}>↻ Coba lagi</button>{status === 'done' && <button className="button button-primary" onClick={() => index + 1 < total ? onSelect(index + 1) : onBack()}>{index + 1 < total ? 'Maze berikutnya →' : 'Kembali ke game'}</button>}</div></div></div><div className="maze-legend"><span><i className="legend-dot legend-start" /> START</span><span><i className="legend-dot legend-route" /> Jalur aman</span><span><i className="legend-dot legend-dead" /> Jalan buntu</span></div></div><LevelRail levels={mazeLevels} mode="maze" current={index} completed={completed} onSelect={onSelect} /></div></section>;
}
function Completion({ onHome, onGame }) {
  return <section className="completion-page page-enter"><div className="confetti confetti-a">✦</div><div className="confetti confetti-b">●</div><div className="confetti confetti-c">★</div><div className="confetti confetti-d">✿</div><div className="award-card"><div className="award-crown">♛</div><div className="award-stars">★ ★ ★</div><div className="award-emoji">👨‍👩‍👧‍👦</div><div className="eyebrow"><span className="eyebrow-dot" /> Medali keluarga hebat</div><h1>SELAMAT!</h1><p>Kamu sudah menyelesaikan semua permainan!</p><div className="award-message">Tanganmu teliti, matamu fokus,<br />dan kamu tidak mudah menyerah.</div><div className="hero-actions"><button className="button button-primary button-large" onClick={onHome}>⌂ Ke beranda</button><button className="button button-ghost button-large" onClick={onGame}>↻ Main lagi</button></div></div></section>;
}

createRoot(document.getElementById('root')).render(<App />);
