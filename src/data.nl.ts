/* ── Nederlandse vertaling van src/data.ts ────────────────────────────────
   Zelfde vorm, zelfde sleutels, zelfde slugs. Alleen de tekst is Nederlands.
   Slugs, ids, afbeeldingen, kleuren en categoriesleutels blijven ongewijzigd,
   omdat routing en filtering eraan hangen. */
import type {
  Project,
  Category,
  Capability,
  Note,
  TeamMember,
} from '@/data'

export const projects: Project[] = [
  {
    id: '1',
    num: '01',
    name: 'Lavanta',
    discipline: 'Identiteit · Product · Vraag',
    year: '2024',
    location: 'Londen',
    brief: 'Een sieradenmerk dat wel bewonderd werd, maar niet gekocht.',
    narrative: {
      problem: 'Lavanta kwam na drie jaar bij ons met een helder probleem: sterk product, sterke schare volgers, zwakke verkoop.',
      insight: 'Het merk werd bewonderd, niet gekocht — geprijsd als betaalbare luxe terwijl het al gedragen werd als een erfstuk. Het gat zat nooit in het product. Het zat in het verhaal dat mensen geen toestemming hadden om te vertellen over het bezit ervan.',
      intervention: 'We hebben het merk geherpositioneerd rond het idee van een erfstuk tegen een eigentijdse prijs — geen betaalbare luxe, maar het laatste stuk in een categorie van één — en identiteit, product en vraagsysteem opnieuw rond dat ene idee gebouwd.',
      outcome: '+34% conversie in zes maanden, en een wachtlijst voor de nieuwe collectie.',
    },
    services: ['Merkstrategie', 'Creatieve directie', 'SEO', 'Groeistrategie'],
    relatedCapabilities: ['brand-strategy', 'creative-direction', 'seo', 'growth-strategy'],
    img: 'https://images.unsplash.com/photo-1675773051474-55c4b7d2cf53?w=1200&h=800&fit=crop&auto=format',
    heroImg: 'https://images.unsplash.com/photo-1675773051474-55c4b7d2cf53?w=1600&h=1000&fit=crop&auto=format',
    result: '+34% conversie in zes maanden, en een wachtlijst.',
    slug: 'lavanta',
    featured: true,
  },
  {
    id: '2',
    num: '02',
    name: 'Studio Marché',
    discipline: 'Positionering · Vraag',
    year: '2025',
    location: 'Parijs',
    brief: 'Een markt die moest aanvoelen alsof ze bij haar eigen buurt hoorde.',
    narrative: {
      problem: 'Studio Marché draaide al vier jaar zonder ooit de vraag te hebben beantwoord die succesvolle markten nooit stellen: wat zijn we precies?',
      insight: 'Niet de standhouders, niet het bezoekersaantal — de markt zelf was het merk, en niemand had haar ooit als één ding benoemd. Elke kraam had een eigen identiteit. De markt had er geen.',
      intervention: 'We bepaalden een positie die de markt zelf tot merk maakte in plaats van de optelsom van wat er verkocht werd, en bouwden daarna het creatieve systeem en de campagne waarin elke standhouder paste zonder zijn eigen stem te verliezen.',
      outcome: '22% meer bezoekers, en een markt die eindelijk als één plek leest.',
    },
    services: ['Merkstrategie', 'Merkpositionering', 'Creatieve directie', 'Campagnestrategie'],
    relatedCapabilities: ['brand-strategy', 'brand-positioning', 'creative-direction', 'campaign-strategy'],
    img: 'https://images.unsplash.com/photo-1759050486852-fdfe2fdc7bea?w=1200&h=800&fit=crop&auto=format',
    heroImg: 'https://images.unsplash.com/photo-1759050486852-fdfe2fdc7bea?w=1600&h=1000&fit=crop&auto=format',
    result: '22% meer bezoekers, en een markt die eindelijk als één plek leest.',
    slug: 'studio-marche',
    featured: false,
  },
  {
    id: '3',
    num: '03',
    name: 'Edde',
    discipline: 'Identiteit · Digitaal',
    year: '2025',
    location: 'Berlijn',
    brief: 'Een huidverzorgingsmerk gebouwd om samen met zijn klanten ouder te worden.',
    narrative: {
      problem: 'De meeste huidverzorgingsmerken zijn bang voor ouder worden en bouwen hun hele identiteit rond het terugdraaien ervan. De klanten van Edde waren er niet bang voor, en het merk liet dat nog niet zien.',
      insight: 'Zichtbare tijd was voor dit publiek niets om voor weg te lopen. Het was een referentie — het bewijs van een leven dat het product moest ondersteunen, niet corrigeren.',
      intervention: 'We bouwden een identiteit en een digitaal systeem die ouder worden behandelden als iets om te begrijpen in plaats van terug te draaien, van de taal op de verpakking tot de woorden op de productpagina.',
      outcome: '41% meer herhaalaankopen onder klanten boven de vijftig.',
    },
    services: ['Visuele identiteit', 'Verbale identiteit', 'Webdesign & development', 'UX/UI-design'],
    relatedCapabilities: ['brand-identity', 'verbal-identity', 'web-design-development', 'ux-ui-design'],
    img: 'https://images.unsplash.com/photo-1617050318658-a9a3175e34cb?w=1200&h=800&fit=crop&auto=format',
    heroImg: 'https://images.unsplash.com/photo-1617050318658-a9a3175e34cb?w=1600&h=1000&fit=crop&auto=format',
    result: '41% meer herhaalaankopen onder klanten boven de vijftig.',
    slug: 'edde',
    featured: false,
  },
  {
    id: '4',
    num: '04',
    name: 'Hinterland',
    discipline: 'Identiteit · Campagnes',
    year: '2025',
    location: 'Melbourne',
    brief: 'Een horecagroep die in drie steden tegelijk iets moest betekenen.',
    narrative: {
      problem: 'Hinterland exploiteerde twaalf zaken in drie steden. Naar de meeste maatstaven succesvol, en als één merk volstrekt onherkenbaar.',
      insight: 'Het probleem was geen gebrek aan smaak — elke zaak zag er op zichzelf doordacht uit. Het was de afwezigheid van een systeem waardoor ze herkenbaar één bedrijf konden zijn zonder identiek te worden.',
      intervention: 'We bouwden een merkarchitectuur en een identiteitssysteem die konden meebewegen over formats heen — restaurant, bar, eventlocatie — en toch onmiskenbaar hetzelfde bedrijf bleven, en rolden dat uit over alle twaalf zaken.',
      outcome: 'Eén merk over twaalf zaken en drie steden, zonder verwarring.',
    },
    services: ['Merkstrategie', 'Merkarchitectuur', 'Creatieve directie', 'Campagnestrategie'],
    relatedCapabilities: ['brand-strategy', 'brand-architecture', 'creative-direction', 'campaign-strategy'],
    img: 'https://images.unsplash.com/photo-1771440047944-0b5d792213a9?w=1200&h=800&fit=crop&auto=format',
    heroImg: 'https://images.unsplash.com/photo-1771440047944-0b5d792213a9?w=1600&h=1000&fit=crop&auto=format',
    result: 'Eén merk over twaalf zaken en drie steden, zonder verwarring.',
    slug: 'hinterland',
    featured: false,
  },
  {
    id: '5',
    num: '05',
    name: 'Unnamed Project',
    discipline: 'Positionering',
    year: '2026',
    location: 'Niet bekendgemaakt',
    brief: 'Loopt nog. Meer zodra het kan.',
    narrative: null,
    services: ['Merkstrategie'],
    relatedCapabilities: ['brand-strategy'],
    img: 'https://images.unsplash.com/photo-1771440048218-68069773fa81?w=1200&h=800&fit=crop&auto=format',
    heroImg: 'https://images.unsplash.com/photo-1771440048218-68069773fa81?w=1600&h=1000&fit=crop&auto=format',
    result: 'Loopt nog. Meer zodra het kan.',
    slug: 'unnamed-2026',
    featured: false,
  },
]

