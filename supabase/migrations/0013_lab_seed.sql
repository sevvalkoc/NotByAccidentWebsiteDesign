-- 0013 · THE LAB — initial configuration
--
-- Assessment version 1, recommendation rules, partner types, matching
-- weights and the nine priority markets. Idempotent: each block only runs
-- when its records don't exist, so editing any of this in the admin is safe.
--
-- Markets carry basic, uncontroversial facts only (EU membership, currency,
-- working languages) and are marked 'unverified'. Market intelligence is
-- added by the team in Admin → The Lab → Markets, with sources and dates.
-- No partners are seeded here: the production partner database starts empty.

-- ── Partner types ─────────────────────────────────────────────────────────
insert into public.lab_partner_types (key, label, description, expected_readiness, sort) values
  ('retailer', 'Retailer', 'Shops and department stores that buy or consign stock.', 50, 1),
  ('concept_store', 'Concept store', 'Independent, curated stores that often take emerging brands.', 40, 2),
  ('distributor', 'Distributor', 'Companies that import and sell on to retailers in a territory.', 65, 3),
  ('wholesale_buyer', 'Wholesale buyer', 'Buyers placing wholesale orders for one or more outlets.', 60, 4),
  ('market_entry_partner', 'Market-entry partner', 'Agents and consultancies that open a market on a brand’s behalf.', 35, 5),
  ('creative_collaborator', 'Creative collaborator', 'Brands, artists and studios for collaborations and co-launches.', 30, 6),
  ('service_provider', 'Service provider', 'Logistics, compliance, localisation and other specialists.', 20, 7)
on conflict (key) do nothing;

-- ── Matching weights (version 1) ──────────────────────────────────────────
insert into public.lab_matching_configs (version, weights, min_score, active, notes)
select 1, '{"category":25,"geography":20,"price":15,"segment":15,"distribution":15,"readiness":10}'::jsonb, 40, true, 'Initial weights from the V1 brief'
where not exists (select 1 from public.lab_matching_configs);

-- ── Markets: basic facts only ─────────────────────────────────────────────
insert into public.lab_markets (code, name, status, priority, eu_member, currency, languages, confidence) values
  ('NL', 'Netherlands', 'published', 1, true, 'EUR', array['nl'], 'unverified'),
  ('DE', 'Germany', 'published', 2, true, 'EUR', array['de'], 'unverified'),
  ('GB', 'United Kingdom', 'published', 3, false, 'GBP', array['en'], 'unverified'),
  ('FR', 'France', 'published', 4, true, 'EUR', array['fr'], 'unverified'),
  ('BE', 'Belgium', 'published', 5, true, 'EUR', array['nl', 'fr', 'de'], 'unverified'),
  ('DK', 'Denmark', 'published', 6, true, 'DKK', array['da'], 'unverified'),
  ('SE', 'Sweden', 'published', 7, true, 'SEK', array['sv'], 'unverified'),
  ('IT', 'Italy', 'published', 8, true, 'EUR', array['it'], 'unverified'),
  ('ES', 'Spain', 'published', 9, true, 'EUR', array['es'], 'unverified')
on conflict (code) do nothing;

