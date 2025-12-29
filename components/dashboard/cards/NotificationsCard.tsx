// Notifications & Alerts — simple banget sesuai referensi
export default function NotificationsCard() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_rgba(2,6,23,0.06)] ring-1 ring-slate-200">
      {/* header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
        <h4 className="text-sm font-extrabold uppercase tracking-wider text-blue-900">Notifications & Alerts</h4>
        <button className="text-xs font-semibold text-slate-600 hover:text-pink-700">Mark All as Read</button>
      </div>
      {/* body: list 1 item */}
      <div className="px-5 py-4">
        <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-start gap-3">
            <span className="mt-1 grid h-8 w-8 place-items-center rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-200">🛈</span>
            <div>
              <p className="text-sm font-semibold text-blue-950">Incomplete Registration</p>
              <p className="mt-1 text-xs text-slate-600">You have not completed your registration form yet.</p>
              <p className="text-xs text-slate-500">Please complete your submission to be eligible for the program.</p>
            </div>
          </div>
          <button className="whitespace-nowrap rounded-md bg-amber-500 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-amber-600">Complete Form</button>
        </div>
      </div>
    </div>
  );
}
