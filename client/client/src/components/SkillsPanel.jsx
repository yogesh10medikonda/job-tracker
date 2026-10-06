import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function SkillsPanel() {
  const { user, updateSkills } = useAuth();
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const skills = user.resumeSkills || [];

  const save = async (next) => {
    try {
      setError("");
      await updateSkills(next);
    } catch {
      setError("Could not save skills");
    }
  };

  const add = (e) => {
    e.preventDefault();
    const parts = input.split(",").map((s) => s.trim()).filter(Boolean);
    if (!parts.length) return;
    setInput("");
    save([...new Set([...skills, ...parts])]);
  };

  return (
    <details className="bg-white rounded-xl shadow p-4" open={skills.length === 0}>
      <summary className="cursor-pointer font-semibold text-sm">
        My skills ({skills.length}), used to calculate match scores
      </summary>
      <div className="mt-3 space-y-3">
        <form onSubmit={add} className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. Python, React, SQL, Docker"
            className="flex-1 border rounded px-3 py-2 text-sm"
          />
          <button className="bg-blue-600 text-white rounded px-4 py-2 text-sm">Add</button>
        </form>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="flex flex-wrap gap-2">
          {skills.map((s) => (
            <span key={s} className="bg-blue-50 text-blue-700 rounded-full px-3 py-1 text-xs flex items-center gap-1">
              {s}
              <button onClick={() => save(skills.filter((x) => x !== s))} className="hover:text-red-600" aria-label={`Remove ${s}`}>×</button>
            </span>
          ))}
        </div>
      </div>
    </details>
  );
}