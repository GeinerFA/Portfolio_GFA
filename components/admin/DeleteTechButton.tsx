"use client";

import { useRouter } from "next/navigation";
import { deleteTechnology } from "@/lib/actions/technologies";
import { DeleteButton } from "./ConfirmDialog";

export function DeleteTechButton({
  id,
  name,
  projectCount,
  redirectTo,
}: {
  id: number;
  name: string;
  projectCount: number;
  redirectTo?: string;
}) {
  const router = useRouter();
  const usage =
    projectCount > 0
      ? ` Se quitará de ${projectCount} ${projectCount === 1 ? "proyecto" : "proyectos"}.`
      : "";
  return (
    <DeleteButton
      title={name}
      compact={!redirectTo}
      description={`Esta acción no se puede deshacer.${usage}`}
      onConfirm={() => deleteTechnology(id)}
      onSuccess={redirectTo ? () => router.push(redirectTo) : undefined}
    />
  );
}
