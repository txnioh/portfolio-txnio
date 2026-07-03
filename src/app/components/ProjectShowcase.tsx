import Link from 'next/link';
import { projectGroups, projects } from '../projects/projectData';

export default function ProjectShowcase() {
  return (
    <section className="minimal-project-list" data-variant="primary">
      <h3 id="projects-title" className="minimal-reveal-line">
        Projects
      </h3>
      <ul>
        {projectGroups.map((group) => (
          <li key={group}>
            <ul>
              {projects
                .filter((project) => project.group === group)
                .map((project) => (
                <li key={project.slug}>
                  <Link
                    className="minimal-row-link minimal-reveal-line"
                    href={`/projects/${project.slug}`}
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
