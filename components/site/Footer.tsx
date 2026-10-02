import Link from "next/link";

export function Footer({ name }: { name: string }) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line">
      <div className="container-x flex flex-col gap-4 py-8 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <p>
          © {year} {name}. Todos los derechos reservados.
        </p>
        <Link href="#top" className="transition-colors hover:text-paper">
          Volver arriba ↑
        </Link>
      </div>
    </footer>
  );
}
