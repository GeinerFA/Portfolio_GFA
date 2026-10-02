import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container-x flex min-h-svh flex-col justify-center py-24">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">Error 404</p>
      <h1 className="text-display mt-6 text-[clamp(4rem,16vw,14rem)]">
        Perdido<span className="text-accent">.</span>
      </h1>
      <p className="mt-6 max-w-md text-lg text-paper/70">La página que buscas no existe o fue movida.</p>
      <Link
        href="/"
        className="mt-10 inline-flex w-fit items-center rounded-full bg-paper px-6 py-3 font-medium text-ink transition-colors hover:bg-accent"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
