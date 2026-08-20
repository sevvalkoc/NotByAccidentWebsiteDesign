/* ── Contenu du site en français ──────────────────────────────────────────
   Traduction statique : ce fichier ne parle jamais à Supabase ni au back-
   office. Il reprend exactement la forme de `Site` (src/content.ts) et
   s'appuie sur les données traduites de src/data.fr.ts.

   Les chemins (`to`, `url`), slugs, URL d'images, couleurs et clés de
   section restent identiques à la version anglaise : le préfixe de langue
   est ajouté ailleurs dans l'application. */
import type { Site } from '@/content'
import {
  notes,
  company,
  testimonials,
  socials,
  clientLogos,
  partnerLogos,
  projects,
  capabilities,
  categories,
  team,
} from '@/data.fr'

export const site: Site = {
  company,

  hero: {
    words: ['désirables', 'choisies', 'mémorables', 'recommandées'],
    subhead:
      "La croissance vient ensuite. Nous travaillons la marque, le produit et la demande — dans une même pièce, vers un même objectif commercial.",
    definition:
      "Not by Accident est une entreprise créative indépendante qui réunit pensée de marque et pensée commerciale. Stratégie, identité, sites web, produits numériques et le marketing qui les rend rentables.",
    image:
      'https://images.unsplash.com/photo-1764096534662-a194a348c4a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1000',
    imageOffsetX: 0,
    imageOffsetY: 0,
    buttons: [
      { label: 'Démarrer un projet', url: '/contact' },
      { label: 'Voir nos réalisations', url: '/work' },
    ],
  },

  homepage: {
    featuredEyebrow: 'Travaux sélectionnés',
    featuredHeading: "La preuve que la décision de marque était la décision commerciale.",
    capabilitiesEyebrow: 'Ce que nous faisons',
    capabilitiesHeading: "Nos expertises. Une seule façon de travailler.",
    capabilitiesImage: '',
    notesEyebrow: 'Notes — une publication indépendante',
    journalHeading: "Notre façon de penser, en public.",
    ctaEyebrow: 'Commencer quelque chose',
    ctaHeading: "Dites-nous l'entreprise que vous voulez devenir.",
    ctaBody:
      "Nous travaillons avec des fondateurs, des responsables marketing et des directeurs de création qui soupçonnent leur entreprise d'être meilleure que sa réputation. Première réponse sous un jour ouvré — d'une personne, pas d'un formulaire.",
    ctaButtonLabel: 'Démarrer un projet',
    ctaButtonUrl: '/contact',
    finalCtaImage: '',
  },

  homeSections: ['hero', 'capabilities', 'testimonials', 'clients', 'partners', 'notes', 'case_studies', 'final_cta'],

  studio: {
    eyebrow: 'Studio',
    heading: 'Nous rendons les entreprises désirables.',
    subhead: 'La croissance vient ensuite. Désirables, jamais par hasard.',
    body: "Not by Accident est une entreprise créative indépendante qui travaille la marque, le produit et la demande. Pensée de marque et pensée commerciale ne siègent pas dans deux pièces séparées.",
    openingImage: 'https://images.unsplash.com/photo-1649414744605-3bfa4f1870fc?w=720&h=900&fit=crop&auto=format',
    principlesEyebrow: 'Notre façon de penser',
    principles: [
      {
        title: 'Précis',
        body: "Nommer la matière, le mois, le chiffre, la rue. Un éventail de possibilités n'est pas une description. C'est une manière de s'en dispenser.",
      },
      {
        title: 'Décidé',
        body: "Présenter des décisions comme des décisions. Deux pistes, jamais trois. La recommandation vient en premier, pas en dernier. Nous sommes payés pour avoir un avis.",
      },
      {
        title: 'Chaleureux, pas mou',
        body: "Des gens, des mains, de l'imperfection et de l'humour. Le travail reste tranchant. Chaleur et rigueur ne s'opposent pas. La mollesse n'est que de la politesse payée par la vérité.",
      },
      {
        title: 'Éveillé à la culture',
        body: "Des références venues d'ailleurs que du design, toujours créditées et jamais expliquées. Nous n'empruntons pas à la culture sans savoir à qui nous empruntons.",
      },
      {
        title: 'Discrètement drôle',
        body: "Un moment humain par prise de parole. Dans la dernière ligne, jamais dans le titre. Drôle parce que c'est vrai, pas parce que ça cherche à l'être.",
      },
      {
        title: 'Commercialement lucide',
        body: "Chaque attribut immatériel réapparaît un cran plus loin sous la forme d'un chiffre. Nous ne séparons pas les décisions esthétiques des décisions commerciales.",
      },
    ],
    cultureEyebrow: 'La culture',
    cultureHeading: "Petits volontairement. Seniors dans la pièce. Commerciaux d'instinct.",
    cultureItems: [
      {
        title: 'Une seule pièce',
        body: "Stratégie, design et demande travaillent ensemble dès le premier jour — pas de course de relais, pas de téléphone arabe entre services.",
      },
      {
        title: 'Des mains seniors',
        body: "Les personnes qui gagnent le projet sont celles qui le font. Nous restons petits pour que le niveau ne se dilue jamais en aval.",
      },
      {
        title: "Le commerce d'abord",
        body: "Chaque décision remonte à un chiffre que le client peut réellement faire bouger. La beauté est la méthode, pas l'objectif.",
      },
    ],
    ctaHeading: "Si vous souhaitez travailler avec nous, laissez-nous votre e-mail.",
  },

  contact: {
    eyebrow: 'Contact',
    heading: 'Écrivez-nous.',
    subhead: "Nous travaillons avec des fondateurs et des responsables créatifs qui soupçonnent leur entreprise d'être meilleure que sa réputation.",
    intro1: "Nous ne travaillons pas avec tout le monde. Nous prenons moins de projets que la plupart, et chacun reçoit l'attention qu'il exige.",
    intro2: "Avant de nous écrire, il est utile de savoir que nous commençons en général par une mission de stratégie. Si vous cherchez une société de production ou un partenaire d'exécution, nous ne sommes probablement pas les bons interlocuteurs.",
  },

  reportsCopy: {
    eyebrow: 'Rapports · Bientôt',
    heading: 'La recherche, à découvert.',
    subhead: "Nous réunissons une petite bibliothèque de rapports originaux — repères de marché, notes de terrain et les calculs que nous gardons d'habitude pour nous. Des chiffres honnêtes, argumentés simplement. Ce n'est pas encore prêt, mais nous y sommes presque.",
  },

  work: {
    eyebrow: 'Réalisations',
    heading: "Un relevé indépendant de ce que nous avons fait.",
    subhead: "Nous prenons moins de projets que la plupart. Chacun reçoit l'attention qu'il exige. Voici les archives.",
  },

  caseStudiesCopy: {
    eyebrow: 'Études de cas',
    heading: 'Le travail examiné en détail.',
    subhead: "Chaque étude de cas est le récit complet d'un projet — le problème, la réflexion et le résultat. Pas un montage des meilleurs moments.",
  },

  capabilitiesCopy: {
    eyebrow: 'Expertises',
    headingSuffix: "domaines d'expertise, dans l'ordre où une entreprise en a réellement besoin.",
    subhead: "Cinq familles — Marque et identité, Digital et produit, Croissance et demande, Marché et expansion, et Expériences. Prenez-en une, ou toute la séquence. Chacune a son équipe, sa méthode et sa page.",
  },

  privacyCopy: {
    eyebrow: 'Confidentialité',
    heading: 'Ce que nous conservons, et pourquoi.',
    subhead: "Nous collectons très peu de choses et nous les traitons simplement. Cette notice explique exactement comment, dans une langue qui ne devrait pas exiger un avocat.",
    headerImage: 'https://images.unsplash.com/photo-1755375551130-cf278d391d99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=640',
    lastUpdated: '8 août 2026',
    sections: [
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

  cookiesCopy: {
    eyebrow: 'Cookies',
    heading: 'Une courte note sur les cookies.',
    subhead: "Nous en utilisons une poignée, et seulement les utiles. Pas de traceurs publicitaires, pas de profilage tiers, pas de revente de votre attention.",
    rows: [
      {
        title: 'Essentiels',
        body: "Ils font fonctionner le site — ils retiennent votre choix en matière de cookies et sécurisent la connexion. Rien à refuser : sans eux, rien ne s'affiche.",
        meta: 'Session – 12 mois',
      },
      {
        title: "Mesure d'audience",
        body: "Une mesure unique et respectueuse de la vie privée : quelles pages sont lues et, grossièrement, d'où viennent les lecteurs. Agrégée, jamais rattachée à un nom.",
        meta: '12 mois',
      },
      {
        title: 'Préférences',
        body: "Ils retiennent les petites choses que vous préféreriez ne pas avoir à nous redire — par exemple si vous avez déjà fermé un bandeau.",
        meta: '6 mois',
      },
    ],
    managingHeading: 'Les gérer vous-même',
    managingBody: "Tous les navigateurs permettent de consulter, bloquer ou supprimer les cookies depuis leurs réglages. Bloquer les cookies essentiels empêchera certaines parties du site de fonctionner ; bloquer les autres ne changera rien que vous puissiez remarquer.",
  },

  nav: [
    { to: '/work', label: 'Réalisations' },
    { to: '/notes', label: 'Notes' },
    { to: '/studio', label: 'Studio' },
    { to: '/trainings', label: 'Formations', soon: true },
    { to: '/reports', label: 'Rapports', soon: true },
    { to: '/contact', label: 'Contact' },
  ],

  footerNav: [
    { to: '/work', label: 'Réalisations' },
    { to: '/case-studies', label: 'Études de cas' },
    { to: '/capabilities', label: 'Expertises' },
    { to: '/studio', label: 'Studio' },
    { to: '/notes', label: 'Le journal' },
    { to: '/trainings', label: 'Événements et ateliers' },
  ],

  socials: socials as Site['socials'],
  clients: clientLogos as Site['clients'],
  partners: partnerLogos as Site['partners'],

  seo: {
    description:
      "Not by Accident est une entreprise créative indépendante basée à Amsterdam, active en stratégie de marque, identité, produits numériques et demande. Nous rendons les entreprises désirables — la croissance vient ensuite.",
    ogImage:
      'https://images.unsplash.com/photo-1764096534662-a194a348c4a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
  },

  trainings: {
    eyebrow: 'Formations — ouverture en 2027',
    heading: "Enseigner le métier, pas la théorie.",
    subhead:
      "Tout ce que nous avons appris en stratégie de marque et en direction de création, transmis directement.",
    body1:
      "Deux ateliers, disponibles en 2027. Le premier sur la stratégie de marque — le vrai travail du positionnement, du naming et de la construction d'un brief. Le second sur la direction de création — comment faire des choses réellement différentes et commercialement solides.",
    body2:
      "En présentiel. Volontairement restreint. Amsterdam et une autre ville par an. Aucune certification. Aucune diapositive que vous ne rouvrirez jamais.",
    waitingListNote:
      "Laissez votre adresse e-mail et nous vous écrirons en premier à l'ouverture des inscriptions. Un seul e-mail. Aucun marketing.",
    format: [
      { label: 'Format', value: 'Atelier en présentiel, deux jours' },
      { label: 'Taille du groupe', value: 'Douze participants au maximum' },
      { label: 'Lieu', value: 'Amsterdam, et une autre ville par an' },
      { label: 'Première session', value: '2027 — date à confirmer' },
      { label: 'Disciplines', value: 'Stratégie de marque · Direction de création' },
    ],
  },

  testimonials: testimonials as Site['testimonials'],
  notes,
  projects,
  capabilities,
  categories,
  team,
}
