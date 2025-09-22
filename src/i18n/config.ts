import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      // Common
      common: {
        madeWithLove: 'made with love by txnio.',
        loading: 'Loading',
        back: 'Back',
        unavailableContent: 'Content not available',
        blog: 'Blog',
        projects: 'Projects',
        home: 'Home',
        social: 'Social',
        linkedin: 'LinkedIn',
        github: 'GitHub',
        macFolio: 'Mac-Folio',
        comingSoon: 'Coming Soon!',
        newOSExperience: 'New OS experience'
      },
      
      // Window titles and names
      windows: {
        aboutMe: 'About Me',
        projects: 'Projects', 
        contact: 'Contact',
        settings: 'Settings',
        snakeGame: 'Snake Game',
        home: 'Home',
        oldTxniOS: 'txniOS Old'
      },

      // About Me Content
      aboutMe: {
        fileName: 'aboutTxnio.ts',
        name: 'Antonio J. González',
        alias: 'Txnio',
        role: 'Developer for human use',
        experience: {
          company: '1.5+ years',
          personal: '2+ years'
        },
        skills: [
          'JavaScript', 'TypeScript', '.NET', 'NextJS',
          'Node.js', 'Python', 'HTML5', 'CSS3',
          'Power Platform', 'AI Integration'
        ],
        currentStack: {
          frontend: ['React', 'NextJS', 'TypeScript'],
          styling: ['Framer-Motion', 'TailwindCSS'],
          stateManagement: ['Redux', 'Context API'],
          backend: ['Node.js', 'Express', 'Firebase'],
          database: ['MongoDB', 'GraphQL'],
          deployment: ['Vercel', 'Netlify', 'Docker']
        },
        interests: [
          'Frontend Development', 'Minimalist Design',
          'Machine Learning Integration'
        ],
        currentlyLearning: ['Swift', 'Advanced NextJS', 'GraphQL'],
        aiTools: [
          'ChatGPT, Claude for code optimization',
          'Midjourney for UI/UX inspiration'
        ]
      },

      // Projects Content
      projects: {
        backToProjects: 'Back to projects',
        loadingProject: 'Loading',
        title: 'PROJECTS',
        subtitle: 'by TXNIO',
        liveDemo: 'Live Demo',
        github: 'GitHub'
      },

      // Contact Content
      contact: {
        title: "Let's Talk!",
        description: 'If you have any questions, collaboration proposals, or just want to chat, feel free to contact me through any of these channels.',
        email: 'Email',
        linkedin: 'LinkedIn',
        github: 'GitHub'
      },

      // Home Content
      home: {
        introduction: `hello! I'm Tony, although my pseudonym is -- txnio --, right now I'm building things for the web,

for now studying different technologies to be able to express art in browser windows.

I like cinema, photography and hypnagogic music.`,
        lastEdited: 'Last edited: 4:04 PM, Fri Sep 27 2024',
        toggleLights: {
          turnOn: 'turn on the lights',
          turnOff: 'turn off the lights'
        }
      },

      // Landing hero (main page)
      landing: {
        title: 'a FRONTEND DEVELOPER',
        subtitle: 'CURRENTLY DESIGNING IN'
      },

      // Settings
      settings: {
        title: 'System Settings',
        search: 'Search settings...',
        wallpaper: {
          title: 'Wallpaper',
          label: 'Background',
          description: 'Change your desktop wallpaper'
        },
        user: {
          title: 'User & Accounts',
          label: 'User',
          description: 'Manage your user accounts and login settings'
        },
        network: {
          title: 'Network & Internet',
          label: 'Network',
          description: 'Configure your Wi-Fi connections and network settings'
        },
        bluetooth: {
          title: 'Bluetooth',
          label: 'Bluetooth',
          description: 'Manage your Bluetooth devices and connections'
        },
        security: {
          title: 'Security & Privacy',
          label: 'Security',
          description: 'Adjust your system security and privacy settings'
        },
        keyboard: {
          title: 'Keyboard',
          label: 'Keyboard',
          description: 'Customize your keyboard settings and shortcuts'
        }
      },

      // Project descriptions
      projectDescriptions: {
        'txniOS Old': 'Interactive simulation of Mac OS 7 with functional windows and classic system aesthetics.',
        'Cubes': 'An interactive visual experience with 3D cubes using Three.js and React Three Fiber.',
        'Minder': 'An application to upload images, comments and projects using Firebase, React, TypeScript, Next.js and Google authentication.',
        'Second Portfolio': 'A portfolio inspired by the work of Yihui Hu, with a sticker-type design.',
        '3D Crystal Effect': 'A 3D crystal visual effect implemented with JavaScript.',
        'Infinite Particles': 'An infinite particle animation created with JavaScript.',
        'Floating Images': 'A minimal gallery with mouse interaction for floating images.',
        'Pixel Transition': 'A simple pixel transition for the menu bar.',
        'Gradient Generator': 'A gradient generator implemented in JavaScript.'
      }
    }
  },
  es: {
    translation: {
      // Common
      common: {
        madeWithLove: 'hecho con amor por txnio.',
        loading: 'Cargando',
        back: 'Volver',
        unavailableContent: 'Contenido no disponible',
        blog: 'Blog',
        projects: 'Proyectos',
        home: 'Inicio',
        social: 'Social',
        linkedin: 'LinkedIn',
        github: 'GitHub',
        macFolio: 'Mac-Folio',
        comingSoon: '¡Próximamente!',
        newOSExperience: 'Nueva experiencia de OS'
      },

      // Window titles and names  
      windows: {
        aboutMe: 'Sobre Mí',
        projects: 'Proyectos',
        contact: 'Contacto', 
        settings: 'Settings',
        snakeGame: 'Snake Game',
        home: 'Home',
        oldTxniOS: 'txniOS Old'
      },

      // About Me Content
      aboutMe: {
        fileName: 'sobreTxnio.ts',
        name: 'Antonio J. González',
        alias: 'Txnio',
        role: 'Desarrollador para uso humano',
        experience: {
          company: '1.5+ años',
          personal: '2+ años'  
        },
        skills: [
          'JavaScript', 'TypeScript', '.NET', 'NextJS',
          'Node.js', 'Python', 'HTML5', 'CSS3',
          'Power Platform', 'Integración de IA'
        ],
        currentStack: {
          frontend: ['React', 'NextJS', 'TypeScript'],
          styling: ['Framer-Motion', 'TailwindCSS'],
          stateManagement: ['Redux', 'Context API'],
          backend: ['Node.js', 'Express', 'Firebase'],
          database: ['MongoDB', 'GraphQL'],
          deployment: ['Vercel', 'Netlify', 'Docker']
        },
        interests: [
          'Desarrollo Frontend', 'Diseño minimalista',
          'Integración de Machine Learning'
        ],
        currentlyLearning: ['Swift', 'NextJS Avanzado', 'GraphQL'],
        aiTools: [
          'ChatGPT, Claude para optimización de código',
          'Midjourney para inspiración en UI/UX'
        ]
      },

      // Projects Content
      projects: {
        backToProjects: 'Volver a proyectos',
        loadingProject: 'Cargando',
        title: 'PROYECTOS',
        subtitle: 'por TXNIO',
        liveDemo: 'Demo en Vivo',
        github: 'GitHub'
      },

      // Contact Content
      contact: {
        title: '¡Hablemos!',
        description: 'Si tienes alguna pregunta, propuesta de colaboración o simplemente quieres charlar, no dudes en contactarme a través de cualquiera de estos medios.',
        email: 'Email',
        linkedin: 'LinkedIn', 
        github: 'GitHub'
      },

      // Home Content
      home: {
        introduction: `hola! soy Tony, aunque mi pseudónimo es -- txnio --, ahora mismo estoy construyendo cosas para web,

por ahora estudiando diferentes tecnologías para poder expresar arte en ventanas de navegadores. 

me gusta el cine, fotografía y la música hipnagógica.`,
        lastEdited: 'Ultima edición: 16:04, Vier Sep 27 2024',
        toggleLights: {
          turnOn: 'enciende las luces',
          turnOff: 'apaga las luces'
        }
      },

      // Landing hero (main page)
      landing: {
        title: 'un DESARROLLADOR FRONTEND',
        subtitle: 'ACTUALMENTE DISEÑANDO EN'
      },

      // Settings
      settings: {
        title: 'Ajustes del Sistema',
        search: 'Buscar ajustes...',
        wallpaper: {
          title: 'Fondo de Pantalla',
          label: 'Fondo de pantalla',
          description: 'Cambia el fondo de escritorio'
        },
        user: {
          title: 'Usuario y Cuentas',
          label: 'Usuario y Cuentas',
          description: 'Gestiona tus cuentas de usuario y ajustes de inicio de sesión'
        },
        network: {
          title: 'Red e Internet',
          label: 'Red e Internet',
          description: 'Configura tus conexiones Wi-Fi y ajustes de red'
        },
        bluetooth: {
          title: 'Bluetooth',
          label: 'Bluetooth',
          description: 'Administra tus dispositivos Bluetooth y conexiones'
        },
        security: {
          title: 'Seguridad y Privacidad',
          label: 'Seguridad y Privacidad',
          description: 'Ajusta la configuración de seguridad y privacidad de tu sistema'
        },
        keyboard: {
          title: 'Teclado',
          label: 'Teclado',
          description: 'Personaliza la configuración de tu teclado y atajos'
        }
      },

      // Project descriptions
      projectDescriptions: {
        'txniOS Old': 'Simulación interactiva de Mac OS 7 con ventanas funcionales y la estética clásica del sistema.',
        'Cubes': 'Una experiencia visual interactiva con cubos 3D utilizando Three.js y React Three Fiber.',
        'Minder': 'Una aplicación para subir imágenes, comentarios y proyectos utilizando Firebase, React, TypeScript, Next.js y autenticación de Google.',
        'Second Portfolio': 'Un portafolio inspirado en el trabajo de Yihui Hu, con un diseño tipo pegatina.',
        '3D Crystal Effect': 'Un efecto visual de cristal 3D implementado con JavaScript.',
        'Infinite Particles': 'Una animación de partículas infinitas creada con JavaScript.',
        'Floating Images': 'Una galería mínima con interacción del mouse para imágenes flotantes.',
        'Pixel Transition': 'Una transición de píxeles simple para la barra de menú.',
        'Gradient Generator': 'Un generador de gradientes implementado en JavaScript.'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language (English)
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;