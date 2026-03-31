import React from "react";
import { componentsTheme } from "@/lib/theme/components";

export function FormField({
  label,
  icon: Icon,
  required = true,
  error,
  children,
}: {
  label: string;
  icon: React.ElementType;
  required?: boolean;
  error?: boolean | string | null;
  children: (errorClassName: string) => React.ReactNode;
}) {
  const isError = !!error;
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
      {isError && (
        <p style={{ marginTop: "6px", fontSize: "12px", color: "#ef4444", display: "flex", alignItems: "center", fontWeight: 500 }}>
          {typeof error === "string" ? error : "Required"}
        </p>
      )}
    </div>
  );
}
