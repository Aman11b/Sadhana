
-- =========================================
-- TABLE: daily_mantra_entries
-- =========================================

CREATE TABLE public.daily_mantra_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES auth.users(id)
        ON DELETE CASCADE,

    daily_log_id UUID NOT NULL,

    mantra_id UUID NOT NULL,

    count INTEGER NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Count must be a positive whole number of malas
    CONSTRAINT daily_mantra_entries_count_check
    CHECK (count > 0),

    -- One entry per mantra per daily log
    CONSTRAINT daily_mantra_entries_log_mantra_unique
    UNIQUE (daily_log_id, mantra_id),

    -- Ensure the daily log belongs to the same user
    CONSTRAINT daily_mantra_entries_daily_log_fkey
    FOREIGN KEY (user_id, daily_log_id)
    REFERENCES public.daily_logs(user_id, id)
    ON DELETE CASCADE,

    -- Ensure the mantra belongs to the same user
    CONSTRAINT daily_mantra_entries_mantra_fkey
    FOREIGN KEY (user_id, mantra_id)
    REFERENCES public.mantras(user_id, id)
    ON DELETE NO ACTION
    DEFERRABLE INITIALLY DEFERRED
);


-- =========================================
-- TRIGGER FUNCTION: Protect mantra entries
-- =========================================

CREATE OR REPLACE FUNCTION public.protect_daily_mantra_entry()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    RAISE EXCEPTION 'Mantra entries cannot be updated';
END;
$$;


-- =========================================
-- TRIGGER: Protect mantra entries
-- =========================================

CREATE TRIGGER protect_daily_mantra_entry
BEFORE UPDATE
ON public.daily_mantra_entries
FOR EACH ROW
EXECUTE FUNCTION public.protect_daily_mantra_entry();



-- =========================================
-- ROW LEVEL SECURITY: daily_mantra_entries
-- =========================================

ALTER TABLE public.daily_mantra_entries
ENABLE ROW LEVEL SECURITY;


-- Users can view only their own mantra entries
CREATE POLICY "User can view their own daily mantra entries"
ON public.daily_mantra_entries
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);


-- Users can insert entries only for themselves
CREATE POLICY "User can add their own daily mantra entries"
ON public.daily_mantra_entries
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);


-- =========================================
-- TABLE PERMISSIONS: daily_mantra_entries
-- =========================================

REVOKE ALL
ON public.daily_mantra_entries
FROM PUBLIC, anon, authenticated;

GRANT SELECT, INSERT
ON public.daily_mantra_entries
TO authenticated;
