/* ── Traduction française ──────────────────────────────────────────────────
   Miroir français de src/data.ts. Mêmes exports, mêmes formes TypeScript :
   seuls les champs rédactionnels sont traduits. Les slugs, identifiants,
   URL, couleurs et clés de catégorie restent identiques à la version
   anglaise — ils servent de clés dans toute l'application. */

import type { Project, Note, Capability, Category, TeamMember } from '@/data'

export const projects: Project[] = [
  {
    id: '1',
    num: '01',
    name: 'Lavanta',
    discipline: 'Identité · Produit · Demande',
    year: '2024',
    location: 'Londres',
    brief: "Une marque de joaillerie que l'on admirait sans l'acheter.",
    narrative: {
      problem: "Lavanta est venue nous voir trois ans après sa création, avec un problème très net : un produit fort, une communauté forte, des ventes molles.",
      insight: "La marque était admirée, pas achetée — positionnée comme un luxe accessible alors qu'elle se portait déjà comme un bijou de famille. L'écart n'a jamais été le produit. C'était l'histoire que personne ne se sentait autorisé à raconter en la portant.",
      intervention: "Nous avons repositionné la marque autour d'une idée : l'héritage au prix d'aujourd'hui — pas un luxe accessible, mais la dernière pièce d'une catégorie qui n'en compte qu'une — puis reconstruit l'identité, le produit et le système de demande autour de cette seule idée.",
      outcome: "+34 % de conversion en six mois, et une liste d'attente pour la nouvelle collection.",
    },
    services: ['Stratégie de marque', 'Direction de création', 'SEO', 'Stratégie de croissance'],
    relatedCapabilities: ['brand-strategy', 'creative-direction', 'seo', 'growth-strategy'],
    img: 'https://images.unsplash.com/photo-1675773051474-55c4b7d2cf53?w=1200&h=800&fit=crop&auto=format',
    heroImg: 'https://images.unsplash.com/photo-1675773051474-55c4b7d2cf53?w=1600&h=1000&fit=crop&auto=format',
    result: "+34 % de conversion en six mois, et une liste d'attente.",
    slug: 'lavanta',
    featured: true,
  },
  {
    id: '2',
    num: '02',
    name: 'Studio Marché',
    discipline: 'Positionnement · Demande',
    year: '2025',
    location: 'Paris',
    brief: "Un marché qui devait redevenir celui de son quartier.",
    narrative: {
      problem: "Studio Marché tournait depuis quatre ans sans avoir jamais répondu à la question que les marchés qui marchent ne se posent jamais : nous sommes quoi, exactement ?",
      insight: "Ni les commerçants, ni la fréquentation : le marché lui-même était la marque, et personne ne l'avait nommé comme une seule chose. Chaque étal avait son identité. Le marché n'en avait aucune.",
      intervention: "Nous avons défini un positionnement qui faisait du marché lui-même la marque, et non la somme de ce qui s'y vend, puis construit le système créatif et la campagne permettant à chaque commerçant d'y trouver sa place sans perdre sa propre voix.",
      outcome: "22 % de fréquentation en plus, et un marché qui se lit enfin comme un seul lieu.",
    },
    services: ['Stratégie de marque', 'Positionnement de marque', 'Direction de création', 'Stratégie de campagne'],
    relatedCapabilities: ['brand-strategy', 'brand-positioning', 'creative-direction', 'campaign-strategy'],
    img: 'https://images.unsplash.com/photo-1759050486852-fdfe2fdc7bea?w=1200&h=800&fit=crop&auto=format',
    heroImg: 'https://images.unsplash.com/photo-1759050486852-fdfe2fdc7bea?w=1600&h=1000&fit=crop&auto=format',
    result: "22 % de fréquentation en plus, et un marché qui se lit enfin comme un seul lieu.",
    slug: 'studio-marche',
    featured: false,
  },
  {
    id: '3',
    num: '03',
    name: 'Edde',
    discipline: 'Identité · Digital',
    year: '2025',
    location: 'Berlin',
    brief: "Une marque de soin conçue pour vieillir avec ses clientes.",
    narrative: {
      problem: "La plupart des marques de soin ont peur du vieillissement et bâtissent toute leur identité sur l'idée de l'inverser. Les clientes d'Edde n'en avaient pas peur, et la marque ne le reflétait pas encore.",
      insight: "Pour cette audience, le temps visible n'était pas quelque chose à dissimuler. C'était une preuve — la trace d'une vie que le produit est là pour accompagner, pas pour corriger.",
      intervention: "Nous avons construit une identité et un système digital qui traitent le vieillissement comme une chose à comprendre plutôt qu'à inverser, du langage des emballages aux mots employés sur les fiches produits.",
      outcome: "41 % de réachat en plus chez les clientes de plus de cinquante ans.",
    },
    services: ['Identité visuelle', 'Identité verbale', 'Conception et développement de sites web', 'Design UX/UI'],
    relatedCapabilities: ['brand-identity', 'verbal-identity', 'web-design-development', 'ux-ui-design'],
    img: 'https://images.unsplash.com/photo-1617050318658-a9a3175e34cb?w=1200&h=800&fit=crop&auto=format',
    heroImg: 'https://images.unsplash.com/photo-1617050318658-a9a3175e34cb?w=1600&h=1000&fit=crop&auto=format',
    result: "41 % de réachat en plus chez les clientes de plus de cinquante ans.",
    slug: 'edde',
    featured: false,
  },
  {
    id: '4',
    num: '04',
    name: 'Hinterland',
    discipline: 'Identité · Campagnes',
    year: '2025',
    location: 'Melbourne',
    brief: "Un groupe hôtelier qui devait vouloir dire quelque chose dans trois villes à la fois.",
    narrative: {
      problem: "Hinterland exploitait douze établissements dans trois villes. Un succès sur presque tous les critères, et rien qui permettait de le reconnaître comme une seule marque.",
      insight: "Le problème n'était pas un manque de goût — chaque lieu, pris isolément, paraissait réfléchi. C'était l'absence d'un système qui leur permette d'être reconnaissables comme une même maison sans être identiques.",
      intervention: "Nous avons construit une architecture de marque et un système d'identité capables de s'adapter aux formats — restaurant, bar, lieu événementiel — tout en restant indubitablement la même maison, puis nous les avons déployés dans les douze établissements.",
      outcome: "Une seule marque, douze lieux, trois villes, aucune confusion.",
    },
    services: ['Stratégie de marque', 'Architecture de marque', 'Direction de création', 'Stratégie de campagne'],
    relatedCapabilities: ['brand-strategy', 'brand-architecture', 'creative-direction', 'campaign-strategy'],
    img: 'https://images.unsplash.com/photo-1771440047944-0b5d792213a9?w=1200&h=800&fit=crop&auto=format',
    heroImg: 'https://images.unsplash.com/photo-1771440047944-0b5d792213a9?w=1600&h=1000&fit=crop&auto=format',
    result: "Une seule marque, douze lieux, trois villes, aucune confusion.",
    slug: 'hinterland',
    featured: false,
  },
  {
    id: '5',
    num: '05',
    name: 'Unnamed Project',
    discipline: 'Positionnement',
    year: '2026',
    location: 'Non communiqué',
    brief: "En cours. Nous en dirons plus dès que possible.",
    narrative: null,
    services: ['Stratégie de marque'],
    relatedCapabilities: ['brand-strategy'],
    img: 'https://images.unsplash.com/photo-1771440048218-68069773fa81?w=1200&h=800&fit=crop&auto=format',
    heroImg: 'https://images.unsplash.com/photo-1771440048218-68069773fa81?w=1600&h=1000&fit=crop&auto=format',
    result: "En cours. Nous en dirons plus dès que possible.",
    slug: 'unnamed-2026',
    featured: false,
  },
]

