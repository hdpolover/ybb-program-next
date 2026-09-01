"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";

function normalizeCanvaUrl(url: string): string {
  // Strip fragment and re-append ?embed if missing
  const [base] = url.split("#");
  const u = new URL(base);
  if (!u.searchParams.has("embed")) {
    u.searchParams.set("embed", "");
    // Canva uses bare `?embed` with no value — remove the trailing `=`
    return u.toString().replace("embed=", "embed");
  }
  return u.toString();
}

function isCanvaUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.hostname === "www.canva.com" || u.hostname === "canva.com";
  } catch {
    return false;
  }
}

type CanvaEmbedItem = {
  url: string;
  programName: string | null;
};

function SingleCanvaEmbed({ url, programName }: CanvaEmbedItem) {
  const [failed, setFailed] = useState(false);

  if (!isCanvaUrl(url)) return null;

  const embedUrl = normalizeCanvaUrl(url);

  return (
    <div>
      {programName && (
        <h2 className="mb-3 text-lg font-semibold text-neutral-900">{programName}</h2>
      )}
      {failed ? (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            The Canva presentation could not be embedded. Make sure the Canva link is set to <strong>Anyone with the link can view</strong> and that the URL comes from <strong>Share → Embed</strong>.
          </p>
        </div>
      ) : (
        <div
          className="relative w-full overflow-hidden rounded-2xl shadow-md"
          style={{ paddingTop: "56.25%" }}
        >
          <iframe
            src={embedUrl}
            title={programName ? `${programName} — Partnership Overview` : "Partnership Overview"}
            className="absolute inset-0 h-full w-full border-0"
            allowFullScreen
            allow="fullscreen"
            onError={() => setFailed(true)}
          />
        </div>
      )}
    </div>
  );
}

export default function CanvaEmbedSection({ embeds }: { embeds: CanvaEmbedItem[] }) {
  return (
    <section className="w-full bg-white py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        {embeds.map((embed) => (
          <SingleCanvaEmbed key={`${embed.programName ?? 'legacy'}-${embed.url}`} {...embed} />
        ))}
      </div>
    </section>
  );
}
