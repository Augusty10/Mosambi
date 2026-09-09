"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Task = {
  id: string;
  title: string;
  type: string;
  date: string;
  time: string | null;
  done: boolean;
  completedAt?: string | Date | null;
};
type Checkin = { id: string; date: string };
type Challenge = {
  id: string;
  title: string;
  duration: number;
  startDate: string;
  createdAt?: string | Date;
  checkins: Checkin[];
};
type UserRow = { id: string; theme: string; mood: string; xp: number; badges: string[] };

const MOODS = [
  { key: "default", em: "🍊", label: "Default", fallback: "" },
  { key: "happy", em: "😄", label: "Happy", fallback: "radial-gradient(circle at 10% 0%, #FFE29A 0%, transparent 45%), radial-gradient(circle at 100% 20%, #FFC46B 0%, transparent 45%), #FFF3D6" },
  { key: "calm", em: "🌿", label: "Calm", fallback: "radial-gradient(circle at 10% 0%, #DCEBC4 0%, transparent 45%), radial-gradient(circle at 100% 20%, #C9E0AE 0%, transparent 45%), #F1F6E7" },
  { key: "focused", em: "🎯", label: "Focused", fallback: "radial-gradient(circle at 10% 0%, #E8C79A 0%, transparent 45%), radial-gradient(circle at 100% 20%, #C98A4B 0%, transparent 45%), #FBEEDC" },
  { key: "energetic", em: "⚡", label: "Energetic", fallback: "radial-gradient(circle at 10% 0%, #FFB199 0%, transparent 45%), radial-gradient(circle at 100% 20%, #FF7A59 0%, transparent 45%), #FFE9E0" },
];

const QUOTES = [
  "Every second counts.",
  "Small wins today, big streaks tomorrow.",
  "Discipline is choosing what you want most over what you want now.",
  "One check-in closer to your best streak.",
  "The clock won't wait — neither should you.",
  "Consistency squeezes out the best results.",
  "Don't break the chain.",
  "Progress, not perfection.",
  "Show up. That's the whole game.",
];

const STREAK_MILESTONES = [
  { days: 3, name: "First Zest", em: "🍋" },
  { days: 7, name: "Full Peel", em: "🍊" },
  { days: 14, name: "Juice Flow", em: "🧃" },
  { days: 21, name: "Grove Guardian", em: "🌳" },
  { days: 30, name: "Orchard Elite", em: "🏅" },
  { days: 60, name: "Citrus Legend", em: "👑" },
  { days: 100, name: "Century Squeeze", em: "💯" },
];
const LEVEL_TITLES = ["Seedling", "Sprout", "Budding Grove", "Blossom", "Ripening", "Juicy", "Orchard Pro", "Citrus Master", "Grove Legend"];

const pad = (n: number) => String(n).padStart(2, "0");
const fmtKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const dayNamesLong = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

