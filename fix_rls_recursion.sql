-- ============================================================
-- CORRECTIF — Récursion infinie dans les policies RLS
-- À exécuter dans SQL Editor Supabase (après schema.sql)
-- ============================================================

-- 1. Fonction sécurisée qui vérifie si l'utilisateur connecté est admin
--    (security definer = contourne RLS pour cette seule vérification,
--    évite que la policy se re-déclenche elle-même)
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- 2. PROFILES — on supprime l'ancienne policy récursive et on la remplace
drop policy if exists "Les admins voient tous les profils" on profiles;
create policy "Les admins voient tous les profils"
  on profiles for select using (is_admin());

-- 3. BRANDS
drop policy if exists "Admin gère les marques" on brands;
create policy "Admin gère les marques" on brands for all using (is_admin());

-- 4. CATEGORIES
drop policy if exists "Admin gère les catégories" on categories;
create policy "Admin gère les catégories" on categories for all using (is_admin());

-- 5. PRODUCTS
drop policy if exists "Admin gère les articles" on products;
create policy "Admin gère les articles" on products for all using (is_admin());

-- 6. ORDERS
drop policy if exists "Admin voit toutes les commandes" on orders;
create policy "Admin voit toutes les commandes" on orders for select using (is_admin());
drop policy if exists "Admin met à jour les commandes" on orders;
create policy "Admin met à jour les commandes" on orders for update using (is_admin());

-- 7. ORDER_ITEMS
drop policy if exists "Admin voit toutes les lignes" on order_items;
create policy "Admin voit toutes les lignes" on order_items for select using (is_admin());

-- 8. DELIVERIES
drop policy if exists "Admin voit toutes les livraisons" on deliveries;
create policy "Admin voit toutes les livraisons" on deliveries for select using (is_admin());

-- 9. PAYMENTS
drop policy if exists "Admin voit tous les paiements" on payments;
create policy "Admin voit tous les paiements" on payments for select using (is_admin());

-- 10. FAQ
drop policy if exists "Admin gère la FAQ" on faq;
create policy "Admin gère la FAQ" on faq for all using (is_admin());

-- ============================================================
-- Terminé. Rechargez votre site : les erreurs 500/401 doivent disparaître.
-- ============================================================