export const notes: Note[] = [
  {
    id: '1',
    title: "Le brief n'est jamais le brief",
    subtitle: "Pourquoi le document remis à une entreprise créative en début de projet décrit presque toujours le symptôme, et non le problème.",
    body: `Il existe un document au début de chaque projet de marque. Il fait en général douze pages. Il comporte une partie « Contexte », une partie « Objectifs » et une partie « L'enjeu ». On l'appelle un brief.

C'en est rarement un.

Ce que la plupart des clients remettent au démarrage d'un projet est la description des effets d'un problème qu'ils n'ont pas encore nommé. Le brief dit : notre taux de conversion est faible. Il dit : les gens ne comprennent pas ce que nous vendons. Il dit : nous nous sentons premium, mais nos prix ne le disent pas.

Ce sont des symptômes. Le brief est une liste de symptômes. Le vrai problème — celui qui, une fois résolu, fait disparaître tous les autres — n'y figure jamais, parce que le client ignore lequel c'est. S'il le savait, il l'aurait déjà réglé.

Ce n'est pas un reproche. C'est la nature même du métier. Le brief existe pour ouvrir une conversation, pas pour définir la réponse.

Une entreprise créative qui prend un brief au pied de la lettre construit en général la mauvaise chose. Non parce que le client se trompe, mais parce qu'il ne peut pas voir la forme de son propre problème. C'est précisément ce qu'il paie.

Le premier travail de toute mission de stratégie consiste à traduire le brief en la vraie question. C'est plus difficile qu'il n'y paraît et cela prend plus de temps que la plupart des clients ne l'imaginent. Et cela n'est presque jamais apprécié avant d'être fait.`,
    date: '3 juillet 2026',
    category: 'Essai',
    readTime: '8 min de lecture',
    img: 'https://images.unsplash.com/photo-1661178081018-d1b8e685ef10?w=1200&h=800&fit=crop&auto=format',
    slug: 'the-brief-is-never-the-brief',
  },
  {
    id: '2',
    title: "Ce que fait vraiment un packaging",
    subtitle: "Note sur la différence entre un emballage qui a l'air cher et un emballage qui fait qu'un produit vaut son prix.",
    body: `Le packaging a une mission. La plupart des packagings ont oublié laquelle.

Sa mission n'est pas d'avoir l'air cher. Une chose qui a l'air chère est une chose qui essaie. Sa mission est de faire sentir, à la seconde où on la tient, que le prix payé était le bon. Que le prix était même, tout compte fait, raisonnable.

C'est beaucoup plus difficile à obtenir, car cela oblige l'emballage à communiquer quelque chose de vrai sur le produit plutôt que quelque chose d'aspirationnel sur la marque. Et la plupart des marques ne connaissent, de leur produit, aucune vérité qui mérite d'être dite. Elles connaissent leur catégorie. Elles connaissent leur promesse différenciante. Elles ne savent pas ce qui rend leur produit réellement différent de celui posé juste à côté en rayon.

Un bon packaging est la traduction visuelle d'une vérité produit. Quand la vérité est forte, l'emballage peut être minimal. Quand elle est faible, aucun gaufrage ni grammage de carton ne le sauvera.`,
    date: '18 juin 2026',
    category: 'Notes',
    readTime: '5 min de lecture',
    img: 'https://images.unsplash.com/photo-1636014724389-270c4e9c0100?w=1200&h=800&fit=crop&auto=format',
    slug: 'what-packaging-actually-does',
  },
  {
    id: '3',
    title: "Le naming n'est pas un exercice créatif",
    subtitle: "Sur l'idée fausse qu'un bon nom de marque sort d'une longue liste et d'un vote.",
    body: `Chaque projet de naming commence de la même façon. Le client veut une liste. Plus elle est longue, mieux c'est. Il est persuadé que quelque part, parmi quatre cents noms, le bon se cache.

Il ne s'y cache pas.

Un nom de marque est un pari sur un ensemble de valeurs qui n'existent pas encore sur le marché. Il ne décrit pas l'entreprise. Il n'explique pas ce qu'elle vend. Il est le début d'une réputation, ce qui veut dire qu'il ne signifie quelque chose qu'après des années de travail qui lui ont donné ce sens.

Concrètement, le nom compte presque toujours moins que le client ne le croit, et la manière dont il est choisi compte presque toujours davantage. Un processus de naming qui exige l'accord de tout le monde autour de la table est un processus conçu pour produire un résultat moyen qui ne froissera personne.

Les meilleurs noms viennent d'une décision, pas d'un consensus.`,
    date: '2 mai 2026',
    category: 'Essai',
    readTime: '6 min de lecture',
    img: 'https://images.unsplash.com/photo-1483366774565-c783b9f70e2c?w=1200&h=800&fit=crop&auto=format',
    slug: 'naming-is-not-a-creative-exercise',
  },
  {
    id: '4',
    title: "Pourquoi la croissance est un problème de marque",
    subtitle: "Le moment où génération de demande et stratégie de marque deviennent la même discipline.",
    body: `Il existe une version du marketing qui traite la marque et la demande comme deux budgets distincts, avec des objectifs distincts. La marque, c'est ce qu'on dépense en notoriété. La demande, c'est ce qu'on dépense en conversion. Les deux équipes se voient une fois par mois et ne s'entendent pas sur l'attribution.

Cette séparation avait un sens quand l'espace média coûtait cher et que construire une marque demandait des années d'investissement patient. Elle en a beaucoup moins aujourd'hui, où un même contenu peut créer la notoriété, le désir et la transaction en un seul scroll.

Les marques les plus performantes avec lesquelles nous avons travaillé ne séparent pas ces deux choses. Elles comprennent que chaque point de contact fait en même temps un travail de marque et un travail de demande. La distinction est un héritage du média-planning, pas une description utile de la manière dont les gens décident vraiment d'acheter.

La croissance est un problème de marque parce que le désir est un résultat de marque. On ne génère pas de demande pour ce que personne ne veut. On construit l'envie d'abord. La croissance vient ensuite.`,
    date: '14 avril 2026',
    category: 'Essai',
    readTime: '7 min de lecture',
    img: 'https://images.unsplash.com/photo-1654481414716-2f4ab5fe0fbe?w=1200&h=800&fit=crop&auto=format',
    slug: 'why-growth-is-a-brand-problem',
  },
  {
    id: '5',
    title: "La tyrannie de la référence",
    subtitle: "Pourquoi le moodboard avec lequel un client arrive décrit en général la dernière marque qui l'a impressionné, et non celle qu'il devrait devenir.",
    body: `Chaque projet commence par des références. Un dossier, un board, un lien vers trois entreprises que le client admire. C'est censé aider, et parfois cela aide. Le plus souvent, c'est une capitulation discrète.

Une référence est la description d'un problème que quelqu'un d'autre a déjà résolu. C'est le résultat visible d'une stratégie que vous ne voyez pas, faite pour une entreprise que vous n'êtes pas. Emprunter le résultat sans la stratégie : voilà comment des marques finissent par avoir l'air chères et ne rien vouloir dire.

Les entreprises qui méritent d'être admirées ne sont pas arrivées à leur allure en collectionnant des références. Elles y sont arrivées en comprenant, sur elles-mêmes, quelque chose de vrai que personne d'autre ne pouvait revendiquer. L'assurance à laquelle vous réagissez n'est pas esthétique. C'est celle d'une entreprise qui sait exactement ce qu'elle est.

Nous prenons donc les références au sérieux — non comme des consignes, mais comme des indices. Qu'est-ce qui, précisément, vous fait envie ici ? Neuf fois sur dix, la réponse n'est ni la typographie ni la palette. C'est la certitude. Et la certitude ne se référence pas. Elle se gagne.`,
    date: '9 avril 2026',
    category: 'Essai',
    readTime: '6 min de lecture',
    img: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=1200&h=800&fit=crop&auto=format',
    slug: 'the-tyranny-of-the-reference',
  },
  {
    id: '6',
    title: "Le premium est une promesse, pas une finition",
    subtitle: "Sur la différence entre une marque qui a l'air chère et une marque qui se comporte comme si elle valait son prix.",
    body: `Les clients demandent du premium comme on parle du temps qu'il fait. Comme s'il s'agissait d'un réglage. Rendez ça plus premium — un peu de noir, une serif, un peu d'air.

Mais le premium n'est pas une finition qu'on applique à la fin. C'est une promesse tenue à chaque point de contact, dont la plupart n'ont rien à voir avec l'apparence de quoi que ce soit. C'est la vitesse de la réponse. La qualité de la boîte. La personne qui décroche le téléphone. Le fait que rien ne soit survendu et que rien ne déçoive.

Une marque paraît chère quand l'expérience ne contredit jamais le prix. À l'instant où elle le contredit — un tunnel d'achat maladroit, un e-mail bon marché, une promesse non tenue — le charme se rompt, et aucune dorure à chaud ne le rétablira.

C'est gênant, car cela veut dire que le premium n'est pas une chose que nous pouvons livrer dans une présentation. C'est un niveau d'exigence que toute l'entreprise doit tenir, longtemps après notre départ. Notre travail est de définir cette exigence assez précisément pour qu'elle puisse être défendue. La tenir revient au client.`,
    date: '20 mars 2026',
    category: 'Notes',
    readTime: '5 min de lecture',
    img: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&h=800&fit=crop&auto=format',
    slug: 'premium-is-a-promise-not-a-finish',
  },
  {
    id: '7',
    title: "Éloge du projet lent",
    subtitle: "Pourquoi le meilleur travail de marque résiste au calendrier sur lequel il a été vendu, et ce que cela coûte réellement.",
    body: `Tout bon projet connaît un moment où il devrait ralentir, et où il ne ralentit presque jamais. C'est le moment qui suit la recherche et précède la fabrication, quand la réponse honnête est : nous ne savons pas encore ce que c'est.

La pression, à cet instant, est énorme. Il y a un calendrier. Il y a des gens qui attendent. Il y a ce réflexe très humain qui consiste à convertir l'incertitude en activité, à commencer à produire quelque chose pour qu'au moins cela ressemble à de l'avancement. C'est ainsi que la plupart des projets déraillent en silence — non par mauvais travail, mais par un travail fait trop tôt, avant que la réflexion soit terminée.

Le projet lent n'est pas lent parce que quelqu'un se tourne les pouces. Il est lent parce qu'il refuse de fabriquer ce qu'il ne peut pas encore justifier. Il laisse la question ouverte, et inconfortable, quelques jours de plus qu'il ne semble raisonnable, parce que l'alternative est d'y répondre mal et de passer les trois mois suivants à défendre la réponse.

Nous ne sommes pas romantiques avec le temps. La lenteur coûte cher, nous le savons. Mais la chose la plus coûteuse qu'une entreprise puisse faire, c'est de construire vite la mauvaise marque, puis d'habiter dedans pendant dix ans.`,
    date: '28 février 2026',
    category: 'Carnet de terrain',
    readTime: '6 min de lecture',
    img: 'https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=1200&h=800&fit=crop&auto=format',
    slug: 'in-defence-of-the-slow-project',
  },
  {
    id: '8',
    title: "L'audience n'est pas tout le monde",
    subtitle: "Note sur le réflexe de vouloir plaire à plus de gens, et pourquoi c'est le moyen le plus sûr d'en faire bouger moins.",
    body: `Le retour le plus fréquent sur un travail de stratégie est une variante de : est-ce que cela pourrait parler à plus de monde ? La question est posée de bonne foi, et elle est presque toujours mauvaise.

Une marque qui tente de s'adresser à tout le monde n'est lisible pour personne. Elle arrondit chaque angle qui aurait pu donner envie de la choisir, dans l'espoir de ne froisser personne qui, de toute façon, serait passé son chemin. Le résultat est une marque techniquement acceptable pour un grand groupe, et réellement désirée par aucun de ses membres.

Le désir est spécifique. C'est le sentiment qu'une chose a été faite pour vous, par des gens qui vous comprenaient assez bien pour en exclure d'autres. Ce sentiment est impossible à fabriquer à grande échelle, et c'est le seul qui fasse passer quelqu'un de l'intérêt à l'achat de manière fiable.

Alors quand nous resserrons l'audience, nous ne réduisons pas l'opportunité. Nous la concentrons. Une marque dont un petit groupe ne peut plus se passer dépassera toujours une marque qu'un grand groupe peut prendre ou laisser. L'audience atteinte est un problème de distribution. Le désir est un problème de définition. Résolvez le second d'abord.`,
    date: '11 février 2026',
    category: 'Essai',
    readTime: '5 min de lecture',
    img: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&h=800&fit=crop&auto=format',
    slug: 'the-audience-is-not-everyone',
  },
  {
    id: '9',
    title: "Le logo est le moindre des sujets",
    subtitle: "Pourquoi le signe dont tout le monde débat est la plus petite décision d'une marque, et celle qui devrait être prise en dernier.",
    body: `C'est le logo qui obtient la réunion. Il obtient les allers-retours, les avis, et la personne restée silencieuse tout le projet qui trouve soudain sa voix. C'est la partie que chacun se sent qualifié pour juger, parce que c'est la partie qui ressemble à une décision.

Mais un logo est une signature, et une signature ne vaut que par tout ce que l'on a fait en dessous. Seul, c'est une forme. Il acquiert du sens par la répétition, par la qualité du travail à côté duquel il figure, par des années de comportement assez constant pour que la forme finisse par représenter quelque chose.

C'est pourquoi nous le faisons tard, et sans bruit. Quand vient le moment de dessiner le signe, les décisions difficiles sont déjà prises — le positionnement, la voix, le système. Le logo n'a plus qu'à se tenir devant tout cela sans le contredire. Quand la réflexion en dessous est solide, presque n'importe quel signe correctement dessiné fera l'affaire. Quand elle est faible, aucun signe ne la sauvera.

Gardez la discussion pour la stratégie. Laissez le logo être la partie facile.`,
    date: '22 janvier 2026',
    category: 'Notes',
    readTime: '5 min de lecture',
    img: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1200&h=800&fit=crop&auto=format',
    slug: 'a-logo-is-the-least-of-it',
  },
  {
    id: '10',
    title: "Le prix à payer pour parler comme tout le monde",
    subtitle: "Sur l'étrange confort des mots que toutes les entreprises emploient, et ce qu'il coûte de s'y cacher.",
    body: `Lisez assez de discours de marque et vous finirez par remarquer qu'ils se ressemblent tous. Tout le monde est passionné. Tout le monde est innovant. Tout le monde place le client au cœur de ses préoccupations. Ces mots sont si répandus qu'ils ne transportent plus aucune information — ils sont du bruit déguisé en sens.

Les entreprises s'y accrochent parce qu'ils ne font courir aucun risque. Personne n'a jamais été licencié pour avoir qualifié sa société d'innovante. Mais le langage sans risque a un coût qui n'apparaît sur aucune facture : il vous rend invisible. Si vous parlez comme tout le monde, vous demandez à ce qu'on ne se souvienne de personne.

L'alternative fait peur, parce qu'elle suppose de dire quelque chose d'assez précis pour que certains ne soient pas d'accord. Une vraie voix a des angles. Elle laisse des choses de côté. Elle s'engage sur une façon de voir le monde que tout le monde ne partagera pas, ce qui est exactement ce qui fait que ceux qui la partagent se sentent enfin trouvés.

Nous passons beaucoup de temps à supprimer les mots qui pourraient appartenir à n'importe qui. Ce qui reste est en général plus court, plus simple, et bien plus à vous.`,
    date: '8 janvier 2026',
    category: 'Essai',
    readTime: '6 min de lecture',
    img: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&h=800&fit=crop&auto=format',
    slug: 'the-cost-of-sounding-like-everyone',
  },
  {
    id: '11',
    title: "La cohérence n'est pas la répétition",
    subtitle: "La différence entre une marque qui tient ensemble et une marque simplement identique partout.",
    body: `Quelque part en chemin, la cohérence est devenue synonyme d'uniformité. Utilisez le logo à cette taille. Ce bleu, jamais celui-là. Le même traitement de titre sur toutes les surfaces. La charte est devenue une liste d'interdits, et la marque une chose qu'on pouvait casser mais jamais construire.

La vraie cohérence ne consiste pas à répéter les mêmes éléments. Elle consiste à répéter le même jugement. C'est ce qui fait que deux réalisations faites par des personnes différentes, dans des formats différents, à des années d'écart, semblent venir du même esprit. Cette unité ne vient pas du fait de tout verrouiller. Elle vient du fait que chacun comprend ce que la marque cherche à être, si bien que leurs mille petites décisions pointent dans la même direction.

Les marques rigides paraissent cohérentes dans une grille et s'effondrent dans le monde réel, parce que le monde demande toujours quelque chose que la charte n'avait pas prévu. Les marques cohérentes se plient sans se perdre, parce que ce qui les tenait n'a jamais été les règles — c'était le goût sous les règles.

Écrivez le jugement, pas seulement les mesures.`,
    date: '17 décembre 2025',
    category: 'Carnet de terrain',
    readTime: '6 min de lecture',
    img: 'https://images.unsplash.com/photo-1503694978374-8a2fa686963a?w=1200&h=800&fit=crop&auto=format',
    slug: 'consistency-is-not-repetition',
  },
  {
    id: '12',
    title: "Dites le prix à voix haute",
    subtitle: "Pourquoi une marque timide sur ce qu'elle coûte est en général mal assurée de ce qu'elle vaut.",
    body: `On apprend beaucoup d'une entreprise à la manière dont elle se comporte autour de son propre prix. Les entreprises sûres d'elles l'annoncent simplement et passent à la suite. Les hésitantes l'enterrent, le mettent derrière un formulaire, l'entourent de justifications, ou évitent le sujet jusqu'au dernier moment possible.

Le prix est la chose la plus claire qu'une marque dise jamais sur elle-même. C'est une affirmation de valeur, faite en public, que toute l'expérience doit ensuite honorer. Une entreprise nerveuse sur son prix vous dit en réalité qu'elle n'est pas certaine que l'affirmation soit vraie — et les clients sentent cette hésitation bien avant de voir un chiffre.

Le travail de marque consiste, pour une large part, à gagner le droit à un prix, puis à avoir le cran de l'énoncer. Quand le positionnement est net et l'expérience entière, le chiffre cesse d'être un risque et devient un fait. Rien ne signale mieux l'assurance qu'une entreprise qui vous dit simplement ce qu'elle coûte.

Si vous ne pouvez pas dire le prix à voix haute, le problème est rarement le prix.`,
    date: '3 décembre 2025',
    category: 'Essai',
    readTime: '5 min de lecture',
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
    quote: "Ils ont trouvé la phrase que toute notre entreprise n'arrivait pas à dire depuis six ans. Tout a été plus simple ensuite — le prix, le recrutement, le pitch.",
    name: 'Amara Devlin',
    role: 'Fondatrice',
    company: 'Lavanta',
  },
  {
    quote: "La plupart des gens arrivent avec une présentation. Eux sont arrivés avec une question, et c'était la seule qui comptait. Nous nous servons encore de la réponse.",
    name: 'Henri Vasseur',
    role: 'Directeur général',
    company: 'Studio Marché',
  },
  {
    quote: "Nous avions confondu avoir l'air cher et être désirés. Ils ont tout démonté, gardé les deux choses qui étaient vraies, et reconstruit le reste autour.",
    name: 'Ingrid Solberg',
    role: 'Directrice générale',
    company: 'Edde',
  },
  {
    quote: "Le travail était précis, mais ce que je n'attendais pas, c'est à quel point il était commercial. Chaque décision revenait à un chiffre que nous pouvions vraiment faire bouger.",
    name: 'Marcus Bianchi',
    role: 'Directeur marketing groupe',
    company: 'Hinterland',
  },
]

