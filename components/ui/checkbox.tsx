"use client";

import * as React from "react";
import { Check } from "lucide-react";

interface CheckboxProps {
  id?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ id, checked = false, onCheckedChange, disabled = false, className = "" }, ref) => {
    const baseStyles = "h-4 w-4 shrink-0 rounded border border-input bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors flex items-center justify-center";
    const disabledStyles = disabled ? "cursor-not-allowed opacity-50" : "";
    const checkedStyles = checked ? "bg-primary border-primary" : "";

    return (
      <button
        ref={ref}
        id={id}
        type="button"
        role="checkbox"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onCheckedChange?.(!checked)}
        className={`${baseStyles} ${disabledStyles} ${checkedStyles} ${className}`}
      >
        {checked && <Check className="h-3 w-3 text-primary-foreground" />}
      </button>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
