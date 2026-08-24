-- ============================================================
-- NOTIFICATIONS + RÔLE LIVREUR — À exécuter dans SQL Editor Supabase
-- ============================================================

-- 1. Ajouter le rôle "livreur"
alter table profiles drop constraint if exists profiles_role_check;
alter table profiles add constraint profiles_role_check
  check (role in ('client','admin','livreur'));

-- 2. Fonction utilitaire : l'utilisateur connecté est-il livreur ou admin ?
create or replace function public.is_livreur()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'livreur'
  );
$$;

create or replace function public.is_staff()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role in ('admin','livreur')
  );
$$;

-- 3. Table des notifications
create table if not exists notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  order_id uuid references orders(id) on delete cascade,
  title text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz default now()
);
alter table notifications enable row level security;

create policy "Voir ses propres notifications" on notifications for select using (auth.uid() = user_id);
create policy "Marquer ses notifications comme lues" on notifications for update using (auth.uid() = user_id);

-- 4. Fonction : crée les notifications quand une commande est lancée
--    (appelée juste après l'enregistrement de la livraison)
create or replace function public.create_order_notifications(p_order_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_client_id uuid;
  v_staff record;
begin
  select user_id into v_client_id from orders where id = p_order_id;

  -- Notification au client : le rassurer
  insert into notifications (user_id, order_id, title, message)
  values (
    v_client_id,
    p_order_id,
    'Commande confirmée',
    'Votre commande a bien été enregistrée. Elle est en cours de préparation et vous sera livrée très bientôt.'
  );

  -- Notification à chaque admin
  for v_staff in select id from profiles where role = 'admin' loop
    insert into notifications (user_id, order_id, title, message)
    values (v_staff.id, p_order_id, 'Nouvelle commande', 'Une nouvelle commande vient d''être passée. Merci de la préparer.');
  end loop;

  -- Notification à chaque livreur
  for v_staff in select id from profiles where role = 'livreur' loop
    insert into notifications (user_id, order_id, title, message)
    values (v_staff.id, p_order_id, 'Nouvelle livraison à prévoir', 'Une nouvelle commande est prête à être livrée dès que possible.');
  end loop;
end;
$$;

-- 5. Fonction : le livreur marque une commande comme livrée
--    -> passe automatiquement la commande ET le paiement en "réglé"
create or replace function public.mark_order_delivered(p_order_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_client_id uuid;
begin
  if not is_staff() then
    raise exception 'Non autorisé';
  end if;

  select user_id into v_client_id from orders where id = p_order_id;

  update orders set status = 'livrée' where id = p_order_id;

  update payments
    set status = 'payé', paid_at = coalesce(paid_at, now())
    where order_id = p_order_id;

  insert into notifications (user_id, order_id, title, message)
  values (v_client_id, p_order_id, 'Commande livrée', 'Votre commande a été livrée avec succès. Merci pour votre confiance !');
end;
$$;

-- 6. Policies : le livreur peut voir/agir sur les commandes à livrer
drop policy if exists "Livreur voit les commandes" on orders;
create policy "Livreur voit les commandes" on orders for select using (is_livreur());

drop policy if exists "Livreur voit les lignes de commande" on order_items;
create policy "Livreur voit les lignes de commande" on order_items for select using (is_livreur());

drop policy if exists "Livreur voit les livraisons" on deliveries;
create policy "Livreur voit les livraisons" on deliveries for select using (is_livreur());

drop policy if exists "Livreur voit les paiements" on payments;
create policy "Livreur voit les paiements" on payments for select using (is_livreur());
