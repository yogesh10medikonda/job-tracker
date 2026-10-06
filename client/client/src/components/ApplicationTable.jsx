import { STATUSES, STATUS_LABELS, STATUS_COLORS } from "../constants";
import MatchBadge from "./MatchBadge";

const fmt = (d) => (d ? new Date(d).toLocaleDateString("en-GB") : "-");

export default function ApplicationTable({ apps, onStatusChange, onEdit, onDelete, onAnalyze }) {
  if (apps.length === 0)
    return <p className="text-gray-500 py-10 text-center">No applications found. Add your first one!</p>;

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="px-4 py-3">Company</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Match</th>
            <th className="px-4 py-3">Applied</th>
            <th className="px-4 py-3">Follow-up</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {apps.map((a) => (
            <tr key={a._id} className="border-t">
              <td className="px-4 py-3 font-medium">
                {a.jobUrl ? (
                  <a href={a.jobUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{a.company}</a>
                ) : a.company}
              </td>
              <td className="px-4 py-3">{a.role}</td>
              <td className="px-4 py-3">
                <select
                  value={a.status}
                  onChange={(e) => onStatusChange(a._id, e.target.value)}
                  className={`rounded-full px-2 py-1 text-xs font-medium ${STATUS_COLORS[a.status]}`}
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                </select>
              </td>
              <td className="px-4 py-3"><MatchBadge score={a.matchScore} /></td>
              <td className="px-4 py-3">{fmt(a.appliedDate)}</td>
              <td className="px-4 py-3">{fmt(a.followUpDate)}</td>
              <td className="px-4 py-3 text-right space-x-3 whitespace-nowrap">
                <button onClick={() => onAnalyze(a)} className="text-purple-600 hover:underline">Analyze</button>
                <button onClick={() => onEdit(a)} className="text-blue-600 hover:underline">Edit</button>
                <button onClick={() => onDelete(a._id)} className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}