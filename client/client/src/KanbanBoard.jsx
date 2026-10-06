import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { STATUSES, STATUS_LABELS } from "../constants";
import MatchBadge from "./MatchBadge";

const fmt = (d) => new Date(d).toLocaleDateString("en-GB");

export default function KanbanBoard({ apps, onStatusChange, onEdit }) {
  const onDragEnd = ({ source, destination, draggableId }) => {
    if (!destination || destination.droppableId === source.droppableId) return;
    onStatusChange(draggableId, destination.droppableId);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-3 overflow-x-auto pb-4">
        {STATUSES.map((status) => {
          const items = apps.filter((a) => a.status === status);
          return (
            <div key={status} className="bg-gray-200 rounded-xl w-64 shrink-0 p-2">
              <h3 className="px-2 py-1 text-sm font-semibold flex justify-between">
                {STATUS_LABELS[status]}
                <span className="text-gray-500">{items.length}</span>
              </h3>

              <Droppable droppableId={status}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-24 space-y-2 p-1 rounded ${snapshot.isDraggingOver ? "bg-blue-100" : ""}`}
                  >
                    {items.map((a, index) => (
                      <Draggable key={a._id} draggableId={a._id} index={index}>
                        {(prov, snap) => (
                          <div
                            ref={prov.innerRef}
                            {...prov.draggableProps}
                            {...prov.dragHandleProps}
                            onClick={() => onEdit(a)}
                            className={`bg-white rounded-lg p-3 cursor-grab ${snap.isDragging ? "shadow-lg" : "shadow-sm"}`}
                          >
                            <p className="font-medium text-sm">{a.company}</p>
                            <p className="text-xs text-gray-600">{a.role}</p>
                            {a.matchScore != null && (
                              <div className="mt-1"><MatchBadge score={a.matchScore} /></div>
                            )}
                            {a.followUpDate && (
                              <p className="text-xs text-amber-700 mt-1">
                                Follow up: {fmt(a.followUpDate)}
                              </p>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}