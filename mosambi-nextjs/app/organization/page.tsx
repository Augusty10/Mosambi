"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  streak: number;
  xp: number;
  status: "active" | "away";
};

type TeamChallenge = {
  id: string;
  title: string;
  days: number;
  currentDay: number;
  teamMembersCount: number;
  tag: string;
  checkedInToday: boolean;
};

type AgencyTask = {
  id: string;
  title: string;
  client: string;
  assignee: string;
  due: string;
  done: boolean;
};

const SAMPLE_MEMBERS: TeamMember[] = [
  { id: "m1", name: "Aarav Sharma", role: "Agency Founder & Lead", avatar: "👨🏽‍💼", streak: 42, xp: 4850, status: "active" },
  { id: "m2", name: "Sophia Chen", role: "Head of Product Design", avatar: "👩🏻‍🎨", streak: 38, xp: 4120, status: "active" },
  { id: "m3", name: "Marcus Vance", role: "Senior Full-Stack Dev", avatar: "👨🏼‍💻", streak: 29, xp: 3650, status: "active" },
  { id: "m4", name: "Priya Nair", role: "Client Operations Manager", avatar: "👩🏽‍💼", streak: 24, xp: 2980, status: "active" },
  { id: "m5", name: "Leo Tanaka", role: "Growth & SEO Specialist", avatar: "👨🏻‍🚀", streak: 19, xp: 2450, status: "away" },
];

const INITIAL_CHALLENGES: TeamChallenge[] = [
  {
    id: "tc1",
    title: "Agency Q3 Sprint: 100% On-Time Client Milestones",
    days: 30,
    currentDay: 22,
    teamMembersCount: 14,
    tag: "High Priority",
    checkedInToday: true,
  },
  {
    id: "tc2",
    title: "Daily 15-Min Standup & Blockers Resolution",
    days: 45,
    currentDay: 31,
    teamMembersCount: 12,
    tag: "Team Habit",
    checkedInToday: false,
  },
  {
    id: "tc3",
    title: "Design System 2.0 Component Library Push",
    days: 21,
    currentDay: 16,
    teamMembersCount: 8,
    tag: "Product Team",
    checkedInToday: false,
  },
];

const INITIAL_AGENCY_TASKS: AgencyTask[] = [
  { id: "at1", title: "Finalize brand guidelines deck for Acme Co.", client: "Acme Corp", assignee: "Sophia Chen", due: "Today, 4:00 PM", done: true },
  { id: "at2", title: "Deploy staging build for Mobile App Release v2.4", client: "Citrus Health", assignee: "Marcus Vance", due: "Today, 6:00 PM", done: false },
  { id: "at3", title: "Weekly client status report & time-audit review", client: "Vortex Media", assignee: "Priya Nair", due: "Tomorrow, 11:00 AM", done: false },
  { id: "at4", title: "Review organic search search-engine ranking gains", client: "FinTech Labs", assignee: "Leo Tanaka", due: "Friday, 3:00 PM", done: false },
];