/* ── Domaines d'expertise ─────────────────────────────────────────────────
   Cinq familles. Les clés `key` et `category` restent en anglais : ce sont
   des identifiants internes, jamais affichés tels quels. */

export const categories: { key: Category; label: string; blurb: string; accent: string }[] = [
  { key: 'Brand & Identity', label: 'Marque et identité', blurb: "Ce qu'est l'entreprise, et la façon dont elle se voit, s'entend et se comporte.", accent: '#6E2237' },
  { key: 'Digital & Product', label: 'Digital et produit', blurb: "Là où les gens la rencontrent, et décident.", accent: '#6A6383' },
  { key: 'Growth & Demand', label: 'Croissance et demande', blurb: "Comment on la rend désirable, à grande échelle.", accent: '#7F8B3E' },
  { key: 'Market & Expansion', label: 'Marché et expansion', blurb: "Là où elle va ensuite, et qui il faut convaincre pour y arriver.", accent: '#C08A1E' },
  { key: 'Experiences', label: 'Expériences', blurb: "Là où la marque a lieu dans une pièce, pas dans un navigateur.", accent: '#221E1B' },
]

export const capabilities: Capability[] = [
  // ── Marque et identité ────────────────────────────────────────────────
  {
    slug: 'brand-strategy',
    name: 'Stratégie de marque',
    category: 'Brand & Identity',
    summary: "La logique commerciale sous la marque — ce que vous vendez, à qui, et pourquoi cela l'emporte.",
    lede: "La stratégie de marque n'est pas une humeur. C'est l'argument qui justifie qu'une entreprise existe, au bon prix, sur un marché qui n'a besoin de rien de plus. Nous construisons cet argument en premier, parce que toutes les décisions qui suivent — identité, produit, prix, média — deviennent moins chères et plus nettes une fois qu'il existe.",
    includes: ["Cartographie des audiences et de la demande", "Formulation de la proposition et de la valeur", "Architecture de marque", "Analyse concurrentielle et de catégorie"],
    question: "Pourquoi nous choisir, et payer ce que nous valons ?",
    outcome: "Une stratégie écrite et validée, qui rend les cent décisions suivantes plus rapides.",
    queries: ["stratégie de marque définition", "agence de stratégie de marque Amsterdam", "comment positionner sa marque", "différence entre stratégie de marque et stratégie marketing"],
  },
  {
    slug: 'brand-positioning',
    name: 'Positionnement de marque',
    category: 'Brand & Identity',
    summary: "La place unique que vous occupez dans la tête d'un acheteur — défendue par des preuves, pas par des adjectifs.",
    lede: "La plupart des entreprises sont positionnées par accident : par celui qui a parlé le plus fort au dernier atelier. Nous cherchons le positionnement à la fois vrai et inoccupé, puis nous le rendons défendable — pour que le marché vous classe dans une catégorie qui ne compte que vous.",
    includes: ["Définition de la catégorie et du cadre de référence", "Point de différence et preuves", "Plateforme de positionnement et maison des messages", "Plan de transition depuis votre situation actuelle"],
    question: "De quoi voulons-nous être le choix évident ?",
    outcome: "Un positionnement que les concurrents ne peuvent copier sans devenir vous.",
    queries: ["positionnement de marque", "repositionner son entreprise", "exemple de plateforme de positionnement", "comment se différencier de ses concurrents"],
  },
  {
    slug: 'naming',
    name: 'Naming',
    category: 'Brand & Identity',
    summary: "Des noms d'entreprises, de produits et de gammes — décidés, pas soumis au vote.",
    lede: "Un nom est un pari sur un ensemble de valeurs qui n'existent pas encore sur le marché. Nous ne livrons pas une liste de quatre cents propositions en vous demandant de choisir. Nous prenons une décision, nous la défendons sur le plan linguistique et juridique, et nous vous donnons le récit qui la fait tenir.",
    includes: ["Stratégie et territoires de naming", "Création et présélection", "Vérification linguistique et antériorités de marque", "Argumentaire et langage de déploiement"],
    question: "Comment cela doit-il s'appeler, et pouvons-nous le posséder ?",
    outcome: "Un nom que vous pouvez déposer, défendre et faire grandir.",
    queries: ["agence de naming", "comment trouver un nom d'entreprise", "processus de création de nom de produit", "vérifier la disponibilité d'un nom de marque"],
  },
  {
    slug: 'brand-architecture',
    name: 'Architecture de marque',
    category: 'Brand & Identity',
    summary: "La façon dont une entreprise organise ses marques, sous-marques et produits pour que la croissance ajoute de la clarté, pas de la confusion.",
    lede: "Toute entreprise finit par avoir plus d'une chose à nommer : une nouvelle gamme, un nouveau marché, un nouveau lieu. L'architecture de marque est le système de décision qui détermine ce qui reçoit son propre nom, ce qui emprunte celui de la maison mère, et comment l'ensemble de la famille reste lisible à mesure qu'elle grandit.",
    includes: ["Audit du portefeuille et de la structure", "Arbitrages marque mère / sous-marques", "Règles de nomenclature et de naming", "Gouvernance du déploiement"],
    question: "Quand nous lancerons la prochaine chose, est-ce qu'elle nous renforce ou nous dilue ?",
    outcome: "Une structure qui grandit sans exiger un changement de nom tous les dix-huit mois.",
    queries: ["architecture de marque", "marque mère ou sous-marque", "stratégie de portefeuille de marques", "comment nommer une gamme de produits"],
  },
  {
    slug: 'brand-identity',
    name: 'Identité visuelle',
    category: 'Brand & Identity',
    summary: "Un système visuel complet — logo, typographie, couleur, mise en page — qui tient encore debout sans le logo.",
    lede: "La reconnaissance ne vient pas d'un logo. Elle vient d'un ensemble de codes si constants que la marque reste lisible même quand le nom a disparu. Nous construisons ce système, et la charte qui le garde vivant.",
    includes: ["Logo, symbole et déclinaisons", "Systèmes typographiques, chromatiques et de mise en page", "Direction artistique et iconographie", "Charte de marque et bibliothèques d'assets"],
    question: "Qu'est-ce qui nous rend reconnaissables au premier coup d'œil ?",
    outcome: "Un système que votre équipe peut faire vivre sans nous dans la pièce.",
    queries: ["création d'identité visuelle", "système d'identité de marque", "charte graphique et logo", "agence de refonte de marque"],
  },
  {
    slug: 'verbal-identity',
    name: 'Identité verbale',
    category: 'Brand & Identity',
    summary: "Les mots que seule votre entreprise emploierait — ton, vocabulaire et règles qui les gardent constants.",
    lede: "Un système visuel dit à quoi ressemble une marque. Une identité verbale dit comment elle sonne — le vocabulaire vers lequel elle va, les plaisanteries qu'elle fait et celles qu'elle ne fait pas, la longueur de phrase qui lui ressemble. Nous écrivons les règles, puis les cent premiers exemples, pour que l'équipe entende la différence.",
    includes: ["Principes de ton de voix", "Vocabulaire et lexique", "Maison des messages et bibliothèque d'accroches", "Guide rédactionnel et formation"],
    question: "Reconnaîtrait-on nos textes si l'on retirait le logo ?",
    outcome: "Une voix assez singulière pour mériter d'être protégée.",
    queries: ["ton de voix de marque", "charte éditoriale de marque", "plateforme de messages de marque", "comment définir la voix de sa marque"],
  },
  {
    slug: 'creative-direction',
    name: 'Direction de création',
    category: 'Brand & Identity',
    summary: "Le goût et le jugement qui tiennent une marque ensemble dans tout ce qu'elle produit.",
    lede: "La direction de création, c'est l'édition à l'échelle de toute l'entreprise : photographie, ton, campagnes et les mille petits arbitrages qui décident si une marque paraît pensée ou assemblée. Nous tenons la ligne pour que le travail reste cohérent à mesure qu'il grandit.",
    includes: ["Direction artistique et photographique", "Conception de campagnes", "Ton et gouvernance créative", "Supervision de production"],
    question: "Est-ce que tout ce que nous produisons nous ressemble ?",
    outcome: "Un travail qui reste indubitablement celui d'une seule maison, quel que soit le volume.",
    queries: ["agence de direction de création", "direction artistique de marque", "direction de création de campagne", "direction photo pour une marque"],
  },
  {
    slug: 'packaging',
    name: 'Packaging',
    category: 'Brand & Identity',
    summary: "Un design d'emballage, structure et graphisme, qui justifie le prix en rayon et pas seulement à l'écran.",
    lede: "Le packaging est la seule pièce de marque qu'un client tient réellement dans les mains. Nous concevons la structure et le graphisme ensemble, pour que l'objet plaide en faveur du prix avant qu'un mot ne soit lu — et qu'il travaille aussi bien photographié dans un fil qu'en rayon.",
    includes: ["Conception structurelle et tracés de découpe", "Matériaux et production d'impression", "Systèmes de gammes et de déclinaisons", "Écoconception et optimisation des coûts"],
    question: "Est-ce que le tenir en main rend le prix évident ?",
    outcome: "Un packaging qui se lit comme réfléchi, pas comme décoré.",
    queries: ["agence de design packaging", "création de packaging produit", "packaging écoresponsable design", "design packaging grande distribution"],
  },

  // ── Digital et produit ────────────────────────────────────────────────
  {
    slug: 'web-design-development',
    name: 'Conception et développement de sites web',
    category: 'Digital & Product',
    summary: "Des sites qui chargent vite, se lisent clairement pour les moteurs et les IA, et amènent les gens vers une décision.",
    lede: "Un site web est l'endroit où la plupart des gens décident s'ils vous font confiance. Nous concevons et développons des sites qui chargent vite, se lisent bien pour les moteurs de recherche comme pour les robots d'IA, et conduisent le visiteur vers une décision — sans jamais ressembler à un template.",
    includes: ["Design et direction artistique", "Développement front-end et CMS", "Core Web Vitals et performance", "Balisage, sémantique et accessibilité"],
    question: "Notre site inspire-t-il confiance et génère-t-il des demandes ?",
    outcome: "Un site qui se positionne, qui convertit et qui reste simple à faire vivre.",
    queries: ["agence de création de site internet", "site web qui convertit", "création de site optimisé SEO", "développement de site avec CMS"],
  },
  {
    slug: 'ux-ui-design',
    name: 'Design UX/UI',
    category: 'Digital & Product',
    summary: "Des interfaces que les gens comprennent immédiatement et prennent plaisir à utiliser.",
    lede: "Une bonne UX est invisible ; une mauvaise UX est une fuite dans le tunnel. Nous concevons des parcours, des écrans et des systèmes qui réduisent la friction, respectent l'attention et tiennent à l'usage réel — mesurés, pas affirmés.",
    includes: ["Recherche utilisateur et parcours", "Design d'interface et d'interaction", "Design systems et composants", "Tests d'utilisabilité"],
    question: "Les gens peuvent-ils faire, facilement, ce pour quoi ils sont venus ?",
    outcome: "Moins d'abandons, plus d'actions menées à terme.",
    queries: ["agence UX UI", "prestation de design produit", "test utilisateur", "création d'un design system"],
  },
  {
    slug: 'digital-product-design',
    name: 'Design de produits numériques',
    category: 'Digital & Product',
    summary: "Applications, plateformes et outils conçus et développés de bout en bout.",
    lede: "Certaines marques ont besoin de plus qu'un site : elles ont besoin d'un produit. Nous menons les produits numériques du concept à la mise en ligne, en réunissant design et ingénierie pour que ce que vous lancez soit exactement ce que vous aviez défendu.",
    includes: ["Stratégie produit et cadrage", "Design et prototypage", "Développement full-stack", "Itérations et feuille de route"],
    question: "Que devons-nous construire, et savez-vous le construire ?",
    outcome: "Un produit sur le marché, pas un prototype dans un tiroir.",
    queries: ["agence de design de produit numérique", "conception et développement d'application", "développement de MVP", "studio de conception produit"],
  },
  {
    slug: 'ecommerce',
    name: 'E-commerce',
    category: 'Digital & Product',
    summary: "Des boutiques et des tunnels d'achat construits pour convertir, pas seulement pour afficher un catalogue.",
    lede: "Un site e-commerce est une surface de vente dont l'éclairage, la file d'attente et le vendeur sont conçus en même temps. Nous construisons des boutiques, des fiches produits et des tunnels d'achat réglés pour la conversion et le réachat, sur la plateforme qui convient vraiment à l'entreprise.",
    includes: ["Choix de plateforme et développement", "Design des pages produits et catégories", "Optimisation du tunnel et de la conversion", "Merchandising et tests CRO"],
    question: "Le chemin de l'envie à l'achat est-il aussi court qu'il devrait l'être ?",
    outcome: "Une boutique qui transforme la visite en achat.",
    queries: ["création de site e-commerce", "agence Shopify", "optimisation du taux de conversion e-commerce", "design UX e-commerce"],
  },

  // ── Croissance et demande ─────────────────────────────────────────────
  {
    slug: 'growth-strategy',
    name: 'Stratégie de croissance',
    category: 'Growth & Demand',
    summary: "Le plan qui relie marque, produit et demande en un seul moteur commercial.",
    lede: "La croissance n'est pas un service. C'est ce qui arrive quand la marque, le produit et la génération de demande racontent la même histoire et visent les mêmes chiffres. Nous construisons le plan qui tient les trois ensemble, avec les canaux, le séquencement et les objectifs qui prouvent que cela fonctionne.",
    includes: ["Modèle de croissance et mix de canaux", "Cartographie du tunnel et de la conversion", "Feuille de route de priorisation et de tests", "Reporting et objectifs commerciaux"],
    question: "Qu'est-ce qui va réellement faire bouger le chiffre d'affaires, et dans quel ordre ?",
    outcome: "Un seul plan de croissance, partagé par toute l'entreprise.",
    queries: ["agence de stratégie de croissance", "stratégie de growth marketing", "comment construire un plan de croissance", "aligner marque et acquisition"],
  },
  {
    slug: 'performance-marketing',
    name: 'Marketing à la performance',
    category: 'Growth & Demand',
    summary: "Une acquisition payante qui respecte autant la marque que le compte de résultat.",
    lede: "La performance sans marque brûle du cash ; la marque sans performance s'étiole. Nous pilotons le média payant comme un seul système avec votre marque — des créations qui ne pourraient être que les vôtres, un ciblage qui ne se contente pas du confort, et un reporting sur lequel on peut réellement agir.",
    includes: ["Search, social et display payants", "Cadres de test créatif", "Mesure et attribution", "Stratégie de budget et d'enchères"],
    question: "Chaque euro investi en média travaille-t-il autant qu'il le pourrait ?",
    outcome: "Une économie d'acquisition qui s'améliore à mesure que vous grandissez.",
    queries: ["agence de marketing à la performance", "gestion de campagnes média payantes", "agence SEA", "growth marketing"],
  },
  {
    slug: 'seo',
    name: 'SEO',
    category: 'Growth & Demand',
    summary: "Un SEO technique, éditorial et sémantique pensé pour Google comme pour les moteurs de réponse IA.",
    lede: "La recherche en 2026, ce sont deux jeux à la fois : se positionner dans Google et être la source qu'une IA cite dans sa réponse. Nous faisons les deux — fondations techniques, contenu sémantique et autorité d'entité — pour que vous apparaissiez là où la décision se prend vraiment.",
    includes: ["SEO technique et Core Web Vitals", "Autorité d'entité et couverture thématique", "Optimisation on-page et éditoriale", "Optimisation pour la recherche IA et les moteurs de réponse"],
    question: "Apparaissons-nous au bon moment, dans la recherche comme dans les réponses IA ?",
    outcome: "Un trafic qualifié qui arrive prêt à prendre contact.",
    queries: ["agence SEO 2026", "référencement dans les IA", "optimisation pour les moteurs de réponse", "SEO sémantique et entités", "comment apparaître dans ChatGPT et Perplexity"],
  },
  {
    slug: 'content-strategy',
    name: 'Stratégie et gestion de contenu',
    category: 'Growth & Demand',
    summary: "Quoi dire, où et pourquoi — plus le système qui garantit que cela sort à l'heure.",
    lede: "Le contenu est la façon dont une marque gagne de l'attention entre deux achats. Nous définissons les territoires que vous pouvez légitimement occuper, les formats adaptés à chaque canal, la structure sémantique qui vous fait citer par les moteurs et les IA, ainsi que le calendrier et le processus qui rendent tout cela tenable plutôt que sporadique.",
    includes: ["Stratégie éditoriale et piliers de contenu", "Cartographie des sujets et des entités pour le SEO", "Organisation et calendrier de production", "Mesure et itération"],
    question: "Que devons-nous publier, et pourrons-nous vraiment tenir le rythme ?",
    outcome: "Un moteur de contenu qui capitalise au lieu de repartir de zéro.",
    queries: ["agence de stratégie de contenu", "stratégie de contenu SEO", "ligne éditoriale de marque", "gestion de contenu pour la recherche IA"],
  },
  {
    slug: 'social-media',
    name: 'Stratégie et gestion des réseaux sociaux',
    category: 'Growth & Demand',
    summary: "Une présence sociale qui a un point de vue, tenue avec la discipline d'un titre de presse.",
    lede: "La plupart des comptes de marque sont un calendrier éditorial déguisé en stratégie. Nous partons de ce que la marque a réellement à dire, choisissons les plateformes qui méritent l'effort, et tenons le compte comme le ferait un rédacteur en chef — voix constante, rythme réfléchi, conversations réelles.",
    includes: ["Stratégie de plateformes et de formats", "Planification et production de contenus", "Animation de communauté", "Analyse et itération"],
    question: "Nos publications sonnent-elles comme quelqu'un en particulier ?",
    outcome: "Une communauté qui se comporte comme un public, pas comme un chiffre.",
    queries: ["agence de stratégie réseaux sociaux", "agence de gestion des réseaux sociaux", "stratégie social media de marque", "croissance organique sur les réseaux sociaux"],
  },
  {
    slug: 'influencer-marketing',
    name: "Marketing d'influence et de créateurs",
    category: 'Growth & Demand',
    summary: "Des partenariats créateurs choisis pour leur justesse et la confiance qu'ils inspirent, pas pour un nombre d'abonnés.",
    lede: "Les meilleurs partenariats créateurs ressemblent à une recommandation, pas à une publicité. Nous trouvons les voix auxquelles votre audience fait déjà confiance, nous les briefons correctement, et nous construisons des relations qui rapportent au-delà d'un seul post.",
    includes: ["Stratégie et sourcing de créateurs", "Brief et gestion de la relation", "Droits et exploitation des contenus", "Performance et mesure"],
    question: "Qui notre audience croit-elle, et comment bien travailler avec eux ?",
    outcome: "Des partenariats qui se lisent comme de la confiance, pas comme de la dépense.",
    queries: ["agence de marketing d'influence", "partenariats avec des créateurs", "stratégie UGC", "comment lancer une campagne d'influence"],
  },
  {
    slug: 'email-marketing',
    name: 'Email marketing',
    category: 'Growth & Demand',
    summary: "Des programmes relationnels et CRM qui transforment une base en chiffre d'affaires.",
    lede: "L'e-mail est le seul canal qui vous appartient. Nous concevons des programmes relationnels — bienvenue, nurturing, fidélisation, réactivation — qui sonnent comme votre marque et font bouger des chiffres visibles dans le tableau de bord dès vendredi.",
    includes: ["Conception des scénarios et automatisations", "Segmentation et stratégie CRM", "Rédaction, design et templates", "Tests et délivrabilité"],
    question: "Notre audience propriétaire rapporte-t-elle vraiment ?",
    outcome: "Du chiffre d'affaires généré par des gens qui vous connaissent déjà.",
    queries: ["agence email marketing", "marketing relationnel et CRM", "agence Klaviyo", "marketing de rétention"],
  },
  {
    slug: 'campaign-strategy',
    name: 'Stratégie de campagne',
    category: 'Growth & Demand',
    summary: "La grande idée, et le plan média qui la met devant les bonnes personnes, au bon moment.",
    lede: "Une campagne n'est pas un parti pris créatif à la recherche d'un plan média. C'est une idée, exprimée correctement pour chaque endroit où elle apparaît, avec un plan média construit autour des moments où votre audience prête réellement attention. Nous concevons les deux moitiés ensemble.",
    includes: ["Idée et concept de campagne", "Planification des canaux et du média", "Déclinaison des assets par format", "Calendrier de diffusion et mesure"],
    question: "Quelle est l'idée unique, et où doit-elle apparaître ?",
    outcome: "Une campagne qui paraît pensée, pas dispersée.",
    queries: ["agence de stratégie de campagne", "planification de campagne 360", "création de campagne publicitaire", "plan média pour une campagne de marque"],
  },

  // ── Marché et expansion ───────────────────────────────────────────────
  {
    slug: 'market-research',
    name: 'Études de marché',
    category: 'Market & Expansion',
    summary: "Des preuves sur les acheteurs, les catégories et les prix — avant les décisions coûteuses.",
    lede: "Nous étudions pour décider, pas pour nous rassurer. De la profondeur qualitative là où la nuance compte, de l'échelle quantitative là où la confiance compte, et une synthèse qui change vraiment ce que vous construirez ensuite.",
    includes: ["Entretiens qualitatifs et ethnographie", "Enquêtes quantitatives et segmentation", "Études de prix et de consentement à payer", "Analyse de catégorie et de tendances"],
    question: "Que croient réellement nos acheteurs, et pour quoi paient-ils ?",
    outcome: "Des décisions fondées sur des preuves plutôt que sur l'avis le plus insistant.",
    queries: ["étude de marché pour une marque", "étude de segmentation client", "étude de prix", "analyse du consentement à payer"],
  },
  {
    slug: 'go-to-market-strategy',
    name: 'Stratégie go-to-market',
    category: 'Market & Expansion',
    summary: "Le plan séquencé pour lancer ou changer d'échelle — canaux, message, exécution et économie.",
    lede: "Un excellent produit avec un go-to-market flou est un échec lent et coûteux. Nous planifions le lancement comme un système commercial : qui l'apprend en premier, ce qu'il entend, où va l'argent, et comment savoir en quelques semaines — plutôt qu'en quelques trimestres — que cela fonctionne.",
    includes: ["Séquencement et phasage du lancement", "Plan de canaux et de messages", "Alignement des ventes et du marketing", "Indicateurs, objectifs et préparation"],
    question: "Comment lancer cela pour que ça prenne et que ça rapporte ?",
    outcome: "Un plan de lancement avec des responsables, des dates et des chiffres.",
    queries: ["stratégie go to market", "plan de lancement produit", "stratégie GTM startup", "comment lancer une marque"],
  },
  {
    slug: 'b2b-partnerships',
    name: 'Partenariats B2B et rendez-vous clients',
    category: 'Market & Expansion',
    summary: "De la distribution par d'autres entreprises — ciblage, prise de contact et rendez-vous eux-mêmes.",
    lede: "Parfois, la route la plus rapide vers la demande passe par l'audience de quelqu'un d'autre. Nous concevons et négocions des partenariats — co-marketing, distribution, offres groupées — et, quand c'est utile, nous entrons nous-mêmes dans la pièce : identifier, approcher et rencontrer les entreprises qui valent la peine.",
    includes: ["Stratégie et ciblage des partenariats", "Prise de contact et cadrage des accords", "Programmes de co-marketing", "Préparation et animation des rendez-vous"],
    question: "À qui emprunter une audience, et à quelles conditions ?",
    outcome: "Un canal de distribution qui n'est pas un budget média supplémentaire.",
    queries: ["stratégie de partenariats B2B", "agence de co-marketing", "partenariats de distribution", "alliances stratégiques"],
  },
  {
    slug: 'market-entry',
    name: 'Entrée sur un nouveau marché',
    category: 'Market & Expansion',
    summary: "L'étude, le positionnement et le plan pour emmener une marque dans un nouveau pays ou une nouvelle catégorie.",
    lede: "Une marque qui fonctionne sur un marché ne fonctionne pas automatiquement sur le suivant. Nous évaluons la demande, la concurrence, la réglementation et la pertinence culturelle avant de recommander comment — ou s'il faut — y entrer, puis nous construisons le positionnement localisé et le plan pour le faire correctement.",
    includes: ["Évaluation de la viabilité du marché", "Paysage concurrentiel et réglementaire", "Positionnement et messages localisés", "Séquencement de l'entrée et partenaires"],
    question: "Devons-nous entrer sur ce marché, et si oui, comment ?",
    outcome: "Un plan d'entrée fondé sur des preuves, pas sur l'enthousiasme.",
    queries: ["stratégie d'entrée sur un marché étranger", "stratégie d'expansion internationale", "comment lancer une marque dans un nouveau pays", "conseil en implantation à l'international"],
  },
  {
    slug: 'investor-readiness',
    name: 'Préparation aux levées de fonds et rendez-vous investisseurs',
    category: 'Market & Expansion',
    summary: "Le récit, le deck et les preuves qui rendent une entreprise finançable — et les rendez-vous eux-mêmes.",
    lede: "Les investisseurs achètent une histoire sur l'avenir, appuyée par des preuves venues du présent. Nous façonnons l'equity story, affûtons le deck et mettons les chiffres à l'épreuve pour que la salle se penche en avant pour les bonnes raisons — et, quand c'est utile, nous participons aux rendez-vous.",
    includes: ["Equity story et récit d'entreprise", "Design et rédaction du pitch deck", "Narration à l'appui de la data room", "Répétitions, préparation aux questions et rendez-vous investisseurs"],
    question: "Pourquoi est-ce cette entreprise qu'il faut financer, maintenant ?",
    outcome: "Un récit de levée qui résiste à la due diligence.",
    queries: ["agence de pitch deck investisseurs", "comment rendre son entreprise finançable", "equity story", "récit de levée de fonds seed"],
  },
  {
    slug: 'growth-process-consultancy',
    name: 'Conseil en processus de croissance',
    category: 'Market & Expansion',
    summary: "Comment l'équipe planifie, livre et mesure réellement la croissance — pas seulement ce qu'elle devrait faire ensuite.",
    lede: "Parfois le plan est juste et c'est le processus autour qui est cassé : personne ne porte la feuille de route, les tests n'ont aucun rythme, et chaque trimestre repart d'une page blanche. Nous auditons la manière dont la croissance se décide et se livre réellement chez vous, puis nous installons un processus que votre équipe continue d'utiliser après notre départ.",
    includes: ["Audit du rythme opérationnel de la croissance", "Feuille de route, responsabilités et reporting", "Cadres de test et de priorisation", "Formation de l'équipe et passation"],
    question: "Le goulot d'étranglement, c'est la stratégie ou notre façon de travailler ?",
    outcome: "Un processus de croissance que l'équipe fait tourner sans nous.",
    queries: ["conseil en processus de croissance", "conseil en marketing operations", "organisation d'une équipe growth", "comment construire une roadmap de croissance"],
  },

  // ── Expériences ───────────────────────────────────────────────────────
  {
    slug: 'events',
    name: 'Événements',
    category: 'Experiences',
    summary: "Des rendez-vous conçus pour construire la marque dans la pièce, pas seulement pour remplir un calendrier.",
    lede: "Une partie de la construction de marque n'a lieu qu'en personne. Nous concevons, dessinons et produisons des événements qui méritent le déplacement — lancements, dîners, soirées de studio — en traitant la pièce elle-même comme une œuvre avec un début, un milieu et une fin.",
    includes: ["Concept et identité de l'événement", "Design de l'expérience invité", "Production et exécution le jour J", "Suivi et mesure"],
    question: "Pour quoi vaut-il la peine de réunir des gens, et s'en souviendront-ils ?",
    outcome: "Une salle qui se souvient de vous.",
    queries: ["agence événementielle de marque", "agence de marketing expérientiel", "production d'événement de lancement", "conception d'événement d'entreprise"],
  },
  {
    slug: 'exhibitions',
    name: 'Expositions',
    category: 'Experiences',
    summary: "Des espaces physiques et éphémères où l'on rencontre la marque comme un objet, pas comme un écran.",
    lede: "Une exposition demande davantage à une marque qu'un stand : elle doit survivre au fait qu'on en fasse le tour. Nous concevons des expositions, des installations et des pop-up qui tiennent en trois dimensions, du concept spatial jusqu'à la fabrication et au montage.",
    includes: ["Concept spatial et scénographie", "Design graphique et environnemental", "Fabrication et gestion de production", "Montage et démontage"],
    question: "La marque reste-t-elle elle-même dans un espace physique ?",
    outcome: "Un lieu que les gens photographient sans qu'on le leur demande.",
    queries: ["agence de scénographie d'exposition", "conception de pop-up store", "installation de marque", "design de stand de salon"],
  },
  {
    slug: 'workshops',
    name: 'Ateliers',
    category: 'Experiences',
    summary: "Des sessions pratiques en petit comité, qui laissent une équipe capable de faire davantage elle-même.",
    lede: "Nous animons des sessions de travail, pas des conférences — sur le positionnement, le naming, la direction de création et le brief lui-même — construites autour de votre projet réel, pas d'une présentation générique. Les équipes repartent avec une décision prise, pas avec un cadre théorique expliqué.",
    includes: ["Conception et animation de l'atelier", "Travail préparatoire et matériaux", "Sessions de décision en direct", "Comptes rendus écrits et prochaines étapes"],
    question: "Que cette équipe pourrait-elle décider elle-même, avec la bonne structure dans la pièce ?",
    outcome: "Une décision prise, pas seulement un cadre expliqué.",
    queries: ["atelier de stratégie de marque", "atelier de direction de création", "animation d'atelier de positionnement", "formation à la marque en interne"],
  },
  {
    slug: 'trainings',
    name: 'Formations',
    category: 'Experiences',
    summary: "Des formations plus longues, en présentiel, en stratégie de marque et direction de création — ouverture en 2027.",
    lede: "Tout ce que nous avons appris en stratégie de marque et en direction de création, transmis directement, sur deux jours, à un petit groupe. Pas une série de webinaires. Pas un certificat. La même réflexion que nous facturons à nos clients, enseignée en personne.",
    includes: ["Format de deux jours en présentiel", "Douze participants au maximum", "Parcours Stratégie de marque et Direction de création", "Amsterdam, plus une autre ville par an"],
    question: "La réflexion derrière le travail peut-elle s'enseigner, et pas seulement se livrer ?",
    outcome: "Une salle de gens qui peuvent désormais en faire davantage eux-mêmes.",
    queries: ["formation en stratégie de marque", "formation en direction de création", "atelier branding en présentiel 2027", "formations Not by Accident"],
  },
]

