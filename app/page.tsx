"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";

const PASSWORD = "mathuz2024";

export default function LoginPage() {
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (pw === PASSWORD) {
        localStorage.setItem("admin_auth", "1");
        router.push("/dashboard");
      } else {
        setError(true);
        setLoading(false);
      }
    }, 400);
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#f9f9fb" }}>
      <div style={{ background: "#fff", border: "1px solid #ebebeb", borderRadius: 20, padding: "40px 36px", width: 340, boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ShieldCheck size={18} color="#fff" />
          </div>
          <div>
            <p style={{ fontWeight: 900, fontSize: 15, color: "#0f0f0f", lineHeight: 1 }}>MathModul</p>
            <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>Admin Panel</p>
          </div>
        </div>

        <h1 style={{ fontWeight: 900, fontSize: 22, color: "#0f0f0f", marginBottom: 4 }}>Xush kelibsiz</h1>
        <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 24 }}>Admin parolni kiriting</p>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            type="password"
            value={pw}
            onChange={e => { setPw(e.target.value); setError(false); }}
            placeholder="••••••••"
            autoFocus
            style={{
              width: "100%", border: `1px solid ${error ? "#fca5a5" : "#e5e5e7"}`,
              borderRadius: 12, padding: "10px 14px", fontSize: 14,
              background: error ? "#fff5f5" : "#fff", outline: "none", color: "#0f0f0f"
            }}
          />
          {error && <p style={{ fontSize: 12, color: "#ef4444" }}>Parol noto&apos;g&apos;ri</p>}
          <button
            type="submit"
            disabled={loading || !pw}
            style={{
              width: "100%", background: "#7c3aed", color: "#fff", fontWeight: 700,
              fontSize: 14, padding: "11px 0", borderRadius: 12, border: "none",
              cursor: loading || !pw ? "not-allowed" : "pointer", opacity: loading || !pw ? 0.7 : 1,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8
            }}
          >
            {loading && <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />}
            Kirish
          </button>
        </form>

        <p style={{ fontSize: 12, color: "#d1d5db", textAlign: "center", marginTop: 20 }}>
          mathuz-i8j3.vercel.app · Admin faqat
        </p>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