export default function OrganizationPage() {
  const [workspace, setWorkspace] = useState("Apex Creative Agency");
  const [challenges, setChallenges] = useState<TeamChallenge[]>(INITIAL_CHALLENGES);
  const [tasks, setTasks] = useState<AgencyTask[]>(INITIAL_AGENCY_TASKS);
  const [members, setMembers] = useState<TeamMember[]>(SAMPLE_MEMBERS);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Member");
  const [inviteSuccess, setInviteSuccess] = useState("");

  const handleToggleTask = (id: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const handleCheckinChallenge = (id: string) => {
    setChallenges(
      challenges.map((c) => (c.id === id ? { ...c, checkedInToday: true, currentDay: c.currentDay + 1 } : c))
    );
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setInviteSuccess(`Invitation dispatched to ${inviteEmail} as ${inviteRole}!`);
    setTimeout(() => {
      setInviteSuccess("");
      setShowInviteModal(false);
      setInviteEmail("");
    }, 2200);
  };

  return (
    <>
      <Navbar />

      <main className="landing-shell" style={{ paddingTop: 28 }}>
        {/* Breadcrumb / Top Bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14, marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: "linear-gradient(135deg, var(--leaf), #5E7A33)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                color: "#fff",
                boxShadow: "0 4px 14px rgba(121, 151, 74, 0.35)",
              }}
            >
              🏢
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <select
                  value={workspace}
                  onChange={(e) => setWorkspace(e.target.value)}
                  className="input"
                  style={{ fontWeight: 800, fontSize: 16, padding: "6px 12px", border: "1.5px solid var(--line)", background: "var(--card-alpha)" }}
                >
                  <option value="Apex Creative Agency">Apex Creative Agency</option>
                  <option value="Citrus Labs Co.">Citrus Labs Co.</option>
                  <option value="Global Growth Partners">Global Growth Partners</option>
                </select>
                <span className="tier-badge agency" style={{ margin: 0 }}>
                  Agency Portal
                </span>
              </div>
              <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 4 }}>
                Collaborative team productivity, client sprints & habit accountability
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="button"
              onClick={() => setShowInviteModal(true)}
              className="btn-primary"
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <span>+ Invite Teammate</span>
            </button>
            <Link
              href="/dashboard"
              className="btn-ghost"
              style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <span>Switch to Personal</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Section 3 Banner */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(121, 151, 74, 0.12), rgba(255, 106, 24, 0.08))",
            border: "1px solid var(--leaf)",
            borderRadius: 18,
            padding: "16px 20px",
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <div style={{ fontWeight: 800, fontSize: 14, color: "var(--ink)" }}>
              Section 3: Organizations, Companies & Agencies
            </div>
            <div style={{ fontSize: 12.5, color: "var(--muted)" }}>
              Designed for companies, creative studios, and fast-paced teams that crave daily transparency and shared momentum.
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <span style={{ fontSize: 12, background: "var(--leaf-soft)", color: "var(--leaf)", padding: "4px 10px", borderRadius: 999, fontWeight: 700 }}>
              14 Members Active
            </span>
            <span style={{ fontSize: 12, background: "var(--gold-soft)", color: "#8A6A00", padding: "4px 10px", borderRadius: 999, fontWeight: 700 }}>
              🔥 42 Days Team Streak
            </span>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="stat-row" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", marginBottom: 24 }}>
          <div className="stat-card">
            <div className="stat-emoji" style={{ background: "linear-gradient(135deg, var(--orange-1), var(--orange-2))" }}>
              🔥
            </div>
            <div className="stat-text">
              <div className="big">42 Days</div>
              <div className="small">Shared Team Streak</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-emoji" style={{ background: "linear-gradient(135deg, var(--leaf), #5E7A33)" }}>
              🎯
            </div>
            <div className="stat-text">
              <div className="big">88.4%</div>
              <div className="small">Sprint On-Time Rate</div>
            </div>
          </div>

          <div className="stat-card level">
            <div className="stat-emoji" style={{ background: "linear-gradient(135deg, var(--gold), #D89B00)" }}>
              ⚡
            </div>
            <div className="stat-text">
              <div className="big">18,050 XP</div>
              <div className="small">Combined Agency Level 8</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-emoji" style={{ background: "linear-gradient(135deg, #FFD8A8, var(--peel))" }}>
              👥
            </div>
            <div className="stat-text">
              <div className="big">{members.length} Active</div>
              <div className="small">Across 4 Departments</div>
            </div>
          </div>
        </div>

        {/* 2-Column Grid: Left: Shared Sprints & Client Tasks | Right: Team Leaderboard & Members */}
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 24 }}>
          {/* Left Column */}
          <div>
            {/* Team Sprints / Multi-Day Challenges */}
            <div className="card">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontFamily: "Fraunces, serif", fontSize: 18, margin: 0 }}>
                    Active Agency Sprints & Multi-Day Challenges
                  </h3>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                    Shared commitment goals for the entire organization
                  </div>
                </div>
                <span className="chip active">3 In Progress</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {challenges.map((c) => {
                  const pct = Math.round((c.currentDay / c.days) * 100);
                  return (
                    <div key={c.id} className="challenge-card" style={{ margin: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>{c.title}</div>
                          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                            <span style={{ fontSize: 11, background: "var(--gold-soft)", color: "#8A6A00", padding: "2px 8px", borderRadius: 999, fontWeight: 700 }}>
                              {c.tag}
                            </span>
                            <span style={{ fontSize: 11, color: "var(--muted)" }}>
                              👥 {c.teamMembersCount} teammates participating
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCheckinChallenge(c.id)}
                          disabled={c.checkedInToday}
                          className="checkin-btn"
                          style={{
                            background: c.checkedInToday
                              ? "var(--leaf)"
                              : "linear-gradient(155deg, var(--orange-1), var(--orange-2))",
                          }}
                        >
                          {c.checkedInToday ? "✓ Checked in" : "+ Check in Today"}
                        </button>
                      </div>

                      {/* Visual progress */}
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
                        <div style={{ flex: 1, height: 7, borderRadius: 999, background: "var(--line)", overflow: "hidden" }}>
                          <div
                            style={{
                              height: "100%",
                              width: `${pct}%`,
                              background: "linear-gradient(90deg, var(--leaf), var(--orange-2))",
                              borderRadius: 999,
                            }}
                          />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "var(--peel)", minWidth: 70, textAlign: "right" }}>
                          Day {c.currentDay} / {c.days} ({pct}%)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Client & Project Priority Tasks */}
            <div className="card">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div>
                  <h3 style={{ fontFamily: "Fraunces, serif", fontSize: 18, margin: 0 }}>
                    Client & Project Deliverables
                  </h3>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                    Live status tracking across agency accounts
                  </div>
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>
                  {tasks.filter((t) => t.done).length} of {tasks.length} Completed
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {tasks.map((task) => (
                  <div key={task.id} className={`task-row ${task.done ? "done" : ""}`}>
                    <button
                      type="button"
                      onClick={() => handleToggleTask(task.id)}
                      className={`check ${task.done ? "checked" : ""}`}
                      aria-label="Toggle task"
                    >
                      {task.done && (
                        <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                          <path d="M1 5L4.5 8.5L11 1.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, textDecoration: task.done ? "line-through" : "none" }}>
                        {task.title}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 11, background: "var(--cream)", border: "1px solid var(--line)", padding: "1px 7px", borderRadius: 6, fontWeight: 700, color: "var(--ink)" }}>
                          🏢 {task.client}
                        </span>
                        <span style={{ fontSize: 11, color: "var(--muted)" }}>
                          👤 {task.assignee}
                        </span>
                        <span style={{ fontSize: 11, color: "var(--peel)", fontWeight: 600 }}>
                          ⏰ {task.due}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Leaderboard & Team Roster */}
          <div>
            {/* Leaderboard Card */}
            <div className="card">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <h3 style={{ fontFamily: "Fraunces, serif", fontSize: 18, margin: 0 }}>
                  🏆 Team Leaderboard
                </h3>
                <span style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700 }}>THIS MONTH</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {members
                  .sort((a, b) => b.xp - a.xp)
                  .map((m, idx) => (
                    <div
                      key={m.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "10px 12px",
                        borderRadius: 14,
                        background: idx === 0 ? "var(--gold-soft)" : "var(--cream)",
                        border: idx === 0 ? "1px solid #F3DFA0" : "1px solid var(--line)",
                      }}
                    >
                      <span style={{ fontSize: 14, fontWeight: 800, width: 18, color: idx === 0 ? "#8A6A00" : "var(--muted)" }}>
                        #{idx + 1}
                      </span>
                      <div style={{ fontSize: 22 }}>{m.avatar}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {m.name}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--muted)" }}>
                          {m.role}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 12, fontWeight: 800, color: "var(--peel)" }}>
                          🔥 {m.streak}d
                        </div>
                        <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600 }}>
                          {m.xp} XP
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Quick Actions & Agency Tools */}
            <div className="card">
              <h3 style={{ fontFamily: "Fraunces, serif", fontSize: 17, margin: "0 0 12px" }}>
                Agency Management Tools
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setShowInviteModal(true)}
                  className="btn-ghost"
                  style={{ width: "100%", textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                >
                  <span>✉️ Invite Team Member</span>
                  <span style={{ color: "var(--muted)" }}>→</span>
                </button>
                <button
                  type="button"
                  onClick={() => alert("Agency CSV Timesheet & Activity Report downloaded!")}
                  className="btn-ghost"
                  style={{ width: "100%", textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                >
                  <span>📊 Export Monthly Agency Report (CSV)</span>
                  <span style={{ color: "var(--muted)" }}>→</span>
                </button>
                <button
                  type="button"
                  onClick={() => alert("Custom client portal links generated for Acme Corp and Citrus Health.")}
                  className="btn-ghost"
                  style={{ width: "100%", textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                >
                  <span>🔗 Generate Client Guest Read-Only Links</span>
                  <span style={{ color: "var(--muted)" }}>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Invite Teammate Modal */}
        {showInviteModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: 20,
            }}
          >
            <div
              className="card"
              style={{
                maxWidth: 460,
                width: "100%",
                background: "var(--card)",
                padding: 28,
                position: "relative",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <h3 style={{ fontFamily: "Fraunces, serif", fontSize: 20, margin: 0 }}>
                  Invite Teammate to {workspace}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="del"
                  style={{ fontSize: 20 }}
                >
                  &times;
                </button>
              </div>

              <p style={{ fontSize: 13, color: "var(--muted)", margin: "0 0 18px", lineHeight: 1.5 }}>
                Team members can participate in shared habit sprints, track client milestones, and appear on the agency streak board.
              </p>

              {inviteSuccess ? (
                <div style={{ background: "var(--leaf-soft)", color: "var(--leaf)", padding: "12px 16px", borderRadius: 12, fontWeight: 700, fontSize: 13 }}>
                  ✓ {inviteSuccess}
                </div>
              ) : (
                <form onSubmit={handleInvite} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>
                      Work Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="colleague@agency.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="input"
                      style={{ width: "100%" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>
                      Role in Workspace
                    </label>
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                      className="input"
                      style={{ width: "100%" }}
                    >
                      <option value="Admin">Admin (Full settings & billing control)</option>
                      <option value="Member">Member (Sprints, tasks & leaderboards)</option>
                      <option value="Client Viewer">Client Viewer (Read-only project view)</option>
                    </select>
                  </div>

                  <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                    <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                      Send Invitation
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowInviteModal(false)}
                      className="btn-ghost"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
