import { useEffect, useState } from "react";
import api from "../api/api";

export default function FollowUpPanel({ refreshKey }) {
  const [items, setItems] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    api.get("/applications/followups").then((r) => setItems(r.data)).catch(() => {});
  }, [refreshKey]);

  if (items.length === 0) return null;

  const copy = async (item) => {
    try {
      await navigator.clipboard.writeText(`Subject: ${item.draft.subject}\n\n${item.draft.body}`);
      setCopied(item._id);
      setTimeout(() => setCopied(""), 1500);
    } catch {
      /* clipboard blocked: user can still select the text */
    }
  };

  const mailto = (d) =>
    `mailto:?subject=${encodeURIComponent(d.subject)}&body=${encodeURIComponent(d.body)}`;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
      <h3 className="text-sm font-semibold text-amber-800">
        Follow-ups needed ({items.length})
      </h3>
      {items.map((item) => (
        <div key={item._id} className="bg-white rounded-lg p-3 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-medium text-sm">{item.company} <span className="text-gray-500 font-normal">- {item.role}</span></p>
              <p className="text-xs text-amber-700">{item.reason}</p>
            </div>
            <button
              onClick={() => setOpenId(openId === item._id ? null : item._id)}
              className="text-sm text-blue-600 hover:underline"
            >
              {openId === item._id ? "Hide draft" : "Show draft"}
            </button>
          </div>

          {openId === item._id && (
            <div className="mt-3 space-y-2">
              <p className="text-xs text-gray-500">Subject: {item.draft.subject}</p>
              <pre className="whitespace-pre-wrap text-sm bg-gray-50 rounded p-3 font-sans">{item.draft.body}</pre>
              <div className="flex gap-3">
                <button onClick={() => copy(item)} className="text-sm bg-gray-800 text-white rounded px-3 py-1.5">
                  {copied === item._id ? "Copied!" : "Copy draft"}
                </button>
                <a href={mailto(item.draft)} className="text-sm border rounded px-3 py-1.5">Open in email app</a>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}