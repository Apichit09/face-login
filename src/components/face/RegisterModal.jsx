"use client";

export default function RegisterModal({ open, title, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 className="text-lg font-bold text-neutral-900 sm:text-xl">{title}</h2>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-lg text-neutral-700 transition hover:bg-neutral-200"
            >
              ×
            </button>
          )}
        </div>

        {children}
      </div>
    </div>
  );
}