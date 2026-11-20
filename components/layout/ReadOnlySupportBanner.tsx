// components/layout/ReadOnlySupportBanner.tsx

/** Shown for the whole of a read-only customer-support session. */
export default function ReadOnlySupportBanner() {
  return (
    <div
      role="status"
      className="fixed inset-x-0 bottom-0 z-[1000] bg-amber-500 px-4 py-2 text-center text-sm font-semibold text-black shadow-lg"
    >
      Read-only support view - changes are disabled
    </div>
  );
}
