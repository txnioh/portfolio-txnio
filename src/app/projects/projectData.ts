export type ProjectSection = {
  id: string;
  title: string;
  body: string[];
};

export type ProjectShot = {
  label: string;
  description: string;
};

export type PortfolioProject = {
  slug: string;
  group: string;
  title: string;
  date: string;
  href: string;
  summary: string;
  intro: string;
  sections: ProjectSection[];
  shots: ProjectShot[];
};

export const projectGroups = ['main', 'apps', 'labs'];

export const projects: PortfolioProject[] = [
  {
    slug: 'txnios',
    group: 'main',
    title: 'txniOS',
    date: '2026',
    href: 'https://os.txnio.com',
    summary:
      'A browser-based desktop inspired by classic Mac OS, built as a place to open windows, explore projects, and play with interface nostalgia.',
    intro:
      'txniOS is the project that turns the portfolio into an operating-system-like space instead of a normal page. It keeps projects, contact, settings, music, and small experiments inside a desktop metaphor.',
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
      { label: 'Desktop overview', description: 'Main desktop state with open project entry points.' },
      { label: 'Window interaction', description: 'A project or app window in active use.' },
      { label: 'Settings state', description: 'Wallpaper, controls, or system-style preferences.' },
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
      { label: 'Upload flow', description: 'The image and project creation path.' },
      { label: 'Project feed', description: 'Published entries with their visual material.' },
      { label: 'Signed-in state', description: 'Authenticated UI and account-aware controls.' },
    ],
  },
  {
    slug: 'second-portfolio',
    group: 'apps',
    title: 'Second Portfolio',
    date: '2025',
    href: 'https://second-portfolio-txnio.vercel.app/',
    summary:
      'A previous portfolio direction with a sticker-like composition and a lighter, more playful layout system.',
    intro:
      'Second Portfolio was an earlier attempt at making a personal site feel more like a collage than a static resume.',
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        body: [
          'The page uses fragments, stickers, and loose composition to create a less rigid first impression.',
          'It is useful as a snapshot of a different visual direction before this cleaner version.',
        ],
      },
      {
        id: 'layout',
        title: 'Layout',
        body: [
          'The design tests how much personality can be added before the content becomes hard to scan.',
          'The current portfolio keeps that experimental history accessible without making it the primary navigation model.',
        ],
      },
      {
        id: 'takeaway',
        title: 'Takeaway',
        body: [
          'The project helped clarify that the strongest personal site for this version should be quieter and more readable.',
          'It still works as a good reference for collage-like visual language.',
        ],
      },
    ],
    shots: [
      { label: 'Home composition', description: 'The first viewport and visual fragments.' },
      { label: 'Sticker layout', description: 'Close-up of the collage-style elements.' },
      { label: 'Responsive crop', description: 'How the composition adapts on mobile.' },
    ],
  },
  {
    slug: 'cubes',
    group: 'labs',
    title: 'Cubes',
    date: '2025',
    href: 'https://cubes-umber.vercel.app',
    summary:
      'A 3D interaction study focused on geometry, depth, and simple browser-rendered motion.',
    intro:
      'Cubes is a small visual lab for exploring depth, camera feel, and motion through a constrained 3D object system.',
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        body: [
          'The project uses a simple cube scene to make the interaction and rendering choices easy to inspect.',
          'It is intentionally narrow: a small piece of visual behavior rather than a full product.',
        ],
      },
      {
        id: 'interaction',
        title: 'Interaction',
        body: [
          'The experience depends on how the scene responds to pointer movement, depth, and the framing of the objects.',
          'The value is in the feeling of the motion and the way the scene holds together across viewports.',
        ],
      },
      {
        id: 'implementation',
        title: 'Implementation',
        body: [
          'It is a browser-rendered 3D experiment using React-side composition around the scene.',
          'The detail captures should show default state, interaction state, and mobile framing.',
        ],
      },
    ],
    shots: [
      { label: 'Scene default', description: 'The initial 3D composition.' },
      { label: 'Interaction state', description: 'How the scene responds to movement.' },
      { label: 'Mobile framing', description: 'The same visual idea on a narrow viewport.' },
    ],
  },
  {
    slug: 'floating-images',
    group: 'labs',
    title: 'Floating Images',
    date: '2025',
    href: 'https://floating-images.vercel.app/',
    summary:
      'A minimal image experiment where motion and pointer position decide how the gallery feels.',
    intro:
      'Floating Images is a gallery interaction study where the images behave like moving material rather than fixed cards.',
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        body: [
          'The page avoids a normal grid and lets motion define how the visual set is discovered.',
          'It sits closer to an interaction sketch than a finished application.',
        ],
      },
      {
        id: 'motion',
        title: 'Motion',
        body: [
          'The key behavior is the relationship between pointer position, image placement, and the feeling of drift.',
          'A good capture set should show the rhythm changing across a few moments.',
        ],
      },
      {
        id: 'takeaway',
        title: 'Takeaway',
        body: [
          'The project is a useful reference for soft, ambient interaction without heavy interface chrome.',
          'It can feed future portfolio or gallery ideas where atmosphere matters more than controls.',
        ],
      },
    ],
    shots: [
      { label: 'Initial spread', description: 'The image set in its calm state.' },
      { label: 'Pointer response', description: 'The gallery reacting to movement.' },
      { label: 'Dense moment', description: 'A more visually filled frame.' },
    ],
  },
  {
    slug: 'gradient-generator',
    group: 'labs',
    title: 'Gradient Generator',
    date: '2025',
    href: 'https://gradient-generator-txnio.vercel.app/',
    summary:
      'A compact tool for building gradients quickly and seeing the result without extra interface noise.',
    intro:
      'Gradient Generator is a utility-style experiment for exploring color combinations and generating a usable visual result quickly.',
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        body: [
          'The tool focuses on immediate feedback: change the inputs and the gradient becomes the main output.',
          'It is intentionally small so the generated result stays more important than the interface.',
        ],
      },
      {
        id: 'controls',
        title: 'Controls',
        body: [
          'The controls exist to support quick color iteration, not deep configuration.',
          'A future capture set should show the controls, the preview, and one finished gradient state.',
        ],
      },
      {
        id: 'takeaway',
        title: 'Takeaway',
        body: [
          'The project is useful as both a practical color helper and a simple interface exercise.',
          'It keeps the scope tight enough that the page can be understood immediately.',
        ],
      },
    ],
    shots: [
      { label: 'Controls', description: 'The editable inputs for the gradient.' },
      { label: 'Generated gradient', description: 'The main visual output.' },
      { label: 'Output detail', description: 'A final state ready to reuse.' },
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