export const notes: Note[] = [
  {
    id: '1',
    title: 'De briefing is nooit de briefing',
    subtitle: 'Waarom het document dat een creatief bedrijf aan het begin van een project krijgt vrijwel altijd het symptoom beschrijft, en niet het probleem.',
    body: `Er bestaat een document dat aan het begin van elk merkproject opduikt. Meestal twaalf pagina's lang. Met een hoofdstuk 'Achtergrond', een hoofdstuk 'Doelstellingen' en een hoofdstuk 'De uitdaging'. Het heet een briefing.

Zelden is het er een.

Wat de meeste opdrachtgevers bij aanvang overhandigen, is een beschrijving van het gevolg van een probleem dat ze nog niet benoemd hebben. De briefing zegt: onze conversie is laag. Hij zegt: mensen begrijpen niet wat we verkopen. Hij zegt: we voelen premium, maar onze prijs laat dat niet zien.

Dat zijn symptomen. De briefing is een lijst met symptomen. Het werkelijke probleem — dat ene dat, opgelost, alle symptomen laat verdwijnen — staat er nooit in, omdat de opdrachtgever niet weet wat het is. Wist hij het wel, dan was het al verholpen.

Dat is geen verwijt. Het is de aard van het werk. Een briefing bestaat om een gesprek te openen, niet om het antwoord vast te leggen.

Een creatief bedrijf dat een briefing letterlijk neemt, bouwt meestal het verkeerde. Niet omdat de opdrachtgever ongelijk heeft, maar omdat hij de vorm van zijn eigen probleem niet kan zien. Daar betaalt hij nu juist voor.

De eerste taak van elk strategietraject is de briefing vertalen naar de echte vraag. Dat is lastiger dan het klinkt en duurt langer dan de meesten verwachten. En het wordt vrijwel nooit gewaardeerd tot het gedaan is.`,
    date: '3 juli 2026',
    category: 'Essay',
    readTime: '8 min leestijd',
    img: 'https://images.unsplash.com/photo-1661178081018-d1b8e685ef10?w=1200&h=800&fit=crop&auto=format',
    slug: 'the-brief-is-never-the-brief',
  },
  {
    id: '2',
    title: 'Wat verpakking werkelijk doet',
    subtitle: 'Een notitie over het verschil tussen verpakking die er duur uitziet en verpakking die een product meer waard maakt.',
    body: `Verpakking heeft een taak. De meeste verpakking is vergeten welke.

Die taak is niet: er duur uitzien. Iets dat er duur uitziet, doet zichtbaar zijn best. De taak is om iemand op het moment dat hij het vasthoudt te laten voelen dat de prijs klopte. Sterker nog: dat de prijs aan de voorzichtige kant was.

Dat is aanzienlijk moeilijker, want het vraagt van de verpakking dat ze iets waars over het product communiceert in plaats van iets wenselijks over het merk. En de meeste merken kennen geen enkele waarheid over hun product die het communiceren waard is. Ze kennen hun categorie. Ze kennen hun USP. Ze weten niet wat hun product werkelijk onderscheidt van het ding ernaast in het schap.

Goede verpakking is de visuele vertaling van productwaarheid. Is die waarheid sterk, dan mag de verpakking minimaal zijn. Is ze zwak, dan redt geen preeglaag of kartondikte het nog.`,
    date: '18 juni 2026',
    category: 'Notities',
    readTime: '5 min leestijd',
    img: 'https://images.unsplash.com/photo-1636014724389-270c4e9c0100?w=1200&h=800&fit=crop&auto=format',
    slug: 'what-packaging-actually-does',
  },
  {
    id: '3',
    title: 'Naming is geen creatieve oefening',
    subtitle: 'Over het misverstand dat een goede merknaam voortkomt uit een lange lijst en een stemronde.',
    body: `Elk namingproject begint hetzelfde. De opdrachtgever wil een lijst. Hoe langer, hoe beter. Hij gelooft dat ergens tussen vierhonderd namen de juiste zit verstopt.

Dat is niet zo.

Een merknaam is een weddenschap op een set waarden die nog niet in de markt bestaat. Hij beschrijft het bedrijf niet. Hij legt niet uit wat het bedrijf verkoopt. Hij is het begin van een reputatie, wat wil zeggen dat hij pas iets betekent nadat jaren werk hem iets hebben laten betekenen.

In de praktijk komt dat hierop neer: de naam doet zelden zoveel ertoe als de opdrachtgever denkt, en het proces eromheen bijna altijd meer. Een namingproces waarin iedereen in de kamer het eens moet worden, is een proces dat ontworpen is om een middelmatige uitkomst op te leveren waaraan niemand zich stoort.

De beste namen komen voort uit een besluit, niet uit een consensus.`,
    date: '2 mei 2026',
    category: 'Essay',
    readTime: '6 min leestijd',
    img: 'https://images.unsplash.com/photo-1483366774565-c783b9f70e2c?w=1200&h=800&fit=crop&auto=format',
    slug: 'naming-is-not-a-creative-exercise',
  },
  {
    id: '4',
    title: 'Waarom groei een merkprobleem is',
    subtitle: 'Het punt waarop vraagcreatie en merkstrategie dezelfde discipline worden.',
    body: `Er bestaat een versie van marketing waarin merk en vraag twee aparte budgetten zijn met twee aparte doelen. Merk is wat je aan bekendheid uitgeeft. Vraag is wat je aan conversie uitgeeft. De twee teams zien elkaar maandelijks en zijn het oneens over attributie.

Die scheiding was ergens logisch toen media duur waren en merken bouwen jaren geduldige investering vroeg. Ze is een stuk minder logisch nu hetzelfde stuk werk binnen één scroll bekendheid kan opbouwen, verlangen kan wekken en een transactie kan afdwingen.

De commercieel sterkste merken waarmee wij hebben gewerkt, scheiden die dingen niet. Zij begrijpen dat elk contactmoment tegelijk merkwerk en vraagwerk doet. Het onderscheid is een erfenis van mediaplanning, geen bruikbare beschrijving van hoe mensen werkelijk tot kopen besluiten.

Groei is een merkprobleem omdat verlangen een merkresultaat is. Je genereert geen vraag naar iets dat mensen niet willen. Eerst bouw je het willen. Groei komt daarna.`,
    date: '14 april 2026',
    category: 'Essay',
    readTime: '7 min leestijd',
    img: 'https://images.unsplash.com/photo-1654481414716-2f4ab5fe0fbe?w=1200&h=800&fit=crop&auto=format',
    slug: 'why-growth-is-a-brand-problem',
  },
  {
    id: '5',
    title: 'De tirannie van de referentie',
    subtitle: 'Waarom het moodboard waarmee een opdrachtgever binnenkomt meestal het laatste merk beschrijft dat indruk op hem maakte, en niet het merk dat hij zou moeten worden.',
    body: `Elk project begint met referenties. Een map, een board, een link naar drie bedrijven die de opdrachtgever bewondert. Het is behulpzaam bedoeld, en soms is het dat ook. Vaker is het een stille vorm van overgave.

Een referentie is de beschrijving van een probleem dat iemand anders al heeft opgelost. Het is het zichtbare resultaat van een strategie die je niet kunt zien, gemaakt voor een bedrijf dat je niet bent. Het resultaat lenen zonder de strategie: zo eindigen merken die er duur uitzien en niets betekenen.

De bedrijven die het bewonderen waard zijn, kwamen niet bij hun uiterlijk uit door referenties te verzamelen. Ze kwamen erbij uit door iets waars over zichzelf te begrijpen dat niemand anders kon claimen. Het zelfvertrouwen waar je op reageert is niet esthetisch. Het is het zelfvertrouwen van een bedrijf dat precies weet wat het is.

Dus nemen we de referenties serieus — niet als instructie, maar als bewijsmateriaal. Wat is het hier precies waar je jaloers op bent? In negen van de tien gevallen is het antwoord niet de letter of het palet. Het is de stelligheid. En stelligheid laat zich niet refereren. Die moet je verdienen.`,
    date: '9 april 2026',
    category: 'Essay',
    readTime: '6 min leestijd',
    img: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=1200&h=800&fit=crop&auto=format',
    slug: 'the-tyranny-of-the-reference',
  },
  {
    id: '6',
    title: 'Premium is een belofte, geen afwerking',
    subtitle: 'Over het verschil tussen een merk dat er duur uitziet en een merk dat zich gedraagt alsof het het geld waard is.',
    body: `Opdrachtgevers vragen om premium zoals ze om het weer vragen. Alsof het een instelling is. Maak het wat premiumer — wat zwart erbij, een schreefletter, iets meer wit.

Maar premium is geen laklaag die je aan het eind aanbrengt. Het is een belofte die je op elk contactmoment nakomt, en de meeste van die momenten hebben niets met vormgeving te maken. Het is de snelheid van het antwoord. De kwaliteit van de doos. De persoon die de telefoon opneemt. Het feit dat niets mooier wordt voorgesteld dan het is en niets tegenvalt.

Een merk voelt duur wanneer de ervaring de prijs geen enkele keer tegenspreekt. Op het moment dat dat wel gebeurt — een rommelige checkout, een goedkope e-mail, een belofte die niet wordt ingelost — is de betovering weg, en geen hoeveelheid goudfolie brengt haar terug.

Dat is ongemakkelijk, want het betekent dat premium niets is wat wij in een deck kunnen overhandigen. Het is een standaard die het hele bedrijf moet vasthouden, lang nadat wij vertrokken zijn. Onze taak is die standaard precies genoeg te formuleren dat hij te verdedigen valt. Hem houden is aan de opdrachtgever.`,
    date: '20 maart 2026',
    category: 'Notities',
    readTime: '5 min leestijd',
    img: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&h=800&fit=crop&auto=format',
    slug: 'premium-is-a-promise-not-a-finish',
  },
  {
    id: '7',
    title: 'Lof van het trage project',
    subtitle: 'Waarom het beste merkwerk zich verzet tegen de planning waarop het verkocht is, en wat dat werkelijk kost.',
    body: `Elk goed project kent een moment waarop het zou moeten vertragen en dat vrijwel nooit doet. Het is het moment na het onderzoek en vóór het maken, waarop het eerlijke antwoord luidt: we weten nog niet wat dit is.

De druk is op dat punt enorm. Er is een planning. Er wachten mensen. Er is de menselijke neiging om onzekerheid om te zetten in bedrijvigheid, om iets te gaan produceren zodat het in elk geval op voortgang lijkt. Zo gaan de meeste projecten stilletjes mis — niet door slecht werk, maar door werk dat te vroeg gemaakt is, voordat het denken af was.

Het trage project is niet traag omdat er iemand stilzit. Het is traag omdat het weigert dingen te maken die het nog niet kan verantwoorden. Het houdt de ongemakkelijke open vraag een paar dagen langer open dan redelijk voelt, omdat het alternatief is haar slecht te beantwoorden en dat antwoord vervolgens drie maanden te moeten verdedigen.

We zijn niet romantisch over tijd. Traag is duur, en dat weten we. Maar het duurste wat een bedrijf kan doen, is snel het verkeerde merk bouwen en er daarna tien jaar in wonen.`,
    date: '28 februari 2026',
    category: 'Veldnotities',
    readTime: '6 min leestijd',
    img: 'https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=1200&h=800&fit=crop&auto=format',
    slug: 'in-defence-of-the-slow-project',
  },
  {
    id: '8',
    title: 'De doelgroep is niet iedereen',
    subtitle: 'Een notitie over waarom de neiging om meer mensen aan te spreken de zekerste manier is om er minder in beweging te krijgen.',
    body: `De meest voorkomende reactie op een stuk strategie is een variant op: kan dit niet iets meer mensen aanspreken? De vraag wordt te goeder trouw gesteld en is vrijwel altijd verkeerd.

Een merk dat voor iedereen probeert te zijn, is voor niemand leesbaar. Het schuurt elke rand weg die iemand had kunnen doen kiezen, in de hoop niemand voor het hoofd te stoten die toch al voorbijliep. Het resultaat is een merk dat technisch acceptabel is voor een grote groep en oprecht gewild door niemand daarbinnen.

Willen is specifiek. Het is het gevoel dat iets voor jou gemaakt is, door mensen die je goed genoeg begrepen om anderen buiten te laten. Dat gevoel laat zich niet op schaal fabriceren, en het is het enige gevoel dat iemand betrouwbaar van interesse naar aankoop beweegt.

Wanneer we de doelgroep versmallen, verkleinen we dus niet de kans. We concentreren haar. Een merk dat een kleine groep niet kan missen, groeit altijd voorbij een merk dat een grote groep kan nemen of laten. Bereik is een distributievraagstuk. Verlangen is een definitievraagstuk. Los het tweede eerst op.`,
    date: '11 februari 2026',
    category: 'Essay',
    readTime: '5 min leestijd',
    img: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&h=800&fit=crop&auto=format',
    slug: 'the-audience-is-not-everyone',
  },
  {
    id: '9',
    title: 'Een logo is het minste',
    subtitle: 'Waarom het beeldmerk waar iedereen over discussieert de kleinste beslissing in een merk is, en degene die als laatste genomen zou moeten worden.',
    body: `Het logo krijgt de vergadering. Het krijgt de revisierondes, de meningen, de collega die het hele project zweeg en nu ineens zijn stem vindt. Het is het onderdeel waarvan iedereen zich in staat acht het te beoordelen, omdat het het onderdeel is dat op een beslissing lijkt.

Maar een logo is een handtekening, en een handtekening betekent alleen iets door alles wat iemand eronder heeft gedaan. Op zichzelf is het een vorm. Het krijgt betekenis door herhaling, door de kwaliteit van het werk waar het naast staat, door jaren waarin een bedrijf zich consistent genoeg gedraagt dat die vorm ergens voor gaat staan.

Daarom maken we het laat, en zonder ophef. Tegen de tijd dat we het beeldmerk ontwerpen, zijn de moeilijke beslissingen al genomen — de positie, de stem, het systeem. Het logo hoeft alleen vooraan te staan zonder dat alles tegen te spreken. Is het denken eronder sterk, dan volstaat vrijwel elk competent merk. Is het zwak, dan redt geen enkel merk het.

Voer de discussie over de strategie. Laat het logo het makkelijke deel zijn.`,
    date: '22 januari 2026',
    category: 'Notities',
    readTime: '5 min leestijd',
    img: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1200&h=800&fit=crop&auto=format',
    slug: 'a-logo-is-the-least-of-it',
  },
  {
    id: '10',
    title: 'Wat het kost om als iedereen te klinken',
    subtitle: 'Over het vreemde comfort van de woorden die elk bedrijf gebruikt, en de prijs van je erachter verschuilen.',
    body: `Lees genoeg merkteksten en het valt op dat ze allemaal hetzelfde zijn. Iedereen is gepassioneerd. Iedereen is innovatief. Iedereen zet de klant centraal in alles wat hij doet. De woorden komen zo vaak voor dat ze geen informatie meer dragen — het is ruis, verkleed als betekenis.

Bedrijven grijpen naar die woorden omdat ze veilig zijn. Nog nooit is iemand ontslagen omdat hij zijn bedrijf innovatief noemde. Maar veilige taal kost iets wat op geen enkele factuur verschijnt: ze maakt je onzichtbaar. Wie klinkt als iedereen, vraagt erom als niemand te worden onthouden.

Het alternatief is beangstigend, want het vraagt iets te zeggen dat specifiek genoeg is dat sommigen het er niet mee eens zullen zijn. Een echte stem heeft randen. Ze laat dingen weg. Ze verbindt zich aan een manier van kijken die niet iedereen zal delen, en precies daardoor voelen de mensen die haar wél delen zich gevonden.

Wij besteden veel tijd aan het schrappen van woorden die van iedereen zouden kunnen zijn. Wat overblijft is meestal kleiner, gewoner en veel meer van jou.`,
    date: '8 januari 2026',
    category: 'Essay',
    readTime: '6 min leestijd',
    img: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&h=800&fit=crop&auto=format',
    slug: 'the-cost-of-sounding-like-everyone',
  },
  {
    id: '11',
    title: 'Consistentie is geen herhaling',
    subtitle: 'Het verschil tussen een merk dat samenhangt en een merk dat overal slechts identiek is.',
    body: `Ergens onderweg is consistentie hetzelfde gaan betekenen als eenvormigheid. Gebruik het logo op dit formaat. Dit blauw, nooit dat andere. Dezelfde koppenbehandeling op elk vlak. Richtlijnen werden een lijst verbodsbepalingen, en het merk werd iets wat je kon breken maar nooit bouwen.

Echte consistentie gaat niet over het herhalen van dezelfde elementen. Ze gaat over het herhalen van hetzelfde oordeel. Ze is de reden dat twee dingen, gemaakt door verschillende mensen, in verschillende formaten, jaren uit elkaar, nog altijd uit hetzelfde hoofd lijken te komen. Die samenhang ontstaat niet door alles vast te zetten. Ze ontstaat doordat iedereen begrijpt wat het merk probeert te zijn, zodat hun duizend kleine beslissingen dezelfde kant op wijzen.

Starre merken zien er consistent uit in een grid en vallen uiteen in de wereld, want de wereld vraagt altijd om iets waar de richtlijnen niet op gerekend hadden. Samenhangende merken bewegen mee zonder zichzelf te verliezen, omdat wat hen bijeenhield nooit de regels waren — het was de smaak onder de regels.

Schrijf het oordeel op, niet alleen de maten.`,
    date: '17 december 2025',
    category: 'Veldnotities',
    readTime: '6 min leestijd',
    img: 'https://images.unsplash.com/photo-1503694978374-8a2fa686963a?w=1200&h=800&fit=crop&auto=format',
    slug: 'consistency-is-not-repetition',
  },
  {
    id: '12',
    title: 'Zeg de prijs hardop',
    subtitle: 'Waarom een merk dat verlegen is over wat het kost, meestal onzeker is over wat het waard is.',
    body: `Je leert veel over een bedrijf uit de manier waarop het zich rond zijn eigen prijs gedraagt. De zelfverzekerde bedrijven noemen hem gewoon en gaan verder. De onzekere verstoppen hem, zetten er een formulier voor, omringen hem met verantwoording, of vermijden het onderwerp tot het laatst mogelijke moment.

Prijs is het helderste wat een merk ooit over zichzelf zegt. Het is een claim over waarde, in het openbaar gedaan, die de hele ervaring vervolgens moet waarmaken. Een bedrijf dat zenuwachtig is over zijn prijs, vertelt je eigenlijk dat het niet zeker weet of die claim klopt — en klanten voelen die aarzeling lang voordat ze een getal zien.

Merkwerk is voor een groot deel het werk van het recht op een prijs verdienen en vervolgens het lef hebben hem te noemen. Is de positie scherp en de ervaring heel, dan voelt het getal niet langer als een risico maar als een feit. Niets straalt zoveel vertrouwen uit als een bedrijf dat je simpelweg vertelt wat het kost.

Kun je de prijs niet hardop zeggen, dan is het probleem zelden de prijs.`,
    date: '3 december 2025',
    category: 'Essay',
    readTime: '5 min leestijd',
    img: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&h=800&fit=crop&auto=format',
    slug: 'say-the-price-out-loud',
  },
]

