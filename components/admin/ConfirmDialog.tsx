"use client";

import { Loader2, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef, useState, useTransition } from "react";
import type { ActionState } from "@/lib/actions/state";

/** Botón de borrar con diálogo de confirmación. Ejecuta `onConfirm` (una Server Action) al aceptar. */
export function DeleteButton({
  title,
  description,
  onConfirm,
  label = "Eliminar",
  compact = false,
  onSuccess,
}: {
  title: string;
  description: string;
  onConfirm: () => Promise<ActionState>;
  label?: string;
  compact?: boolean;
  onSuccess?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !pending && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, pending]);

  const confirm = () =>
    startTransition(async () => {
      const result = await onConfirm();
      if (result.ok) {
        setOpen(false);
        onSuccess?.();
      }
      else setError(result.message ?? "No se pudo eliminar.");
    });

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setError(null);
          setOpen(true);
        }}
        className={
          compact
            ? "rounded-lg p-2 text-muted transition-colors hover:bg-red-400/10 hover:text-red-400"
            : "inline-flex items-center gap-2 rounded-full border border-red-400/30 px-4 py-2 text-sm text-red-300 transition-colors hover:bg-red-400/10"
        }
        aria-label={compact ? `${label}: ${title}` : undefined}
      >
        <Trash2 className="size-4" aria-hidden />
        {!compact && label}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !pending && setOpen(false)}
          >
            <motion.div
              role="alertdialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className="w-full max-w-md rounded-2xl border border-line bg-ink-2 p-6"
              initial={{ y: 30, scale: 0.97 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 30, scale: 0.97 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 id={titleId} className="text-lg font-medium">
                ¿Eliminar «{title}»?
              </h2>
              <p className="mt-2 text-sm text-muted">{description}</p>
              {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  ref={cancelRef}
                  type="button"
                  disabled={pending}
                  onClick={() => setOpen(false)}
                  className="rounded-full px-4 py-2 text-sm hover:bg-paper/5"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={pending}
                  onClick={confirm}
                  className="inline-flex items-center gap-2 rounded-full bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-70"
                >
                  {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
                  Sí, eliminar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
