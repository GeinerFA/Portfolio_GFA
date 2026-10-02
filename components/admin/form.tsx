"use client";

import { CheckCircle2, Loader2, TriangleAlert } from "lucide-react";
import { startTransition, useActionState } from "react";
import { initialState, type ActionState } from "@/lib/actions/state";
import { cn } from "@/lib/utils";

export const inputClass =
  "w-full rounded-xl border border-line bg-ink-2 px-3.5 py-2.5 text-sm text-paper placeholder:text-muted/70 outline-none transition-colors focus:border-paper/60 focus:ring-2 focus:ring-paper/10 aria-invalid:border-red-400/70";

export function Field({
  label,
  name,
  hint,
  errors,
  className,
  children,
}: {
  label: string;
  name: string;
  hint?: React.ReactNode;
  errors?: ActionState["errors"];
  className?: string;
  children: React.ReactNode;
}) {
  const error = errors?.[name]?.[0];
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={name} className="text-sm font-medium text-paper/90">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${name}-error`} className="text-xs text-red-400">
          {error}
        </p>
      ) : (
        hint && <p className="text-xs text-muted">{hint}</p>
      )}
    </div>
  );
}

/** Props de accesibilidad para un input con posible error. */
export function fieldProps(name: string, errors?: ActionState["errors"]) {
  const invalid = Boolean(errors?.[name]?.length);
  return {
    id: name,
    name,
    "aria-invalid": invalid || undefined,
    "aria-describedby": invalid ? `${name}-error` : undefined,
  };
}

/**
 * Conecta un formulario a una Server Action con useActionState, enviándolo en una transición.
 * A diferencia de <form action>, no resetea los campos: si hay errores, lo escrito se conserva.
 */
export function useActionForm(action: (state: ActionState, formData: FormData) => Promise<ActionState>) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  };
  return { state, pending, onSubmit };
}

export function SubmitButton({
  children,
  pending,
  className,
}: {
  children: React.ReactNode;
  pending: boolean;
  className?: string;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full bg-paper px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-accent disabled:cursor-wait disabled:opacity-70",
        className,
      )}
    >
      {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {pending ? "Guardando…" : children}
    </button>
  );
}

export function FormMessage({ state }: { state: ActionState }) {
  if (!state.message) return null;
  return (
    <p
      role="status"
      className={cn(
        "flex items-center gap-2 rounded-xl border px-4 py-3 text-sm",
        state.ok ? "border-accent/30 bg-accent/10 text-accent" : "border-red-400/30 bg-red-400/10 text-red-300",
      )}
    >
      {state.ok ? <CheckCircle2 className="size-4 shrink-0" /> : <TriangleAlert className="size-4 shrink-0" />}
      {state.message}
    </p>
  );
}

export function Switch({
  name,
  label,
  description,
  defaultChecked,
}: {
  name: string;
  label: string;
  description?: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-line bg-ink-2 p-4">
      <span>
        <span className="block text-sm font-medium">{label}</span>
        {description && <span className="mt-0.5 block text-xs text-muted">{description}</span>}
      </span>
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="peer sr-only" />
      <span
        aria-hidden
        className="relative mt-0.5 h-6 w-11 shrink-0 rounded-full bg-line transition-colors after:absolute after:left-0.5 after:top-0.5 after:size-5 after:rounded-full after:bg-paper after:transition-transform peer-checked:bg-accent peer-checked:after:translate-x-5 peer-checked:after:bg-ink peer-focus-visible:ring-2 peer-focus-visible:ring-paper/40"
      />
    </label>
  );
}

export function Card({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-ink-2/40 p-5 md:p-6">
      <h2 className="font-medium">{title}</h2>
      {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      <div className="mt-5 flex flex-col gap-5">{children}</div>
    </section>
  );
}
