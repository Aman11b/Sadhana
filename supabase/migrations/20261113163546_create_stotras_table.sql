--==========================
-- TABLE: stotras
--==========================

CREATE TABLE public.stotras(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID NOT NULL
  -- This is where the foreign key relationship is established. 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE,
  -- Automatically delete dependent records when the referenced record is deleted.

  name TEXT NOT NULL,

  is_daily_practice BOOLEAN NOT NULL DEFAULT FALSE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT stotras_name_format_check
  CHECK (
    name <> ''
    AND name=LOWER(BTRIM(name))
  ),

  CONSTRAINT stotras_user_name_unique
  UNIQUE (user_id,name),

  CONSTRAINT stotras_user_id_id_unique
  UNIQUE (user_id,id)

);

-- =========================================
-- ROW LEVEL SECURITY TABLE: stotra
-- =========================================

ALTER TABLE public.stotras
ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User can view their own stotras"
ON public.stotras
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "User can add their own stotras"
ON public.stotras
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "User can update their own stotras"
ON public.stotras
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- =========================================
-- TABLE PERMISSIONS: stotras
-- =========================================

GRANT SELECT,INSERT,UPDATE
ON public.stotras
TO authenticated;
