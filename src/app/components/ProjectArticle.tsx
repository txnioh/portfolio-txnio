'use client';

import type { MouseEvent } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import PageEnter from './PageEnter';
import type { PortfolioProject } from '../projects/projectData';

type ProjectArticleProps = {
  project: PortfolioProject;
};

function getSectionAnchorY() {
  return Math.min(window.innerHeight * 0.5, 420);
}

export default function ProjectArticle({ project }: ProjectArticleProps) {
  const sectionIds = useMemo(() => {
    return [...project.sections.map((section) => section.id), 'screenshots', 'visit'];
  }, [project.sections]);

  const [activeSectionId, setActiveSectionId] = useState(sectionIds[0]);

  const getCurrentSectionId = useCallback(() => {
    const anchorY = getSectionAnchorY();
    let currentSectionId = sectionIds[0];

    for (const sectionId of sectionIds) {
      const sectionElement = document.getElementById(sectionId);
      if (!sectionElement) continue;

      const rect = sectionElement.getBoundingClientRect();
      if (rect.top <= anchorY) {
        currentSectionId = sectionId;
      }
    }

    return currentSectionId;
  }, [sectionIds]);

  const handleSectionClick = (sectionId: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    const sectionElement = document.getElementById(sectionId);
    if (!sectionElement) return;

    setActiveSectionId(sectionId);
    sectionElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;

      ticking = true;
      window.requestAnimationFrame(() => {
        setActiveSectionId(getCurrentSectionId());
        ticking = false;
      });
    };

    setActiveSectionId(getCurrentSectionId());
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [getCurrentSectionId]);

  return (
    <main className="minimal-portfolio-page">
      <PageEnter className="minimal-project-page-shell">
        <aside className="minimal-project-sidebar" aria-label="Project navigation">
          <Link className="minimal-index-link" href="/">
            <span className="minimal-index-symbol" aria-hidden="true">&lt;-</span>
            <span className="minimal-index-label">Index</span>
          </Link>

          <nav>
            {project.sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={activeSectionId === section.id ? 'is-active' : ''}
                onClick={handleSectionClick(section.id)}
              >
                {section.title}
              </a>
            ))}
            <a
              href="#screenshots"
              className={activeSectionId === 'screenshots' ? 'is-active' : ''}
              onClick={handleSectionClick('screenshots')}
            >
              Screenshots
            </a>
            <a
              href="#visit"
              className={activeSectionId === 'visit' ? 'is-active' : ''}
              onClick={handleSectionClick('visit')}
            >
              Visit
            </a>
          </nav>
        </aside>

        <article className="minimal-project-article">
          <header>
            <h1 className="minimal-reveal-line">{project.title}</h1>
            <time className="minimal-reveal-line">{project.date}</time>
          </header>

          <p className="minimal-project-lede minimal-reveal-line">
            {project.summary}
          </p>

          <div
            className="minimal-project-preview minimal-reveal-line"
            aria-label={`${project.title} preview placeholder`}
          >
            <span>Screenshot pending</span>
          </div>

          <p className="minimal-reveal-line">{project.intro}</p>

          {project.sections.map((section) => (
            <section key={section.id} id={section.id}>
              <h2 className="minimal-reveal-line">{section.title}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="minimal-reveal-line">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}

          <section id="screenshots">
            <h2 className="minimal-reveal-line">Screenshots</h2>
            <div className="minimal-article-shot-grid">
              {project.shots.map((shot, index) => (
                <figure
                  key={shot.label}
                  className="minimal-reveal-line"
                >
                  <div>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <figcaption>
                    <strong>{shot.label}</strong>
                    {shot.description}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

          <section id="visit">
            <h2 className="minimal-reveal-line">Visit</h2>
            <p className="minimal-reveal-line">
              The explanation stays here so the project can be understood first.
              The live version is still available separately.
            </p>
            <p className="minimal-reveal-line">
              <a
                className="minimal-basic-link"
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open live project
              </a>
            </p>
          </section>
        </article>
      </PageEnter>
    </main>
  );
}
