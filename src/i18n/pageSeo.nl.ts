/* Nederlandse titel/omschrijving per pagina. Zelfstandig bestand — geen
   import van `en` uit pageSeo.ts, om een circulaire runtime-afhankelijkheid
   te vermijden (pageSeo.ts importeert dit bestand op zijn beurt). */
import type { PageSeoMap } from '@/i18n/pageSeo'

export const pageSeo: PageSeoMap = {
  '/': { title: 'Onafhankelijk creatief bureau, Amsterdam' },
  '/work': { title: 'Werk', description: 'Geselecteerd werk van Not by Accident — merkstrategie, identiteit, digitale producten en groei voor oprichters en creatieve teams.' },
  '/case-studies': { title: 'Case studies', description: 'Diepgaande case studies van Not by Accident — hoe merkstrategie, identiteit en groei zich vertalen naar meetbare commerciële resultaten.' },
  '/capabilities': { title: 'Expertises' },
  '/studio': { title: 'Studio', description: 'Not by Accident is een onafhankelijk creatief bureau in Amsterdam. Klein met opzet, senior aan tafel, commercieel van instinct — merk- en groeidenken in één team.' },
  '/notes': { title: 'De publicatie', description: 'Essays en notities van Not by Accident over merkstrategie, positionering, naamgeving, design en commerciële groei — een onafhankelijke kijk, onregelmatig gepubliceerd.' },
  '/trainings': { title: 'Events & workshops', description: 'Merk- en strategieworkshops, events en praktische trainingen van Not by Accident — ervaringen die het waard zijn om mensen voor samen te brengen.' },
  '/reports': { title: 'Rapporten', description: 'Veldnotities, benchmarks en origineel onderzoek van Not by Accident — binnenkort beschikbaar.' },
  '/contact': { title: 'Contact', description: 'Start een project met Not by Accident. Vertel ons welk bedrijf je wilt worden — eerste reactie binnen één werkdag, van een persoon, niet van een formulier.' },
  '/search': { title: 'Zoeken', description: 'Doorzoek Not by Accident — werk, expertises en de publicatie.' },
  '/privacy': { title: 'Privacy', description: 'Hoe Not by Accident je persoonsgegevens verzamelt, gebruikt en beschermt.' },
  '/cookies': { title: 'Cookies', description: 'Hoe Not by Accident cookies en vergelijkbare technologieën op deze website gebruikt.' },
  '/404': { title: 'Pagina niet gevonden', description: 'De pagina die je zocht bestaat niet.' },
}
