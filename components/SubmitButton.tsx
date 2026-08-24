"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useFormStatus } from "react-dom";

type SubmitButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "onClick"> & {
  children: ReactNode;
  pendingLabel?: string;
  confirmMessage?: string;
};

export function SubmitButton({
  children,
  pendingLabel = "Procesando...",
  confirmMessage,
  disabled,
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      {...props}
      type="submit"
      disabled={pending || disabled}
      onClick={(event) => {
        if (confirmMessage && !window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
      aria-disabled={pending || disabled}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