export const clients = [
  'Lavanta', 'Studio Marché', 'Edde', 'Hinterland',
  'Vela Collective', 'Roux Atelier', 'Sonder Press',
  'Maison Têtu', 'Folio & Co', 'Kōan Health',
  'The North Table', 'Stratum', 'Archive Forty',
  'Palomar Films', 'Glassworks', 'Lund & Meyer',
]

export const partners = [
  'Monotype', 'Contra Studio', 'The Type Foundry',
  'Riso & Ink', 'Field Notes Press', 'Aesop Trade',
  'It’s Nice That', 'Are.na', 'Semi-Permanent',
  'Design Week', 'Frame Store', 'Counter-Print',
  'Unit Editions', 'The Gourmand',
]

export const testimonials = [
  {
    quote: 'Ze vonden de zin die ons hele bedrijf er zes jaar lang niet uit kreeg. Alles daarna werd makkelijker — de prijsstelling, het aannemen van mensen, de pitch.',
    name: 'Amara Devlin',
    role: 'Oprichter',
    company: 'Lavanta',
  },
  {
    quote: 'De meesten komen binnen met een deck. Zij kwamen binnen met een vraag, en dat bleek de enige te zijn die ertoe deed. Het antwoord gebruiken we nog steeds.',
    name: 'Henri Vasseur',
    role: 'Algemeen directeur',
    company: 'Studio Marché',
  },
  {
    quote: 'We hadden er duur uitzien verward met gewild zijn. Zij haalden het hele ding uit elkaar, hielden de twee dingen over die waar waren, en bouwden de rest daaromheen.',
    name: 'Ingrid Solberg',
    role: 'CEO',
    company: 'Edde',
  },
  {
    quote: 'Het werk was scherp, maar wat ik niet had verwacht, was hoe commercieel het was. Elke beslissing kwam terug op een getal dat we ook echt konden bewegen.',
    name: 'Marcus Bianchi',
    role: 'Group Marketing Director',
    company: 'Hinterland',
  },
]

