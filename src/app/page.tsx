import type { ReactNode } from 'react';
import Link from 'next/link';
import FooterRobotMark from './components/FooterRobotMark';
import LocalTime from './components/LocalTime';
import PageEnter from './components/PageEnter';
import ProjectShowcase from './components/ProjectShowcase';
import { VinylPlayer } from './components/VinylPlayer';

function ExternalLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      className="minimal-basic-link"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}

export default function Home() {
  return (
    <main className="minimal-portfolio-page">
      <PageEnter className="minimal-portfolio-shell">
        <div className="minimal-homepage">
          <article className="minimal-article">
            <header>
              <h1 className="minimal-reveal-line">Antonio J. Gonzalez</h1>
              <time className="minimal-reveal-line" dateTime="2026-07-02">
                Updated Jul 2, 2026
              </time>
            </header>

            <VinylPlayer />

            <p className="minimal-reveal-line">
              I&apos;m Antonio, also known as txnio. I build things for the web
              and use browser windows as a place for interface experiments.
            </p>

            <p className="minimal-reveal-line">
              I make practical software, automation, and visual interface
              experiments with TypeScript, React, Next.js, Python, .NET, and AI.
            </p>

            <p className="minimal-reveal-line">
              You can find me on{' '}
              <ExternalLink href="https://www.linkedin.com/in/txnio/">
                LinkedIn
              </ExternalLink>
              ,{' '}
              <ExternalLink href="https://github.com/txnioh">
                GitHub
              </ExternalLink>
              , try{' '}
              <ExternalLink href="https://os.txnio.com">txniOS</ExternalLink>,
              or reach me via{' '}
              <a className="minimal-basic-link" href="mailto:txniodev@gmail.com">
                email
              </a>
              .
            </p>
          </article>

          <section className="minimal-section" aria-labelledby="projects-title">
            <ProjectShowcase />
          </section>

          <footer className="minimal-footer">
            <div className="minimal-footer-container">
              <div className="minimal-footer-row minimal-reveal-line">
                <p>
                  <span>
                    <LocalTime /> in Madrid, Spain
                  </span>
                </p>
                <FooterRobotMark />
              </div>
            </div>
          </footer>

          <nav className="minimal-hidden-nav" aria-label="Other pages">
            <Link href="/projects">All projects</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/mac-folio">Classic portfolio</Link>
          </nav>
        </div>
      </PageEnter>
    </main>
  );
}
