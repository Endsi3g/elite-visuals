-- Script pour supprimer toutes les politiques existantes
-- Exécutez ce script AVANT schema.sql si vous avez des erreurs de politiques déjà existantes

-- Profiles policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Boards policies
DROP POLICY IF EXISTS "Public boards are viewable by everyone" ON public.boards;
DROP POLICY IF EXISTS "Users can create boards" ON public.boards;
DROP POLICY IF EXISTS "Board owners can update their boards" ON public.boards;
DROP POLICY IF EXISTS "Board owners can delete their boards" ON public.boards;

-- Board items policies
DROP POLICY IF EXISTS "Board items are viewable by board viewers" ON public.board_items;
DROP POLICY IF EXISTS "Board editors can create items" ON public.board_items;
DROP POLICY IF EXISTS "Board editors can update items" ON public.board_items;
DROP POLICY IF EXISTS "Board editors can delete items" ON public.board_items;

-- Tasks policies
DROP POLICY IF EXISTS "Tasks are viewable by board viewers" ON public.tasks;
DROP POLICY IF EXISTS "Board editors can manage tasks" ON public.tasks;

-- Comments policies
DROP POLICY IF EXISTS "Comments are viewable by board viewers" ON public.comments;
DROP POLICY IF EXISTS "Authenticated users can create comments" ON public.comments;
DROP POLICY IF EXISTS "Users can update own comments" ON public.comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON public.comments;

-- Board collaborators policies
DROP POLICY IF EXISTS "Collaborators are viewable by board members" ON public.board_collaborators;
DROP POLICY IF EXISTS "Board owners can manage collaborators" ON public.board_collaborators;

-- AI generations policies
DROP POLICY IF EXISTS "Users can view their own AI generations" ON public.ai_generations;
DROP POLICY IF EXISTS "Users can create AI generations" ON public.ai_generations;

-- Storage policies
DROP POLICY IF EXISTS "Media files are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload media" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own media" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own media" ON storage.objects;
