import type { Degree } from '../content/resume';

type EducationProps = {
  degrees: Degree[];
  languages: string[];
};

export function Education({ degrees, languages }: EducationProps) {
  return (
    <>
      <ul className="space-y-6">
        {degrees.map((degree) => (
          <li key={degree.title}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h3 className="font-semibold">{degree.title}</h3>
              <p className="text-sm text-muted">{degree.period}</p>
            </div>
            <p className="text-sm text-muted">{degree.school}</p>
            {degree.note && <p className="mt-2 leading-relaxed">{degree.note}</p>}
          </li>
        ))}
      </ul>
      {languages.length > 0 && (
        <p className="mt-8">
          <span className="font-medium">Languages: </span>
          <span className="text-muted">{languages.join(' · ')}</span>
        </p>
      )}
    </>
  );
}