export const categories: { key: Category; label: string; blurb: string; accent: string }[] = [
  { key: 'Brand & Identity', label: 'Merk & identiteit', blurb: 'Wat het bedrijf is, en hoe het eruitziet, klinkt en zich gedraagt.', accent: '#6E2237' },
  { key: 'Digital & Product', label: 'Digitaal & product', blurb: 'Waar mensen het tegenkomen, en beslissen.', accent: '#6A6383' },
  { key: 'Growth & Demand', label: 'Groei & vraag', blurb: 'Hoe het gewild wordt, op schaal.', accent: '#7F8B3E' },
  { key: 'Market & Expansion', label: 'Markt & expansie', blurb: 'Waar het heen gaat, en wie het daarvoor moet overtuigen.', accent: '#C08A1E' },
  { key: 'Experiences', label: 'Experiences', blurb: 'Waar het merk plaatsvindt in een ruimte, niet in een browser.', accent: '#221E1B' },
]

export const capabilities: Capability[] = [
  // ── Merk & identiteit ─────────────────────────────────────────────────
  {
    slug: 'brand-strategy',
    name: 'Merkstrategie',
    category: 'Brand & Identity',
    summary: 'De commerciële logica onder het merk — wat je verkoopt, aan wie, en waarom je wint.',
    lede: 'Merkstrategie is geen sfeer. Het is het betoog waarom een bedrijf mag bestaan, tegen de juiste prijs, in een markt die al vol genoeg is. Wij bouwen dat betoog eerst, omdat elke beslissing die erop volgt — identiteit, product, prijs, media — goedkoper en scherper wordt zodra het er ligt.',
    includes: ['Doelgroep- en vraagonderzoek', 'Propositie en waardeverhaal', 'Merkarchitectuur', 'Concurrentie- en categorieanalyse'],
    question: 'Waarom zou iemand voor ons kiezen, en betalen wat we waard zijn?',
    outcome: 'Een vastgelegde, gedragen strategie die de volgende honderd beslissingen sneller maakt.',
    queries: ['merkstrategie bureau Amsterdam', 'wat is merkstrategie', 'hoe positioneer je een merk', 'verschil merkstrategie en marketingstrategie'],
  },
  {
    slug: 'brand-positioning',
    name: 'Merkpositionering',
    category: 'Brand & Identity',
    summary: 'De ene plek die je in het hoofd van een koper bezet — verdedigd met bewijs, niet met bijvoeglijke naamwoorden.',
    lede: 'De meeste bedrijven zijn per ongeluk gepositioneerd: door wie in de laatste sessie het hardst sprak. Wij zoeken de positie die zowel waar als onbezet is, en maken haar verdedigbaar — zodat de markt je archiveert onder een categorie van één.',
    includes: ['Categorie en referentiekader', 'Onderscheid en bewijsvoering', 'Positioneringsstatement en messaging house', 'Migratieplan vanaf waar je vandaag staat'],
    question: 'Waarvoor willen we de vanzelfsprekende keuze zijn?',
    outcome: 'Een positie die concurrenten niet kunnen kopiëren zonder jou te worden.',
    queries: ['merkpositionering', 'merk herpositioneren', 'positioneringsstatement voorbeeld', 'onderscheidend vermogen merk'],
  },
  {
    slug: 'naming',
    name: 'Naming',
    category: 'Brand & Identity',
    summary: 'Namen voor bedrijven, producten en lijnen — besloten, niet weggestemd.',
    lede: 'Een naam is een weddenschap op een set waarden die nog niet in de markt bestaat. Wij overhandigen geen lijst van vierhonderd met het verzoek te kiezen. Wij nemen een besluit, verdedigen het taalkundig en juridisch, en leveren het verhaal waardoor het blijft plakken.',
    includes: ['Namingstrategie en territoria', 'Creatie en shortlist', 'Taalkundige en merkenrechtelijke toetsing', 'Onderbouwing en introductietaal'],
    question: 'Hoe moet dit heten, en kunnen we het bezitten?',
    outcome: 'Een naam die je kunt registreren, verdedigen en waarin je kunt groeien.',
    queries: ['naming bureau', 'bedrijfsnaam bedenken', 'productnaam bedenken proces', 'is mijn merknaam nog vrij'],
  },
  {
    slug: 'brand-architecture',
    name: 'Merkarchitectuur',
    category: 'Brand & Identity',
    summary: 'Hoe een bedrijf zijn merken, submerken en producten ordent, zodat groei duidelijkheid oplevert in plaats van verwarring.',
    lede: 'Elk bedrijf heeft op enig moment meer dan één ding te benoemen — een nieuwe lijn, een nieuwe markt, een nieuwe locatie. Merkarchitectuur is het beslissysteem dat bepaalt wat een eigen naam krijgt, wat leent van het moedermerk, en hoe de hele familie leesbaar blijft terwijl ze groeit.',
    includes: ['Portfolio- en structuuraudit', 'Keuze tussen hoofdmerk en submerk', 'Naamgevings- en nomenclatuurregels', 'Uitrol en governance'],
    question: 'Versterkt het volgende dat we lanceren ons, of verwatert het ons?',
    outcome: 'Een structuur die meegroeit zonder elke achttien maanden een naamswijziging.',
    queries: ['merkarchitectuur', 'submerk of hoofdmerk', 'merkportfolio strategie', 'productlijn een naam geven'],
  },
  {
    slug: 'brand-identity',
    name: 'Visuele identiteit',
    category: 'Brand & Identity',
    summary: 'Een compleet visueel systeem — logo, typografie, kleur, opmaak — dat ook zonder het logo overeind blijft.',
    lede: 'Herkenning komt niet van een logo. Ze komt van een set codes die zo consequent is dat het merk leesbaar blijft wanneer de naam ontbreekt. Wij bouwen dat systeem, en de richtlijnen die het in leven houden.',
    includes: ['Logo, beeldmerk en lockups', 'Typografie-, kleur- en opmaaksystemen', 'Art direction en iconografie', 'Merkrichtlijnen en assetbibliotheken'],
    question: 'Wat maakt ons in één oogopslag onmiskenbaar?',
    outcome: 'Een systeem dat je team draait zonder dat wij in de kamer zitten.',
    queries: ['visuele identiteit ontwerpen', 'huisstijl laten ontwerpen', 'merkidentiteit en brandbook', 'rebranding bureau'],
  },
  {
    slug: 'verbal-identity',
    name: 'Verbale identiteit',
    category: 'Brand & Identity',
    summary: 'De woorden die alleen jouw bedrijf zou gebruiken — toon, vocabulaire en de regels die ze consistent houden.',
    lede: 'Een visueel systeem vertelt hoe een merk eruitziet. Een verbale identiteit vertelt hoe het klinkt — het vocabulaire waar het naar grijpt, de grappen die het wel en niet maakt, de zinslengte die als het merk voelt. Wij schrijven de regels, en daarna de eerste honderd voorbeelden, zodat het team het verschil kan horen.',
    includes: ['Tone-of-voice-principes', 'Vocabulaire en lexicon', 'Messaging house en koppenbibliotheek', 'Schrijfrichtlijnen en training'],
    question: 'Zou iemand onze tekst herkennen zonder het logo erboven?',
    outcome: 'Een stem die specifiek genoeg is om te beschermen.',
    queries: ['tone of voice merk', 'verbale identiteit richtlijnen', 'merkboodschap framework', 'tone of voice document laten schrijven'],
  },
  {
    slug: 'creative-direction',
    name: 'Creatieve directie',
    category: 'Brand & Identity',
    summary: 'De smaak en het oordeel die een merk bijeenhouden in alles wat het maakt.',
    lede: 'Creatieve directie is redigeren op het niveau van het hele bedrijf: fotografie, toon, campagnes en de duizend kleine besluiten die bepalen of een merk doordacht of samengeraapt aanvoelt. Wij houden de lijn vast, zodat het werk samenhangend blijft terwijl het opschaalt.',
    includes: ['Art direction en fotografieregie', 'Campagneconcepten', 'Toon en creatieve governance', 'Productiebegeleiding'],
    question: 'Voelt alles wat we maken als ons?',
    outcome: 'Werk dat onmiskenbaar van één bedrijf komt, bij elk volume.',
    queries: ['creative direction bureau', 'art direction voor merken', 'creatieve regie campagne', 'fotografie art direction'],
  },
  {
    slug: 'packaging',
    name: 'Verpakkingsontwerp',
    category: 'Brand & Identity',
    summary: 'Structureel en grafisch verpakkingsontwerp dat de prijs verdient in het schap, niet alleen op het scherm.',
    lede: 'Verpakking is het enige stuk merkwerk dat een klant daadwerkelijk vasthoudt. Wij ontwerpen structuur en grafiek in samenhang, zodat het object voor de prijs pleit voordat iemand een woord leest — en net zo hard werkt gefotografeerd in een feed als staand in een schap.',
    includes: ['Structuur- en stansontwerp', 'Materialen en drukwerkproductie', 'Lijn- en variantsystemen', 'Duurzaamheid en kostenoptimalisatie'],
    question: 'Voelt de prijs juist zodra je dit vasthoudt?',
    outcome: 'Verpakking die doordacht leest, niet versierd.',
    queries: ['verpakkingsontwerp bureau', 'packaging design laten maken', 'duurzame verpakking ontwerpen', 'verpakkingsontwerp food'],
  },

  // ── Digitaal & product ────────────────────────────────────────────────
  {
    slug: 'web-design-development',
    name: 'Webdesign & development',
    category: 'Digital & Product',
    summary: 'Websites die snel laden, helder leesbaar zijn voor zoekmachines en AI-crawlers, en mensen naar een beslissing bewegen.',
    lede: 'Een website is waar de meeste mensen besluiten of ze je vertrouwen. Wij ontwerpen en bouwen sites die snel laden, goed leesbaar zijn voor zoekmachines en AI-crawlers, en bezoekers naar een beslissing bewegen — zonder er ooit uit te zien als een template.',
    includes: ['Ontwerp en art direction', 'Front-endbouw en CMS', 'Core Web Vitals en performance', 'Schema, semantiek en toegankelijkheid'],
    question: 'Levert onze website vertrouwen en aanvragen op?',
    outcome: 'Een site die scoort, converteert en makkelijk in leven te houden is.',
    queries: ['website laten maken bureau', 'website die converteert', 'SEO-vriendelijke website bouwen', 'website met CMS laten bouwen'],
  },
  {
    slug: 'ux-ui-design',
    name: 'UX/UI-design',
    category: 'Digital & Product',
    summary: 'Interfaces die mensen meteen begrijpen en prettig vinden om te gebruiken.',
    lede: 'Goede UX is onzichtbaar; slechte UX is een lek in de funnel. Wij ontwerpen flows, schermen en systemen die wrijving wegnemen, aandacht respecteren en standhouden in echt gebruik — gemeten, niet beweerd.',
    includes: ['Gebruikersonderzoek en flows', 'Interface- en interactieontwerp', 'Designsystemen en componenten', 'Usabilitytesten'],
    question: 'Kunnen mensen moeiteloos doen waarvoor ze kwamen?',
    outcome: 'Minder afhakers, meer voltooide acties.',
    queries: ['UX UI design bureau', 'product design bureau', 'usability onderzoek', 'design system laten bouwen'],
  },
  {
    slug: 'digital-product-design',
    name: 'Digitaal productdesign',
    category: 'Digital & Product',
    summary: 'Apps, platforms en tools, van eerste ontwerp tot volledige engineering.',
    lede: 'Sommige merken hebben meer nodig dan een website — ze hebben een product nodig. Wij brengen digitale producten van concept naar oplevering en zetten ontwerp en engineering naast elkaar, zodat wat je lanceert ook is waar je voor pleitte.',
    includes: ['Productstrategie en scoping', 'Ontwerp en prototyping', 'Full-stack engineering', 'Iteratie en roadmap'],
    question: 'Wat moeten we bouwen, en kunnen jullie het bouwen?',
    outcome: 'Een product in de markt, geen prototype in een la.',
    queries: ['digital product design bureau', 'app laten ontwikkelen', 'MVP laten bouwen', 'productontwikkeling studio'],
  },
  {
    slug: 'ecommerce',
    name: 'E-commerce',
    category: 'Digital & Product',
    summary: 'Storefronts en checkoutervaringen gebouwd om te converteren, niet om een catalogus te tonen.',
    lede: 'Een e-commercesite is een verkoopvloer waar de verlichting, de rij en de verkoper in één keer zijn ontworpen. Wij bouwen storefronts, productpagina’s en checkoutflows die zijn afgesteld op conversie en herhaalaankoop, op het platform dat werkelijk bij de business past.',
    includes: ['Platformkeuze en bouw', 'Ontwerp van product- en categoriepagina’s', 'Checkout- en conversieoptimalisatie', 'Merchandising en CRO-tests'],
    question: 'Is de route van interesse naar aankoop zo kort als hij zou moeten zijn?',
    outcome: 'Een storefront die kijken omzet in kopen.',
    queries: ['webshop laten bouwen', 'Shopify bureau Nederland', 'conversieoptimalisatie webshop', 'e-commerce UX design'],
  },

  // ── Groei & vraag ─────────────────────────────────────────────────────
  {
    slug: 'growth-strategy',
    name: 'Groeistrategie',
    category: 'Growth & Demand',
    summary: 'Het plan dat merk, product en vraag samenbrengt tot één commerciële motor.',
    lede: 'Groei is geen afdeling. Het is wat er gebeurt wanneer merk, product en vraagcreatie het eens zijn over hetzelfde verhaal en dezelfde cijfers. Wij bouwen het plan dat die drie bijeenhoudt, met de kanalen, de volgorde en de doelen om te bewijzen dat het werkt.',
    includes: ['Groeimodel en kanaalmix', 'Funnel- en conversieanalyse', 'Prioritering en testroadmap', 'Rapportage en commerciële doelen'],
    question: 'Wat gaat de omzet werkelijk bewegen, en in welke volgorde?',
    outcome: 'Eén groeiplan waar het hele bedrijf mee kan werken.',
    queries: ['groeistrategie bureau', 'growth marketing strategie', 'groeiplan opstellen', 'merk en performance op elkaar afstemmen'],
  },
  {
    slug: 'performance-marketing',
    name: 'Performance marketing',
    category: 'Growth & Demand',
    summary: 'Betaalde acquisitie die het merk en de winst- en verliesrekening even serieus neemt.',
    lede: 'Performance zonder merk verbrandt geld; merk zonder performance verhongert. Wij draaien betaalde media als één systeem met je merk — creatie die alleen van jou kan zijn, targeting die niet lui is, en rapportage waar je werkelijk iets mee kunt.',
    includes: ['Paid search, social en display', 'Frameworks voor creatietesten', 'Meting en attributie', 'Budget- en biedstrategie'],
    question: 'Werkt elke euro media zo hard als hij kan?',
    outcome: 'Acquisitie-economie die beter wordt naarmate je opschaalt.',
    queries: ['performance marketing bureau', 'paid media uitbesteden', 'SEA bureau', 'growth marketing bureau'],
  },
  {
    slug: 'seo',
    name: 'SEO',
    category: 'Growth & Demand',
    summary: 'Technische, inhoudelijke en entiteits-SEO, gebouwd voor Google én AI-antwoordmachines.',
    lede: 'Zoeken is in 2026 twee spellen tegelijk: ranken in Google en de bron zijn die een AI-antwoord citeert. Wij doen allebei — technische fundamenten, semantische content en entiteitsautoriteit — zodat je opduikt waar de beslissing werkelijk valt.',
    includes: ['Technische SEO en Core Web Vitals', 'Entiteits- en onderwerpautoriteit', 'On-page- en contentoptimalisatie', 'Optimalisatie voor AI-zoeken en antwoordmachines'],
    question: 'Verschijnen we wanneer het telt, in de zoekresultaten én in AI-antwoorden?',
    outcome: 'Gekwalificeerd verkeer dat binnenkomt met de aanvraag al klaar.',
    queries: ['SEO bureau 2026', 'optimaliseren voor AI-zoekmachines', 'answer engine optimalisatie', 'entiteit SEO', 'vindbaar worden in ChatGPT en Perplexity'],
  },
  {
    slug: 'content-strategy',
    name: 'Contentstrategie & contentmanagement',
    category: 'Growth & Demand',
    summary: 'Wat je zegt, waar en waarom — plus het besturingssysteem dat het op tijd gepubliceerd houdt.',
    lede: 'Content is hoe een merk aandacht verdient tussen aankopen door. Wij bepalen de thema’s die je geloofwaardig kunt bezitten, de formats die bij elk kanaal passen, de semantische structuur die je geciteerd krijgt in zoekmachines en AI, en de kalender en werkwijze die het houdbaar maken in plaats van sporadisch.',
    includes: ['Redactionele strategie en pijlers', 'Onderwerp- en entiteitsmapping voor SEO', 'Contentoperatie en kalender', 'Meting en bijsturing'],
    question: 'Wat moeten we publiceren, en kunnen we het volhouden?',
    outcome: 'Een contentmotor die zich opstapelt in plaats van steeds opnieuw te beginnen.',
    queries: ['contentstrategie bureau', 'SEO contentstrategie', 'redactionele strategie voor merken', 'contentmanagement voor AI-zoekmachines'],
  },
  {
    slug: 'social-media',
    name: 'Socialmediastrategie & -management',
    category: 'Growth & Demand',
    summary: 'Een aanwezigheid op social met een standpunt, gerund met de discipline van een redactie.',
    lede: 'De meeste merksocial is een contentkalender in een strategiekostuum. Wij beginnen bij wat het merk werkelijk te zeggen heeft, kiezen de platforms die de moeite waard zijn, en runnen het account zoals een redacteur dat zou doen — consistente stem, doordacht tempo, echte interactie.',
    includes: ['Platform- en formatstrategie', 'Contentplanning en -productie', 'Communitymanagement', 'Analyse en bijsturing'],
    question: 'Klinkt onze social alsof er iemand in het bijzonder aan het woord is?',
    outcome: 'Een schare volgers die zich gedraagt als publiek, niet als getal.',
    queries: ['socialmediastrategie bureau', 'social media uitbesteden', 'merkstrategie voor social media', 'organisch groeien op social'],
  },
  {
    slug: 'influencer-marketing',
    name: 'Influencer- / creatormarketing',
    category: 'Growth & Demand',
    summary: 'Samenwerkingen met creators, gekozen op passendheid en vertrouwen, niet op volgersaantal.',
    lede: 'De beste samenwerkingen met creators voelen als een aanbeveling, niet als een advertentie. Wij vinden de stemmen die jouw publiek al vertrouwt, briefen ze fatsoenlijk, en bouwen relaties die verder terugbetalen dan één post.',
    includes: ['Creatorstrategie en selectie', 'Briefing en relatiebeheer', 'Rechten en gebruik van content', 'Prestaties en meting'],
    question: 'Wie gelooft ons publiek, en hoe werken we goed met hen samen?',
    outcome: 'Samenwerkingen die als vertrouwen lezen, niet als budget.',
    queries: ['influencer marketing bureau', 'samenwerken met creators', 'UGC strategie', 'influencercampagne opzetten'],
  },
  {
    slug: 'email-marketing',
    name: 'E-mailmarketing',
    category: 'Growth & Demand',
    summary: 'Lifecycle- en CRM-programma’s die een lijst omzetten in omzet.',
    lede: 'E-mail is het enige kanaal dat je zelf bezit. Wij ontwerpen lifecycleprogramma’s — welkom, nurture, retentie, win-back — die klinken als jouw merk en cijfers bewegen die je vrijdag al in het dashboard ziet.',
    includes: ['Lifecycle- en automationontwerp', 'Segmentatie en CRM-strategie', 'Tekst, ontwerp en templates', 'Testen en deliverability'],
    question: 'Verdient ons eigen publiek werkelijk iets terug?',
    outcome: 'Omzet uit mensen die je al kennen.',
    queries: ['e-mailmarketing bureau', 'CRM lifecycle marketing', 'Klaviyo bureau', 'retentiemarketing'],
  },
  {
    slug: 'campaign-strategy',
    name: 'Campagnestrategie',
    category: 'Growth & Demand',
    summary: 'Het grote idee, en het mediaplan dat het op tijd voor de juiste mensen krijgt.',
    lede: 'Een campagne is geen creatieve uitwerking op zoek naar een kanaalplan. Het is één idee, per plek juist uitgedrukt, met een mediaplan gebouwd rond wanneer en hoe je publiek werkelijk oplet. Wij ontwerpen beide helften tegelijk.',
    includes: ['Campagne-idee en concept', 'Kanaal- en mediaplanning', 'Assetontwikkeling over formats heen', 'Flighting en meting'],
    question: 'Wat is het ene idee, en waar moet het opduiken?',
    outcome: 'Een campagne die gepland voelt, niet verstrooid.',
    queries: ['campagnestrategie bureau', 'geïntegreerde campagne planning', 'creatief campagneconcept', 'mediaplanning merkcampagne'],
  },

  // ── Markt & expansie ──────────────────────────────────────────────────
  {
    slug: 'market-research',
    name: 'Marktonderzoek',
    category: 'Market & Expansion',
    summary: 'Bewijs over kopers, categorieën en prijzen — vóór de dure beslissingen.',
    lede: 'Wij onderzoeken om te beslissen, niet om te bevestigen. Kwalitatieve diepte waar nuance telt, kwantitatieve schaal waar zekerheid telt, en een synthese die werkelijk verandert wat je hierna bouwt.',
    includes: ['Kwalitatieve interviews en etnografie', 'Kwantitatief onderzoek en segmentatie', 'Prijs- en betalingsbereidheidsonderzoek', 'Categorie- en trendanalyse'],
    question: 'Wat geloven onze kopers werkelijk, en waar betalen ze voor?',
    outcome: 'Beslissingen gestoeld op bewijs in plaats van op de hardste mening.',
    queries: ['marktonderzoek merk', 'klantsegmentatie onderzoek', 'prijsonderzoek', 'betalingsbereidheid onderzoeken'],
  },
  {
    slug: 'go-to-market-strategy',
    name: 'Go-to-marketstrategie',
    category: 'Market & Expansion',
    summary: 'Het gefaseerde plan om te lanceren of op te schalen — kanalen, boodschap, beweging en economie.',
    lede: 'Een uitstekend product met een vage go-to-market is een trage, dure mislukking. Wij plannen de lancering als een commercieel systeem: wie het als eerste hoort, wat ze horen, waar het geld heen gaat, en hoe je binnen weken in plaats van kwartalen weet of het werkt.',
    includes: ['Lanceringsvolgorde en fasering', 'Kanaal- en boodschapplanning', 'Afstemming tussen sales en marketing', 'Meetpunten, doelen en gereedheid'],
    question: 'Hoe lanceren we dit zo dat het landt en zichzelf terugverdient?',
    outcome: 'Een lanceerplan met eigenaren, data en cijfers eraan vast.',
    queries: ['go to market strategie', 'plan voor productlancering', 'GTM strategie startup', 'nieuw merk lanceren'],
  },
  {
    slug: 'b2b-partnerships',
    name: 'B2B-partnerships & gesprekken met potentiële klanten',
    category: 'Market & Expansion',
    summary: 'Distributie via andere bedrijven — selectie, benadering en de gesprekken zelf.',
    lede: 'Soms is de snelste route naar vraag het publiek van iemand anders. Wij ontwerpen en bemiddelen partnerships — co-marketing, channel, bundeling — en schuiven waar dat nuttig is zelf aan: de bedrijven die het partneren waard zijn identificeren, benaderen en spreken.',
    includes: ['Partnerstrategie en selectie', 'Benadering en dealvorming', 'Co-marketingprogramma’s', 'Voorbereiding en begeleiding van gesprekken'],
    question: 'Wiens publiek moeten we lenen, en op welke voorwaarden?',
    outcome: 'Een distributiekanaal dat geen extra advertentiebudget is.',
    queries: ['B2B partnerstrategie', 'co-marketing bureau', 'channel partnerships', 'strategische allianties'],
  },
  {
    slug: 'market-entry',
    name: 'Marktbetreding',
    category: 'Market & Expansion',
    summary: 'Het onderzoek, de positionering en het plan om een merk naar een nieuw land of een nieuwe categorie te brengen.',
    lede: 'Een merk dat in de ene markt werkt, werkt niet vanzelf in de volgende. Wij toetsen vraag, concurrentie, regelgeving en culturele passendheid voordat we adviseren hoe — of óf — je binnengaat, en bouwen daarna de gelokaliseerde positionering en het plan om het goed te doen.',
    includes: ['Toets op marktpotentieel', 'Concurrentie- en regelgevingslandschap', 'Gelokaliseerde positionering en boodschap', 'Volgorde van betreding en partners'],
    question: 'Moeten we deze markt in, en zo ja, hoe?',
    outcome: 'Een marktbetredingsplan gebouwd op bewijs, niet op enthousiasme.',
    queries: ['strategie internationale marktbetreding', 'marktexpansie strategie', 'merk lanceren in een nieuw land', 'advies marktbetreding'],
  },
  {
    slug: 'investor-readiness',
    name: 'Investor readiness & investeerdersgesprekken',
    category: 'Market & Expansion',
    summary: 'Het verhaal, het deck en het bewijs die een bedrijf financierbaar maken — en de gesprekken zelf.',
    lede: 'Investeerders kopen een verhaal over de toekomst, gedekt door bewijs uit het heden. Wij vormen het equity story, scherpen het deck aan en testen de cijfers, zodat de kamer om de juiste redenen naar voren leunt — en waar het helpt, schuiven we bij de gesprekken aan.',
    includes: ['Equity story en narratief', 'Ontwerp en tekst van het pitchdeck', 'Narratieve ondersteuning van de dataroom', 'Repetitie, Q&A-voorbereiding en investeerdersgesprekken'],
    question: 'Waarom is dit het bedrijf om nu op in te zetten?',
    outcome: 'Een financieringsverhaal dat een due diligence overleeft.',
    queries: ['bureau voor investor pitch deck', 'pitchdeck laten maken', 'equity story', 'verhaal voor een seed ronde'],
  },
  {
    slug: 'growth-process-consultancy',
    name: 'Groeiprocesconsultancy',
    category: 'Market & Expansion',
    summary: 'Hoe het team groei werkelijk plant, uitvoert en meet — niet alleen wat het hierna zou moeten doen.',
    lede: 'Soms klopt het plan en is het proces eromheen stuk: niemand is eigenaar van de roadmap, testen heeft geen ritme, en elk kwartaal begint met een leeg blad. Wij onderzoeken hoe groei binnen jouw bedrijf werkelijk wordt besloten en uitgevoerd, en installeren daarna een proces dat je team blijft gebruiken nadat wij weg zijn.',
    includes: ['Audit van het groeiritme', 'Roadmap, eigenaarschap en rapportagestructuur', 'Test- en prioriteringsframeworks', 'Teamtraining en overdracht'],
    question: 'Zit de bottleneck in de strategie, of in hoe we werken?',
    outcome: 'Een groeiproces dat het team zonder ons draait.',
    queries: ['growth process consultancy', 'advies marketing operations', 'operating model growth team', 'growth roadmap opstellen'],
  },

  // ── Experiences ───────────────────────────────────────────────────────
  {
    slug: 'events',
    name: 'Events',
    category: 'Experiences',
    summary: 'Bijeenkomsten ontworpen om het merk in de ruimte te bouwen, niet om een agenda te vullen.',
    lede: 'Sommig merkwerk gebeurt alleen in levenden lijve. Wij bedenken, ontwerpen en produceren events die het bijwonen waard zijn — lanceringen, diners, studioavonden — en behandelen de ruimte zelf als creatief werk met een begin, een midden en een eind.',
    includes: ['Eventconcept en identiteit', 'Ontwerp van de gastbeleving', 'Productie en uitvoering op de dag zelf', 'Opvolging en meting'],
    question: 'Waarvoor is het de moeite waard mensen samen te brengen, en onthouden ze het?',
    outcome: 'Een ruimte die zich jou herinnert.',
    queries: ['eventbureau voor merken', 'experiential marketing bureau', 'productie lanceringsevent', 'ontwerp zakelijk event'],
  },
  {
    slug: 'exhibitions',
    name: 'Tentoonstellingen',
    category: 'Experiences',
    summary: 'Fysieke en tijdelijke ruimtes waarin mensen het merk als object tegenkomen, niet als scherm.',
    lede: 'Een tentoonstelling vraagt meer van een merk dan een stand ooit doet — ze moet overleven dat er omheen wordt gelopen. Wij ontwerpen tentoonstellingen, installaties en pop-ups die in drie dimensies standhouden, van ruimtelijk concept tot fabricage en opbouw.',
    includes: ['Ruimtelijk en tentoonstellingsconcept', 'Grafisch en omgevingsontwerp', 'Fabricage en productiebegeleiding', 'Opbouw en afbouw'],
    question: 'Voelt het merk nog als zichzelf in een fysieke ruimte?',
    outcome: 'Een ruimte die mensen fotograferen zonder dat je erom vraagt.',
    queries: ['ontwerpbureau tentoonstellingen', 'pop-up store ontwerp', 'ontwerp merkinstallatie', 'beursstand ontwerp'],
  },
  {
    slug: 'workshops',
    name: 'Workshops',
    category: 'Experiences',
    summary: 'Praktische sessies in kleine groepen, waarna een team meer van het werk zelf aankan.',
    lede: 'Wij houden werksessies, geen colleges — over positionering, naming, creatieve directie en de briefing zelf — opgebouwd rond jouw eigen project, niet rond een algemeen deck. Teams vertrekken met een genomen besluit, niet met een uitgelegd model.',
    includes: ['Ontwerp en begeleiding van de sessie', 'Voorbereiding en materiaal', 'Live beslissessies', 'Schriftelijke uitkomsten en vervolgstappen'],
    question: 'Wat zou dit team zelf kunnen beslissen, met de juiste structuur in de kamer?',
    outcome: 'Een genomen besluit, niet een uitgelegd model.',
    queries: ['workshop merkstrategie', 'workshop creative direction', 'begeleiding positioneringssessie', 'merktraining in huis'],
  },
  {
    slug: 'trainings',
    name: 'Trainingen',
    category: 'Experiences',
    summary: 'Uitgebreidere trainingen op locatie in merkstrategie en creatieve directie — vanaf 2027.',
    lede: 'Alles wat wij hebben geleerd over merkstrategie en creatieve directie, in twee dagen rechtstreeks overgedragen aan een kleine groep. Geen webinarreeks. Geen certificaat. Hetzelfde denkwerk waarvoor opdrachtgevers ons betalen, in persoon onderwezen.',
    includes: ['Tweedaags format op locatie', 'Maximaal twaalf deelnemers', 'Sporen Merkstrategie en Creatieve directie', 'Amsterdam, plus één extra stad per jaar'],
    question: 'Laat het denken achter het werk zich onderwijzen, en niet alleen leveren?',
    outcome: 'Een kamer vol mensen die dit nu voor een groot deel zelf kunnen.',
    queries: ['training merkstrategie', 'opleiding creative direction', 'branding workshop op locatie 2027', 'Not by Accident trainingen'],
  },
]

