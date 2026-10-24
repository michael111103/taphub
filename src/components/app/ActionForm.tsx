"use client";

import { useFormState } from "react-dom";
import { useEffect, useRef } from "react";
import type { ActionState } from "@/app/app/actions";

/** Form untuk server action: menampilkan pesan error / berhasil di bawah form */
export default function ActionForm({
  action,
  children,
  className,
  resetOnSuccess = false,
  clearOnSuccess,
  confirm,
}: {
  action: (state: ActionState, fd: FormData) => Promise<ActionState>;
  children: React.ReactNode;
  className?: string;
  resetOnSuccess?: boolean;
  /** Nama field yang dikosongkan setelah berhasil (misalnya password) */
  clearOnSuccess?: string[];
  confirm?: string;
}) {
  const [state, formAction] = useFormState(action, undefined);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (!state?.ok || !ref.current) return;
    if (resetOnSuccess) ref.current.reset();
    clearOnSuccess?.forEach((name) => {
      const el = ref.current?.elements.namedItem(name);
      if (el instanceof HTMLInputElement) el.value = "";
    });
    // hanya dijalankan saat hasil action berubah
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);
  return (
    <form
      ref={ref}
      action={formAction}
      className={className}
      onSubmit={(e) => {
        if (confirm && !window.confirm(confirm)) e.preventDefault();
      }}
    >
      {children}
      {state?.error && (
        <p role="alert" className="mt-3 rounded-xl bg-rose-500/10 px-3 py-2 text-sm text-rose-600 dark:text-rose-300">
          {state.error}
        </p>
      )}
      {state?.ok && (
        <p role="status" className="anim-feed mt-3 rounded-xl bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300">
          {state.ok}
        </p>
      )}
    </form>
  );
}
