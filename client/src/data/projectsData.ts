export const SUPPORTED_LANGUAGES = ["he", "en", "es", "fr"] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

interface ProjectTranslation {
  title: string;
  description: string;
}

export interface Project {
  id: string;
  category: string;
  techStack: string[];
  videoUrl: string;
  imageUrl: string;
  liveUrl: string;
  translations: Record<SupportedLanguage, ProjectTranslation>;
}

export const projectsData: Project[] = [
  {
    id: "tr-vldymyr",
    category: "Transport & Logistics",
    techStack: ["Corporate", "Lead Generation", "Responsive"],
    videoUrl: "",
    imageUrl: "/portfolio/screencapture-tr-vldymyr-vercel-app-2026-03-30-11_24_42.png",
    liveUrl: "https://tr-vldymyr.vercel.app",
    translations: {
      he: {
        title: "TR Vldymyr — לוגיסטיקה והובלה",
        description:
          "אתר תדמית לחברת הובלות מקצועית. עיצוב נקי עם דגש על אמינות, שירות מהיר ונוכחות דיגיטלית חזקה.",
      },
      en: {
        title: "TR Vldymyr — Logistics",
        description:
          "A corporate website for a professional transport company. Clean design emphasizing reliability, fast service, and strong digital presence.",
      },
      es: {
        title: "TR Vldymyr — Transporte Profesional",
        description:
          "Un sitio web corporativo para una empresa de transporte profesional. Diseño limpio con énfasis en confiabilidad y presencia digital.",
      },
      fr: {
        title: "TR Vldymyr — Transport Professionnel",
        description:
          "Un site web d'entreprise pour une société de transport professionnel. Design épuré mettant l'accent sur la fiabilité et la présence digitale.",
      },
    },
  },
  {
    id: "yuli-bity",
    category: "Creative Portfolio",
    techStack: ["Dark Aesthetic", "Gallery Grid", "Minimalist"],
    videoUrl: "",
    imageUrl: "/portfolio/screencapture-yulibity-en-2026-03-30-11_11_00.png",
    liveUrl: "https://yulibity.com/",
    translations: {
      he: {
        title: "Yuli Bity — אמנות קעקועים ועיצוב",
        description:
          "אתר תיק עבודות לאמנית קעקועים עם עיצוב כהה ומינימליסטי. גלריית תמונות אינטראקטיבית, אסתטיקה פרימיום וחוויית משתמש חלקה.",
      },
      en: {
        title: "Yuli Bity — Tattoo Art & Design",
        description:
          "A dark, editorial portfolio for a tattoo artist. Interactive image gallery, premium aesthetic, and seamless user experience.",
      },
      es: {
        title: "Yuli Bity — Tatuadora",
        description:
          "Un portafolio editorial oscuro para una artista del tatuaje. Galería interactiva, estética premium y experiencia de usuario impecable.",
      },
      fr: {
        title: "Yuli Bity — Tatoueuse",
        description:
          "Un portfolio éditorial sombre pour une artiste tatoueuse. Galerie interactive, esthétique premium et expérience utilisateur fluide.",
      },
    },
  },
  {
    id: "immigration-advice-service",
    category: "Global Corporate & Legal",
    techStack: ["Multilingual", "Legal-Tech", "Complex Architecture"],
    videoUrl: "",
    imageUrl: "/portfolio/screencapture-immigrationadviceservice-org-2026-03-30-11_10_00.png",
    liveUrl: "https://immigrationadviceservice.org/",
    translations: {
      he: {
        title: "שירותי ייעוץ הגירה (IAS)",
        description:
          "האתר הרשמי של פירמת עורכי הדין המובילה בבריטניה להגירה. פלטפורמת תוכן ענקית המספקת ייעוץ משפטי ושירותי ויזה ברחבי העולם.",
      },
      en: {
        title: "Immigration Advice Service (IAS)",
        description:
          "The leading UK immigration law firm website. A massive, content-driven platform providing legal advice and visa services globally.",
      },
      es: {
        title: "Immigration Advice Service (IAS)",
        description:
          "El sitio web principal del bufete de abogados de inmigración líder en el Reino Unido. Una plataforma masiva de asesoramiento legal.",
      },
      fr: {
        title: "Immigration Advice Service (IAS)",
        description:
          "Le site web du premier cabinet d'avocats spécialisé en immigration au Royaume-Uni. Une plateforme juridique d'envergure mondiale.",
      },
    },
  },
  {
    id: "yachad-lechaim",
    category: "Wine Tourism & Events",
    techStack: ["RTL Design", "Booking System", "Storytelling"],
    videoUrl: "",
    imageUrl: "/portfolio/screencapture-yachad-lechaim-2026-03-30-11_20_16.png",
    liveUrl: "https://yachad-lechaim.co.il",
    translations: {
      he: {
        title: "יחד לחיים — חווית יקב בוטיק",
        description:
          "אתר חוויתי ליקב ישראלי עם מסלולי סיורים, הזמנת קבוצות ועיצוב סיפורי שמזמין לטעום את הכרם מבפנים.",
      },
      en: {
        title: "Yachad Lechaim — Winery Experience",
        description:
          "An immersive Israeli winery website featuring guided tours, group bookings, and storytelling design that brings the vineyard to life.",
      },
      es: {
        title: "Yachad Lechaim — Experiencia Vinícola",
        description:
          "Un sitio web inmersivo de una bodega israelí con tours guiados, reservas grupales y un diseño narrativo que da vida al viñedo.",
      },
      fr: {
        title: "Yachad Lechaim — Expérience Vinicole",
        description:
          "Un site immersif de domaine viticole israélien avec visites guidées, réservations de groupe et un design narratif qui donne vie au vignoble.",
      },
    },
  },
  {
    id: "ljb-commercial-gas",
    category: "Commercial Services",
    techStack: ["Service Platform", "B2B", "Multi-Section"],
    videoUrl: "",
    imageUrl: "/portfolio/screencapture-ljbcommercialgas-vercel-app-2026-03-30-11_25_15.png",
    liveUrl: "https://ljbcommercialgas.vercel.app",
    translations: {
      he: {
        title: "LJB — שירותי גז מסחריים",
        description:
          "אתר שירות מקצועי לחברת גז מסחרית בבריטניה. פלטפורמה מקיפה עם מערכת הזמנות, סקירת שירותים ועיצוב אמין.",
      },
      en: {
        title: "LJB Commercial Gas",
        description:
          "A professional service website for a UK commercial gas company. Comprehensive platform with booking, service overview, and trustworthy design.",
      },
      es: {
        title: "LJB Commercial Gas",
        description:
          "Un sitio web profesional para una empresa de gas comercial del Reino Unido. Plataforma integral con reservas y diseño confiable.",
      },
      fr: {
        title: "LJB Commercial Gas",
        description:
          "Un site web professionnel pour une entreprise de gaz commercial au Royaume-Uni. Plateforme complète avec réservations et design fiable.",
      },
    },
  },
];
