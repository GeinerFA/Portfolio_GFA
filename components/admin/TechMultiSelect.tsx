"use client";

import { Check, Search } from "lucide-react";
import { useState } from "react";
import { TECH_CATEGORY_LABELS, type Technology } from "@/lib/data/types";
import { cn } from "@/lib/utils";

/** Selector múltiple de tecnologías (envía cada id seleccionado como `technologyIds`). */
export function TechMultiSelect({ technologies, defaultSelected }: { technologies: Technology[]; defaultSelected: number[] }) {
  const [selected, setSelected] = useState<Set<number>>(() => new Set(defaultSelected));
  const [query, setQuery] = useState("");

  const toggle = (id: number) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const q = query.trim().toLowerCase();
  const visible = q ? technologies.filter((t) => t.name.toLowerCase().includes(q)) : technologies;
  const chosen = technologies.filter((t) => selected.has(t.id));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-paper/90">Tecnologías</span>
        <span className="text-xs text-muted">{selected.size} seleccionadas</span>
      </div>

      {[...selected].map((id) => (
        <input key={id} type="hidden" name="technologyIds" value={id} />
      ))}

      {chosen.length > 0 && (
        <ul className="flex flex-wrap gap-1.5" aria-label="Seleccionadas">
          {chosen.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => toggle(t.id)}
                className="rounded-full bg-paper px-3 py-1 text-xs font-medium text-ink hover:bg-red-300"
                aria-label={`Quitar ${t.name}`}
              >
                {t.name} ×
              </button>
            </li>
          ))}
        </ul>
      )}

      {technologies.length === 0 ? (
        <p className="text-sm text-muted">Aún no hay tecnologías. Créalas en la sección Tecnologías.</p>
      ) : (
        <div className="rounded-xl border border-line bg-ink-2">
          <div className="flex items-center gap-2 border-b border-line px-3">
            <Search className="size-4 text-muted" aria-hidden />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar tecnología…"
              aria-label="Buscar tecnología"
              className="w-full bg-transparent py-2.5 text-sm outline-none"
            />
          </div>
          <ul className="grid max-h-64 grid-cols-1 gap-1 overflow-y-auto p-2 sm:grid-cols-2" role="group" aria-label="Tecnologías disponibles">
            {visible.map((t) => {
              const on = selected.has(t.id);
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={on}
                    onClick={() => toggle(t.id)}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
                      on ? "bg-paper/10" : "hover:bg-paper/5",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-4 items-center justify-center rounded border",
                        on ? "border-accent bg-accent text-ink" : "border-line",
                      )}
                    >
                      {on && <Check className="size-3" strokeWidth={3} />}
                    </span>
                    <span className="size-2.5 rounded-full" style={{ background: t.color ?? "#555" }} />
                    <span className="flex-1">{t.name}</span>
                    <span className="text-[0.65rem] text-muted">{TECH_CATEGORY_LABELS[t.category]}</span>
                  </button>
                </li>
              );
            })}
            {visible.length === 0 && <li className="p-2 text-sm text-muted">Sin resultados.</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