-- ── Recommendation rules ──────────────────────────────────────────────────
insert into public.lab_recommendation_rules (key, title, body, category, condition, priority, partner_types) values
  ('sharpen_positioning', 'Sharpen the reason to choose you',
   'Write the one sentence a buyer in your target market would repeat to a colleague. Test it on five people who don’t know you. If they can’t say it back, it won’t survive translation.',
   'brand', '{"type":"manual"}', 80, '{}'),
  ('prove_demand', 'Test demand before you ship stock',
   'Run a pre-order page or a small paid test in one target market, priced in local currency. Ten real orders tell you more than a hundred compliments.',
   'pmf', '{"type":"category_below","category":"pmf","value":50}', 90, '{}'),
  ('test_locally', 'Check fit with local customers',
   'Show the product to a handful of customers in the market: sizes, formats, materials and the words on the label. Assumptions are cheapest to fix before launch.',
   'pmf', '{"type":"manual"}', 70, '{}'),
  ('landed_cost', 'Work out your landed cost',
   'Add shipping, duties, VAT and the partner’s margin to your price and compare the result with what sits next to you on the shelf. If the number only works at home, fix that first.',
   'pmf', '{"type":"manual"}', 85, '{}'),
  ('unit_economics', 'Know your margin per channel',
   'Retailers usually take a large share of the shelf price, distributors take theirs on top. Model each channel separately before choosing one.',
   'commercial', '{"type":"manual"}', 75, '{}'),
  ('commercial_engine', 'Build a repeatable way to sell',
   'Before adding a market, get one channel working predictably: you should know roughly what a customer costs to win and what they spend.',
   'commercial', '{"type":"category_below","category":"commercial","value":50}', 70, '{}'),
  ('logistics_setup', 'Set up cross-border fulfilment first',
   'Decide how an order reaches a customer abroad, what it costs and how long it takes, before the first order arrives. A fulfilment partner can shorten this.',
   'operations', '{"type":"category_below","category":"operations","value":50}', 80, '{service_provider}'),
  ('returns_policy', 'Price international returns in',
   'Returns from abroad cost more and take longer. Decide the policy and put its cost into your margin before you launch.',
   'operations', '{"type":"manual"}', 65, '{service_provider}'),
  ('compliance_check', 'Check what applies to your product',
   'Labelling, product safety, packaging and data rules differ by market and category. An hour with a specialist now is cheaper than a recall later.',
   'operations', '{"type":"manual"}', 75, '{service_provider}'),
  ('localise_product', 'Localise the product, not just the website',
   'Language, currency, payment methods and support hours. Decide which you’ll cover at launch and which can follow.',
   'operations', '{"type":"manual"}', 65, '{service_provider}'),
  ('partner_brief', 'Write the brief for your ideal partner',
   'Who they sell to, what they expect from a brand, what you offer them. A one-page brief makes every introduction faster.',
   'partnership', '{"type":"category_below","category":"partnership","value":50}', 70, '{market_entry_partner}'),
  ('sales_kit', 'Prepare a buyer kit',
   'A line sheet or price list, your terms, a short brand deck and samples or demo access. Buyers decide quickly; have it ready before you ask for meetings.',
   'partnership', '{"type":"manual"}', 70, '{}'),
  ('choose_markets', 'Compare markets on evidence',
   'Put two or three candidates side by side (Markets) and pick the one where your readiness and the available partners line up best.',
   'strategy', '{"type":"manual"}', 75, '{}'),
  ('set_budget', 'Ring-fence a test budget',
   'Set aside a fixed amount for a first test and decide in advance what result would justify the next step.',
   'strategy', '{"type":"manual"}', 70, '{}'),
  ('define_success', 'Put a number on success',
   'Decide what twelve months should deliver (stockists, revenue, repeat orders) and the date you’ll review it.',
   'strategy', '{"type":"manual"}', 65, '{}'),
  ('distribution_undecided', 'Decide how you’ll sell there',
   'Direct to consumers, through retailers or through a distributor: each needs different margins, partners and stock. A market-entry partner can help you choose.',
   'strategy', '{"type":"brand_field","field":"distribution_model","in":["undecided"]}', 72, '{market_entry_partner}'),
  ('foundation_home', 'Strengthen the home base first',
   'Several fundamentals are still forming. Most of what expansion would test can be tested at home first, faster and for less.',
   null, '{"type":"overall_below","value":40}', 95, '{}'),
  ('plan_pilot', 'Plan a contained pilot',
   'Pick one market, a handful of partners or a focused direct-to-consumer test, a fixed budget and a date to review. Small enough to learn from, big enough to matter.',
   null, '{"type":"overall_at_least","value":60}', 60, '{concept_store,retailer}'),
  ('shortlist_partners', 'Shortlist partners and request introductions',
   'Your fundamentals are in place. Review your matches, save the strongest and ask us for introductions where the fit is clear.',
   null, '{"type":"overall_at_least","value":80}', 55, '{distributor,wholesale_buyer,retailer}')
on conflict (key) do nothing;

