import type { ReactNode } from 'react';

type SectionProps = {
  title: string;
  children: ReactNode;
};

export function Section({ title, children }: SectionProps) {
  const id = title.toLowerCase().replace(/\s+/g, '-');

  return (
    <section aria-labelledby={id} className="mt-16">
      <h2 id={id} className="text-sm font-semibold uppercase tracking-widest text-muted">
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}
