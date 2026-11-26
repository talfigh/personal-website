import type { SkillGroup } from '../content/resume';

export function Skills({ groups }: { groups: SkillGroup[] }) {
  return (
    <dl className="space-y-4">
      {groups.map((group) => (
        <div key={group.name} className="sm:grid sm:grid-cols-[10rem_1fr] sm:gap-4">
          <dt className="font-medium">{group.name}</dt>
          <dd className="text-muted">{group.items.join(' · ')}</dd>
        </div>
      ))}
    </dl>
  );
}
