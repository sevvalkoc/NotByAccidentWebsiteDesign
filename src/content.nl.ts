/* ── Nederlandse site-inhoud ──────────────────────────────────────────────
   Een statische vertaling van de Engelse seed in src/content.ts. Deze versie
   raakt Supabase of het admin-paneel nooit aan; alleen de Engelse site is via
   het CMS te bewerken. Paden, slugs, URL's en sectiesleutels blijven exact
   gelijk aan het Engels — de taalprefix wordt elders in de app gezet. */
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
  team,
} from '@/data.nl'

export const site: Site = {
  company,

  hero: {
    words: ['gewild', 'gekozen', 'onthouden', 'aanbevolen'],
    subhead:
      'Groei is wat daarna gebeurt. Wij werken aan merk, product en vraag — in één kamer, met één commercieel doel.',
    definition:
      'Not by Accident is een onafhankelijk creatief bedrijf dat merkdenken en commercieel denken samenbrengt. Strategie, identiteit, websites, digitale producten en de marketing die ze laat terugverdienen.',
    image:
      'https://images.unsplash.com/photo-1764096534662-a194a348c4a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1000',
    imageOffsetX: 0,
    imageOffsetY: 0,
    buttons: [
      { label: 'Start een project', url: '/contact' },
      { label: 'Bekijk het werk', url: '/work' },
    ],
  },

  homepage: {
    featuredEyebrow: 'Geselecteerd werk',
    featuredHeading: 'Het bewijs dat de merkbeslissing de commerciële beslissing was.',
    capabilitiesEyebrow: 'Wat we doen',
    capabilitiesHeading: 'Expertises. Eén manier van werken.',
    capabilitiesImage: '',
    notesEyebrow: 'Notities — een onafhankelijke uitgave',
    journalHeading: 'Hoe we denken, in het openbaar.',
    ctaEyebrow: 'Begin iets',
    ctaHeading: 'Vertel ons welk bedrijf je wilt worden.',
    ctaBody:
      'We werken met oprichters, marketingverantwoordelijken en creative directors die vermoeden dat hun bedrijf beter is dan zijn reputatie. Eerste antwoord binnen één werkdag — van een mens, niet van een formulier.',
    ctaButtonLabel: 'Start een project',
    ctaButtonUrl: '/contact',
    finalCtaImage: '',
  },

  homeSections: ['hero', 'capabilities', 'testimonials', 'clients', 'partners', 'notes', 'case_studies', 'final_cta'],

  studio: {
    eyebrow: 'Studio',
    heading: 'Wij maken bedrijven gewild.',
    subhead: 'Groei is wat daarna gebeurt. Gewild, met opzet.',
    body: 'Not by Accident is een onafhankelijk creatief bedrijf dat werkt aan merk, product en vraag. Merkdenken en commercieel denken zitten hier niet in aparte kamers.',
    principlesEyebrow: 'Hoe we denken',
    principles: [
      { title: 'Specifiek', body: 'Noem het materiaal, de maand, het getal, de straat. Een reeks mogelijkheden is geen beschrijving. Het is het ontwijken van een beschrijving.' },
      { title: 'Besloten', body: 'Presenteer beslissingen als beslissingen. Twee routes, nooit drie. Het advies komt eerst, niet als laatste. We worden betaald om een mening te hebben.' },
      { title: 'Warm, niet zacht', body: 'Mensen, handen, onvolkomenheid en humor. Het werk blijft scherp. Warmte en strengheid staan niet op gespannen voet. Zachtheid is beleefdheid ten koste van de waarheid.' },
      { title: 'Cultureel wakker', body: 'Referenties van buiten het vak, altijd gecrediteerd en nooit uitgelegd. We lenen niet van cultuur zonder te weten waarvan we geleend hebben.' },
      { title: 'Stilletjes grappig', body: 'Eén menselijk moment per uiting. In de laatste regel, nooit in de kop. Grappig omdat het waar is, niet omdat het zijn best doet.' },
      { title: 'Commercieel geletterd', body: 'Elke zachte eigenschap duikt één stap verderop op als een hard getal. Wij scheiden esthetische beslissingen niet van commerciële.' },
    ],
    cultureEyebrow: 'De cultuur',
    cultureHeading: 'Klein met opzet. Senior in de kamer. Commercieel uit instinct.',
    cultureItems: [
      { title: 'Eén kamer', body: 'Strategie, ontwerp en vraag zitten vanaf dag één bij elkaar — geen estafette, geen doorfluistervertelling tussen afdelingen.' },
      { title: 'Senior handen', body: 'De mensen die het werk binnenhalen, doen het werk. We blijven klein zodat de standaard verderop nooit verwatert.' },
      { title: 'Commercieel eerst', body: 'Elke beslissing is terug te voeren op een getal dat een opdrachtgever werkelijk kan bewegen. Schoonheid is de methode, niet het doel.' },
    ],
    ctaHeading: 'Wil je met ons werken? Laat je e-mailadres achter.',
  },

  contact: {
    eyebrow: 'Contact',
    heading: 'Schrijf ons.',
    subhead: 'We werken met oprichters en creatieve leiders die vermoeden dat hun bedrijf beter is dan zijn reputatie.',
    intro1: 'We werken niet met iedereen. We doen minder projecten dan de meesten, en elk project krijgt de aandacht die het vraagt.',
    intro2: 'Voordat je schrijft, is het goed te weten dat we doorgaans beginnen met een strategietraject. Zoek je een productiepartij of een uitvoerende partner, dan zijn wij waarschijnlijk niet de juiste keuze.',
  },

  reportsCopy: {
    eyebrow: 'Rapporten · Binnenkort',
    heading: 'Het onderzoek, in de openbaarheid.',
    subhead: 'We stellen een kleine bibliotheek met eigen rapporten samen — benchmarks, veldnotities en het rekenwerk dat we normaal voor onszelf houden. Eerlijke cijfers, helder beargumenteerd. Het is nog niet klaar, maar het scheelt niet veel meer.',
  },

  work: {
    eyebrow: 'Werk',
    heading: 'Een onafhankelijk register van wat we hebben gemaakt.',
    subhead: 'We doen minder projecten dan de meesten. Elk project krijgt de aandacht die het vraagt. Dit is het archief.',
  },

  caseStudiesCopy: {
    eyebrow: 'Case studies',
    heading: 'Werk, uitvoerig bekeken.',
    subhead: 'Elke case study is een volledig verslag van een project — het probleem, het denken en het resultaat. Geen highlights.',
  },

  capabilitiesCopy: {
    eyebrow: 'Expertises',
    headingSuffix: 'expertises, in de volgorde waarin een bedrijf ze werkelijk nodig heeft.',
    subhead: 'Vijf groepen — Merk & identiteit, Digitaal & product, Groei & vraag, Markt & expansie en Experiences. Neem er één, of de hele reeks. Elke groep heeft een eigen team, methode en pagina.',
  },

  privacyCopy: {
    eyebrow: 'Privacy',
    heading: 'Wat we bewaren, en waarom.',
    subhead: 'We verzamelen heel weinig en gaan er nuchter mee om. Deze verklaring legt precies uit hoe, in taal waarvoor je geen jurist nodig hebt.',
    lastUpdated: '8 augustus 2026',
    sections: [
      {
        title: 'Wie we zijn',
        body: 'Not by Accident is een onafhankelijk creatief bedrijf. Waar in deze verklaring “wij”, “ons” of “onze” staat, bedoelen we Not by Accident. Waar “je” of “jou” staat, bedoelen we iedereen die deze website bezoekt of met ons correspondeert. Onze volledige registratiegegevens worden hier toegevoegd voordat deze verklaring als definitief geldt.\n\nDeze verklaring legt uit wat we verzamelen, waarom we het verzamelen, en wat je ons kunt vragen ermee te doen. Ze is geschreven om gelezen te worden, niet om doorstaan te worden.',
      },
      {
        title: 'Wat we verzamelen',
        body: 'We verzamelen alleen wat een gesprek nodig heeft. Wanneer je ons schrijft via het contactformulier of per e-mail, bewaren we je naam, je bedrijf, je e-mailadres en wat je verder over je project vertelt. We houden dat bij zolang het gesprek loopt, en een redelijke periode daarna.\n\nWanneer je de site bezoekt, legt onze hostingpartij standaard technische gegevens vast — de opgevraagde pagina’s, de globale regio, de gebruikte browser. Dat is gewone serveractiviteit, geen toezicht.',
      },
      {
        title: 'Waarom we het bewaren',
        body: 'We gebruiken je gegevens voor één doel: je antwoorden en, waar dat aan de orde komt, het werk uitvoeren waar je ons om hebt gevraagd. We verkopen ze niet. We bouwen er geen advertentieprofielen mee. We verrijken ze niet met elders ingekochte data.\n\nOnze grondslag is ofwel je toestemming, gegeven op het moment dat je ons schrijft, ofwel ons gerechtvaardigd belang om een klein bedrijf goed te runnen.',
      },
      {
        title: 'Wie ze ziet',
        body: 'Je gegevens worden gezien door de mensen bij Not by Accident die ze moeten zien, en door een korte lijst dienstverleners die ons helpen draaien — e-mail, hosting en analytics. Elk van hen is aan eigen verplichtingen gebonden. We kiezen ze zorgvuldig en beoordelen ze opnieuw.',
      },
      {
        title: 'Je rechten',
        body: 'Je mag opvragen welke gegevens we over je bewaren, ze laten corrigeren of laten wissen. Je mag je toestemming op elk moment intrekken. Je mag ook een klacht indienen bij de toezichthouder voor gegevensbescherming, al horen we het liever eerst zelf, zodat we het kunnen rechtzetten.\n\nSchrijf voor al deze rechten naar hello@notbyaccident.com. We reageren binnen een maand, meestal eerder.',
      },
    ],
  },

  cookiesCopy: {
    eyebrow: 'Cookies',
    heading: 'Een korte notitie over cookies.',
    subhead: 'We gebruiken er een handvol, en alleen de nuttige soort. Geen advertentietrackers, geen profilering door derden, geen doorverkoop van aandacht.',
    rows: [
      { title: 'Noodzakelijk', body: 'Houdt de site werkend — onthoudt je cookiekeuze en beveiligt de verbinding. Niets om uit te zetten; zonder deze laadt er niets.', meta: 'Sessie – 12 maanden' },
      { title: 'Analytics', body: 'Eén privacyvriendelijke meting van welke pagina’s gelezen worden en ruwweg waar lezers vandaan komen. Geaggregeerd, nooit gekoppeld aan een naam.', meta: '12 maanden' },
      { title: 'Voorkeuren', body: 'Onthoudt kleine dingen die je liever niet twee keer gevraagd krijgt — of je bijvoorbeeld een melding hebt weggeklikt.', meta: '6 maanden' },
    ],
    managingHeading: 'Zelf beheren',
    managingBody: 'Elke browser laat je cookies bekijken, blokkeren of verwijderen via de instellingen. Blokkeer je de noodzakelijke, dan werken delen van de site niet meer; blokkeer je de rest, dan verandert er niets dat je zou opvallen.',
  },

  nav: [
    { to: '/work', label: 'Werk' },
    { to: '/notes', label: 'Notities' },
    { to: '/studio', label: 'Studio' },
    { to: '/trainings', label: 'Trainingen', soon: true },
    { to: '/reports', label: 'Rapporten', soon: true },
    { to: '/contact', label: 'Contact' },
  ],

  footerNav: [
    { to: '/work', label: 'Werk' },
    { to: '/case-studies', label: 'Case studies' },
    { to: '/capabilities', label: 'Expertises' },
    { to: '/studio', label: 'Studio' },
    { to: '/notes', label: 'De publicatie' },
    { to: '/trainings', label: 'Events & workshops' },
  ],

  socials: socials as Site['socials'],
  clients: clientLogos as Site['clients'],
  partners: partnerLogos as Site['partners'],

  seo: {
    description:
      'Not by Accident is een onafhankelijk creatief bedrijf in Amsterdam dat werkt aan merkstrategie, identiteit, digitale producten en vraag. Wij maken bedrijven gewild — groei is wat daarna gebeurt.',
    ogImage:
      'https://images.unsplash.com/photo-1764096534662-a194a348c4a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
  },

  trainings: {
    eyebrow: 'Trainingen — vanaf 2027',
    heading: 'Het werk onderwijzen, niet de theorie.',
    subhead:
      'Alles wat wij hebben geleerd over merkstrategie en creatieve directie, rechtstreeks overgedragen.',
    body1:
      'Twee workshops, beschikbaar in 2027. De eerste over merkstrategie — het echte werk van positioneren, benoemen en een briefing bouwen. De tweede over creatieve directie — hoe je dingen maakt die werkelijk anders én commercieel gezond zijn.',
    body2:
      'In persoon. Bewust klein. Amsterdam en één andere stad per jaar. Geen certificering. Geen slides die je nooit meer opent.',
    waitingListNote:
      'Laat je e-mailadres achter, dan schrijven we je als eerste zodra de inschrijving opent. Eén e-mail. Geen marketing.',
    format: [
      { label: 'Format', value: 'Workshop op locatie, twee dagen' },
      { label: 'Groepsgrootte', value: 'Maximaal twaalf deelnemers' },
      { label: 'Locatie', value: 'Amsterdam, één extra stad per jaar' },
      { label: 'Eerste datum', value: '2027 — datum volgt' },
      { label: 'Disciplines', value: 'Merkstrategie · Creatieve directie' },
    ],
  },

  testimonials: testimonials as Site['testimonials'],
  notes,
  projects,
  capabilities,
  team,
}
