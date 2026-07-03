'use client';

import type { CSSProperties, MouseEvent } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import type { PortfolioProject } from '../projects/projectData';

type ProjectArticleProps = {
  project: PortfolioProject;
};

function getSectionAnchorY() {
  return Math.min(window.innerHeight * 0.5, 420);
}

function easeInOutCubic(progress: number) {
  return progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
}

function getScrollDuration(distance: number) {
  const absoluteDistance = Math.abs(distance);
  return Math.min(940, Math.max(360, 180 + Math.sqrt(absoluteDistance) * 19));
}

export default function ProjectArticle({ project }: ProjectArticleProps) {
  const sectionIds = useMemo(() => {
    return [...project.sections.map((section) => section.id), 'screenshots', 'visit'];
  }, [project.sections]);

  const [activeSectionId, setActiveSectionId] = useState(sectionIds[0]);
  const animationFrameRef = useRef<number | null>(null);

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

  const stopScrollAnimation = useCallback(() => {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const handleSectionClick = (sectionId: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    const sectionElement = document.getElementById(sectionId);
    if (!sectionElement) return;

    stopScrollAnimation();

    const startY = window.scrollY;
    const targetY = Math.max(
      0,
      sectionElement.getBoundingClientRect().top + window.scrollY - getSectionAnchorY(),
    );
    const distance = targetY - startY;
    const duration = getScrollDuration(distance);
    const startTime = performance.now();

    const step = (timestamp: number) => {
      const rawProgress = Math.min(1, (timestamp - startTime) / duration);
      const easedProgress = easeInOutCubic(rawProgress);

      window.scrollTo(0, startY + distance * easedProgress);
      setActiveSectionId(getCurrentSectionId());

      if (rawProgress < 1) {
        animationFrameRef.current = window.requestAnimationFrame(step);
        return;
      }

      window.scrollTo(0, targetY);
      setActiveSectionId(sectionId);
      animationFrameRef.current = null;
    };

    animationFrameRef.current = window.requestAnimationFrame(step);
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

  useEffect(() => {
    return () => stopScrollAnimation();
  }, [stopScrollAnimation]);

  let revealIndex = 0;
  const revealStyle = () =>
    ({
      '--reveal-index': revealIndex++,
    }) as CSSProperties;

  return (
    <main className="minimal-portfolio-page minimal-page-enter">
      <div className="minimal-project-page-shell">
        <aside className="minimal-project-sidebar" aria-label="Project navigation">
          <Link className="minimal-index-link" href="/">
            &lt;- Index
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
            <h1 className="minimal-reveal-line" style={revealStyle()}>
              {project.title}
            </h1>
            <time className="minimal-reveal-line" style={revealStyle()}>
              {project.date}
            </time>
          </header>

          <p className="minimal-project-lede minimal-reveal-line" style={revealStyle()}>
            {project.summary}
          </p>

          <div
            className="minimal-project-preview minimal-reveal-line"
            style={revealStyle()}
            aria-label={`${project.title} preview placeholder`}
          >
            <span>Screenshot pending</span>
          </div>

          <p className="minimal-reveal-line" style={revealStyle()}>
            {project.intro}
          </p>

          {project.sections.map((section) => (
            <section key={section.id} id={section.id}>
              <h2 className="minimal-reveal-line" style={revealStyle()}>
                {section.title}
              </h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="minimal-reveal-line" style={revealStyle()}>
                  {paragraph}
                </p>
              ))}
            </section>
          ))}

          <section id="screenshots">
            <h2 className="minimal-reveal-line" style={revealStyle()}>
              Screenshots
            </h2>
            <div className="minimal-article-shot-grid">
              {project.shots.map((shot, index) => (
                <figure
                  key={shot.label}
                  className="minimal-reveal-line"
                  style={revealStyle()}
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
            <h2 className="minimal-reveal-line" style={revealStyle()}>
              Visit
            </h2>
            <p className="minimal-reveal-line" style={revealStyle()}>
              The explanation stays here so the project can be understood first.
              The live version is still available separately.
            </p>
            <p className="minimal-reveal-line" style={revealStyle()}>
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
      </div>
    </main>
  );
}
