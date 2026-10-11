/* Nederlands. Statische vertaling van sections.en.ts (alleen Engels is via
   het CMS te bewerken, net als op de vorige site). Juridische teksten
   letterlijk van de vorige site. */
import type { PageMeta, PageSections, PageSlug } from './types'
import { sectionsEn, pageMetaEn } from './sections.en'

const img = (page: PageSlug, key: string) => sectionsEn[page][key]?.image ?? null

export const sectionsNl: Record<PageSlug, PageSections> = {
  home: {
    hero: {
      eyebrow: 'Merkstrategie & creatieve studio · Amsterdam',
      title: 'Wij maken bedrijven *gewild*.',
      subtitle: 'Een onafhankelijk brandingbureau voor oprichters die willen dat het merk verkoopt. Strategie, identiteit, digitaal en vraag, gemaakt door één senior team.',
      ctaLabel: 'Begin een project',
      ctaUrl: '/contact',
      extra: { cta2Label: 'Bekijk het werk', cta2Url: '#work', words: ['gekozen', 'onthouden', 'aanbevolen'] },
      image: img('home', 'hero'),
    },
    work: { ...sectionsEn.home.work, eyebrow: 'Geselecteerd werk', title: 'Merken die de cijfers erachter in beweging zetten.', ctaLabel: 'Het hele archief' },
    practice: {
      eyebrow: 'Expertises',
      title: 'Vijf praktijken. Eén team. Geen overdrachten.',
      ctaLabel: 'Alle expertises',
      ctaUrl: '/capabilities',
      extra: {
        areas: [
          { key: 'Brand & Identity', label: 'Merk & identiteit', text: 'Positionering, naamgeving en identiteit die mensen een reden geven om voor jou te kiezen.' },
          { key: 'Digital & Product', label: 'Digitaal & product', text: 'Websites, e-commerce en producten waar aandacht een beslissing wordt.' },
          { key: 'Growth & Demand', label: 'Groei & vraag', text: 'SEO, content en performance marketing waardoor een merk gezocht wordt, niet alleen gezien.' },
          { key: 'Market & Expansion', label: 'Markt & expansie', text: 'Onderzoek en go-to-market voor de volgende markt, voordat het budget op is.' },
          { key: 'Experiences', label: 'Ervaringen', text: 'Evenementen, exposities en workshops waar mensen het merk in het echt ontmoeten.' },
        ],
      },
    },
    evidence: { eyebrow: 'In hun woorden', extra: sectionsEn.home.evidence.extra },
    studio: {
      eyebrow: 'De studio',
      title: 'Klein met opzet. Senior aan tafel. Commercieel van *instinct*.',
      body: 'We begonnen aan de groeikant van de tafel, dus elk stuk merkwerk hier moet zichzelf terugverdienen.',
      ctaLabel: 'Binnen in de studio',
      ctaUrl: '/studio',
      image: img('home', 'studio'),
    },
    notes: { eyebrow: 'Journaal', title: 'Notities over merk, strategie en groei.', ctaLabel: 'Lees het journaal', ctaUrl: '/notes', extra: { notes: [] } },
    contact: {
      eyebrow: 'Nieuwe opdrachten',
      title: 'Vertel ons welk bedrijf je wilt *worden*.',
      body: 'Een mens antwoordt binnen één werkdag. Nooit een bot, nooit een verkoopscript.',
      ctaLabel: 'Begin een project',
      ctaUrl: '/contact',
    },
  },

  global: {
    footer: {
      title: 'Gewild, met opzet.',
      body: 'Het journaal per e-mail. Alleen essays, een paar keer per jaar.',
      extra: { lastLine: 'Gemaakt in Amsterdam. Niets hier is toeval, behalve', lastLink: 'dit' },
    },
    announcement: { title: '' },
    header_nav: {
      items: [
        { title: 'Werk', body: '/work' },
        { title: 'Expertises', body: '/capabilities' },
        { title: 'Studio', body: '/studio' },
        { title: 'Notities', body: '/notes' },
      ],
    },
    footer_nav: {
      items: [
        { title: 'Werk', body: '/work' },
        { title: 'Cases', body: '/case-studies' },
        { title: 'Expertises', body: '/capabilities' },
        { title: 'Studio', body: '/studio' },
        { title: 'Notities', body: '/notes' },
        { title: 'Trainingen', body: '/trainings' },
        { title: 'Rapporten', body: '/reports' },
        { title: 'Contact', body: '/contact' },
      ],
    },
  },

  work: { header: { eyebrow: 'Werk', title: 'Merk-, digitaal en groei*werk*.', subtitle: 'We nemen minder projecten aan dan de meeste bureaus, dus elk project krijgt senior aandacht, van de eerste briefing tot het laatste getal.' } },
  'case-studies': { header: { eyebrow: 'Cases', title: 'Hoe het werk *werkte*.', subtitle: 'Elke case volgt dezelfde lijn: het probleem, het inzicht, de beslissing en wat het met het bedrijf deed.' } },
  capabilities: {
    header: {
      eyebrow: 'Expertises',
      title: 'Alles wat een merk nodig heeft om *gewild* te zijn.',
      subtitle: 'Merkstrategie, identiteit, digitaal, groei en expansie, in vijf praktijken. Neem er één, of de hele reeks. Elke discipline heeft een eigen pagina.',
    },
    cta: { title: 'Weet je niet waar je moet beginnen? De meeste klanten weten het eerst ook niet. Dat uitzoeken is ons eerste gesprek.', ctaLabel: 'Praat met ons', ctaUrl: '/contact' },
  },
  studio: {
    header: {
      eyebrow: 'Studio',
      title: 'Klein met opzet. Senior aan tafel. Commercieel van *instinct*.',
      body: 'Not by Accident is een onafhankelijke studio voor merkstrategie en creatie in Amsterdam, actief in merk, digitaal product en vraag. We begonnen aan de groeikant, en daarom hebben het creatieve werk en de commerciële zaak hier nooit in aparte kamers gezeten.',
      image: img('studio', 'header'),
    },
    principles: {
      title: 'Hoe we denken',
      items: [
        { title: 'Specifiek', body: 'Noem het materiaal, de maand, het getal, de straat. “Een reeks” is geen beschrijving.' },
        { title: 'Beslist', body: 'Twee routes, nooit drie. De aanbeveling komt eerst. We worden betaald om een mening te hebben.' },
        { title: 'Warm, niet zacht', body: 'Mensen, handen, imperfectie, humor. Het werk blijft scherp.' },
        { title: 'Cultureel wakker', body: 'Referenties van buiten design. Altijd vermeld, nooit uitgelegd.' },
        { title: 'Stil grappig', body: 'Eén menselijk moment per communicatie. In de laatste regel, nooit in de kop.' },
        { title: 'Commercieel geletterd', body: 'Elke zachte eigenschap verschijnt één stap verderop als een hard getal.' },
      ],
    },
    culture: {
      title: 'De cultuur',
      items: [
        { title: 'Eén kamer', body: 'Strategie, ontwerp en vraag zitten vanaf dag één samen.' },
        { title: 'Senior handen', body: 'Wie het werk binnenhaalt, doet het werk.' },
        { title: 'Commercieel eerst', body: 'Elke beslissing leidt terug naar een getal dat een klant kan bewegen.' },
      ],
    },
    locations: { title: 'Waar', items: [{ title: 'Amsterdam', body: 'Maandag–donderdag, 10:00–17:00 CET' }] },
    signup: { title: 'Nog niet het juiste moment? Laat je e-mailadres achter en blijf dichtbij.' },
  },
  notes: { header: { eyebrow: 'Journaal', title: 'Notities', subtitle: 'Essays over merkstrategie, positionering, naamgeving en groei. Een onafhankelijke blik, gepubliceerd als er iets te zeggen valt.' } },
  trainings: {
    header: { eyebrow: 'Workshops · Vanaf 2027', title: 'Het werk, geleerd van wie het doet.', subtitle: 'Tweedaagse workshops merkstrategie en creatieve regie, op locatie, voor maximaal twaalf mensen.' },
    body: {
      items: [
        { title: '', body: 'Twee workshops vanaf 2027. Eén over merkstrategie: positionering, naamgeving, een briefing bouwen. Eén over creatieve regie: werk maken dat anders is en commercieel klopt.' },
        { title: '', body: 'Op locatie en bewust klein. Amsterdam, plus één andere stad per jaar. Geen certificaat. Geen slides die je nooit meer opent.' },
      ],
    },
    format: {
      title: 'Opzet',
      items: [
        { title: 'Vorm', body: 'Workshop op locatie, twee dagen' },
        { title: 'Groepsgrootte', body: 'Maximaal twaalf deelnemers' },
        { title: 'Locatie', body: 'Amsterdam, plus één stad per jaar' },
        { title: 'Eerste datum', body: '2027, nog te bevestigen' },
        { title: 'Disciplines', body: 'Merkstrategie · Creatieve regie' },
      ],
    },
    waiting: { title: 'Wachtlijst', body: 'We schrijven je als eerste zodra de inschrijving opent. Eén e-mail, geen marketing.', ctaLabel: 'Zet me op de lijst' },
  },
  reports: {
    header: {
      eyebrow: 'Rapporten · Binnenkort',
      title: 'Het onderzoek, openlijk.',
      subtitle: 'Benchmarks, veldnotities en de getallen die bureaus meestal voor zichzelf houden, helder beargumenteerd. Het eerste rapport is dichtbij.',
    },
    notify: { title: 'Laat het me weten', body: 'Eén e-mail bij de lancering. Verder niets.', ctaLabel: 'Laat het me weten' },
  },
  contact: {
    header: {
      eyebrow: 'Contact',
      title: 'Begin een *project*.',
      subtitle: 'Voor oprichters en marketingleiders die vermoeden dat hun bedrijf beter is dan zijn reputatie.',
      body: 'We nemen minder projecten aan dan de meesten en beginnen meestal met een strategietraject. Zoek je een productiebedrijf of een uitvoerende partner, dan zijn we waarschijnlijk niet de juiste keuze.',
    },
    form: { title: 'Of vertel het hier', body: 'Meestal binnen één werkdag.' },
  },
  privacy: {
    header: {
      eyebrow: 'Privacy',
      title: 'Wat we bewaren, en waarom.',
      subtitle: 'We verzamelen heel weinig en gaan er nuchter mee om. Deze verklaring legt precies uit hoe, in taal waarvoor je geen jurist nodig hebt.',
      extra: { lastUpdated: '8 augustus 2026' },
    },
    legal: {
      items: [
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
  },
  cookies: {
    header: {
      eyebrow: 'Cookies',
      title: 'Een korte notitie over cookies.',
      subtitle: 'We gebruiken er een handvol, en alleen de nuttige soort. Geen advertentietrackers, geen profilering door derden, geen doorverkoop van aandacht.',
    },
    table: {
      items: [
        { title: 'Noodzakelijk', body: 'Houdt de site werkend — onthoudt je cookiekeuze en beveiligt de verbinding. Niets om uit te zetten; zonder deze laadt er niets.', meta: 'Sessie – 12 maanden' },
        { title: 'Analytics', body: 'Eén privacyvriendelijke meting van welke pagina’s gelezen worden en ruwweg waar lezers vandaan komen. Geaggregeerd, nooit gekoppeld aan een naam.', meta: '12 maanden' },
        { title: 'Voorkeuren', body: 'Onthoudt kleine dingen die je liever niet twee keer gevraagd krijgt — of je bijvoorbeeld een melding hebt weggeklikt.', meta: '6 maanden' },
      ],
    },
    managing: {
      title: 'Zelf beheren',
      body: 'Elke browser laat je cookies bekijken, blokkeren of verwijderen via de instellingen. Blokkeer je de noodzakelijke, dan werken delen van de site niet meer; blokkeer je de rest, dan verandert er niets dat je zou opvallen.',
    },
  },
  '404': { header: { eyebrow: 'Fout 404', title: 'Deze pagina is een ongeluk.', body: 'Al het andere hier is met opzet gemaakt. De link is misschien kapot, of de pagina is verhuisd.' } },
  // The Lab is English-only in V1.
  lab: sectionsEn.lab,
  'lab-how': sectionsEn['lab-how'],
  'lab-readiness': sectionsEn['lab-readiness'],
  'lab-app': sectionsEn['lab-app'],
}

export const pageMetaNl: Record<PageSlug, PageMeta> = {
  home: {
    title: 'Not by Accident · Brandingbureau & creatieve studio, Amsterdam',
    description: 'Onafhankelijk brandingbureau in Amsterdam. Merkstrategie, identiteit, websites en groeimarketing die bedrijven gewild, gekozen en onthouden maken.',
  },
  global: { title: 'Not by Accident', description: '' },
  work: { title: 'Werk · Merk-, digitale en groeiprojecten', description: 'Geselecteerde projecten van Not by Accident: merkstrategie, identiteit, websites en groeicampagnes voor oprichters die willen dat het merk verkoopt.' },
  'case-studies': { title: 'Cases · Resultaten van branding', description: 'Cases van Not by Accident: het probleem, het denkwerk en het commerciële resultaat van merk-, identiteits- en groeiwerk.' },
  capabilities: { title: 'Expertises · Branding, digitaal & groei', description: 'Expertises in vijf praktijken: merkstrategie, identiteit, websiteontwerp, SEO, performance marketing, marktonderzoek, evenementen en meer.' },
  studio: { title: 'Studio · Onafhankelijk creatief bedrijf, Amsterdam', description: 'Not by Accident is een onafhankelijk creatief bedrijf in Amsterdam. Klein met opzet, senior aan tafel, commercieel van instinct.' },
  notes: { title: 'Journaal · Essays over merkstrategie', description: 'Essays en notities van Not by Accident over merkstrategie, positionering, naamgeving, ontwerp en commerciële groei.' },
  trainings: { title: 'Workshops merkstrategie', description: 'Workshops merkstrategie en creatieve regie van Not by Accident. Twee dagen, op locatie, maximaal twaalf mensen. Vanaf 2027.' },
  reports: { title: 'Rapporten', description: 'Veldnotities, benchmarks en eigen onderzoek van Not by Accident. Binnenkort.' },
  contact: { title: 'Contact · Begin een merkproject', description: 'Begin een merk-, digitaal of groeiproject met Not by Accident in Amsterdam. Vertel ons welk bedrijf je wilt worden. Een mens antwoordt binnen één werkdag.' },
  privacy: { title: 'Privacyverklaring', description: 'Hoe Not by Accident je persoonsgegevens verzamelt, gebruikt en beschermt.' },
  cookies: { title: 'Cookiebeleid', description: 'Hoe Not by Accident cookies en vergelijkbare technieken op deze website gebruikt.' },
  '404': { title: 'Pagina niet gevonden', description: 'Deze pagina bestaat niet.' },
  lab: pageMetaEn.lab,
  'lab-how': pageMetaEn['lab-how'],
  'lab-readiness': pageMetaEn['lab-readiness'],
  'lab-app': pageMetaEn['lab-app'],
}
