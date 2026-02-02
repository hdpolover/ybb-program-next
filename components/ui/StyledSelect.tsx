"use client";

import React from "react";
import { Check, ChevronDown } from "lucide-react";

export type StyledSelectOption = {
  value: string;
  label: string;
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  options: StyledSelectOption[];
  placeholder: string;
  className: string;
  disabled?: boolean;
  searchable?: boolean;
};

export default function StyledSelect({
  value,
  onChange,
  options,
  placeholder,
  className,
  disabled,
  searchable,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [placement, setPlacement] = React.useState<"bottom" | "top">("bottom");
  const [maxMenuHeight, setMaxMenuHeight] = React.useState<number>(144);
  const [menuRect, setMenuRect] = React.useState<{ left: number; width: number; top: number; bottom: number } | null>(
    null,
  );
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);
  const menuRef = React.useRef<HTMLDivElement | null>(null);
  const listRef = React.useRef<HTMLDivElement | null>(null);

  const selected = React.useMemo(() => {
    return options.find(option => option.value === value) ?? null;
  }, [options, value]);

  const filteredOptions = React.useMemo(() => {
    if (!searchable) return options;
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(option => option.label.toLowerCase().includes(q));
  }, [options, query, searchable]);

  React.useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node | null;
      if (!target) return;
      if (wrapperRef.current && !wrapperRef.current.contains(target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [open]);

  React.useEffect(() => {
    if (!open) return;

    function updatePosition() {
      const buttonEl = buttonRef.current;
      if (!buttonEl) return;

      const rect = buttonEl.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const gap = 8;
      const padding = 12;

      const spaceBelow = viewportHeight - rect.bottom - gap - padding;
      const spaceAbove = rect.top - gap - padding;

      // Keep the dropdown compact: ~3 options visible, rest scroll.
      const desired = 144;
      const minHeight = 96;

      const left = Math.min(Math.max(rect.left, padding), viewportWidth - padding - rect.width);
      const width = Math.min(rect.width, viewportWidth - padding * 2);

      if (spaceBelow < minHeight && spaceAbove > spaceBelow) {
        setPlacement("top");
        setMaxMenuHeight(Math.max(minHeight, Math.min(desired, spaceAbove)));
        setMenuRect({ left, width, top: 0, bottom: viewportHeight - rect.top + gap });
      } else {
        setPlacement("bottom");
        setMaxMenuHeight(Math.max(minHeight, Math.min(desired, spaceBelow)));
        setMenuRect({ left, width, top: rect.bottom + gap, bottom: 0 });
      }
    }

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  React.useEffect(() => {
    if (open) {
      setOpen(false);
    }
    // Intentionally only depends on value.
    // When parent state changes (selection saved), close the dropdown for better UX.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  React.useEffect(() => {
    if (!open) return;

    // Make sure the selected option is visible when opening the dropdown.
    // This is important when the dropdown only shows a few rows and needs scrolling.
    const raf = window.requestAnimationFrame(() => {
      const listEl = listRef.current;
      if (!listEl) return;
      const selectedEl = listEl.querySelector('[data-selected="true"]') as HTMLElement | null;
      if (!selectedEl) return;
      selectedEl.scrollIntoView({ block: 'nearest' });
    });

    return () => {
      window.cancelAnimationFrame(raf);
    };
  }, [open, value]);

  return (
    <div ref={wrapperRef} className="relative w-full">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        ref={buttonRef}
        className={`${className} pr-10 text-left ${disabled ? "cursor-not-allowed opacity-70" : ""}`}
        onClick={e => {
          e.stopPropagation();
          if (disabled) return;
          setOpen(v => !v);
          setQuery("");
        }}
      >
        <span className={value ? "text-slate-900" : "text-slate-400"}>
          {selected?.label ?? placeholder}
        </span>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
          <ChevronDown className="h-4 w-4" />
        </span>
      </button>

      {open ? (
        <div
          ref={menuRef}
          className="fixed z-50 overflow-hidden rounded-2xl bg-white shadow-[0_18px_45px_rgba(15,23,42,0.18)] ring-1 ring-slate-200/80"
          style={
            menuRect
              ? {
                  left: menuRect.left,
                  width: menuRect.width,
                  top: placement === "bottom" ? menuRect.top : undefined,
                  bottom: placement === "top" ? menuRect.bottom : undefined,
                }
              : undefined
          }
        >
          {searchable ? (
            <div className="p-2">
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
              />
            </div>
          ) : null}

          <div ref={listRef} className="overflow-auto p-2" style={{ maxHeight: maxMenuHeight }}>
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-slate-500">No results</div>
            ) : (
              filteredOptions.map(option => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    data-selected={isSelected ? "true" : "false"}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${
                      isSelected ? "bg-emerald-50 ring-1 ring-emerald-200" : "hover:bg-slate-50"
                    }`}
                    onMouseDown={e => {
                      // Prevent the click from bubbling and re-toggling the trigger.
                      // Also prevents focus-related quirks when selecting.
                      e.preventDefault();
                      e.stopPropagation();
                      setOpen(false);
                      onChange(option.value);
                    }}
                  >
                    <span className="text-slate-800">{option.label}</span>
                    {isSelected ? <Check className="h-4 w-4 text-emerald-600" /> : null}
                  </button>
                );
              })
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