export default function DashboardClient({
  initialTasks,
  initialChallenges,
  initialUser,
  moodsWithImages,
  clerkImageUrl,
  clerkName,
}: {
  initialTasks: Task[];
  initialChallenges: Challenge[];
  initialUser: UserRow;
  moodsWithImages: string[];
  clerkImageUrl: string;
  clerkName: string;
}) {
  const today = new Date();
  const todayKey = fmtKey(today);

  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [challenges, setChallenges] = useState<Challenge[]>(initialChallenges);
  const [user, setUser] = useState<UserRow>(initialUser);
  const [moodsAvail, setMoodsAvail] = useState<string[]>(moodsWithImages);
  const [moodBg, setMoodBg] = useState<string | null>(null);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedKey, setSelectedKey] = useState(todayKey);
  const [filter, setFilter] = useState("all");

  const [title, setTitle] = useState("");
  const [type, setType] = useState("task");
  const [time, setTime] = useState("");

  const [chTitle, setChTitle] = useState("");
  const [chDuration, setChDuration] = useState("21");
  const [chCustom, setChCustom] = useState("");

  const [quoteIdx, setQuoteIdx] = useState(0);
  const [quoteFade, setQuoteFade] = useState(false);
  const [clock, setClock] = useState("");
  const [toasts, setToasts] = useState<{ id: number; msg: string }[]>([]);
  const notifiedRef = useRef<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingMoodRef = useRef<string | null>(null);

  function toast(msg: string) {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 6000);
  }

  /* ---------- theme ---------- */
  useEffect(() => {
    document.documentElement.classList.toggle("dark", user.theme === "dark");
  }, [user.theme]);

  async function toggleTheme() {
    const theme = user.theme === "dark" ? "light" : "dark";
    setUser((u) => ({ ...u, theme }));
    await fetch("/api/user", { method: "PATCH", body: JSON.stringify({ theme }) });
  }

  /* ---------- ticker: quotes + clock ---------- */
  useEffect(() => {
    const q = setInterval(() => {
      setQuoteFade(true);
      setTimeout(() => {
        setQuoteIdx((i) => (i + 1) % QUOTES.length);
        setQuoteFade(false);
      }, 400);
    }, 6000);
    const c = setInterval(() => setClock(new Date().toLocaleTimeString()), 1000);
    setClock(new Date().toLocaleTimeString());
    return () => { clearInterval(q); clearInterval(c); };
  }, []);

  /* ---------- deadline alerts ---------- */
  useEffect(() => {
    const iv = setInterval(() => {
      const now = new Date();
      const nowKey = fmtKey(now);
      tasks.forEach((t) => {
        if (t.done || !t.time || t.date !== nowKey) return;
        const [h, m] = t.time.split(":").map(Number);
        const due = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m);
        const diffMin = (due.getTime() - now.getTime()) / 60000;
        const soonId = t.id + "-soon", dueId = t.id + "-due";
        if (diffMin <= 5 && diffMin > 4 && !notifiedRef.current.has(soonId)) {
          notify("Deadline approaching", `"${t.title}" is due at ${t.time}`);
          notifiedRef.current.add(soonId);
        }
        if (diffMin <= 0 && diffMin > -1 && !notifiedRef.current.has(dueId)) {
          notify("Deadline reached", `"${t.title}" was due now`);
          notifiedRef.current.add(dueId);
        }
      });
    }, 15000);
    return () => clearInterval(iv);
  }, [tasks]);

  function notify(t: string, body: string) {
    toast(`${t} — ${body}`);
    try {
      if (typeof Notification !== "undefined" && Notification.permission === "granted") {
        new Notification(t, { body });
      }
    } catch {}
  }
  const [notifOn, setNotifOn] = useState(false);
  useEffect(() => {
    setNotifOn(typeof Notification !== "undefined" && Notification.permission === "granted");
  }, []);
  async function enableNotifs() {
    if (typeof Notification === "undefined") { toast("Notifications aren't available in this browser — in-app alerts still work."); return; }
    const perm = await Notification.requestPermission();
    setNotifOn(perm === "granted");
    toast(perm === "granted" ? "Deadline alerts enabled." : "Blocked — in-app alerts will still show.");
  }

  /* ---------- mood background ---------- */
  useEffect(() => { applyMood(user.mood); /* eslint-disable-next-line */ }, [user.mood, moodsAvail]);

  async function applyMood(mood: string) {
    const m = MOODS.find((x) => x.key === mood) || MOODS[0];
    if (m.key === "default") { setMoodBg(null); return; }
    if (moodsAvail.includes(m.key)) {
      const res = await fetch(`/api/user/mood-image?mood=${m.key}`);
      const data = await res.json();
      if (data.dataUrl) { setMoodBg(`linear-gradient(rgba(0,0,0,0.12),rgba(0,0,0,0.12)), url(${data.dataUrl})`); return; }
    }
    setMoodBg(m.fallback);
  }

  async function selectMood(key: string) {
    setUser((u) => ({ ...u, mood: key }));
    await fetch("/api/user", { method: "PATCH", body: JSON.stringify({ mood: key }) });
  }

  function openUploadFor(mood: string) {
    pendingMoodRef.current = mood;
    fileInputRef.current?.click();
  }

  async function onFileChosen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    const mood = pendingMoodRef.current;
    pendingMoodRef.current = null;
    if (!file || !mood) return;
    try {
      const dataUrl = await compressImage(file, 1600, 0.78);
      const res = await fetch("/api/user/mood-image", {
        method: "POST",
        body: JSON.stringify({ mood, dataUrl }),
      });
      if (!res.ok) { toast("Upload failed — try a smaller image."); return; }
      setMoodsAvail((m) => (m.includes(mood) ? m : [...m, mood]));
      await selectMood(mood);
      toast("Background updated for this mood.");
    } catch {
      toast("Could not process that image.");
    }
  }

  function compressImage(file: File, maxW: number, quality: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const scale = Math.min(1, maxW / img.width);
          const w = Math.round(img.width * scale), h = Math.round(img.height * scale);
          const canvas = document.createElement("canvas");
          canvas.width = w; canvas.height = h;
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL("image/jpeg", quality));
        };
        img.onerror = reject;
        img.src = String(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /* ---------- streak / xp / badges ---------- */
  const streak = useMemo(() => {
    let s = 0;
    const cursor = new Date(today);
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const key = fmtKey(cursor);
      const items = tasks.filter((t) => t.date === key);
      if (items.length === 0) {
        if (key === todayKey) { cursor.setDate(cursor.getDate() - 1); continue; }
        break;
      }
      if (!items.every((t) => t.done)) break;
      s++;
      cursor.setDate(cursor.getDate() - 1);
    }
    return s;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks]);

  useEffect(() => {
    const unlocked = STREAK_MILESTONES.filter((m) => streak >= m.days && !user.badges.includes(m.name));
    if (unlocked.length === 0) return;
    const newBadges = [...user.badges, ...unlocked.map((m) => m.name)];
    const bonus = unlocked.length * 50;
    setUser((u) => ({ ...u, badges: newBadges, xp: u.xp + bonus }));
    unlocked.forEach((m) => toast(`Badge unlocked: ${m.em} ${m.name}!`));
    fetch("/api/user", { method: "PATCH", body: JSON.stringify({ badges: newBadges, xpDelta: bonus }) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streak]);

  const level = Math.floor(user.xp / 100) + 1;
  const levelTitle = LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)];
  const xpInto = user.xp % 100;

  /* ---------- calendar ---------- */
  const cells = useMemo(() => {
    const firstOfMonth = new Date(viewYear, viewMonth, 1);
    const startWeekday = firstOfMonth.getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();
    const out: { day: number; other: boolean; m: number; y: number }[] = [];
    for (let i = startWeekday - 1; i >= 0; i--) out.push({ day: daysInPrevMonth - i, other: true, m: viewMonth - 1, y: viewYear });
    for (let d = 1; d <= daysInMonth; d++) out.push({ day: d, other: false, m: viewMonth, y: viewYear });
    while (out.length % 7 !== 0 || out.length < 42) {
      const nextDay = out.length - (startWeekday + daysInMonth) + 1;
      out.push({ day: nextDay, other: true, m: viewMonth + 1, y: viewYear });
    }
    return out;
  }, [viewYear, viewMonth]);

  /* ---------- task CRUD ---------- */
  async function addTask() {
    if (!title.trim()) return;
    const res = await fetch("/api/tasks", {
      method: "POST",
      body: JSON.stringify({ title: title.trim(), type, date: selectedKey, time: time || null }),
    });
    const data = await res.json();
    if (data.task) setTasks((t) => [data.task, ...t]);
    setTitle(""); setTime("");
  }

  async function toggleTask(t: Task) {
    const done = !t.done;
    setTasks((all) => all.map((x) => (x.id === t.id ? { ...x, done } : x)));
    const res = await fetch(`/api/tasks/${t.id}`, { method: "PATCH", body: JSON.stringify({ done }) });
    const data = await res.json();
    if (data.xpAwarded) {
      setUser((u) => ({ ...u, xp: u.xp + data.xpAwarded }));
      toast(`+${data.xpAwarded} XP`);
    }
  }

  async function deleteTask(id: string) {
    setTasks((all) => all.filter((x) => x.id !== id));
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
  }

  /* ---------- challenge CRUD ---------- */
  async function addChallenge() {
    const duration = chDuration === "custom" ? parseInt(chCustom, 10) : parseInt(chDuration, 10);
    if (!chTitle.trim() || !duration || duration < 1) return;
    const res = await fetch("/api/challenges", {
      method: "POST",
      body: JSON.stringify({ title: chTitle.trim(), duration, startDate: todayKey }),
    });
    const data = await res.json();
    if (data.challenge) setChallenges((c) => [data.challenge, ...c]);
    setChTitle(""); setChCustom("");
  }

  async function checkinChallenge(ch: Challenge) {
    const res = await fetch(`/api/challenges/${ch.id}/checkin`, { method: "POST" });
    if (!res.ok) return;
    const data = await res.json();
    setChallenges((all) => all.map((c) => (c.id === ch.id ? { ...c, checkins: [...c.checkins, data.checkin] } : c)));
    setUser((u) => ({ ...u, xp: u.xp + data.xpAwarded }));
    toast(`+${data.xpAwarded} XP — checked in on "${ch.title}"`);
  }

  async function deleteChallenge(id: string) {
    setChallenges((all) => all.filter((x) => x.id !== id));
    await fetch(`/api/challenges/${id}`, { method: "DELETE" });
  }

  function challengeStreak(ch: Challenge) {
    let s = 0;
    const cursor = new Date(today);
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const key = fmtKey(cursor);
      if (key < ch.startDate) break;
      if (ch.checkins.some((c) => c.date === key)) { s++; cursor.setDate(cursor.getDate() - 1); }
      else if (key === todayKey) { cursor.setDate(cursor.getDate() - 1); continue; }
      else break;
    }
    return s;
  }

  /* ---------- download & share ---------- */
  function download(format: "json" | "csv") {
    window.open(`/api/export?format=${format}`, "_blank");
  }

  async function share() {
    const text = `🍊 My Mosambi streak: ${streak} days | Level ${level} · ${levelTitle} | ${user.xp} XP`;
    if (navigator.share) {
      try { await navigator.share({ title: "Mosambi progress", text }); return; } catch { /* user cancelled */ }
    }
    try {
      await navigator.clipboard.writeText(text);
      toast("Progress summary copied to clipboard.");
    } catch {
      toast(text);
    }
  }

  /* ---------- derived: today's list ---------- */
  const dayTasks = useMemo(() => {
    let list = tasks.filter((t) => t.date === selectedKey);
    if (filter !== "all") list = list.filter((t) => t.type === filter);
    return [...list].sort((a, b) => {
      const at = a.time || "00:00", bt = b.time || "00:00";
      if (at !== bt) return bt.localeCompare(at);
      return b.id.localeCompare(a.id);
    });
  }, [tasks, selectedKey, filter]);

  const allDayTasks = tasks.filter((t) => t.date === selectedKey);
  const doneCount = allDayTasks.filter((t) => t.done).length;
  const pct = allDayTasks.length ? Math.round((doneCount / allDayTasks.length) * 100) : 0;

  const sortedChallenges = useMemo(
    () =>
      [...challenges].sort((a, b) =>
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      ),
    [challenges]
  );

  return (
    <div style={moodBg ? { background: moodBg, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", margin: "-24px -16px", padding: "24px 16px" } : undefined}>
      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={onFileChosen} />

      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "radial-gradient(circle at 32% 28%, #FFD8A8 0%, var(--orange-1) 45%, var(--orange-2) 78%, var(--peel) 100%)" }} />
          <div>
            <h1 style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: 26, margin: 0 }}>Mosambi</h1>
            <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--muted)" }}>Welcome back, {clerkName} 👋</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className={`icon-btn ${notifOn ? "on" : ""}`} onClick={enableNotifs} title="Enable deadline alerts">🔔</button>
          <button className="icon-btn" onClick={share} title="Share progress">🔗</button>
          <button className="icon-btn" onClick={() => download("json")} title="Download JSON">⬇</button>
          <button className={`icon-btn ${user.theme === "dark" ? "on" : ""}`} onClick={toggleTheme} title="Toggle dark mode">
            {user.theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      </div>

      <div className="ticker">
        <div className="ticker-quote" style={{ opacity: quoteFade ? 0 : 1 }}>{QUOTES[quoteIdx]}</div>
        <div className="ticker-clock">⏱ {clock}</div>
      </div>

      <div className="mood-bar">
        <span className="mood-label">Mood</span>
        {MOODS.map((m) => (
          <button
            key={m.key}
            className={`mood-btn ${user.mood === m.key ? "active" : ""}`}
            onClick={() => selectMood(m.key)}
          >
            <span>{m.em}</span>{m.label}
            {m.key !== "default" && (
              <span
                className="cam"
                onClick={(e) => { e.stopPropagation(); openUploadFor(m.key); }}
              >
                {moodsAvail.includes(m.key) ? "↻" : "+"}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="stat-row">
        <div className="stat-card">
          <div className="stat-emoji">🔥</div>
          <div className="stat-text">
            <div className="big">{streak}-day streak</div>
            <div className="small">{streak > 0 ? "Keep completing today's items to extend it" : "Complete every item today to start one"}</div>
          </div>
        </div>
        <div className="stat-card level">
          <div className="stat-emoji">🏆</div>
          <div className="stat-text">
            <div className="big">Level {level} · {levelTitle}</div>
            <div className="xp-bar"><div className="xp-fill" style={{ width: `${xpInto}%` }} /></div>
            <div className="small">{xpInto} / 100 XP · {user.xp} total</div>
          </div>
        </div>
      </div>

      <div className="badges-row">
        {STREAK_MILESTONES.map((m) => {
          const earned = user.badges.includes(m.name);
          return (
            <div key={m.name} className={`badge ${earned ? "" : "locked"}`} title={earned ? "Earned" : `Reach a ${m.days}-day streak to unlock`}>
              {m.em} {m.name}
            </div>
          );
        })}
      </div>

      <div className="grid2">
        <div>
          <div className="card">
            <div className="cal-head">
              <h2>{monthNames[viewMonth]} {viewYear}</h2>
              <div className="cal-nav">
                <button onClick={() => setViewMonth((m) => { if (m === 0) { setViewYear((y) => y - 1); return 11; } return m - 1; })}>‹</button>
                <button onClick={() => setViewMonth((m) => { if (m === 11) { setViewYear((y) => y + 1); return 0; } return m + 1; })}>›</button>
              </div>
            </div>
            <div className="dow"><span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span></div>
            <div className="days">
              {cells.map((c, i) => {
                let realM = c.m, realY = c.y;
                if (realM < 0) { realM = 11; realY -= 1; }
                if (realM > 11) { realM = 0; realY += 1; }
                const dObj = new Date(realY, realM, c.day);
                const key = fmtKey(dObj);
                const dayItems = tasks.filter((t) => t.date === key);
                const hasChallengeCheckin = challenges.some((ch) => ch.checkins.some((k) => k.date === key));
                const types = [...new Set(dayItems.map((t) => t.type))];
                if (hasChallengeCheckin) types.push("challenge");
                return (
                  <button
                    key={i}
                    className={`day ${c.other ? "other" : ""} ${key === todayKey ? "today" : ""} ${key === selectedKey ? "selected" : ""}`}
                    onClick={() => { setSelectedKey(key); setViewYear(realY); setViewMonth(realM); }}
                  >
                    <span>{c.day}</span>
                    {types.length > 0 && (
                      <span className="dots">
                        {types.slice(0, 3).map((t) => <span key={t} className={`dot ${t}`} />)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="legend">
              <span><i style={{ background: "var(--orange-2)" }} />Task</span>
              <span><i style={{ background: "var(--leaf)" }} />Challenge check-in</span>
              <span><i style={{ background: "var(--gold)" }} />Reminder</span>
            </div>
          </div>

          <div className="card">
            <div style={{ marginBottom: 16 }}>
              <h2 style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: 20, margin: 0 }}>Challenges</h2>
              <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 2 }}>Multi-day streaks — 21, 75, 120 days or custom</div>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              <input className="input" style={{ flex: 1, minWidth: 140 }} placeholder="e.g. No sugar, Wake at 6am…" value={chTitle} onChange={(e) => setChTitle(e.target.value)} />
              <select value={chDuration} onChange={(e) => setChDuration(e.target.value)}>
                <option value="7">7 days</option>
                <option value="21">21 days</option>
                <option value="45">45 days</option>
                <option value="75">75 days</option>
                <option value="100">100 days</option>
                <option value="120">120 days</option>
                <option value="custom">Custom…</option>
              </select>
              {chDuration === "custom" && <input type="number" min={1} placeholder="days" style={{ width: 80 }} value={chCustom} onChange={(e) => setChCustom(e.target.value)} />}
              <button className="btn-primary" onClick={addChallenge}>Start</button>
            </div>
            {sortedChallenges.length === 0 ? (
              <div className="empty"><span style={{ fontSize: 30, display: "block", marginBottom: 8 }}>🎯</span>Start a 21-, 75- or 120-day challenge above.</div>
            ) : sortedChallenges.map((ch) => {
              const daysSince = Math.floor((new Date(todayKey).getTime() - new Date(ch.startDate).getTime()) / 86400000);
              const dayNum = Math.min(daysSince + 1, ch.duration);
              const chPct = Math.min(100, Math.round((ch.checkins.length / ch.duration) * 100));
              const checkedToday = ch.checkins.some((c) => c.date === todayKey);
              const finished = ch.checkins.length >= ch.duration;
              const r = 18, circ = 2 * Math.PI * r, offset = circ - (chPct / 100) * circ;
              return (
                <div key={ch.id} className="challenge-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14.5 }}>{ch.title}</div>
                      <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 2 }}>
                        {finished ? "Completed 🎉" : `Day ${dayNum} of ${ch.duration}`} · {ch.checkins.length} check-ins
                      </div>
                    </div>
                    <div style={{ position: "relative", width: 44, height: 44, flexShrink: 0 }}>
                      <svg width="44" height="44" viewBox="0 0 44 44" style={{ transform: "rotate(-90deg)" }}>
                        <circle cx="22" cy="22" r={r} fill="none" stroke="var(--line)" strokeWidth="5" />
                        <circle cx="22" cy="22" r={r} fill="none" stroke="var(--orange-2)" strokeWidth="5" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} />
                      </svg>
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "var(--peel)" }}>{chPct}%</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                    <span style={{ fontSize: 11.5, color: "var(--leaf)", fontWeight: 700 }}>🔥 {challengeStreak(ch)}-day streak</span>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <button className="checkin-btn" disabled={checkedToday || finished} onClick={() => checkinChallenge(ch)}>
                        {finished ? "Done" : checkedToday ? "Checked in" : "Check in today"}
                      </button>
                      <button className="del" onClick={() => deleteChallenge(ch.id)}>&times;</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <div style={{ marginBottom: 16 }}>
            <h2 style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: 20, margin: 0 }}>
              {selectedKey === todayKey ? "Today's line-up" : (() => {
                const [y, m, d] = selectedKey.split("-").map(Number);
                const dObj = new Date(y, m - 1, d);
                return `${dayNamesLong[dObj.getDay()]}, ${monthNames[dObj.getMonth()]} ${dObj.getDate()}`;
              })()}
            </h2>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button className="btn-ghost" onClick={() => download("json")}>⬇ JSON</button>
              <button className="btn-ghost" onClick={() => download("csv")}>⬇ CSV</button>
              <button className="btn-ghost" onClick={share}>🔗 Share</button>
            </div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div className="pct">{pct}%</div>
              <div style={{ fontSize: 12, color: "var(--muted)", textAlign: "right" }}>
                {allDayTasks.length ? `${doneCount} of ${allDayTasks.length} complete` : "Nothing scheduled yet"}
              </div>
            </div>
            <div className="segbar">
              {(allDayTasks.length ? allDayTasks : Array.from({ length: 6 })).map((_, i) => (
                <div key={i} className={`seg ${!allDayTasks.length ? "empty-state" : i < doneCount ? "filled" : ""}`} />
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
            {["all", "task", "reminder"].map((f) => (
              <button key={f} className={`chip ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
                {f === "all" ? "All" : f === "task" ? "Tasks" : "Reminders"}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            <input className="input" style={{ flex: 1, minWidth: 140 }} placeholder="Add a task or reminder…" value={title}
              onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTask()} />
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="task">Task</option>
              <option value="reminder">Reminder</option>
            </select>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            <button className="btn-primary" onClick={addTask}>Add</button>
          </div>

          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8, maxHeight: 420, overflowY: "auto" }}>
            {dayTasks.length === 0 && (
              <div className="empty"><span style={{ fontSize: 30, display: "block", marginBottom: 8 }}>🍊</span>
                {filter === "all" ? "No items for this day yet. Add your first above." : `No ${filter}s for this day.`}
              </div>
            )}
            {dayTasks.map((t) => (
              <li key={t.id} className={`task-row ${t.done ? "done" : ""}`}>
                <div className={`check ${t.done ? "checked" : ""}`} onClick={() => toggleTask(t)}>
                  {t.done && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M4 12l6 6L20 6" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, textDecoration: t.done ? "line-through" : "none", color: t.done ? "var(--muted)" : "var(--ink)" }}>{t.title}</div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 3, flexWrap: "wrap" }}>
                    <span className={`type-badge ${t.type}`}>{t.type}</span>
                    {t.time && <span style={{ fontSize: 11.5, color: "var(--muted)" }}>{t.time}</span>}
                  </div>
                </div>
                <button className="del" onClick={() => deleteTask(t.id)}>&times;</button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div style={{ textAlign: "center", fontSize: 11, color: "var(--muted)", marginTop: 24 }}>
        Signed in as {clerkName} · Your data is stored securely in your own Neon Postgres database.
      </div>

      <div className="toast-wrap">
        {toasts.map((t) => <div key={t.id} className="toast">{t.msg}</div>)}
      </div>
    </div>
  );
}
