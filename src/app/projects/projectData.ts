export type ProjectSection = {
  id: string;
  title: string;
  body: string[];
};

export type ProjectShot = {
  label: string;
  description: string;
  media?: ProjectMedia;
};

export type ProjectMedia = {
  src: string;
  alt: string;
  format?: 'image' | 'gif';
};

export type PortfolioProject = {
  slug: string;
  group: string;
  title: string;
  date: string;
  href: string;
  summary: string;
  intro: string;
  previewImage?: ProjectMedia;
  sections: ProjectSection[];
  shots: ProjectShot[];
};

export const projectGroups = ['apps'];

export const projects: PortfolioProject[] = [
  {
    slug: 'txnios',
    group: 'apps',
    title: 'txniOS',
    date: '2026',
    href: 'https://os.txnio.com',
    summary:
      'A browser-based desktop inspired by classic Mac OS, built as a place to open windows, explore projects, and play with interface nostalgia.',
    intro:
      'txniOS is the project that turns the portfolio into an operating-system-like space instead of a normal page. It keeps projects, contact, settings, music, and small experiments inside a desktop metaphor.',
    previewImage: {
      src: '/projects-img/project-txnios-main.webp',
      alt: 'txniOS desktop with Finder and iPod windows open.',
    },
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        body: [
          'The interface starts as a familiar desktop: windows, icons, a dock, settings, and small pieces of state that make it feel alive.',
          'The goal is not to copy an old OS perfectly, but to use that language as a way to make portfolio navigation feel exploratory.',
        ],
      },
      {
        id: 'interaction',
        title: 'Interaction',
        body: [
          'Windows can be opened, moved, and used as containers for project content. The visual details are intentionally small: pixel edges, icon states, wallpaper changes, and audio controls.',
          'Those interactions make the project feel more like a place than a collection of links.',
        ],
      },
      {
        id: 'implementation',
        title: 'Implementation',
        body: [
          'The system is built with React and Next.js, with local state driving the window system and supporting components.',
          'The important implementation constraint is keeping the playful shell responsive enough that it still works as a portfolio.',
        ],
      },
    ],
    shots: [
      {
        label: 'Desktop overview',
        description: 'Main desktop state with open project entry points.',
        media: {
          src: '/projects-img/project-txnios-main.webp',
          alt: 'txniOS desktop overview with application windows and dock.',
        },
      },
      {
        label: 'Window movement',
        description: 'Animated capture of a window being moved across the desktop.',
        media: {
          src: '/projects-img/project-txnios-window-movement.gif',
          alt: 'Animated txniOS window movement capture.',
          format: 'gif',
        },
      },
      { label: 'Settings state', description: 'Wallpaper, controls, or system-style preferences.' },
    ],
  },
  {
    slug: 'spacio',
    group: 'apps',
    title: 'Spacio',
    date: '2026',
    href: 'https://spacio.txnio.com/',
    summary:
      'A browser-based BIM and digital-twin viewer for exploring models, sensor data, and environmental layers in one spatial interface.',
    intro:
      'Spacio turns a building model into an explorable workspace: choose a project, inspect the 3D scene, and move between geometry, sensors, and live-style environmental views.',
    previewImage: {
      src: '/projects-img/project-spacio-bim.gif',
      alt: 'Animated Spacio BIM viewer showing a loaded building model and sensor panel.',
      format: 'gif',
    },
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        body: [
          'The entry screen keeps the project selection simple, while the viewer opens a more detailed spatial workspace for each building.',
          'The portfolio version presents Spacio as a focused example of how complex building information can become an approachable browser interaction.',
        ],
      },
      {
        id: 'interaction',
        title: 'Interaction',
        body: [
          'Inside a project, the viewer combines a 3D BIM model with sensor navigation, floor grouping, search, and environmental heatmap controls.',
          'Temperature, humidity, and CO₂ layers can be switched alongside measurements, clips, and a spatial tree for different inspection modes.',
        ],
      },
      {
        id: 'implementation',
        title: 'Implementation',
        body: [
          'The experience is built around a browser-rendered BIM viewer with IFC model loading and a React interface for the surrounding workspace.',
          'The important constraint is keeping the controls legible while the 3D scene remains the primary surface for understanding the building.',
        ],
      },
    ],
    shots: [
      {
        label: 'BIM viewer',
        description: 'Animated model view with sensors, floor navigation, and analysis controls.',
        media: {
          src: '/projects-img/project-spacio-bim.gif',
          alt: 'Animated Spacio BIM viewer showing a loaded building model and sensor panel.',
          format: 'gif',
        },
      },
      {
        label: 'Project chooser',
        description: 'The starting point for selecting a building model.',
        media: {
          src: '/projects-img/project-spacio-main.png',
          alt: 'Spacio project chooser showing four BIM projects.',
        },
      },
      {
        label: 'CO₂ heatmap and charts',
        description: 'A CO₂ heatmap with temperature and humidity charts for sensor analysis.',
        media: {
          src: '/projects-img/project-spacio-charts.png',
          alt: 'Spacio project view with environmental chart data.',
        },
      },
    ],
  },
  {
    slug: 'minder',
    group: 'apps',
    title: 'Minder',
    date: '2025',
    href: 'https://minder-txnio.vercel.app/',
    summary:
      'A small product for uploading images, comments, and projects with authentication and persistent data.',
    intro:
      'Minder is a practical app experiment around saving visual material, adding context, and keeping project entries organized.',
    previewImage: {
      src: '/projects-img/project-minder-main.gif',
      alt: 'Animated Minder walkthrough showing the app interface in use.',
      format: 'gif',
    },
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        body: [
          'The app is centered on publishing and organizing visual entries rather than presenting a marketing surface.',
          'It combines authentication, uploads, project data, and comments into a compact workflow.',
        ],
      },
      {
        id: 'flow',
        title: 'Flow',
        body: [
          'A signed-in user can create entries, attach images, and review the resulting project feed.',
          'The useful part is the connection between input, storage, and a clean display state.',
        ],
      },
      {
        id: 'implementation',
        title: 'Implementation',
        body: [
          'The project uses React, TypeScript, Next.js, Firebase, and Google authentication.',
          'The main challenge is keeping the upload and auth states clear enough that the app does not feel fragile.',
        ],
      },
    ],
    shots: [
      {
        label: 'Landing screen',
        description: 'Initial Minder entry point with login, sign up, and exploration paths.',
        media: {
          src: '/projects-img/project-minder-home.png',
          alt: 'Minder landing screen with login, sign up, and explore minds actions.',
        },
      },
      {
        label: 'Explore feed',
        description: 'Public feed view for browsing shared minds and visual posts.',
        media: {
          src: '/projects-img/project-minder-feed.png',
          alt: 'Minder explore feed showing shared entries and interaction controls.',
        },
      },
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