/* ── Entreprise, contact et réseaux ───────────────────────────────────────
   Immatriculation, téléphone et adresse du studio sont des textes d'attente
   — ils ne doivent jamais être inventés. */
export const company = {
  name: 'Not by Accident',
  legalName: 'Not by Accident',
  tagline: 'Désirables, jamais par hasard.',
  proposition: 'Nous rendons les entreprises désirables. La croissance vient ensuite.',
  email: 'hello@notbyaccident.com',
  pressEmail: 'press@notbyaccident.com',
  newBusinessEmail: 'new@notbyaccident.com',
  phone: '',
  phonePlaceholder: 'Numéro de téléphone — à venir',
  registrationNote: "Numéro d'immatriculation et siège social — à venir",
  address: {
    line1: '',
    line2: '',
    city: '',
    postcode: '',
    country: '',
  },
  addressPlaceholder: 'Adresse du studio — à venir',
  hours: 'Lundi–jeudi, 10h00–17h00 CET',
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
    role: 'Associée fondatrice, stratégie',
    bio: "Sara a passé dix ans dans le conseil en stratégie avant de conclure que pensée de marque et pensée commerciale devaient former une seule discipline, pas deux. Elle a fondé Not by Accident sur cette conviction.",
    img: 'https://images.unsplash.com/photo-1675773051474-55c4b7d2cf53?w=600&h=750&fit=crop&auto=format',
  },
  {
    id: '2',
    name: 'Tomás Reyes',
    role: 'Associé fondateur, création',
    bio: "Tomás a dirigé la création pendant deux décennies, au sein d'agences indépendantes à Amsterdam et à São Paulo, avant de décider que le travail était meilleur quand le directeur de création s'asseyait aussi à la table de la stratégie.",
    img: 'https://images.unsplash.com/photo-1523908511403-7fc7b25592f4?w=600&h=750&fit=crop&auto=format',
  },
]