/* ── Bedrijf, contact en social ───────────────────────────────────────────
   Registratie, telefoon en studioadres zijn placeholders — die mogen nooit
   verzonnen worden. Ze worden vóór lancering ingevuld; tot die tijd toont de
   site de placeholdertekst gewoon zoals ze is. */
export const company = {
  name: 'Not by Accident',
  legalName: 'Not by Accident',
  tagline: 'Gewild, met opzet.',
  proposition: 'Wij maken bedrijven gewild. Groei is wat daarna gebeurt.',
  email: 'hello@notbyaccident.com',
  pressEmail: 'press@notbyaccident.com',
  newBusinessEmail: 'new@notbyaccident.com',
  phone: '',
  phonePlaceholder: 'Telefoonnummer — volgt',
  registrationNote: 'Registratienummer en statutaire vestiging — volgen',
  address: {
    line1: '',
    line2: '',
    city: '',
    postcode: '',
    country: '',
  },
  addressPlaceholder: 'Studioadres — volgt',
  hours: 'Maandag–donderdag, 10:00–17:00 CET',
}

export const socials = [
  { label: 'LinkedIn', handle: 'Not by Accident', url: 'https://linkedin.com/company/notbyaccident' },
  { label: 'Instagram', handle: '@notbyaccident', url: 'https://instagram.com/notbyaccident' },
  { label: 'TikTok', handle: '@notbyaccident', url: 'https://tiktok.com/@notbyaccident' },
  { label: 'Substack', handle: 'notbyaccident', url: 'https://notbyaccident.substack.com' },
  { label: 'Are.na', handle: 'not-by-accident', url: 'https://are.na/not-by-accident' },
  { label: 'Dribbble', handle: 'notbyaccident', url: 'https://dribbble.com/notbyaccident' },
]