-- ── Assessment version 1 ──────────────────────────────────────────────────
do $seed$
declare v uuid; q jsonb; o jsonb; qid uuid; i int := 0; k int;
begin
  if exists (select 1 from public.lab_assessment_versions where version = 1) then return; end if;
  insert into public.lab_assessment_versions (version, title, status, category_weights, bands, notes)
  values (1, 'Market readiness', 'draft',
    '{"brand":15,"pmf":20,"commercial":15,"operations":20,"partnership":15,"strategy":15}'::jsonb,
    $b$[
      {"key":"foundation","min":0,"max":39,"label":"Foundation stage","summary":"The basics that make expansion work (a sharp proposition, proof of demand, a way to deliver) are still forming. Most of what a new market would test can be tested at home, faster and for less."},
      {"key":"early_validation","min":40,"max":59,"label":"Early validation stage","summary":"Parts of the case are in place. Before committing budget abroad, close the gaps below with small, cheap tests: a pre-order page, a few buyer conversations, a landed-cost calculation."},
      {"key":"pilot_ready","min":60,"max":79,"label":"Pilot-ready potential","summary":"You could run a contained pilot in one market: a few partners or a focused direct-to-consumer test, with clear success measures and a fixed budget."},
      {"key":"advanced","min":80,"max":100,"label":"Advanced preparation","summary":"The fundamentals are strong. The work now is choosing the right market and partners, and executing tightly."}
    ]$b$::jsonb,
    'Initial version')
  returning id into v;

  for q in select value from jsonb_array_elements($q$[
    {"key":"positioning","category":"brand","kind":"single","weight":1.5,
     "prompt":"Can you say, in one sentence, why someone would choose you over the obvious alternative?",
     "help":"Think of what a happy customer says when they recommend you.",
     "why":"Positioning that travels survives translation. If it’s blurred at home, it blurs further abroad.",
     "options":[{"key":"repeated","label":"Yes, and customers say it back to us","score":100},
                {"key":"internal","label":"Yes, but we haven’t tested it outside the team","score":60},
                {"key":"versions","label":"We have a few versions","score":30,"rec":"sharpen_positioning"},
                {"key":"not_yet","label":"Not yet","score":0,"rec":"sharpen_positioning"}]},
    {"key":"audience","category":"brand","kind":"single","weight":1,
     "prompt":"How well do you know who buys from you today?",
     "options":[{"key":"data","label":"We have data on who buys, how often and why","score":100},
                {"key":"rough","label":"We know roughly who buys","score":55},
                {"key":"assumed","label":"We have assumptions, not data","score":20},
                {"key":"no_sales","label":"We haven’t sold yet","score":10}]},
    {"key":"traction","category":"brand","kind":"single","weight":1,
     "prompt":"What traction do you have in your home market?",
     "options":[{"key":"repeat","label":"Consistent sales and repeat customers","score":100},
                {"key":"steady","label":"Steady sales, mostly first-time buyers","score":65},
                {"key":"early","label":"Early sales","score":35},
                {"key":"pre_launch","label":"Pre-launch","score":5}]},
    {"key":"differentiation","category":"brand","kind":"single","weight":1,"preview":true,
     "prompt":"How different is your product from what’s already on offer in your target markets?",
     "options":[{"key":"clear","label":"Clearly different, and we can show why","score":100},
                {"key":"some","label":"Different in a few respects","score":60},
                {"key":"brand_only","label":"Similar products; our brand is the difference","score":35},
                {"key":"unknown","label":"We don’t know yet","score":10}]},

    {"key":"demand_evidence","category":"pmf","kind":"multi","weight":1.5,
     "prompt":"What evidence of demand do you have from the markets you’re targeting?",
     "help":"Choose all that apply.",
     "why":"Demand you can point to is the strongest predictor of a smooth entry, and the first thing a partner asks about.",
     "options":[{"key":"orders","label":"Orders from customers there","score":40},
                {"key":"waitlist","label":"A waitlist or pre-orders","score":25},
                {"key":"trade_interest","label":"Inbound interest from retailers or distributors","score":25},
                {"key":"signals","label":"Social or search interest","score":10},
                {"key":"none","label":"None yet","score":0}]},
    {"key":"local_relevance","category":"pmf","kind":"single","weight":1,
     "prompt":"Have you checked how your product fits local habits, sizes, formats or rules?",
     "options":[{"key":"tested","label":"Yes, tested with local customers","score":100},
                {"key":"researched","label":"Researched, not tested","score":55},
                {"key":"assumed","label":"We assume it transfers","score":15,"rec":"test_locally"}]},
    {"key":"competitors","category":"pmf","kind":"single","weight":1,"preview":true,
     "prompt":"Do you know who you’d sit next to on a shelf, or a search page, there?",
     "options":[{"key":"named","label":"Named competitors, with their prices","score":100},
                {"key":"general","label":"A general sense","score":50},
                {"key":"not_yet","label":"Not yet","score":0}]},
    {"key":"price_check","category":"pmf","kind":"single","weight":1.5,"preview":true,
     "prompt":"Have you compared your price, after shipping, duties and partner margins, with local alternatives?",
     "why":"Many brands are competitive at home and expensive abroad once the extra costs land.",
     "options":[{"key":"holds","label":"Yes, and it holds","score":100},
                {"key":"tight","label":"Yes, and it’s tight","score":55,"rec":"landed_cost"},
                {"key":"not_yet","label":"Not yet","score":10,"rec":"landed_cost"}]},

    {"key":"channels","category":"commercial","kind":"single","weight":1,
     "prompt":"How do you sell today?",
     "options":[{"key":"several","label":"More than one channel, working well","score":100},
                {"key":"one","label":"One channel, working well","score":65},
                {"key":"experimenting","label":"Still experimenting","score":30},
                {"key":"not_selling","label":"Not selling yet","score":0}]},
    {"key":"unit_economics","category":"commercial","kind":"single","weight":1,
     "prompt":"Do you know your margin per channel, including what a partner or platform takes?",
     "applies_if":[{"source":"answer","question":"channels","not_in":["not_selling"]}],
     "options":[{"key":"per_channel","label":"Yes, per channel","score":100},
                {"key":"overall_only","label":"Overall only","score":50,"rec":"unit_economics"},
                {"key":"not_yet","label":"Not yet","score":5,"rec":"unit_economics"}]},
    {"key":"acquisition","category":"commercial","kind":"single","weight":1,
     "prompt":"Could you win customers in a new market without a partner doing it for you?",
     "options":[{"key":"tested","label":"Yes, with a tested budget and approach","score":100},
                {"key":"untested","label":"Some capacity, untested abroad","score":55},
                {"key":"not_yet","label":"Not yet","score":15}]},

    {"key":"fulfilment","category":"operations","kind":"single","weight":1.5,
     "prompt":"How would orders reach customers abroad?",
     "applies_if":[{"source":"brand","field":"offering","in":["physical","mixed"]}],
     "options":[{"key":"partner","label":"Through a fulfilment partner that ships internationally","score":100},
                {"key":"own","label":"From our own stock, with international shipping set up","score":70},
                {"key":"not_set_up","label":"Not set up yet","score":10}]},
    {"key":"capacity","category":"operations","kind":"single","weight":1,
     "prompt":"If orders tripled next quarter, could you produce or source enough?",
     "applies_if":[{"source":"brand","field":"offering","in":["physical","mixed"]}],
     "options":[{"key":"yes","label":"Yes","score":100},
                {"key":"with_effort","label":"With effort and lead time","score":60},
                {"key":"no","label":"No","score":15}]},
    {"key":"returns","category":"operations","kind":"single","weight":1,
     "prompt":"Do you have a process for returns from abroad?",
     "applies_if":[{"source":"brand","field":"offering","in":["physical","mixed"]}],
     "options":[{"key":"priced_in","label":"Yes, and its cost is in our prices","score":100},
                {"key":"domestic_only","label":"For domestic orders only","score":45,"rec":"returns_policy"},
                {"key":"none","label":"No","score":5,"rec":"returns_policy"}]},
    {"key":"compliance","category":"operations","kind":"single","weight":1,
     "prompt":"Do you know which rules apply to your product in your target markets?",
     "help":"Labelling, product safety, packaging, data protection: whatever applies to your category.",
     "options":[{"key":"checked","label":"Yes, checked with a specialist","score":100},
                {"key":"partly","label":"Partly","score":50,"rec":"compliance_check"},
                {"key":"not_yet","label":"Not yet","score":5,"rec":"compliance_check"},
                {"key":"na","label":"Nothing specific applies to us","score":0,"na":true}]},
    {"key":"localisation","category":"operations","kind":"single","weight":1,
     "prompt":"Is your product or service ready for another language, currency and support hours?",
     "applies_if":[{"source":"brand","field":"offering","in":["digital","service"]}],
     "options":[{"key":"ready","label":"Yes","score":100},
                {"key":"partly","label":"Partly","score":50,"rec":"localise_product"},
                {"key":"no","label":"No","score":10,"rec":"localise_product"}]},

    {"key":"partner_profile","category":"partnership","kind":"single","weight":1,"preview":true,
     "prompt":"Do you know what kind of partner you need, and what they’ll expect from you?",
     "options":[{"key":"criteria","label":"Yes, with clear criteria","score":100},
                {"key":"rough","label":"A rough idea","score":50},
                {"key":"no","label":"No","score":10}]},
    {"key":"sales_kit","category":"partnership","kind":"multi","weight":1,
     "prompt":"Which of these could you send a buyer tomorrow?",
     "help":"Choose all that apply.",
     "options":[{"key":"line_sheet","label":"A line sheet or price list","score":30},
                {"key":"terms","label":"Wholesale or partner terms","score":30},
                {"key":"deck","label":"A short brand deck","score":20},
                {"key":"samples","label":"Samples or demo access","score":20},
                {"key":"none","label":"None of these yet","score":0,"rec":"sales_kit"}]},

    {"key":"market_choice","category":"strategy","kind":"single","weight":1,"preview":true,
     "prompt":"How did you choose your target markets?",
     "options":[{"key":"evidence","label":"We compared options against data","score":100},
                {"key":"demand","label":"From demand we already see","score":70},
                {"key":"instinct","label":"Instinct or personal connections","score":30,"rec":"choose_markets"},
                {"key":"not_chosen","label":"We haven’t chosen yet","score":0,"rec":"choose_markets"}]},
    {"key":"budget","category":"strategy","kind":"single","weight":1,
     "prompt":"Is there a budget set aside for this expansion?",
     "options":[{"key":"year","label":"Yes, for at least twelve months","score":100},
                {"key":"test","label":"Yes, for a first test","score":65},
                {"key":"not_yet","label":"Not yet","score":10,"rec":"set_budget"}]},
    {"key":"success_measure","category":"strategy","kind":"single","weight":1,"preview":true,
     "prompt":"What would success look like after twelve months, in numbers?",
     "options":[{"key":"specific","label":"A specific target, with a date to review it","score":100},
                {"key":"rough","label":"A rough target","score":50,"rec":"define_success"},
                {"key":"none","label":"Not defined yet","score":5,"rec":"define_success"}]}
  ]$q$::jsonb) loop
    i := i + 10;
    insert into public.lab_questions (version_id, key, category, kind, prompt, help, why, weight, required, in_preview, applies_if, sort)
    values (v, q->>'key', q->>'category', q->>'kind', q->>'prompt', q->>'help', q->>'why', (q->>'weight')::numeric, true,
            coalesce((q->>'preview')::boolean, false), q->'applies_if', i)
    returning id into qid;
    k := 0;
    for o in select value from jsonb_array_elements(q->'options') loop
      k := k + 1;
      insert into public.lab_options (question_id, key, label, score, is_na, recommendation_key, sort)
      values (qid, o->>'key', o->>'label', (o->>'score')::numeric, coalesce((o->>'na')::boolean, false), o->>'rec', k);
    end loop;
  end loop;
  update public.lab_assessment_versions set status = 'published', published_at = now() where id = v;
end $seed$;
