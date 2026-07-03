import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProjectArticle from '../../components/ProjectArticle';
import { getProject, projects } from '../projectData';

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return {
      title: 'Project',
    };
  }

  return {
    title: `${project.title} - Antonio J. Gonzalez`,
    description: project.summary,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <ProjectArticle project={project} />
  );
}
