import React from "react";
import { AlertCircle, Info } from "lucide-react";
import { componentsTheme } from "@/lib/theme/components";

export function FormField({
  label,
  icon: Icon,
  required = true,
  error,
  hint,
  children,
  footer,
}: {
  label: string;
  icon: React.ElementType;
  required?: boolean;
  error?: boolean | string | null;
  /** Informational helper shown below the field when there is no error (e.g. no dropdown data available). */
  hint?: string | null;
  children: (errorClassName: string) => React.ReactNode;
  /**
   * Rendered BELOW the input row, full width.
   *
   * The input row is `relative flex items-center` so it can hang the leading
   * icon off it, which means anything a caller returns from `children`
   * alongside the control becomes a horizontal flex sibling and steals the
   * control's width. That is what happened to the "Can't find your
   * state/region? Type it manually" link: it sat beside the select, squeezed
   * it to about half the row and wrapped itself onto three lines on a phone.
   * Its own `mt-3` gives away that it was always meant to sit underneath.
   *
   * So secondary actions belong here, not in `children`.
   */
  footer?: React.ReactNode;
}) {
  const isError = !!error;
  const showHint = !isError && !!hint;
  const errorClassName = isError ? "!border-red-500 focus:!border-red-500 focus:!ring-red-500/20" : "";

  return (
    <div className={isError ? "has-form-error w-full" : "w-full"}>

      <label className={componentsTheme.login.fieldLabel}>
        {label} {!required && <span className="text-slate-400 font-normal normal-case tracking-normal ml-1">(Optional)</span>}
        {required && <span style={{ color: "#ef4444", marginLeft: "4px" }}>*</span>}
      </label>
      <div className={componentsTheme.login.inputWrapper}>
        <Icon
           className={componentsTheme.login.inputIcon}
           style={{ color: isError ? "#ef4444" : undefined, zIndex: 10 }}
        />
        {children(errorClassName)}
      </div>
      {footer}
      {isError && (
        <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-destructive">
          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
          {typeof error === "string" ? error : "Required"}
        </p>
      )}
      {showHint && (
        <p style={{ marginTop: "6px", fontSize: "12px", color: "#64748b", display: "flex", alignItems: "center", gap: "4px", fontWeight: 500 }}>
          <Info style={{ width: "13px", height: "13px", flexShrink: 0 }} />
          {hint}
        </p>
      )}
    </div>
  );
}
