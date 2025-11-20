-- Script de nettoyage pour réinitialiser la base de données
-- ATTENTION: Ceci supprime TOUTES les données !
-- Utilisez ce script uniquement si vous voulez tout recommencer à zéro

-- Supprimer les politiques de storage
DROP POLICY IF EXISTS "Media files are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload media" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own media" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own media" ON storage.objects;

-- Supprimer le bucket
DELETE FROM storage.buckets WHERE id = 'media';

-- Supprimer les triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_boards_updated_at ON public.boards;
DROP TRIGGER IF EXISTS update_board_items_updated_at ON public.board_items;
DROP TRIGGER IF EXISTS update_tasks_updated_at ON public.tasks;
DROP TRIGGER IF EXISTS update_comments_updated_at ON public.comments;

-- Supprimer les fonctions
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Supprimer les tables (CASCADE supprime aussi les politiques RLS)
DROP TABLE IF EXISTS public.ai_generations CASCADE;
DROP TABLE IF EXISTS public.board_collaborators CASCADE;
DROP TABLE IF EXISTS public.comments CASCADE;
DROP TABLE IF EXISTS public.tasks CASCADE;
DROP TABLE IF EXISTS public.board_items CASCADE;
DROP TABLE IF EXISTS public.boards CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Note: Après avoir exécuté ce script, exécutez schema.sql pour tout recréer
