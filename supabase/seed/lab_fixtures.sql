-- THE LAB — STAGING FIXTURES. NEVER RUN AGAINST PRODUCTION.
--
-- Fictional partner organisations for demos and automated tests. Every row
-- is flagged is_fixture = true, named "Fictional · …", and uses the reserved
-- .example domain, so none of it can be mistaken for a real business.
-- Fixture rows are only visible to brands while lab_settings.fixtures_enabled
-- is true; this script switches it on. To remove everything again:
--   delete from public.lab_partners where is_fixture;
--   update public.lab_settings set fixtures_enabled = false;
--
-- Apply locally:
--   docker exec -i supabase_db_notbyaccident-next psql -U postgres -d postgres -v ON_ERROR_STOP=1 < supabase/seed/lab_fixtures.sql

do $guard$
begin
  -- refuse to run on a database that looks like production (the hosted
  -- project has real Lab users or real, non-fixture partners)
  if exists (select 1 from public.lab_partners where not is_fixture) then
    raise exception 'lab_fixtures.sql: non-fixture partners exist — this looks like a real database, aborting';
  end if;
end
$guard$;

update public.lab_settings set fixtures_enabled = true where id = 1;

insert into public.lab_partners (name, website, country_code, city, type_key, description, industries, product_categories,
  customer_segments, price_tiers, distribution_models, accepts_offering, brand_requirements, business_size, excluded_industries,
  min_readiness, verification_status, accepts_introductions, listed, is_fixture, internal_notes, last_verified_at)
values
  ('Fictional · Canal Concept Store', 'https://canal-concept.example', 'NL', 'Amsterdam', 'concept_store',
   'FICTIONAL DEMO ROW. An independent concept store mixing fashion, objects and small-batch beauty.',
   '{fashion,design_objects,beauty}', '{accessories,ceramics,skincare}', '{professionals,gift_buyers,enthusiasts}', '{premium,luxury}',
   '{retail}', '{physical}', 'Fictional: small first orders, consignment possible.', 'independent', '{}', 40,
   'verified_organization', true, true, true, 'FIXTURE internal note — must never be shown to brands.', current_date),
  ('Fictional · Rhein Wholesale House', 'https://rhein-wholesale.example', 'DE', 'Cologne', 'wholesale_buyer',
   'FICTIONAL DEMO ROW. A multi-brand wholesale buyer supplying department stores.',
   '{fashion,jewellery}', '{apparel,accessories}', '{professionals,broad}', '{mid,premium}',
   '{wholesale}', '{physical}', 'Fictional: needs a line sheet and EU stock.', 'mid_size', '{food_drink}', 60,
   'confirmed_partner', true, true, true, null, current_date),
  ('Fictional · Nordlys Distribution', 'https://nordlys-dist.example', 'DK', 'Copenhagen', 'distributor',
   'FICTIONAL DEMO ROW. A Nordic distributor for home and design brands.',
   '{home,design_objects}', '{ceramics,textiles,lighting}', '{professionals,families}', '{premium}',
   '{distributor}', '{physical}', null, 'small_group', '{}', 65,
   'verified_organization', true, true, true, null, current_date),
  ('Fictional · Lumière Beauty Retail', 'https://lumiere-beauty.example', 'FR', 'Lyon', 'retailer',
   'FICTIONAL DEMO ROW. A beauty retailer with six stores and an online shop.',
   '{beauty,wellness}', '{skincare,fragrance}', '{young_adults,professionals}', '{mid,premium}',
   '{retail,dtc}', '{physical}', null, 'small_group', '{}', 50,
   'contacted_prospect', false, true, true, null, current_date),
  ('Fictional · Thames Market Entry Partners', 'https://thames-entry.example', 'GB', 'London', 'market_entry_partner',
   'FICTIONAL DEMO ROW. Helps EU brands set up UK import, VAT and first stockists.',
   '{}', '{}', '{}', '{}',
   '{hybrid}', '{physical,mixed}', null, 'independent', '{}', 30,
   'verified_organization', true, true, true, null, current_date),
  ('Fictional · Studio Iberia Collective', 'https://iberia-collective.example', 'ES', 'Barcelona', 'creative_collaborator',
   'FICTIONAL DEMO ROW. A creative collective for launches, shoots and pop-ups.',
   '{fashion,beauty,design_objects}', '{}', '{young_adults,enthusiasts}', '{mid,premium,luxury}',
   '{hybrid}', '{physical,digital,service,mixed}', null, 'independent', '{}', null,
   'research_prospect', false, true, true, null, null),
  ('Fictional · Milano Value Outlet', 'https://milano-outlet.example', 'IT', 'Milan', 'retailer',
   'FICTIONAL DEMO ROW. An off-price outlet; useful as a contrast case in tests.',
   '{fashion}', '{apparel}', '{broad}', '{value}',
   '{retail}', '{physical}', null, 'large', '{}', 30,
   'verified_organization', true, true, true, null, current_date),
  ('Fictional · Unlisted Prospect', 'https://unlisted-prospect.example', 'BE', 'Antwerp', 'retailer',
   'FICTIONAL DEMO ROW. Not listed: must never appear to brands.',
   '{fashion}', '{apparel}', '{professionals}', '{premium}',
   '{retail}', '{physical}', null, 'independent', '{}', 40,
   'research_prospect', false, false, true, null, null)
on conflict do nothing;

insert into public.lab_partner_markets (partner_id, market_code)
select p.id, m from public.lab_partners p,
  lateral unnest(case p.website_domain
    when 'canal-concept.example' then array['NL', 'BE']
    when 'rhein-wholesale.example' then array['DE', 'NL']
    when 'nordlys-dist.example' then array['DK', 'SE']
    when 'lumiere-beauty.example' then array['FR', 'BE']
    when 'thames-entry.example' then array['GB']
    when 'iberia-collective.example' then array['ES']
    when 'milano-outlet.example' then array['IT']
    when 'unlisted-prospect.example' then array['BE']
  end) m
where p.is_fixture
on conflict do nothing;
