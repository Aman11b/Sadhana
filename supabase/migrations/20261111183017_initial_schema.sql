--==========================
-- TABLE: mantra
--==========================

CREATE TABLE public.mantras(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID NOT NULL 
    REFERENCES auth.users(id) 
    ON DELETE CASCADE,

  name TEXT NOT NULL,

  is_daily_practice BOOLEAN NOT NULL DEFAULT FALSE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- TIMESTAMPTZ Stores timestamps with timezone awareness

  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Name must alredy be trimmed and lowercase
  -- Constrain define a rule that database must enforce CONSTRAINT <name>
  -- CHECK ensures that a condition evaluates to TRUE for every row
  CONSTRAINT mantras_name_format_check
  CHECK (
    name <> ''
    -- <> not equal to 
    -- '' empty string 
    AND name=LOWER(BTRIM(name))
    -- LOWER(name) converts text into lowercase
    -- BTRIM(name) <both trim> removes whitespace from the beginning and end of string
  ),

  -- A user cannot add the same mantra twice
  CONSTRAINT mantras_user_name_unique
  UNIQUE (user_id,name),

  -- Require for further conposite foreign keys
  CONSTRAINT mantras_user_id_id_unique
  UNIQUE (user_id,id)
);

-- =========================================
-- ROW LEVEL SECURITY TABLE: mantra
-- =========================================

ALTER TABLE public.mantras
ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User can view their own mantras"
ON public.mantras
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "User can add their own mantras"
ON public.mantras
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "User can update their own mantra"
ON public.mantras
FOR UPDATE
TO authenticated
-- USING — Only allow the user to update rows that they already own.
USING (auth.uid() = user_id)
-- WITH CHECK — after the update, make sure the resulting row still belongs to the authenticated user.
WITH CHECK (auth.uid() = user_id);

-- =========================================
-- TABLE PERMISSIONS: mantras
-- =========================================

GRANT SELECT,INSERT,UPDATE
ON public.mantras
TO authenticated;

