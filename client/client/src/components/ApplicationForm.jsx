import { useState } from "react";
import api from "../api/api";
import { STATUSES, STATUS_LABELS } from "../constants";

const toDateInput = (d) => (d ? d.slice(0, 10) : "");

export default function ApplicationForm({ initial, onClose, onSaved }) {
  const isEdit = Boolean(initial?._id);
  const [form, setForm] = useState({
    company: initial?.company || "",
    role: initial?.role || "",
    jobUrl: initial?.jobUrl || "",
    location: initial?.location || "",
    status: initial?.status || "wishlist",
    appliedDate: toDateInput(initial?.appliedDate),
    followUpDate: toDateInput(initial?.followUpDate),
    notes: initial?.notes || "",
    jobDescription: initial?.jobDescription || "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      ...form,
      appliedDate: form.appliedDate || null,
      followUpDate: form.followUpDate || null,
    };
    try {
      if (isEdit) await api.put(`/applications/${initial._id}`, payload);
      else await api.post("/applications", payload);
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save");
    } finally {
      setSaving(false);
    }
  };

  const input = "w-full border rounded px-3 py-2";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <form onSubmit={onSubmit} className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 space-y-3 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold">{isEdit ? "Edit application" : "Add application"}</h2>
        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="grid grid-cols-2 gap-3">
          <input name="company" placeholder="Company *" value={form.company} onChange={onChange} required className={input} />
          <input name="role" placeholder="Role *" value={form.role} onChange={onChange} required className={input} />
          <input name="location" placeholder="Location" value={form.location} onChange={onChange} className={input} />
          <select name="status" value={form.status} onChange={onChange} className={input}>
            {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
          <label className="text-sm text-gray-600">Applied date
            <input name="appliedDate" type="date" value={form.appliedDate} onChange={onChange} className={input} />
          </label>
          <label className="text-sm text-gray-600">Follow-up date
            <input name="followUpDate" type="date" value={form.followUpDate} onChange={onChange} className={input} />
          </label>
        </div>

        <input name="jobUrl" placeholder="Job posting URL" value={form.jobUrl} onChange={onChange} className={input} />
        <textarea
          name="jobDescription"
          placeholder="Paste the job description here (used for the skill match)"
          rows={5}
          value={form.jobDescription}
          onChange={onChange}
          className={input}
        />
        <textarea name="notes" placeholder="Notes" rows={3} value={form.notes} onChange={onChange} className={input} />

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded border">Cancel</button>
          <button disabled={saving} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}