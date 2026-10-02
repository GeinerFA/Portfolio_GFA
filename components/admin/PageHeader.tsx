export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-display text-4xl md:text-5xl">{title}</h1>
        {description && <p className="mt-2 text-sm text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </div>
  );
}

export const primaryButton =
  "inline-flex items-center gap-2 rounded-full bg-paper px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-accent";
