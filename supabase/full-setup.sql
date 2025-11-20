-- =============================================
-- SCRIPT COMPLET DE CONFIGURATION SUPABASE
-- Ce script peut être exécuté plusieurs fois sans erreur
-- =============================================

-- =============================================
-- 1. NETTOYAGE (si nécessaire)
-- =============================================

-- Supprimer les politiques existantes
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public boards are viewable by everyone" ON public.boards;
DROP POLICY IF EXISTS "Users can create boards" ON public.boards;
DROP POLICY IF EXISTS "Board owners can update their boards" ON public.boards;
DROP POLICY IF EXISTS "Board owners can delete their boards" ON public.boards;
DROP POLICY IF EXISTS "Board items are viewable by board viewers" ON public.board_items;
DROP POLICY IF EXISTS "Board editors can create items" ON public.board_items;
DROP POLICY IF EXISTS "Board editors can update items" ON public.board_items;
DROP POLICY IF EXISTS "Board editors can delete items" ON public.board_items;
DROP POLICY IF EXISTS "Tasks are viewable by board viewers" ON public.tasks;
DROP POLICY IF EXISTS "Board editors can manage tasks" ON public.tasks;
DROP POLICY IF EXISTS "Comments are viewable by board viewers" ON public.comments;
DROP POLICY IF EXISTS "Authenticated users can create comments" ON public.comments;
DROP POLICY IF EXISTS "Users can update own comments" ON public.comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON public.comments;
DROP POLICY IF EXISTS "Collaborators are viewable by board members" ON public.board_collaborators;
DROP POLICY IF EXISTS "Board owners can manage collaborators" ON public.board_collaborators;
DROP POLICY IF EXISTS "Users can view their own AI generations" ON public.ai_generations;
DROP POLICY IF EXISTS "Users can create AI generations" ON public.ai_generations;
DROP POLICY IF EXISTS "Media files are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload media" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own media" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own media" ON storage.objects;

-- Supprimer les triggers existants
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_boards_updated_at ON public.boards;
DROP TRIGGER IF EXISTS update_board_items_updated_at ON public.board_items;
DROP TRIGGER IF EXISTS update_tasks_updated_at ON public.tasks;
DROP TRIGGER IF EXISTS update_comments_updated_at ON public.comments;

-- =============================================
-- 2. EXTENSIONS
-- =============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 3. TABLES
-- =============================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.boards (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_public BOOLEAN DEFAULT FALSE,
  thumbnail_url TEXT,
  description TEXT
);

CREATE TABLE IF NOT EXISTS public.board_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  board_id UUID REFERENCES public.boards(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('text', 'image', 'video', 'audio', 'pdf', 'url', 'ai-generated')),
  x FLOAT DEFAULT 0,
  y FLOAT DEFAULT 0,
  width FLOAT DEFAULT 200,
  height FLOAT DEFAULT 200,
  z_index INTEGER DEFAULT 0,
  content JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  board_id UUID REFERENCES public.boards(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'backlog' CHECK (status IN ('backlog', 'in-progress', 'review', 'done')),
  assigned_to TEXT CHECK (assigned_to IN ('openai', 'claude', 'luma', 'human')),
  assigned_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  ai_generated BOOLEAN DEFAULT FALSE,
  due_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  board_id UUID REFERENCES public.boards(id) ON DELETE CASCADE NOT NULL,
  item_id UUID REFERENCES public.board_items(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  x FLOAT,
  y FLOAT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.board_collaborators (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  board_id UUID REFERENCES public.boards(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('owner', 'editor', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(board_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.ai_generations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  board_id UUID REFERENCES public.boards(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  ai_provider TEXT NOT NULL CHECK (ai_provider IN ('openai', 'claude', 'luma', 'ollama')),
  prompt TEXT NOT NULL,
  result JSONB,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- =============================================
-- 4. INDEXES
-- =============================================

CREATE INDEX IF NOT EXISTS idx_boards_owner_id ON public.boards(owner_id);
CREATE INDEX IF NOT EXISTS idx_board_items_board_id ON public.board_items(board_id);
CREATE INDEX IF NOT EXISTS idx_tasks_board_id ON public.tasks(board_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_comments_board_id ON public.comments(board_id);
CREATE INDEX IF NOT EXISTS idx_comments_item_id ON public.comments(item_id);
CREATE INDEX IF NOT EXISTS idx_board_collaborators_board_id ON public.board_collaborators(board_id);
CREATE INDEX IF NOT EXISTS idx_board_collaborators_user_id ON public.board_collaborators(user_id);

-- =============================================
-- 5. FUNCTIONS
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 6. TRIGGERS
-- =============================================

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_boards_updated_at BEFORE UPDATE ON public.boards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_board_items_updated_at BEFORE UPDATE ON public.board_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- 7. ROW LEVEL SECURITY
-- =============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.board_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.board_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_generations ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Boards policies
CREATE POLICY "Public boards are viewable by everyone"
  ON public.boards FOR SELECT
  USING (is_public = true OR owner_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.board_collaborators
    WHERE board_id = boards.id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can create boards"
  ON public.boards FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Board owners can update their boards"
  ON public.boards FOR UPDATE
  USING (owner_id = auth.uid());

CREATE POLICY "Board owners can delete their boards"
  ON public.boards FOR DELETE
  USING (owner_id = auth.uid());

-- Board items policies
CREATE POLICY "Board items are viewable by board viewers"
  ON public.board_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.boards
    WHERE id = board_items.board_id
    AND (is_public = true OR owner_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.board_collaborators
      WHERE board_id = boards.id AND user_id = auth.uid()
    ))
  ));

CREATE POLICY "Board editors can create items"
  ON public.board_items FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.boards
    WHERE id = board_items.board_id
    AND (owner_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.board_collaborators
      WHERE board_id = boards.id AND user_id = auth.uid() AND role IN ('owner', 'editor')
    ))
  ));

CREATE POLICY "Board editors can update items"
  ON public.board_items FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.boards
    WHERE id = board_items.board_id
    AND (owner_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.board_collaborators
      WHERE board_id = boards.id AND user_id = auth.uid() AND role IN ('owner', 'editor')
    ))
  ));

