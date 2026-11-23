import { Wordmark } from "./Wordmark";
import { ThemeToggle } from "./ThemeToggle";

/** Cabeçalho do celular: marca à esquerda, tema à direita. */
export function MobileHeader() {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-line bg-surface/90 px-4 backdrop-blur lg:hidden">
      <Wordmark />
      <ThemeToggle />
    </header>
  );
}
