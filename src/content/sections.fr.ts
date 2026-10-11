/* Français. Traduction statique de sections.en.ts (seul l'anglais est
   modifiable dans le CMS, comme sur le site précédent). Textes juridiques
   repris mot pour mot du site précédent. */
import type { PageMeta, PageSections, PageSlug } from './types'
import { sectionsEn, pageMetaEn } from './sections.en'

const img = (page: PageSlug, key: string) => sectionsEn[page][key]?.image ?? null

export const sectionsFr: Record<PageSlug, PageSections> = {
  home: {
    hero: {
      eyebrow: 'Stratégie de marque & studio créatif · Amsterdam',
      title: 'Nous rendons les entreprises *désirables*.',
      subtitle: 'Une agence de branding indépendante pour les fondateurs qui veulent une marque qui vend. Stratégie, identité, digital et demande, par une seule équipe senior.',
      ctaLabel: 'Lancer un projet',
      ctaUrl: '/contact',
      extra: { cta2Label: 'Voir les travaux', cta2Url: '#work', words: ['choisies', 'mémorables', 'recommandées'] },
      image: img('home', 'hero'),
    },
    work: { ...sectionsEn.home.work, eyebrow: 'Travaux choisis', title: 'Des marques qui ont fait bouger les chiffres derrière elles.', ctaLabel: "Toute l'archive" },
    practice: {
      eyebrow: 'Expertises',
      title: 'Cinq pratiques. Une équipe. Aucun relais.',
      ctaLabel: 'Toutes les expertises',
      ctaUrl: '/capabilities',
      extra: {
        areas: [
          { key: 'Brand & Identity', label: 'Marque & identité', text: 'Positionnement, naming et identité qui donnent une raison de vous choisir plutôt que le voisin.' },
          { key: 'Digital & Product', label: 'Digital & produit', text: "Sites, e-commerce et produits où l'attention devient une décision." },
          { key: 'Growth & Demand', label: 'Croissance & demande', text: 'SEO, contenu et marketing à la performance pour une marque recherchée, pas seulement vue.' },
          { key: 'Market & Expansion', label: 'Marché & expansion', text: 'Études et go-to-market pour le prochain marché, avant que le budget ne soit dépensé.' },
          { key: 'Experiences', label: 'Expériences', text: 'Événements, expositions et ateliers où l’on rencontre la marque en vrai.' },
        ],
      },
    },
    evidence: { eyebrow: 'Dans leurs mots', extra: sectionsEn.home.evidence.extra },
    studio: {
      eyebrow: 'Le studio',
      title: 'Petite à dessein. Senior dans la pièce. Commerciale par *instinct*.',
      body: 'Nous avons commencé du côté de la croissance : ici, chaque travail de marque doit se rembourser.',
      ctaLabel: 'Entrer dans le studio',
      ctaUrl: '/studio',
      image: img('home', 'studio'),
    },
    notes: { eyebrow: 'Journal', title: 'Notes sur la marque, la stratégie et la croissance.', ctaLabel: 'Lire le journal', ctaUrl: '/notes', extra: { notes: [] } },
    contact: {
      eyebrow: 'Nouveaux projets',
      title: 'Dites-nous quelle entreprise vous voulez *devenir*.',
      body: 'Une personne répond sous un jour ouvré. Jamais un robot, jamais un script commercial.',
      ctaLabel: 'Lancer un projet',
      ctaUrl: '/contact',
    },
  },

  global: {
    footer: {
      title: 'Désirables, jamais par hasard.',
      body: 'Les notes par e-mail. Des essais seulement, quelques fois par an.',
      extra: { lastLine: "Fait à Amsterdam. Rien ici n'est un accident, sauf", lastLink: 'ceci' },
    },
    announcement: { title: '' },
    header_nav: {
      items: [
        { title: 'Travaux', body: '/work' },
        { title: 'Expertises', body: '/capabilities' },
        { title: 'Studio', body: '/studio' },
        { title: 'Notes', body: '/notes' },
      ],
    },
    footer_nav: {
      items: [
        { title: 'Travaux', body: '/work' },
        { title: 'Études de cas', body: '/case-studies' },
        { title: 'Expertises', body: '/capabilities' },
        { title: 'Studio', body: '/studio' },
        { title: 'Notes', body: '/notes' },
        { title: 'Formations', body: '/trainings' },
        { title: 'Rapports', body: '/reports' },
        { title: 'Contact', body: '/contact' },
      ],
    },
  },

  work: { header: { eyebrow: 'Travaux', title: 'Marque, digital et *croissance*.', subtitle: "Nous prenons moins de projets que la plupart des agences : chacun reçoit une attention senior, du premier brief au dernier chiffre." } },
  'case-studies': { header: { eyebrow: 'Études de cas', title: 'Comment le travail a *marché*.', subtitle: "Chaque étude suit la même ligne : le problème, l'intuition, la décision et ce qu'elle a changé pour l'entreprise." } },
  capabilities: {
    header: {
      eyebrow: 'Expertises',
      title: 'Tout ce qu’il faut à une marque pour être *désirée*.',
      subtitle: 'Stratégie de marque, identité, digital, croissance et expansion, en cinq pratiques. Une seule, ou toute la séquence. Chaque discipline a sa propre page.',
    },
    cta: { title: "Vous ne savez pas par où commencer ? La plupart de nos clients non plus, au début. C'est notre première conversation.", ctaLabel: 'Parlons-en', ctaUrl: '/contact' },
  },
  studio: {
    header: {
      eyebrow: 'Studio',
      title: 'Petite à dessein. Senior dans la pièce. Commerciale par *instinct*.',
      body: "Not by Accident est un studio indépendant de stratégie de marque et de création à Amsterdam, qui travaille sur la marque, le produit numérique et la demande. Nous avons commencé du côté de la croissance : ici, le travail créatif et l'argument commercial n'ont jamais vécu dans des pièces séparées.",
      image: img('studio', 'header'),
    },
    principles: {
      title: 'Comment nous pensons',
      items: [
        { title: 'Précis', body: 'Nommer la matière, le mois, le chiffre, la rue. « Une gamme de » n’est pas une description.' },
        { title: 'Décidé', body: 'Deux pistes, jamais trois. La recommandation vient en premier. On nous paie pour avoir un avis.' },
        { title: 'Chaleureux, pas mou', body: "Des gens, des mains, de l'imperfection, de l'humour. Le travail reste net." },
        { title: 'Éveillé', body: 'Des références venues d’ailleurs que le design. Toujours créditées, jamais expliquées.' },
        { title: 'Discrètement drôle', body: 'Un moment humain par communication. Dans la dernière ligne, jamais dans le titre.' },
        { title: 'Lucide commercialement', body: 'Chaque qualité subjective se retrouve, un cran plus loin, en chiffre concret.' },
      ],
    },
    culture: {
      title: 'La culture',
      items: [
        { title: 'Une seule pièce', body: 'Stratégie, design et demande travaillent ensemble dès le premier jour.' },
        { title: 'Des mains expérimentées', body: 'Ceux qui gagnent le projet le réalisent.' },
        { title: "Le commercial d'abord", body: 'Chaque décision remonte à un chiffre que le client peut faire bouger.' },
      ],
    },
    locations: { title: 'Où', items: [{ title: 'Amsterdam', body: 'Lundi–jeudi, 10 h–17 h CET' }] },
    signup: { title: 'Pas encore le bon moment ? Laissez votre e-mail et restez proche.' },
  },
  notes: { header: { eyebrow: 'Journal', title: 'Notes', subtitle: "Des essais sur la stratégie de marque, le positionnement, le naming et la croissance. Un regard indépendant, publié quand il y a quelque chose à dire." } },
  trainings: {
    header: { eyebrow: 'Ateliers · À partir de 2027', title: 'Le métier, enseigné par ceux qui le font.', subtitle: 'Ateliers de deux jours en stratégie de marque et direction de création, en présentiel, pour douze personnes au plus.' },
    body: {
      items: [
        { title: '', body: "Deux ateliers à partir de 2027. L'un sur la stratégie de marque : positionnement, naming, construction d'un brief. L'autre sur la direction de création : faire un travail différent et commercialement juste." },
        { title: '', body: "En présentiel, et volontairement petit. Amsterdam, plus une autre ville par an. Pas de certificat. Pas de slides que vous n'ouvrirez plus jamais." },
      ],
    },
    format: {
      title: 'Format',
      items: [
        { title: 'Format', body: 'Atelier en présentiel, deux jours' },
        { title: 'Taille du groupe', body: 'Douze participants au plus' },
        { title: 'Lieu', body: 'Amsterdam, plus une ville par an' },
        { title: 'Première date', body: '2027, à confirmer' },
        { title: 'Disciplines', body: 'Stratégie de marque · Direction de création' },
      ],
    },
    waiting: { title: "Liste d'attente", body: "Nous vous écrirons en premier à l'ouverture des inscriptions. Un e-mail, pas de marketing.", ctaLabel: 'Rejoindre la liste' },
  },
  reports: {
    header: {
      eyebrow: 'Rapports · Bientôt',
      title: 'La recherche, en accès libre.',
      subtitle: "Benchmarks, notes de terrain et les calculs que nous gardons d'habitude pour nous. Des chiffres honnêtes, argumentés simplement. Pas encore prêt, mais presque.",
    },
    notify: { title: 'Me prévenir', body: 'Un e-mail au lancement. Rien d’autre.', ctaLabel: 'Me prévenir' },
  },
  contact: {
    header: {
      eyebrow: 'Contact',
      title: 'Écrivez-nous.',
      subtitle: 'Nous travaillons avec des fondateurs et des responsables créatifs qui soupçonnent que leur entreprise vaut mieux que sa réputation.',
      body: "Nous prenons moins de projets que la plupart, et nous commençons généralement par une mission de stratégie. Si vous cherchez une maison de production ou un partenaire d'exécution, nous ne sommes sans doute pas les bons interlocuteurs.",
    },
    form: { title: 'Ou dites-le ici', body: 'Généralement sous un jour ouvré.' },
  },
  privacy: {
    header: {
      eyebrow: 'Confidentialité',
      title: 'Ce que nous conservons, et pourquoi.',
      subtitle: 'Nous collectons très peu de choses et nous les traitons simplement. Cette notice explique exactement comment, dans une langue qui ne devrait pas exiger un avocat.',
      extra: { lastUpdated: '8 août 2026' },
    },
    legal: {
      items: [
        {
          title: 'Qui nous sommes',
          body: "Not by Accident est une entreprise créative indépendante. Quand nous disons « nous » ou « notre » dans cette notice, nous parlons de Not by Accident. Quand nous disons « vous », nous parlons de toute personne qui visite ce site ou qui correspond avec nous. Nos coordonnées légales complètes seront ajoutées ici avant que cette notice soit considérée comme définitive.\n\nCette notice explique ce que nous collectons, pourquoi nous le collectons, et ce que vous pouvez nous demander de faire à ce sujet. Elle est écrite pour être lue, pas pour être endurée.",
        },
        {
          title: 'Ce que nous collectons',
          body: "Nous collectons uniquement ce qu'une conversation exige. Lorsque vous nous écrivez via le formulaire de contact ou par e-mail, nous conservons votre nom, votre entreprise, votre adresse e-mail et ce que vous choisissez de nous dire de votre projet. Nous les gardons tant que la conversation est active, puis pendant une durée raisonnable ensuite.\n\nLorsque vous parcourez le site, notre hébergeur enregistre des informations techniques standard — les pages demandées, la région approximative, le navigateur utilisé. Il s'agit d'une activité serveur ordinaire, pas de surveillance.",
        },
        {
          title: 'Pourquoi nous les conservons',
          body: "Nous utilisons vos informations dans un seul but : vous répondre et, lorsque cela devient pertinent, réaliser le travail que vous nous avez demandé. Nous ne les vendons pas. Nous ne construisons pas de profils publicitaires. Nous ne les enrichissons pas avec des données achetées ailleurs.\n\nNotre base légale est soit votre consentement, donné lorsque vous nous écrivez, soit notre intérêt légitime à bien gérer une petite entreprise.",
        },
        {
          title: 'Qui y a accès',
          body: "Vos informations sont vues par les personnes de Not by Accident qui ont besoin de les voir, et par une courte liste de prestataires qui nous aident à fonctionner — messagerie, hébergement et mesure d'audience. Chacun est tenu par ses propres obligations. Nous les choisissons avec soin et nous les réexaminons.",
        },
        {
          title: 'Vos droits',
          body: "Vous pouvez demander à consulter les informations que nous détenons sur vous, à les corriger ou à les faire supprimer. Vous pouvez retirer votre consentement à tout moment. Vous pouvez également saisir l'autorité de protection des données compétente, même si nous préférerions que vous nous le disiez d'abord, afin que nous puissions corriger les choses.\n\nPour exercer l'un de ces droits, écrivez à hello@notbyaccident.com. Nous répondons sous un mois, en général plus tôt.",
        },
      ],
    },
  },
  cookies: {
    header: {
      eyebrow: 'Cookies',
      title: 'Une courte note sur les cookies.',
      subtitle: 'Nous en utilisons une poignée, et seulement les utiles. Pas de traceurs publicitaires, pas de profilage tiers, pas de revente de votre attention.',
    },
    table: {
      items: [
        { title: 'Essentiels', body: "Ils font fonctionner le site — ils retiennent votre choix en matière de cookies et sécurisent la connexion. Rien à refuser : sans eux, rien ne s'affiche.", meta: 'Session – 12 mois' },
        { title: "Mesure d'audience", body: "Une mesure unique et respectueuse de la vie privée : quelles pages sont lues et, grossièrement, d'où viennent les lecteurs. Agrégée, jamais rattachée à un nom.", meta: '12 mois' },
        { title: 'Préférences', body: 'Ils retiennent les petites choses que vous préféreriez ne pas avoir à nous redire — par exemple si vous avez déjà fermé un bandeau.', meta: '6 mois' },
      ],
    },
    managing: {
      title: 'Les gérer vous-même',
      body: 'Tous les navigateurs permettent de consulter, bloquer ou supprimer les cookies depuis leurs réglages. Bloquer les cookies essentiels empêchera certaines parties du site de fonctionner ; bloquer les autres ne changera rien que vous puissiez remarquer.',
    },
  },
  '404': { header: { eyebrow: 'Erreur 404', title: 'Cette page est un accident.', body: 'Tout le reste ici a été fait à dessein. Le lien est peut-être cassé, ou la page a déménagé.' } },
  // The Lab is English-only in V1.
  lab: sectionsEn.lab,
  'lab-how': sectionsEn['lab-how'],
  'lab-readiness': sectionsEn['lab-readiness'],
  'lab-app': sectionsEn['lab-app'],
}

