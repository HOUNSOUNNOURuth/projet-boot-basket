-- ============================================================
-- CORRECTIF — Création automatique du profil à l'inscription
-- À exécuter dans SQL Editor Supabase
-- ============================================================

-- 1. Fonction qui crée la ligne profiles automatiquement
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    'client'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- 2. Déclencheur : s'exécute à chaque création de compte dans auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. On peut maintenant supprimer la policy d'insertion manuelle
--    (le trigger s'en charge avec des droits élevés, plus besoin
--    que le client l'insère lui-même)
drop policy if exists "Un utilisateur crée son propre profil" on profiles;

-- ============================================================
-- Rattraper les comptes déjà créés mais sans profil (comme le vôtre)
-- ============================================================
insert into public.profiles (id, full_name, phone, role)
select u.id, coalesce(u.raw_user_meta_data->>'full_name', ''), coalesce(u.raw_user_meta_data->>'phone', ''), 'client'
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;
