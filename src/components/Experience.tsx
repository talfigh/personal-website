import type { Job } from '../content/resume';

export function Experience({ jobs }: { jobs: Job[] }) {
  return (
    <ol className="space-y-12">
      {jobs.map((job) => (
        <li key={`${job.company}-${job.period}`}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4">
            <h3 className="font-semibold">
              {job.role}, {job.company}
            </h3>
            <p className="text-sm text-muted">{job.period}</p>
          </div>
          <p className="text-sm text-muted">
            {job.location} · {job.blurb}
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed marker:text-muted">
            {job.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
