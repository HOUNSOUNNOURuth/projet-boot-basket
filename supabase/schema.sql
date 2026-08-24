-- ============================================================
-- CHANCELIÈRE SHOP — Schéma Supabase (Postgres)
-- À exécuter dans l'éditeur SQL de votre projet Supabase
-- ============================================================

-- Extension pour uuid
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------
-- 1. PROFILES (liée à auth.users)
-- ------------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'client' check (role in ('client','admin')),
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Un utilisateur voit son propre profil"
  on profiles for select using (auth.uid() = id);
create policy "Un utilisateur modifie son propre profil"
  on profiles for update using (auth.uid() = id);
create policy "Un utilisateur crée son propre profil"
  on profiles for insert with check (auth.uid() = id);
create policy "Les admins voient tous les profils"
  on profiles for select using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ------------------------------------------------------------
-- 2. BRANDS
-- ------------------------------------------------------------
create table brands (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  logo_url text,
  created_at timestamptz default now()
);
alter table brands enable row level security;
create policy "Lecture publique des marques" on brands for select using (true);
create policy "Admin gère les marques" on brands for all using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- ------------------------------------------------------------
-- 3. CATEGORIES
-- ------------------------------------------------------------
create table categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique check (name in ('homme','femme','enfant','autre'))
);
alter table categories enable row level security;
create policy "Lecture publique des catégories" on categories for select using (true);
create policy "Admin gère les catégories" on categories for all using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

insert into categories (name) values ('homme'), ('femme'), ('enfant'), ('autre');

-- ------------------------------------------------------------
-- 4. PRODUCTS
-- ------------------------------------------------------------
create table products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  price numeric not null check (price >= 0),
  stock integer not null default 0,
  sizes jsonb default '[]'::jsonb,
  brand_id uuid references brands(id) on delete set null,
  category_id uuid references categories(id) on delete set null,
  image_url text,
  created_at timestamptz default now()
);
alter table products enable row level security;
create policy "Lecture publique des articles" on products for select using (true);
create policy "Admin gère les articles" on products for all using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- ------------------------------------------------------------
-- 5. PRODUCT REVIEWS (avis sur un article)
-- ------------------------------------------------------------
create table product_reviews (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz default now()
);
alter table product_reviews enable row level security;
create policy "Lecture publique des avis" on product_reviews for select using (true);
create policy "Utilisateur connecté peut publier un avis"
  on product_reviews for insert with check (auth.uid() = user_id);
create policy "Un utilisateur modifie son propre avis"
  on product_reviews for update using (auth.uid() = user_id);
create policy "Un utilisateur supprime son propre avis"
  on product_reviews for delete using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 6. SHOP COMMENTS (avis généraux sur la boutique)
-- ------------------------------------------------------------
create table shop_comments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  message text not null,
  created_at timestamptz default now()
);
alter table shop_comments enable row level security;
create policy "Lecture publique des commentaires" on shop_comments for select using (true);
create policy "Utilisateur connecté peut commenter"
  on shop_comments for insert with check (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 7. ORDERS
-- ------------------------------------------------------------
create table orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  status text not null default 'en_attente_livraison'
    check (status in ('en_attente_livraison','en_attente_paiement','payée','livrée','annulée')),
  total_amount numeric not null default 0,
  created_at timestamptz default now()
);
alter table orders enable row level security;
create policy "Un client voit ses commandes" on orders for select using (auth.uid() = user_id);
create policy "Un client crée ses commandes" on orders for insert with check (auth.uid() = user_id);
create policy "Admin voit toutes les commandes" on orders for select using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);
create policy "Admin met à jour les commandes" on orders for update using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- ------------------------------------------------------------
-- 8. ORDER ITEMS
-- ------------------------------------------------------------
create table order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  size integer,
  quantity integer not null check (quantity > 0),
  unit_price numeric not null
);
alter table order_items enable row level security;
create policy "Voir les lignes de ses commandes" on order_items for select using (
  exists (select 1 from orders o where o.id = order_id and o.user_id = auth.uid())
);
create policy "Créer des lignes pour ses commandes" on order_items for insert with check (
  exists (select 1 from orders o where o.id = order_id and o.user_id = auth.uid())
);
create policy "Admin voit toutes les lignes" on order_items for select using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- ------------------------------------------------------------
-- 9. DELIVERIES
-- ------------------------------------------------------------
create table deliveries (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade,
  full_name text not null,
  phone text not null,
  address text not null,
  city text not null,
  landmark text,
  notes text
);
alter table deliveries enable row level security;
create policy "Voir sa propre livraison" on deliveries for select using (
  exists (select 1 from orders o where o.id = order_id and o.user_id = auth.uid())
);
create policy "Créer sa propre livraison" on deliveries for insert with check (
  exists (select 1 from orders o where o.id = order_id and o.user_id = auth.uid())
);
create policy "Admin voit toutes les livraisons" on deliveries for select using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- ------------------------------------------------------------
-- 10. PAYMENTS
-- ------------------------------------------------------------
create table payments (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade,
  method text not null check (method in ('mobile_money','carte','paiement_livraison')),
  amount numeric not null,
  status text not null default 'en_attente' check (status in ('en_attente','payé','échoué')),
  paid_at timestamptz
);
alter table payments enable row level security;
create policy "Voir son propre paiement" on payments for select using (
  exists (select 1 from orders o where o.id = order_id and o.user_id = auth.uid())
);
create policy "Créer son propre paiement" on payments for insert with check (
  exists (select 1 from orders o where o.id = order_id and o.user_id = auth.uid())
);
create policy "Admin voit tous les paiements" on payments for select using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- ------------------------------------------------------------
-- 11. FAQ (contenu du bouton Aide, éditable par l'admin)
-- ------------------------------------------------------------
create table faq (
  id uuid primary key default uuid_generate_v4(),
  question text not null,
  answer text not null,
  order_index integer default 0
);
alter table faq enable row level security;
create policy "Lecture publique de la FAQ" on faq for select using (true);
create policy "Admin gère la FAQ" on faq for all using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- ------------------------------------------------------------
-- Exemple : créer un premier compte admin
-- (à exécuter APRÈS avoir créé le compte via l'inscription du site)
-- update profiles set role = 'admin' where id = 'UUID_DU_COMPTE';
-- ------------------------------------------------------------
