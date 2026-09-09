"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

type LocalTask = {
  id: string;
  title: string;
  type: "task" | "reminder";
  time: string;
  done: boolean;
  createdAt: string;
};

const STARTER_TASKS: LocalTask[] = [
  {
    id: "init-1",
    title: "Squeeze 30 minutes of deep focus on my primary goal",
    type: "task",
    time: "09:30",
    done: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "init-2",
    title: "Drink a tall glass of cold citrus water 🍊",
    type: "reminder",
    time: "11:00",
    done: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "init-3",
    title: "Clear all pending inbox items & plan tomorrow's top 3",
    type: "task",
    time: "16:45",
    done: false,
    createdAt: new Date().toISOString(),
  },
];

const MOODS = [
  { key: "default", em: "🍊", label: "Default", bg: "radial-gradient(circle at 8% 0%, #FFE7CC 0%, transparent 45%), radial-gradient(circle at 100% 10%, #FFDDBB 0%, transparent 40%), var(--cream)" },
  { key: "happy", em: "😄", label: "Happy", bg: "radial-gradient(circle at 10% 0%, #FFE29A 0%, transparent 45%), radial-gradient(circle at 100% 20%, #FFC46B 0%, transparent 45%), #FFF3D6" },
  { key: "calm", em: "🌿", label: "Calm", bg: "radial-gradient(circle at 10% 0%, #DCEBC4 0%, transparent 45%), radial-gradient(circle at 100% 20%, #C9E0AE 0%, transparent 45%), #F1F6E7" },
  { key: "focused", em: "🎯", label: "Focused", bg: "radial-gradient(circle at 10% 0%, #E8C79A 0%, transparent 45%), radial-gradient(circle at 100% 20%, #C98A4B 0%, transparent 45%), #FBEEDC" },
  { key: "energetic", em: "⚡", label: "Energetic", bg: "radial-gradient(circle at 10% 0%, #FFB199 0%, transparent 45%), radial-gradient(circle at 100% 20%, #FF7A59 0%, transparent 45%), #FFE9E0" },
];

const QUOTES = [
  "Every second counts.",
  "Small wins today, big streaks tomorrow.",
  "Discipline is choosing what you want most over what you want now.",
  "Consistency squeezes out the best results.",
  "The clock won't wait — neither should you.",
  "Show up. That's the whole game.",
];

