import { Map, List } from "lucide-react";

export default function ViewToggle({ view, onViewChange }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden">
      <div className="bg-white rounded-full shadow-2xl border-2 border-gray-200 p-1.5 flex gap-1">
        <button
          onClick={() => onViewChange("list")}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all ${
            view === "list"
              ? "bg-[var(--pcolor1)] text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <List className="w-5 h-5" />
          List
        </button>

        <button
          onClick={() => onViewChange("map")}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all ${
            view === "map"
              ? "bg-[var(--pcolor1)] text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <Map className="w-5 h-5" />
          Map
        </button>
      </div>
    </div>
  );
}
