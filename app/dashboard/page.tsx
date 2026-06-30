"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  LayoutDashboard, Users, BookOpen, GraduationCap, Trophy,
  Settings, ChevronDown, ChevronRight, Search, Plus, Edit,
  Trash2, Eye, RefreshCcw, UserCheck, Award, LogOut,
  Loader2, Check, ShieldCheck, Database, Wifi, Bot, AlertTriangle
} from "lucide-react";

type Page = "dashboard" | "users" | "questions" | "classrooms" | "competitions" | "settings";

const NAV_GROUPS = [
  { items: [{ id: "dashboard" as Page, label: "Dashboard", icon: LayoutDashboard }] },
  {
    label: "Foydalanuvchilar",
    items: [{ id: "users" as Page, label: "Barcha foydalanuvchilar", icon: Users }]
  },
  {
    label: "Kontent",
    items: [
      { id: "questions" as Page, label: "Savollar banki", icon: BookOpen },
      { id: "classrooms" as Page, label: "Sinfxonalar", icon: GraduationCap },
      { id: "competitions" as Page, label: "Musobaqalar", icon: Trophy },
    ]
  },
  {
    label: "Sozlamalar",
    items: [{ id: "settings" as Page, label: "Tizim sozlamalari", icon: Settings }]
  },
];

// ── Sidebar ────────────────────────────────────────────────────────────────
function Sidebar({ current, onNav, onLogout }: { current: Page; onNav: (p: Page) => void; onLogout: () => void }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    Foydalanuvchilar: true, Kontent: true, Sozlamalar: false,
  });

  return (
    <div style={{ width: 232, background: "#fff", borderRight: "1px solid #f0f0f0", display: "flex", flexDirection: "column", height: "100vh", flexShrink: 0, position: "sticky", top: 0 }}>
      {/* Logo */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 9, background: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <ShieldCheck size={16} color="#fff" />
        </div>
        <div>
          <p style={{ fontWeight: 900, fontSize: 13, color: "#0f0f0f", lineHeight: 1 }}>MathUz</p>
          <p style={{ fontSize: 10, color: "#9ca3af", marginTop: 2 }}>Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "12px 10px" }}>
        {NAV_GROUPS.map((group, gi) => (
          <div key={gi} style={{ marginBottom: 6 }}>
            {group.label && (
              <button
                onClick={() => setExpanded(prev => ({ ...prev, [group.label!]: !prev[group.label!] }))}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 8px", fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", background: "none", border: "none", cursor: "pointer" }}
              >
                {group.label}
                {expanded[group.label] ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
              </button>
            )}
            {(!group.label || expanded[group.label!]) && (
              <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {group.items.map(item => {
                  const active = current === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onNav(item.id)}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", gap: 9,
                        padding: "8px 10px", borderRadius: 8, fontSize: 13, fontWeight: active ? 600 : 500,
                        background: active ? "#7c3aed" : "transparent",
                        color: active ? "#fff" : "#6b7280",
                        border: "none", cursor: "pointer", transition: "all 0.15s"
                      }}
                    >
                      <item.icon size={14} />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ borderTop: "1px solid #f0f0f0", padding: "10px" }}>
        <button
          onClick={onLogout}
          style={{ width: "100%", display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", borderRadius: 8, fontSize: 13, color: "#6b7280", background: "none", border: "none", cursor: "pointer" }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#fff0f0"; (e.currentTarget as HTMLButtonElement).style.color = "#ef4444"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "none"; (e.currentTarget as HTMLButtonElement).style.color = "#6b7280"; }}
        >
          <LogOut size={14} />
          Chiqish
        </button>
      </div>
    </div>
  );
}

// ── Stat Card ──────────────────────────────────────────────────────────────
function StatCard({ title, value, icon: Icon, color, bg, sub }: { title: string; value: string | number; icon: React.ElementType; color: string; bg: string; sub?: string }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: 14, padding: 20 }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
        <Icon size={17} color={color} />
      </div>
      <p style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500, marginBottom: 2 }}>{title}</p>
      <p style={{ fontSize: 26, fontWeight: 900, color: "#0f0f0f" }}>{value}</p>
      {sub && <p style={{ fontSize: 11, color: "#d1d5db", marginTop: 2 }}>{sub}</p>}
    </div>
  );
}

