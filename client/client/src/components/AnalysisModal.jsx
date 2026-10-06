import MatchBadge from "./MatchBadge";

const Chips = ({ items, color }) =>
  items.length ? (
    <div className="flex flex-wrap gap-2">
      {items.map((s) => (
        <span key={s} className={`rounded-full px-3 py-1 text-xs ${color}`}>{s}</span>
      ))}
    </div>
  ) : (
    <p className="text-sm text-gray-500">None</p>
  );

export default function AnalysisModal({ data, onClose }) {
  const required = data.requiredSkills || data.jobSkills || [];
  const matched = data.matchedSkills || [];
  const missing = data.missingSkills || [];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold">{data.company}</h2>
            <p className="text-sm text-gray-600">{data.role}</p>
          </div>
          <MatchBadge score={data.matchScore} />
        </div>

        {required.length === 0 ? (
          <p className="text-sm text-gray-600">
            No known skills were found in this job description. Try pasting the full requirements section.
          </p>
        ) : (
          <>
            <div>
              <h3 className="text-sm font-semibold mb-2">You have ({matched.length})</h3>
              <Chips items={matched} color="bg-green-100 text-green-700" />
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-2">Missing ({missing.length})</h3>
              <Chips items={missing} color="bg-red-100 text-red-700" />
            </div>
          </>
        )}

        <button onClick={onClose} className="w-full border rounded py-2">Close</button>
      </div>
    </div>
  );
}