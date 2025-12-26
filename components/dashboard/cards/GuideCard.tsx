// Kartu panduan pendaftaran — biar peserta tau next step apa aja
export default function GuideCard() {
  return (
    <div className="overflow-hidden rounded-2xl bg-[url('/img/bgprogramoverview.png')] bg-cover bg-center p-5 text-white shadow-[0_12px_40px_rgba(2,6,23,0.12)] ring-1 ring-white/10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-white/80">
            Registration Guideline
          </p>
          <h3 className="mt-1 text-lg font-extrabold">
            Important information about registration and participation
          </h3>
        </div>
        <a
          href="https://docs.google.com/document/d/1wRHpvcOvfZfySWImswKj75En9dw3Lq34GrgS2yX_jC4/edit?tab=t.0"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/25"
        >
          View
        </a>
      </div>
    </div>
  );
}
