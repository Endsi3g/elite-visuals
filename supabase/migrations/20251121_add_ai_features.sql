-- Enable AI & Vector Extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Table pour les embeddings AI
CREATE TABLE IF NOT EXISTS public.ai_embeddings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  board_id UUID REFERENCES public.boards(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  embedding vector(1536), -- OpenAI ada-002 dimensions
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour recherche vectorielle (IVFFlat)
CREATE INDEX IF NOT EXISTS idx_ai_embeddings_vector 
  ON public.ai_embeddings 
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Index pour recherche full-text
CREATE INDEX IF NOT EXISTS idx_ai_embeddings_content 
  ON public.ai_embeddings 
  USING gin (to_tsvector('english', content));

-- Index pour board_id
CREATE INDEX IF NOT EXISTS idx_ai_embeddings_board_id 
  ON public.ai_embeddings(board_id);

-- Enable RLS
ALTER TABLE public.ai_embeddings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view embeddings from their boards"
  ON public.ai_embeddings FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.boards
    WHERE id = ai_embeddings.board_id
    AND (owner_id = auth.uid() OR is_public = true OR EXISTS (
      SELECT 1 FROM public.board_collaborators
      WHERE board_id = boards.id AND user_id = auth.uid()
    ))
  ));

CREATE POLICY "Users can create embeddings for their boards"
  ON public.ai_embeddings FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.boards
    WHERE id = ai_embeddings.board_id
    AND (owner_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.board_collaborators
      WHERE board_id = boards.id AND user_id = auth.uid() AND role IN ('owner', 'editor')
    ))
  ));

CREATE POLICY "Users can update embeddings for their boards"
  ON public.ai_embeddings FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.boards
    WHERE id = ai_embeddings.board_id
    AND (owner_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.board_collaborators
      WHERE board_id = boards.id AND user_id = auth.uid() AND role IN ('owner', 'editor')
    ))
  ));

CREATE POLICY "Users can delete embeddings for their boards"
  ON public.ai_embeddings FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.boards
    WHERE id = ai_embeddings.board_id
    AND owner_id = auth.uid()
  ));

-- Function pour recherche sémantique
CREATE OR REPLACE FUNCTION search_embeddings(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  board_id uuid,
  content text,
  similarity float,
  metadata jsonb
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ai_embeddings.id,
    ai_embeddings.board_id,
    ai_embeddings.content,
    1 - (ai_embeddings.embedding <=> query_embedding) as similarity,
    ai_embeddings.metadata
  FROM ai_embeddings
  WHERE 1 - (ai_embeddings.embedding <=> query_embedding) > match_threshold
  ORDER BY ai_embeddings.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Trigger pour updated_at
CREATE TRIGGER update_ai_embeddings_updated_at 
  BEFORE UPDATE ON public.ai_embeddings
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Table pour les générations IA (amélioration)
ALTER TABLE public.ai_generations ADD COLUMN IF NOT EXISTS embedding_id UUID REFERENCES public.ai_embeddings(id) ON DELETE SET NULL;
ALTER TABLE public.ai_generations ADD COLUMN IF NOT EXISTS tokens_used INTEGER;
ALTER TABLE public.ai_generations ADD COLUMN IF NOT EXISTS cost DECIMAL(10, 4);

-- Index pour les générations IA
CREATE INDEX IF NOT EXISTS idx_ai_generations_embedding_id ON public.ai_generations(embedding_id);
CREATE INDEX IF NOT EXISTS idx_ai_generations_user_id ON public.ai_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_generations_status ON public.ai_generations(status);

-- Function pour obtenir les embeddings similaires d'un board
CREATE OR REPLACE FUNCTION get_similar_board_content(
  target_board_id uuid,
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  content text,
  similarity float,
  metadata jsonb
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ai_embeddings.id,
    ai_embeddings.content,
    1 - (ai_embeddings.embedding <=> query_embedding) as similarity,
    ai_embeddings.metadata
  FROM ai_embeddings
  WHERE 
    ai_embeddings.board_id = target_board_id
    AND 1 - (ai_embeddings.embedding <=> query_embedding) > match_threshold
  ORDER BY ai_embeddings.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Function pour obtenir les statistiques d'embeddings
CREATE OR REPLACE FUNCTION get_embedding_stats(target_board_id uuid)
RETURNS TABLE (
  total_embeddings bigint,
  avg_content_length numeric,
  last_updated timestamptz
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::bigint as total_embeddings,
    AVG(LENGTH(content))::numeric as avg_content_length,
    MAX(updated_at) as last_updated
  FROM ai_embeddings
  WHERE board_id = target_board_id;
END;
$$;

-- View pour les embeddings avec informations de board
CREATE OR REPLACE VIEW embeddings_with_boards AS
SELECT 
  e.id,
  e.board_id,
  e.content,
  e.metadata,
  e.created_at,
  e.updated_at,
  b.title as board_title,
  b.owner_id as board_owner_id,
  b.is_public as board_is_public
FROM ai_embeddings e
JOIN boards b ON e.board_id = b.id;

-- Grant permissions sur la view
GRANT SELECT ON embeddings_with_boards TO authenticated;

-- Comments pour documentation
COMMENT ON TABLE public.ai_embeddings IS 'Stocke les embeddings vectoriels pour la recherche sémantique';
COMMENT ON COLUMN public.ai_embeddings.embedding IS 'Vecteur d''embedding OpenAI ada-002 (1536 dimensions)';
COMMENT ON FUNCTION search_embeddings IS 'Recherche sémantique dans les embeddings avec seuil de similarité';
COMMENT ON FUNCTION get_similar_board_content IS 'Trouve le contenu similaire dans un board spécifique';
COMMENT ON FUNCTION get_embedding_stats IS 'Statistiques des embeddings pour un board';