CREATE POLICY "Board editors can delete items"
  ON public.board_items FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.boards
    WHERE id = board_items.board_id
    AND (owner_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.board_collaborators
      WHERE board_id = boards.id AND user_id = auth.uid() AND role IN ('owner', 'editor')
    ))
  ));

-- Tasks policies
CREATE POLICY "Tasks are viewable by board viewers"
  ON public.tasks FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.boards
    WHERE id = tasks.board_id
    AND (is_public = true OR owner_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.board_collaborators
      WHERE board_id = boards.id AND user_id = auth.uid()
    ))
  ));

CREATE POLICY "Board editors can manage tasks"
  ON public.tasks FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.boards
    WHERE id = tasks.board_id
    AND (owner_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.board_collaborators
      WHERE board_id = boards.id AND user_id = auth.uid() AND role IN ('owner', 'editor')
    ))
  ));

-- Comments policies
CREATE POLICY "Comments are viewable by board viewers"
  ON public.comments FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.boards
    WHERE id = comments.board_id
    AND (is_public = true OR owner_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.board_collaborators
      WHERE board_id = boards.id AND user_id = auth.uid()
    ))
  ));

CREATE POLICY "Authenticated users can create comments"
  ON public.comments FOR INSERT
  WITH CHECK (auth.uid() = user_id AND EXISTS (
    SELECT 1 FROM public.boards
    WHERE id = comments.board_id
    AND (is_public = true OR owner_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.board_collaborators
      WHERE board_id = boards.id AND user_id = auth.uid()
    ))
  ));

CREATE POLICY "Users can update own comments"
  ON public.comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON public.comments FOR DELETE
  USING (auth.uid() = user_id);

-- Board collaborators policies
CREATE POLICY "Collaborators are viewable by board members"
  ON public.board_collaborators FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.boards
    WHERE id = board_collaborators.board_id
    AND (owner_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.board_collaborators bc
      WHERE bc.board_id = boards.id AND bc.user_id = auth.uid()
    ))
  ));

CREATE POLICY "Board owners can manage collaborators"
  ON public.board_collaborators FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.boards
    WHERE id = board_collaborators.board_id AND owner_id = auth.uid()
  ));

-- AI generations policies
CREATE POLICY "Users can view their own AI generations"
  ON public.ai_generations FOR SELECT
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.boards
    WHERE id = ai_generations.board_id
    AND (owner_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.board_collaborators
      WHERE board_id = boards.id AND user_id = auth.uid()
    ))
  ));

CREATE POLICY "Users can create AI generations"
  ON public.ai_generations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =============================================
-- 8. STORAGE
-- =============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Media files are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');

CREATE POLICY "Authenticated users can upload media"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update own media"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'media' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can delete own media"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'media' AND (storage.foldername(name))[1] = auth.uid()::text);
