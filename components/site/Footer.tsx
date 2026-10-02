export function Footer({ name }: { name: string }) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line">
      <div className="container-x py-8 text-sm text-muted">
        <p>
          © {year} {name}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