function Badge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: 99, fontSize: 11, fontWeight: 600, color, background: bg }}>
      {label}
    </span>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────
function DashboardContent() {
  const [stats, setStats] = useState({ questions: 0, classrooms: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from("questions").select("*", { count: "exact", head: true }),
      supabase.from("classrooms").select("*", { count: "exact", head: true }),
    ]).then(([q, c]) => {
      setStats({ questions: q.count ?? 0, classrooms: c.count ?? 0 });
      setLoading(false);
    });
  }, []);

  const statItems = [
    { title: "Savollar", value: loading ? "..." : stats.questions, icon: BookOpen, color: "#7c3aed", bg: "#f5f3ff", sub: "bazada mavjud" },
    { title: "Sinfxonalar", value: loading ? "..." : stats.classrooms, icon: GraduationCap, color: "#22c55e", bg: "#f0fdf4", sub: "faol sinflar" },
    { title: "Musobaqalar", value: "0", icon: Trophy, color: "#f97316", bg: "#fff7ed", sub: "oylik tashkil etiladi" },
    { title: "Premium", value: "0", icon: Award, color: "#eab308", bg: "#fefce8", sub: "to'lovli foydalanuvchi" },
  ];

  const systemStatus = [
    { label: "Supabase ulanishi", icon: Database, ok: true },
    { label: "Savollar banki", icon: BookOpen, ok: !loading && stats.questions > 0, note: stats.questions === 0 ? "Savol yo'q" : undefined },
    { label: "Classroom tizimi", icon: GraduationCap, ok: true },
    { label: "Tarmoq", icon: Wifi, ok: true },
    { label: "AI yordamchi", icon: Bot, ok: false, note: "API kredit kerak" },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 900, color: "#0f0f0f" }}>Dashboard</h1>
        <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 2 }}>MathUz tizimining umumiy holati</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {statItems.map(s => <StatCard key={s.title} {...s} />)}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {/* System status */}
        <div style={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: 14, padding: 20 }}>
          <p style={{ fontWeight: 700, fontSize: 14, color: "#0f0f0f", marginBottom: 16 }}>Tizim holati</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {systemStatus.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: i < systemStatus.length - 1 ? "1px solid #f9f9f9" : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <item.icon size={14} color="#9ca3af" />
                  <span style={{ fontSize: 13, color: "#374151" }}>{item.label}</span>
                </div>
                {item.ok
                  ? <span style={{ fontSize: 12, fontWeight: 600, color: "#22c55e", display: "flex", alignItems: "center", gap: 4 }}><Check size={11} /> Faol</span>
                  : <span style={{ fontSize: 12, fontWeight: 600, color: "#ef4444" }}>{item.note ?? "Xato"}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div style={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: 14, padding: 20 }}>
          <p style={{ fontWeight: 700, fontSize: 14, color: "#0f0f0f", marginBottom: 16 }}>Tezkor havolalar</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { label: "Asosiy sayt", url: "https://mathuz-i8j3.vercel.app", note: "Student platformasi" },
              { label: "Supabase", url: "https://supabase.com/dashboard", note: "Ma'lumotlar bazasi" },
              { label: "Vercel", url: "https://vercel.com/dashboard", note: "Deployment" },
            ].map(link => (
              <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: 10, background: "#f9f9fb", textDecoration: "none", border: "1px solid #f0f0f0" }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#0f0f0f" }}>{link.label}</p>
                  <p style={{ fontSize: 11, color: "#9ca3af" }}>{link.note}</p>
                </div>
                <span style={{ fontSize: 16, color: "#d1d5db" }}>↗</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Users ─────────────────────────────────────────────────────────────────
function UsersContent() {
  const [users, setUsers] = useState<{ user_id: string; name: string; coins: number; streak: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("leaderboard").select("user_id,name,coins,streak").order("coins", { ascending: false });
    setUsers(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = users.filter(u => !search || u.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 900, color: "#0f0f0f" }}>Foydalanuvchilar</h1>
          <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 2 }}>Jami {users.length} ta foydalanuvchi (leaderboard orqali)</p>
        </div>
        <button onClick={load} style={{ padding: "8px", borderRadius: 8, border: "1px solid #f0f0f0", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", color: "#6b7280" }}>
          <RefreshCcw size={13} />
        </button>
      </div>

      {/* Search */}
      <div style={{ position: "relative", maxWidth: 300, marginBottom: 16 }}>
        <Search size={13} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Ism bo'yicha..."
          style={{ width: "100%", paddingLeft: 36, paddingRight: 12, paddingTop: 9, paddingBottom: 9, border: "1px solid #e5e5e7", borderRadius: 10, fontSize: 13, outline: "none", background: "#fff" }}
        />
      </div>

      {/* Table */}
      <div style={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: 14, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
              {["#", "Ism", "Streak", "Tangalar", "Amallar"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ textAlign: "center", padding: "40px 0", fontSize: 13, color: "#9ca3af" }}>
                <Loader2 size={16} style={{ display: "inline", marginRight: 8, animation: "spin 1s linear infinite" }} />Yuklanmoqda...
              </td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: "center", padding: "40px 0", fontSize: 13, color: "#9ca3af" }}>Foydalanuvchi topilmadi</td></tr>
            ) : filtered.map((u, i) => (
              <tr key={u.user_id} style={{ borderBottom: "1px solid #f9f9f9" }}>
                <td style={{ padding: "12px 16px", fontSize: 12, color: "#9ca3af" }}>{i + 1}</td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                      {(u.name ?? "U").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "#0f0f0f" }}>{u.name ?? "Foydalanuvchi"}</p>
                      <p style={{ fontSize: 11, color: "#d1d5db" }}>{u.user_id.slice(0, 10)}...</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "#f97316" }}>🔥 {u.streak ?? 0}</td>
                <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "#eab308" }}>🪙 {u.coins ?? 0}</td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button style={{ padding: 6, borderRadius: 6, border: "none", background: "transparent", cursor: "pointer", color: "#9ca3af" }} title="Ko'rish">
                      <Eye size={13} />
                    </button>
                    <button style={{ padding: 6, borderRadius: 6, border: "none", background: "transparent", cursor: "pointer", color: "#9ca3af" }} title="O'qituvchi roli">
                      <UserCheck size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Questions ─────────────────────────────────────────────────────────────
