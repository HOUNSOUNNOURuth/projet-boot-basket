-- ============================================================
-- INTÉGRATION CHARIOW — À exécuter dans SQL Editor Supabase
-- ============================================================

-- 1. Chaque article Supabase peut être relié à un produit Chariow
--    (créé manuellement dans le tableau de bord Chariow, prix identique)
alter table products add column if not exists chariow_product_id text;

-- 2. On enrichit les paiements avec le suivi Chariow
alter table payments add column if not exists chariow_sale_id text;
alter table payments add column if not exists chariow_checkout_url text;
alter table payments add column if not exists chariow_status text;

-- 3. Autoriser le nouveau moyen de paiement "chariow"
alter table payments drop constraint if exists payments_method_check;
alter table payments add constraint payments_method_check
  check (method in ('mobile_money','carte','paiement_livraison','chariow'));

-- 4. Table anti-doublon pour les webhooks Chariow (Pulses)
--    Chaque delivery_id ne doit être traité qu'une seule fois.
create table if not exists chariow_webhook_events (
  delivery_id text primary key,
  event text,
  received_at timestamptz default now()
);
alter table chariow_webhook_events enable row level security;
-- Aucun accès client : seule l'Edge Function (service role) y touche.
create policy "Aucun accès public" on chariow_webhook_events for all using (false);

-- 5. Table pour suivre chaque "unité" de paiement Chariow d'une commande
--    (une commande avec 3 articles = 3 lignes ici, une par paiement Chariow)
create table if not exists chariow_order_units (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  chariow_product_id text not null,
  chariow_sale_id text,
  status text not null default 'en_attente' check (status in ('en_attente','payé','échoué')),
  amount numeric not null,
  created_at timestamptz default now()
);
alter table chariow_order_units enable row level security;
create policy "Voir ses propres unités" on chariow_order_units for select using (
  exists (select 1 from orders o where o.id = order_id and o.user_id = auth.uid())
);
create policy "Créer ses propres unités" on chariow_order_units for insert with check (
  exists (select 1 from orders o where o.id = order_id and o.user_id = auth.uid())
);
create policy "Admin voit toutes les unités" on chariow_order_units for select using (is_admin());