export const pageMetaFr: Record<PageSlug, PageMeta> = {
  home: {
    title: 'Not by Accident · Agence de branding & studio créatif, Amsterdam',
    description: 'Agence de branding indépendante à Amsterdam. Stratégie de marque, identité, sites web et marketing de croissance pour des entreprises désirées et choisies.',
  },
  global: { title: 'Not by Accident', description: '' },
  work: { title: 'Travaux · Projets de marque, digital et croissance', description: "L'archive de Not by Accident : stratégie de marque, identité, produits numériques et demande, pour des fondateurs et des équipes créatives." },
  'case-studies': { title: 'Études de cas · Résultats de branding', description: 'Études de cas de Not by Accident : le problème, la réflexion et le résultat commercial du travail de marque, d’identité et de croissance.' },
  capabilities: { title: 'Expertises · Branding, digital & croissance', description: 'Expertises en cinq pratiques : stratégie de marque, identité, sites web, SEO, marketing à la performance, études de marché, événements et plus.' },
  studio: { title: 'Studio · Entreprise créative indépendante, Amsterdam', description: 'Not by Accident, entreprise créative indépendante à Amsterdam. Petite à dessein, senior dans la pièce, commerciale par instinct.' },
  notes: { title: 'Journal · Essais de stratégie de marque', description: 'Essais de Not by Accident sur la stratégie de marque, le positionnement, le naming, le design et la croissance commerciale.' },
  trainings: { title: 'Ateliers de stratégie de marque', description: 'Ateliers de stratégie de marque et de direction de création par Not by Accident. Deux jours, en présentiel, douze personnes au plus. À partir de 2027.' },
  reports: { title: 'Rapports', description: 'Notes de terrain, benchmarks et recherches originales de Not by Accident. Bientôt.' },
  contact: { title: 'Contact · Lancer un projet de marque', description: 'Lancez un projet de marque, digital ou de croissance avec Not by Accident à Amsterdam. Une personne vous répond sous un jour ouvré.' },
  privacy: { title: 'Confidentialité', description: 'Comment Not by Accident collecte, utilise et protège vos données personnelles.' },
  cookies: { title: 'Politique de cookies', description: 'Comment Not by Accident utilise les cookies et technologies similaires sur ce site.' },
  '404': { title: 'Page introuvable', description: "Cette page n'existe pas." },
  lab: pageMetaEn.lab,
  'lab-how': pageMetaEn['lab-how'],
  'lab-readiness': pageMetaEn['lab-readiness'],
  'lab-app': pageMetaEn['lab-app'],
}
