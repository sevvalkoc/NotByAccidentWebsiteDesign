/* Titre/description par page en français. Fichier autonome — n'importe pas
   `en` depuis pageSeo.ts, pour éviter une dépendance circulaire au moment de
   l'exécution (pageSeo.ts importe ce fichier). */
import type { PageSeoMap } from '@/i18n/pageSeo'

export const pageSeo: PageSeoMap = {
  '/': { title: 'Entreprise créative indépendante, Amsterdam' },
  '/work': { title: 'Réalisations', description: 'Réalisations sélectionnées de Not by Accident — stratégie de marque, identité, produits digitaux et croissance pour fondateurs et équipes créatives.' },
  '/case-studies': { title: 'Études de cas', description: 'Études de cas approfondies de Not by Accident — comment la stratégie de marque, l\'identité et la croissance se traduisent en résultats commerciaux mesurables.' },
  '/capabilities': { title: 'Expertises' },
  '/studio': { title: 'Studio', description: 'Not by Accident est une entreprise créative indépendante basée à Amsterdam. Volontairement petite, expérimentée à chaque étape, commerciale par instinct — la pensée marque et croissance réunies dans une seule équipe.' },
  '/notes': { title: 'Le journal', description: 'Essais et notes de Not by Accident sur la stratégie de marque, le positionnement, le nommage, le design et la croissance commerciale — un regard indépendant, publié irrégulièrement.' },
  '/trainings': { title: 'Événements et ateliers', description: 'Ateliers de marque et de stratégie, événements et formations pratiques de Not by Accident — des expériences qui valent la peine de rassembler les gens.' },
  '/reports': { title: 'Rapports', description: 'Notes de terrain, benchmarks et recherches originales de Not by Accident — bientôt disponibles.' },
  '/contact': { title: 'Contact', description: 'Démarrez un projet avec Not by Accident. Dites-nous l\'entreprise que vous voulez devenir — première réponse sous un jour ouvré, par une personne, pas un formulaire.' },
  '/search': { title: 'Recherche', description: 'Recherchez sur Not by Accident — réalisations, expertises et journal.' },
  '/privacy': { title: 'Confidentialité', description: 'Comment Not by Accident collecte, utilise et protège vos données personnelles.' },
  '/cookies': { title: 'Cookies', description: 'Comment Not by Accident utilise les cookies et technologies similaires sur ce site.' },
  '/404': { title: 'Page introuvable', description: "La page que vous recherchiez n'existe pas." },
}