export default function InstantModePage() {
  const [tasks, setTasks] = useState<LocalTask[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"task" | "reminder">("task");
  const [time, setTime] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "done">("all");
  const [mood, setMood] = useState("default");
  const [isDark, setIsDark] = useState(false);

  // Quote & Clock ticker
  const [clock, setClock] = useState("");
  const [quoteIdx, setQuoteIdx] = useState(0);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem("mosambi_instant_tasks");
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      } else {
        setTasks(STARTER_TASKS);
      }

      const savedMood = localStorage.getItem("mosambi_instant_mood");
      if (savedMood) setMood(savedMood);

      const savedTheme = localStorage.getItem("mosambi_instant_theme");
      if (savedTheme === "dark") {
        setIsDark(true);
        document.documentElement.classList.add("dark");
      }
    } catch {
      setTasks(STARTER_TASKS);
    }
    setIsLoaded(true);
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("mosambi_instant_tasks", JSON.stringify(tasks));
    } catch (e) {
      console.error(e);
    }
  }, [tasks, isLoaded]);

  // Clock ticker & quote rotator
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setClock(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      );
    };
    updateTime();
    const clockInterval = setInterval(updateTime, 1000);
    const quoteInterval = setInterval(() => {
      setQuoteIdx((prev) => (prev + 1) % QUOTES.length);
    }, 6000);

    return () => {
      clearInterval(clockInterval);
      clearInterval(quoteInterval);
    };
  }, []);

  // Mood handler
  const handleMoodSelect = (moodKey: string) => {
    setMood(moodKey);
    localStorage.setItem("mosambi_instant_mood", moodKey);
    const selectedMood = MOODS.find((m) => m.key === moodKey);
    if (selectedMood) {
      document.body.style.background = selectedMood.bg;
    }
  };

  // Dark mode handler
  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("mosambi_instant_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("mosambi_instant_theme", "light");
    }
  };

  // Add Task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: LocalTask = {
      id: "inst-" + Date.now(),
      title: title.trim(),
      type,
      time: time || "",
      done: false,
      createdAt: new Date().toISOString(),
    };

    setTasks([newTask, ...tasks]);
    setTitle("");
    setTime("");
  };

  // Toggle completion
  const toggleTask = (id: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  // Delete task
  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  // Export tasks as JSON
  const exportTasks = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `mosambi_instant_tasks_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Stats calculation
  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.done).length;
  const percent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const filteredTasks = useMemo(() => {
    if (filter === "pending") return tasks.filter((t) => !t.done);
    if (filter === "done") return tasks.filter((t) => t.done);
    return tasks;
  }, [tasks, filter]);

  return (
    <>
      <Navbar />

      <main className="app-shell" style={{ paddingTop: 20 }}>
        {/* Instant Mode Notice Banner */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(255, 106, 24, 0.12), rgba(242, 183, 5, 0.15))",
            border: "1px solid var(--orange-2)",
            borderRadius: 18,
            padding: "14px 18px",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 24 }}>⚡</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: 14, color: "var(--ink)" }}>
                Section 1: Normal Use (Instant Mode &bull; No Login Required)
              </div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>
                Everything runs privately in your browser. Stored automatically in LocalStorage.
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Link
              href="/sign-up"
              className="btn-primary"
              style={{
                textDecoration: "none",
                fontSize: 12.5,
                padding: "8px 14px",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span>Unlock Personal Pro (Auth)</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Header Bar with Mood & Controls */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
          <div className="mood-bar" style={{ margin: 0 }}>
            <span className="mood-label">Mood:</span>
            {MOODS.map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => handleMoodSelect(m.key)}
                className={`mood-btn ${mood === m.key ? "active" : ""}`}
              >
                <span>{m.em}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              onClick={exportTasks}
              className="btn-ghost"
              title="Download tasks as JSON"
              style={{ fontSize: 12, padding: "7px 12px", display: "inline-flex", alignItems: "center", gap: 5 }}
            >
              <span>📥</span>
              <span>Export JSON</span>
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="icon-btn"
              title="Toggle Dark Mode"
            >
              {isDark ? "☀️" : "🌙"}
            </button>
          </div>
        </div>

        {/* Live Ticker */}
        <div className="ticker">
          <div className="ticker-quote">&ldquo;{QUOTES[quoteIdx]}&rdquo;</div>
          <div className="ticker-clock">⏱️ {clock || "--:--:--"}</div>
        </div>

        {/* Progress & Quick Stats */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
            <div>
              <span className="pct">{percent}%</span>
              <span style={{ fontSize: 13, color: "var(--muted)", marginLeft: 8 }}>
                completed ({completedCount} of {totalCount})
              </span>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {(["all", "pending", "done"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`chip ${filter === f ? "active" : ""}`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Segmented bar */}
          <div className="segbar">
            {totalCount === 0 ? (
              <div className="seg empty-state" />
            ) : (
              Array.from({ length: Math.min(totalCount, 20) }).map((_, i) => {
                const isFilled = i < Math.round((completedCount / totalCount) * Math.min(totalCount, 20));
                return <div key={i} className={`seg ${isFilled ? "filled" : ""}`} />;
              })
            )}
          </div>
        </div>

        {/* Add Task Input Form */}
        <div className="card" style={{ padding: 16, marginBottom: 20 }}>
          <form onSubmit={handleAddTask} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input
              type="text"
              placeholder="What needs to be squeezed today?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
              style={{ flex: "1 1 240px" }}
              required
            />
            <div style={{ display: "flex", gap: 8 }}>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as "task" | "reminder")}
                className="input"
                style={{ paddingRight: 24 }}
              >
                <option value="task">Task</option>
                <option value="reminder">Reminder</option>
              </select>

              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="input"
                title="Target Time"
              />

              <button type="submit" className="btn-primary" style={{ whiteSpace: "nowrap" }}>
                + Add
              </button>
            </div>
          </form>
        </div>

        {/* Tasks List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filteredTasks.length === 0 ? (
            <div className="card empty">
              <p style={{ margin: 0 }}>No items in this filter. Add one above to get squeezing!</p>
            </div>
          ) : (
            filteredTasks.map((t) => (
              <div key={t.id} className={`task-row ${t.done ? "done" : ""}`}>
                <button
                  type="button"
                  onClick={() => toggleTask(t.id)}
                  className={`check ${t.done ? "checked" : ""}`}
                  aria-label="Toggle completion"
                >
                  {t.done && (
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                      <path d="M1 5L4.5 8.5L11 1.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, textDecoration: t.done ? "line-through" : "none" }}>
                    {t.title}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                    <span className={`type-badge ${t.type}`}>{t.type}</span>
                    {t.time && (
                      <span style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600 }}>
                        🕒 {t.time}
                      </span>
                    )}
                    <span style={{ fontSize: 11, color: "var(--muted)" }}>
                      &bull; In-Browser Storage
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => deleteTask(t.id)}
                  className="del"
                  title="Delete item"
                >
                  &times;
                </button>
              </div>
            ))
          )}
        </div>

        {/* Upgrade Callout Card */}
        <div
          className="card"
          style={{
            marginTop: 36,
            background: "linear-gradient(135deg, var(--card), var(--cream))",
            border: "1.5px dashed var(--orange-2)",
            textAlign: "center",
            padding: "30px 20px",
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 8 }}>🏆</div>
          <h3 style={{ fontFamily: "Fraunces, serif", fontSize: 22, margin: "0 0 8px" }}>
            Ready to build long-term momentum?
          </h3>
          <p style={{ color: "var(--muted)", maxWidth: 520, margin: "0 auto 20px", fontSize: 13.5, lineHeight: 1.6 }}>
            Upgrade from Instant Mode to <strong>Personal Pro</strong> (free with Clerk auth) to unlock 7, 21, 45, 75, 100 & 120-day habit challenges, XP levels from Seedling to Citrus Master, cloud backup, and mood photo backgrounds.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <Link href="/sign-up" className="btn-primary" style={{ textDecoration: "none" }}>
              Sign Up for Personal Pro (Free)
            </Link>
            <Link href="/organization" className="btn-ghost" style={{ textDecoration: "none" }}>
              Explore For Agencies & Teams →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
