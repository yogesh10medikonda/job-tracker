export default function MatchBadge({ score }) {
  if (score === null || score === undefined) return <span className="text-gray-400">-</span>;
  const color =
    score >= 70 ? "bg-green-100 text-green-700"
    : score >= 40 ? "bg-amber-100 text-amber-700"
    : "bg-red-100 text-red-700";
  return <span className={`rounded-full px-2 py-1 text-xs font-medium ${color}`}>{score}% match</span>;
}