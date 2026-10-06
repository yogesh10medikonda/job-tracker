import { useCallback, useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import { STATUSES, STATUS_LABELS } from "../constants";
import ApplicationTable from "../components/ApplicationTable";
import ApplicationForm from "../components/ApplicationForm";
import KanbanBoard from "../components/KanbanBoard";
import StatsPanel from "../components/StatsPanel";
import SkillsPanel from "../components/SkillsPanel";
import FollowUpPanel from "../components/FollowUpPanel";
import AnalysisModal from "../components/AnalysisModal";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [view, setView] = useState("board");
  const [statsKey, setStatsKey] = useState(0);
  const [editing, setEditing] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const refreshStats = () => setStatsKey((k) => k + 1);

  const load = useCallback(async () => {
    try {
      const params = {};
      if (status) params.status = status;
      if (search.trim()) params.search = search.trim();
      const res = await api.get("/applications", { params });
      setApps(res.data);
      setError("");
    } catch {
      setError("Could not load applications");
    } finally {
      setLoading(false);
    }
  }, [status, search]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const changeStatus = async (id, newStatus) => {
    setApps((prev) => prev.map((a) => (a._id === id ? { ...a, status: newStatus } : a)));
    try {
      await api.patch(`/applications/${id}/status`, { status: newStatus });
      refreshStats();
    } catch {
      setError("Could not update status");
      load();
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this application?")) return;
    try {
      await api.delete(`/applications/${id}`);
      load();
      refreshStats();
    } catch {
      setError("Could not delete");
    }
  };

  const analyze = async (app) => {
    if (!app.jobDescription || !app.jobDescription.trim()) {
      setError("Add a job description first, then click Analyze.");
      setEditing(app);
      return;
    }
    try {
      setError("");
      const res = await api.post(`/applications/${app._id}/analyze`);
      setAnalysis({ company: app.company, role: app.role, ...res.data });
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not analyze");
    }
  };

  const tab = (name) =>
    `px-3 py-1.5 text-sm rounded ${view === name ? "bg-blue-600 text-white" : "bg-white border"}`;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold">Job Tracker</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Hi, {user.name}</span>
            <button onClick={logout} className="text-sm bg-gray-800 text-white rounded px-3 py-1.5">Log out</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-4">
        <StatsPanel refreshKey={statsKey} />
        <SkillsPanel />
        <FollowUpPanel refreshKey={statsKey} />
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search company or role..."
              className="border rounded px-3 py-2 w-64 bg-white"
            />
            {view === "table" && (
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="border rounded px-3 py-2 bg-white">
                <option value="">All statuses</option>
                {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
              </select>
            )}
            <button className={tab("board")} onClick={() => { setView("board"); setStatus(""); }}>Board</button>
            <button className={tab("table")} onClick={() => setView("table")}>Table</button>
          </div>
          <button onClick={() => setEditing({})} className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700">
            + Add application
          </button>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : view === "board" ? (
          <KanbanBoard apps={apps} onStatusChange={changeStatus} onEdit={setEditing} />
        ) : (
          <ApplicationTable apps={apps} onStatusChange={changeStatus} onEdit={setEditing} onDelete={remove} onAnalyze={analyze} />
        )}
      </main>

      {editing && (
        <ApplicationForm
          initial={editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load(); refreshStats(); }}
        />
      )}
      {analysis && <AnalysisModal data={analysis} onClose={() => setAnalysis(null)} />}
    </div>
  );
}