export type PageHeaderVariant = "light" | "lime";

export interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  variant?: PageHeaderVariant;
}

const variantStyles: Record<
  PageHeaderVariant,
  { section: string; eyebrow: string; title: string; description: string }
> = {
  light: {
    section: "border-b border-zinc-200 bg-white",
    eyebrow: "text-lime-700",
    title: "text-zinc-950",
    description: "text-zinc-600",
  },
  lime: {
    section: "bg-lime-400",
    eyebrow: "text-zinc-700",
    title: "text-zinc-950",
    description: "text-zinc-700",
  },
};

export function PageHeader({
  eyebrow,
  title,
  description,
  variant = "light",
}: PageHeaderProps) {
  const styles = variantStyles[variant];

  return (
    <header className={styles.section}>
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <p className={`text-xs font-bold uppercase tracking-[0.2em] ${styles.eyebrow}`}>
          {eyebrow}
        </p>
        <h1 className={`mt-4 max-w-3xl text-4xl font-black leading-tight sm:text-6xl ${styles.title}`}>
          {title}
        </h1>
        <p className={`mt-5 max-w-2xl text-base leading-7 sm:text-lg ${styles.description}`}>
          {description}
        </p>
      </div>
    </header>
  );
}
