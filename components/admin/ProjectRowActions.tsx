"use client";

import { ArrowDown, ArrowUp, Eye, EyeOff, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteProject, moveProject, toggleProjectFlag } from "@/lib/actions/projects";
import { cn } from "@/lib/utils";
import { DeleteButton } from "./ConfirmDialog";

export function MoveButtons({ id, isFirst, isLast }: { id: number; isFirst: boolean; isLast: boolean }) {
  const [pending, start] = useTransition();
  const btn = "rounded-md p-1 text-muted transition-colors hover:bg-paper/10 hover:text-paper disabled:opacity-25";
  return (
    <div className={cn("flex flex-col", pending && "opacity-50")}>
      <button type="button" disabled={isFirst || pending} onClick={() => start(() => void moveProject(id, "up"))} className={btn} aria-label="Subir">
        <ArrowUp className="size-4" />
      </button>
      <button type="button" disabled={isLast || pending} onClick={() => start(() => void moveProject(id, "down"))} className={btn} aria-label="Bajar">
        <ArrowDown className="size-4" />
      </button>
    </div>
  );
}

export function ToggleButtons({ id, isPublished, isFeatured }: { id: number; isPublished: boolean; isFeatured: boolean }) {
  const [pending, start] = useTransition();
  return (
    <div className={cn("flex flex-wrap gap-1.5", pending && "opacity-60")}>
      <button
        type="button"
        disabled={pending}
        onClick={() => start(() => void toggleProjectFlag(id, "isPublished"))}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors",
          isPublished ? "border-accent/40 bg-accent/10 text-accent" : "border-line text-muted hover:text-paper",
        )}
        title={isPublished ? "Despublicar" : "Publicar"}
      >
        {isPublished ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
        {isPublished ? "Publicado" : "Borrador"}
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => start(() => void toggleProjectFlag(id, "isFeatured"))}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors",
          isFeatured ? "border-amber-300/40 bg-amber-300/10 text-amber-200" : "border-line text-muted hover:text-paper",
        )}
        title={isFeatured ? "Quitar de destacados" : "Destacar"}
      >
        <Star className={cn("size-3.5", isFeatured && "fill-current")} />
        {isFeatured ? "Destacado" : "Destacar"}
      </button>
    </div>
  );
}

export function DeleteProjectButton({
  id,
  title,
  compact,
  redirectTo,
}: {
  id: number;
  title: string;
  compact?: boolean;
  redirectTo?: string;
}) {
  const router = useRouter();
  return (
    <DeleteButton
      title={title}
      compact={compact}
      description="Se eliminará el proyecto y su relación con las tecnologías. Esta acción no se puede deshacer."
      onConfirm={() => deleteProject(id)}
      onSuccess={redirectTo ? () => router.push(redirectTo) : undefined}
    />
  );
}
