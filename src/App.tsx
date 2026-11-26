import { resume } from './content/resume';
import { Section } from './components/Section';
import { Experience } from './components/Experience';
import { Skills } from './components/Skills';
import { Education } from './components/Education';

export function App() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
      <a href="#main" className="sr-only focus:not-sr-only">
        Skip to content
      </a>

      <header>
        <h1 className="text-3xl font-semibold tracking-tight">{resume.name}</h1>
        <p className="mt-1 text-lg text-muted">
          {resume.title} · {resume.location}
        </p>
        <p className="mt-6 leading-relaxed">{resume.summary}</p>

        <nav aria-label="Contact" className="mt-6">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {resume.email && (
              <li>
                <a className="link" href={`mailto:${resume.email}`}>
                  Email
                </a>
              </li>
            )}
            {resume.links.map((link) => (
              <li key={link.href}>
                <a className="link" href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main id="main">
        <Section title="Experience">
          <Experience jobs={resume.experience} />
        </Section>

        <Section title="Skills">
          <Skills groups={resume.skills} />
        </Section>

        <Section title="Education">
          <Education degrees={resume.education} languages={resume.languages} />
        </Section>
      </main>

      <footer className="mt-20 text-sm text-muted">
        © {resume.name} · Built with React, Tailwind, and AWS.
      </footer>
    </div>
  );
}
