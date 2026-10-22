/**
 * Anima un texto letra por letra (el lector de pantalla lee el texto completo).
 * Es CSS puro: se ve y anima apenas llega el HTML, sin esperar al JavaScript.
 */
export function SplitText({
  text,
  className,
  delay = 0,
  stagger = 0.035,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const words = text.split(" ").map((word, wi, all) => {
    const offset = all.slice(0, wi).reduce((n, w) => n + w.length, 0);
    return { word, offset };
  });

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map(({ word, offset }, wi) => (
          <span key={wi} className="inline-block whitespace-nowrap">
            {Array.from(word).map((char, ci) => (
              <span key={ci} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                <span
                  className="anim-letter inline-block"
                  style={{ ["--delay" as string]: `${delay + (offset + ci) * stagger}s` }}
                >
                  {char}
                </span>
              </span>
            ))}
            {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
          </span>
        ))}
      </span>
    </span>
  );
}