export const clientLogos: { name: string; style: 'serif' | 'sans-tight' | 'sans-wide' | 'mono' | 'italic' | 'black' }[] = [
  { name: 'Lavanta', style: 'serif' },
  { name: 'STUDIO MARCHÉ', style: 'sans-wide' },
  { name: 'edde', style: 'sans-tight' },
  { name: 'Hinterland', style: 'italic' },
  { name: 'VELA', style: 'black' },
  { name: 'Roux', style: 'serif' },
  { name: 'SONDER', style: 'mono' },
  { name: 'Maison Têtu', style: 'italic' },
  { name: 'Folio&Co', style: 'sans-tight' },
  { name: 'KŌAN', style: 'sans-wide' },
  { name: 'The North Table', style: 'serif' },
  { name: 'STRATUM', style: 'black' },
]

export const partnerLogos: { name: string; style: 'serif' | 'sans-tight' | 'sans-wide' | 'mono' | 'italic' | 'black' }[] = [
  { name: 'Monotype', style: 'sans-tight' },
  { name: 'CONTRA', style: 'black' },
  { name: 'It’s Nice That', style: 'serif' },
  { name: 'Are.na', style: 'mono' },
  { name: 'Semi-Permanent', style: 'sans-wide' },
  { name: 'Counter-Print', style: 'italic' },
  { name: 'Unit Editions', style: 'serif' },
  { name: 'Framestore', style: 'sans-tight' },
  { name: 'Riso&Ink', style: 'mono' },
  { name: 'The Gourmand', style: 'italic' },
]

export const team: TeamMember[] = [
  {
    id: '1',
    name: 'Sara Okafor',
    role: 'Oprichtend partner, strategie',
    bio: 'Sara werkte tien jaar in strategieconsultancy voordat ze concludeerde dat merkdenken en commercieel denken één discipline zouden moeten zijn en geen twee. Op dat uitgangspunt bouwde ze Not by Accident.',
    img: 'https://images.unsplash.com/photo-1675773051474-55c4b7d2cf53?w=600&h=750&fit=crop&auto=format',
  },
  {
    id: '2',
    name: 'Tomás Reyes',
    role: 'Oprichtend partner, creatie',
    bio: 'Tomás leidde de creatie bij onafhankelijke bureaus in Amsterdam en São Paulo, twee keer een jaar of tien, tot hij besloot dat het werk beter werd wanneer de creative director ook bij de strategie aan tafel zat.',
    img: 'https://images.unsplash.com/photo-1523908511403-7fc7b25592f4?w=600&h=750&fit=crop&auto=format',
  },
]