function QuestionsContent() {
  const [questions, setQuestions] = useState<{ id: string; text: string; topic: string; difficulty: string; answer: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const PER = 20;

  useEffect(() => {
    setLoading(true);
    Promise.all([
      supabase.from("questions").select("id,text,topic,difficulty,answer").order("id").range((page - 1) * PER, page * PER - 1),
      supabase.from("questions").select("*", { count: "exact", head: true }),
    ]).then(([{ data }, { count }]) => {
      setQuestions(data ?? []);
      setTotal(count ?? 0);
      setLoading(false);
    });
  }, [page]);

  const filtered = questions.filter(q =>
    !search || q.text?.toLowerCase().includes(search.toLowerCase()) || q.topic?.toLowerCase().includes(search.toLowerCase())
  );

  const diffColor = (d: string) =>
    d === "Oson" ? { color: "#16a34a", bg: "#f0fdf4" } :
    d === "O'rtacha" ? { color: "#d97706", bg: "#fffbeb" } :
    { color: "#dc2626", bg: "#fef2f2" };

  async function deleteQuestion(id: string) {
    if (!confirm("Bu savolni o'chirasizmi?")) return;
    await supabase.from("questions").delete().eq("id", id);
    setQuestions(prev => prev.filter(q => q.id !== id));
    setTotal(prev => prev - 1);
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 900, color: "#0f0f0f" }}>Savollar banki</h1>
          <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 2 }}>Jami {total} ta savol</p>
        </div>
      </div>

      <div style={{ position: "relative", maxWidth: 300, marginBottom: 16 }}>
        <Search size={13} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Savol yoki mavzu..."
          style={{ width: "100%", paddingLeft: 36, paddingRight: 12, paddingTop: 9, paddingBottom: 9, border: "1px solid #e5e5e7", borderRadius: 10, fontSize: 13, outline: "none", background: "#fff" }}
        />
      </div>

      <div style={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: 14, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
              {["#", "Savol", "Mavzu", "Qiyinlik", "Javob", "Amallar"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: "40px 0", fontSize: 13, color: "#9ca3af" }}>
                <Loader2 size={16} style={{ display: "inline", marginRight: 8, animation: "spin 1s linear infinite" }} />Yuklanmoqda...
              </td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: "40px 0", fontSize: 13, color: "#9ca3af" }}>
                {total === 0 ? "Hozircha savollar yo'q" : "Natija topilmadi"}
              </td></tr>
            ) : filtered.map((q, i) => {
              const dc = diffColor(q.difficulty);
              return (
                <tr key={q.id} style={{ borderBottom: "1px solid #f9f9f9" }}>
                  <td style={{ padding: "10px 16px", fontSize: 12, color: "#9ca3af" }}>{(page - 1) * PER + i + 1}</td>
                  <td style={{ padding: "10px 16px", maxWidth: 260 }}>
                    <p style={{ fontSize: 13, color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{q.text?.slice(0, 80)}</p>
                    <p style={{ fontSize: 10, color: "#d1d5db", marginTop: 2 }}>{q.id}</p>
                  </td>
                  <td style={{ padding: "10px 16px", fontSize: 12, color: "#6b7280", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{q.topic}</td>
                  <td style={{ padding: "10px 16px" }}>
                    <Badge label={q.difficulty || "—"} color={dc.color} bg={dc.bg} />
                  </td>
                  <td style={{ padding: "10px 16px", fontSize: 12, color: "#6b7280", maxWidth: 80, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{q.answer}</td>
                  <td style={{ padding: "10px 16px" }}>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button style={{ padding: 6, borderRadius: 6, border: "none", background: "transparent", cursor: "pointer", color: "#9ca3af" }}>
                        <Edit size={12} />
                      </button>
                      <button onClick={() => deleteQuestion(q.id)} style={{ padding: 6, borderRadius: 6, border: "none", background: "transparent", cursor: "pointer", color: "#9ca3af" }}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination */}
        <div style={{ padding: "12px 16px", borderTop: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontSize: 12, color: "#9ca3af" }}>{total} ta savoldan {(page - 1) * PER + 1}–{Math.min(page * PER, total)} ko&apos;rsatilmoqda</p>
          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              style={{ padding: "5px 12px", fontSize: 12, border: "1px solid #e5e5e7", borderRadius: 8, background: "#fff", cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? 0.4 : 1 }}
            >← Oldingi</button>
            <span style={{ padding: "5px 10px", fontSize: 12, color: "#6b7280" }}>{page}</span>
            <button
              onClick={() => setPage(p => p + 1)} disabled={page * PER >= total}
              style={{ padding: "5px 12px", fontSize: 12, border: "1px solid #e5e5e7", borderRadius: 8, background: "#fff", cursor: page * PER >= total ? "not-allowed" : "pointer", opacity: page * PER >= total ? 0.4 : 1 }}
            >Keyingi →</button>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Settings ──────────────────────────────────────────────────────────────
function SettingsContent() {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 900, color: "#0f0f0f" }}>Tizim sozlamalari</h1>
        <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 2 }}>Foydalanuvchi rollari va tizim boshqaruvi</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Warning */}
        <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12, padding: "14px 16px", display: "flex", gap: 10, alignItems: "flex-start" }}>
          <AlertTriangle size={15} color="#d97706" style={{ marginTop: 1, flexShrink: 0 }} />
          <p style={{ fontSize: 13, color: "#92400e" }}>
            Foydalanuvchi rollarini o&apos;zgartirish uchun <strong>Supabase SQL Editor</strong>dan foydalaning.
            Anon key orqali auth.users jadvaliga yozish imkoni yo&apos;q.
          </p>
        </div>

        {[
          {
            title: "O'qituvchi roli berish",
            sql: `UPDATE auth.users\nSET raw_user_meta_data = raw_user_meta_data || '{"is_teacher":true}'::jsonb\nWHERE email = 'foydalanuvchi@email.com';`
          },
          {
            title: "Premium berish",
            sql: `UPDATE auth.users\nSET raw_user_meta_data = raw_user_meta_data || '{"is_premium":true}'::jsonb\nWHERE email = 'foydalanuvchi@email.com';`
          },
          {
            title: "Rol olib tashlash",
            sql: `UPDATE auth.users\nSET raw_user_meta_data = raw_user_meta_data - 'is_teacher' - 'is_premium'\nWHERE email = 'foydalanuvchi@email.com';`
          },
        ].map(item => (
          <div key={item.title} style={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: 14, padding: 20 }}>
            <p style={{ fontWeight: 700, fontSize: 14, color: "#0f0f0f", marginBottom: 12 }}>{item.title}</p>
            <pre style={{ background: "#f9f9fb", border: "1px solid #f0f0f0", borderRadius: 10, padding: "12px 14px", fontSize: 12, color: "#374151", fontFamily: "monospace", overflowX: "auto", margin: 0, lineHeight: 1.7 }}>
              {item.sql}
            </pre>
          </div>
        ))}

        {/* Links */}
        <div style={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: 14, padding: 20 }}>
          <p style={{ fontWeight: 700, fontSize: 14, color: "#0f0f0f", marginBottom: 12 }}>Foydali havolalar</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { label: "Supabase Dashboard", url: "https://supabase.com/dashboard" },
              { label: "Vercel Dashboard", url: "https://vercel.com/dashboard" },
              { label: "Asosiy sayt (mathuz-i8j3.vercel.app)", url: "https://mathuz-i8j3.vercel.app" },
            ].map(link => (
              <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 13, color: "#7c3aed", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
                ↗ {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Coming Soon ────────────────────────────────────────────────────────────
function ComingSoon({ title }: { title: string }) {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 900, color: "#0f0f0f" }}>{title}</h1>
      </div>
      <div style={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: 14, padding: "60px 0", textAlign: "center" }}>
        <p style={{ fontSize: 32, marginBottom: 12 }}>🚧</p>
        <p style={{ fontSize: 15, fontWeight: 700, color: "#0f0f0f", marginBottom: 6 }}>Tez orada</p>
        <p style={{ fontSize: 13, color: "#9ca3af" }}>Bu bo&apos;lim hali ishlab chiqilmoqda</p>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();
  const [page, setPage] = useState<Page>("dashboard");
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("admin_auth") !== "1") {
        router.replace("/");
      } else {
        setChecked(true);
      }
    }
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("admin_auth");
    router.replace("/");
  }

  if (!checked) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 size={20} style={{ animation: "spin 1s linear infinite", color: "#7c3aed" }} />
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#f9f9fb" }}>
      <Sidebar current={page} onNav={setPage} onLogout={handleLogout} />
      <main style={{ flex: 1, overflowY: "auto", padding: 28 }}>
        {page === "dashboard" && <DashboardContent />}
        {page === "users" && <UsersContent />}
        {page === "questions" && <QuestionsContent />}
        {page === "classrooms" && <ComingSoon title="Sinfxonalar" />}
        {page === "competitions" && <ComingSoon title="Musobaqalar" />}
        {page === "settings" && <SettingsContent />}
      </main>
    </div>
  );
}
