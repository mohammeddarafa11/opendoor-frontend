// frontend/src/components/ui/LoadingIndicator.jsx
import { Loader2 } from "lucide-react";

export default function LoadingIndicator({
  fullScreen = false,
  message = "Loading...",
}) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-[var(--pcolor2)]/80 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-[var(--pcolor3)]/50 backdrop-blur-xl border border-[var(--pcolor1)]/50 rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl">
          <Loader2 className="w-12 h-12 text-[var(--pcolor1)] animate-spin" />
          <p className="text-white font-medium">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center py-20">
      <Loader2 className="w-12 h-12 text-[var(--pcolor1)] animate-spin" />
      <p className="text-gray-900 ml-4">{message}</p>
    </div>
  );
}
