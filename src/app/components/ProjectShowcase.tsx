import type { CSSProperties } from 'react';
import Link from 'next/link';
import { projectGroups, projects } from '../projects/projectData';

type ProjectShowcaseProps = {
  startRevealIndex?: number;
};

function revealStyle(index: number) {
  return {
    '--reveal-index': index,
  } as CSSProperties;
}

export default function ProjectShowcase({
  startRevealIndex = 0,
}: ProjectShowcaseProps) {
  let revealIndex = startRevealIndex + 1;
  const groupedProjects = projectGroups.map((group) => ({
    group,
    projects: projects
      .filter((project) => project.group === group)
      .map((project) => ({
        project,
        revealIndex: revealIndex++,
      })),
  }));

  return (
    <section className="minimal-project-list" data-variant="primary">
      <h3
        id="projects-title"
        className="minimal-reveal-line"
        style={revealStyle(startRevealIndex)}
      >
        Projects
      </h3>
      <ul>
        {groupedProjects.map(({ group, projects: groupedProjectItems }) => (
          <li key={group}>
            <ul>
              {groupedProjectItems.map(({ project, revealIndex }) => (
                <li key={project.slug}>
                  <Link
                    className="minimal-row-link minimal-reveal-line"
                    href={`/projects/${project.slug}`}
                    style={revealStyle(revealIndex)}
                  >
                    <h2>{project.title}</h2>
                    <span
                      className="minimal-row-meta"
                      aria-label={`${project.group} project`}
                    >
                      <span>{project.group}</span>
                      <span aria-hidden="true">/</span>
                      <span>View</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}
