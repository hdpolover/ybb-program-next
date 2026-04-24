import { ExternalLink, PlayCircle, Download } from "lucide-react";
import type { PortalFieldHelpAsset } from "@/types/portal-submission";

interface FieldHelpAssetsProps {
  items?: PortalFieldHelpAsset[];
  className?: string;
}

function IconForKind({ kind }: { kind: PortalFieldHelpAsset["kind"] }) {
  if (kind === "video") return <PlayCircle className="h-3.5 w-3.5" aria-hidden="true" />;
  if (kind === "file") return <Download className="h-3.5 w-3.5" aria-hidden="true" />;
  return <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />;
}

/**
 * Renders the admin-configured guidance items (example links, tutorial videos,
 * downloadable templates) as a small cluster of labeled pills beneath a form
 * field. Each pill opens in a new tab.
 */
export function FieldHelpAssets({ items, className }: FieldHelpAssetsProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className ?? ""}`}>
      {items.map((item, idx) => (
        <a
          key={`${item.url}-${idx}`}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 transition hover:bg-blue-100"
        >
          <IconForKind kind={item.kind} />
          <span>{item.label}</span>
        </a>
      ))}
    </div>
  );
}
