"use client";

import { ArrowUpRight, CheckCircle2, Loader2, TriangleAlert } from "lucide-react";
import { startTransition, useActionState, useEffect, useRef } from "react";
import { sendContactMessage } from "@/lib/actions/contact";
import { initialState, type ActionState } from "@/lib/actions/state";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full border-b border-line bg-transparent pb-3 pt-1 text-lg text-paper outline-none transition-colors placeholder:text-muted/50 focus:border-paper aria-invalid:border-red-400/80 md:text-xl";

function FormField({
  label,
  name,
  errors,
  optional,
  className,
  children,
}: {
  label: string;
  name: string;
  errors?: ActionState["errors"];
  optional?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const error = errors?.[name]?.[0];
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={`contact-${name}`} className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
        {label}
        {optional && <span className="normal-case tracking-normal text-muted/60"> (opcional)</span>}
      </label>
      {children}
      {error && (
        <p id={`contact-${name}-error`} className="text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

function inputProps(name: string, errors?: ActionState["errors"]) {
  const invalid = Boolean(errors?.[name]?.length);
  return {
    id: `contact-${name}`,
    name,
    "aria-invalid": invalid || undefined,
    "aria-describedby": invalid ? `contact-${name}-error` : undefined,
  };
}

/** Formulario de contacto: el mensaje te llega por correo (Resend). */
export function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContactMessage, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  // Tras un envío correcto se limpian los campos; con errores se conserva lo escrito.
  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set("startedAt", String(startedAt.current));
    startTransition(() => formAction(formData));
  };

  const errors = state.errors;

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="flex flex-col gap-8">
      {/* Honeypot anti-spam: invisible para personas. */}
      <div aria-hidden className="absolute -left-[9999px] size-px overflow-hidden">
        <label htmlFor="contact-hp">No completar</label>
        <input id="contact-hp" name="hp_trap" type="text" tabIndex={-1} autoComplete="new-password" data-1p-ignore data-lpignore="true" />
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <FormField label="Nombre" name="name" errors={errors}>
          <input {...inputProps("name", errors)} type="text" autoComplete="name" placeholder="Tu nombre" maxLength={100} required className={inputClass} />
        </FormField>
        <FormField label="Correo" name="email" errors={errors}>
          <input {...inputProps("email", errors)} type="email" autoComplete="email" placeholder="tu@correo.com" maxLength={200} required className={inputClass} />
        </FormField>
      </div>

      <FormField label="Asunto" name="subject" errors={errors} optional>
        <input {...inputProps("subject", errors)} type="text" placeholder="¿De qué quieres hablar?" maxLength={150} className={inputClass} />
      </FormField>

      <FormField label="Mensaje" name="message" errors={errors}>
        <textarea
          {...inputProps("message", errors)}
          rows={5}
          placeholder="Cuéntame sobre tu proyecto o idea…"
          maxLength={5000}
          required
          className={cn(inputClass, "resize-none")}
        />
      </FormField>

      <div className="flex flex-col-reverse gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div aria-live="polite" className="min-h-6">
          {state.message && (
            <p className={cn("flex items-center gap-2 text-sm", state.ok ? "text-accent" : "text-red-300")}>
              {state.ok ? <CheckCircle2 className="size-4 shrink-0" aria-hidden /> : <TriangleAlert className="size-4 shrink-0" aria-hidden />}
              {state.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={pending}
          className="group inline-flex shrink-0 items-center justify-center gap-3 self-start rounded-full bg-paper px-7 py-4 font-medium text-ink transition-colors duration-300 hover:bg-accent disabled:cursor-wait disabled:opacity-70 sm:self-auto"
        >
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Enviando…
            </>
          ) : (
            <>
              Enviar mensaje
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
