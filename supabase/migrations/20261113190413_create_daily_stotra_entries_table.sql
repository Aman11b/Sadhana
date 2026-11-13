
-- =========================================
-- TABLE: daily_stotra_entries
-- =========================================

CREATE TABLE public.daily_stotra_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES auth.users(id)
        ON DELETE CASCADE,

    daily_log_id UUID NOT NULL,

    stotra_id UUID NOT NULL,

    count INTEGER NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Count must be a positive number of complete recitations
    CONSTRAINT daily_stotra_entries_count_check
    CHECK (count > 0),

    -- One entry per stotra per daily log
    CONSTRAINT daily_stotra_entries_log_stotra_unique
    UNIQUE (daily_log_id, stotra_id),

    -- Ensure the daily log belongs to the same user
    CONSTRAINT daily_stotra_entries_daily_log_fkey
    FOREIGN KEY (user_id, daily_log_id)
    REFERENCES public.daily_logs(user_id, id)
    ON DELETE CASCADE,

    -- Ensure the stotra belongs to the same user
    CONSTRAINT daily_stotra_entries_stotra_fkey
    FOREIGN KEY (user_id, stotra_id)
    REFERENCES public.stotras(user_id, id)
    ON DELETE NO ACTION
    DEFERRABLE INITIALLY DEFERRED
);



-- =========================================
-- TRIGGER FUNCTION: Protect stotra entries
-- =========================================

CREATE OR REPLACE FUNCTION public.protect_daily_stotra_entry()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    RAISE EXCEPTION 'Stotra entries cannot be updated';
END;
$$;


-- =========================================
-- TRIGGER: Protect stotra entries
-- =========================================

CREATE TRIGGER protect_daily_stotra_entry
BEFORE UPDATE
ON public.daily_stotra_entries
FOR EACH ROW
EXECUTE FUNCTION public.protect_daily_stotra_entry();


-- =========================================
-- ROW LEVEL SECURITY
-- =========================================

ALTER TABLE public.daily_stotra_entries
ENABLE ROW LEVEL SECURITY;

-- =========================================
-- SELECT POLICY
-- =========================================

CREATE POLICY "User can view their own daily stotra entries"
ON public.daily_stotra_entries
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);


-- =========================================
-- INSERT POLICY
-- =========================================

CREATE POLICY "User can add their own daily stotra entries"
ON public.daily_stotra_entries
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- =========================================
-- TABLE PERMISSIONS
-- =========================================

REVOKE ALL ON public.daily_stotra_entries
FROM PUBLIC, anon, authenticated;

GRANT SELECT, INSERT
ON public.daily_stotra_entries
TO authenticated;