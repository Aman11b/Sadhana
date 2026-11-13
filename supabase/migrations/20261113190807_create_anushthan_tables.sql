
-- =====================================================
-- SADHANA TRACKER
-- FINAL ANUSHTHAN TABLES MIGRATION
-- =====================================================


-- =====================================================
-- 1. TABLE: anushthans
-- =====================================================

CREATE TABLE public.anushthans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES auth.users(id)
        ON DELETE CASCADE,

    name TEXT NOT NULL,

    start_date DATE NOT NULL,

    end_date DATE NOT NULL,

    timezone TEXT NOT NULL,

    outcome TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT anushthans_name_check
    CHECK (
        name <> ''
        AND name = LOWER(BTRIM(name))
    ),

    CONSTRAINT anushthans_date_range_check
    CHECK (end_date >= start_date),

    CONSTRAINT anushthans_outcome_check
    CHECK (
        outcome IS NULL
        OR outcome IN ('completed', 'incomplete')
    ),

    CONSTRAINT anushthans_user_name_unique
    UNIQUE (user_id, name),

    CONSTRAINT anushthans_user_id_id_unique
    UNIQUE (user_id, id)
);


-- =====================================================
-- 2. TABLE: anushthan_mantras
-- =====================================================

CREATE TABLE public.anushthan_mantras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL,

    anushthan_id UUID NOT NULL,

    mantra_id UUID NOT NULL,

    target_malas INTEGER NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT anushthan_mantras_target_check
    CHECK (target_malas > 0),

    CONSTRAINT anushthan_mantras_unique
    UNIQUE (anushthan_id, mantra_id),

    CONSTRAINT anushthan_mantras_anushthan_fkey
    FOREIGN KEY (user_id, anushthan_id)
    REFERENCES public.anushthans(user_id, id)
    ON DELETE CASCADE,

    CONSTRAINT anushthan_mantras_mantra_fkey
    FOREIGN KEY (user_id, mantra_id)
    REFERENCES public.mantras(user_id, id)
    ON DELETE NO ACTION
    DEFERRABLE INITIALLY DEFERRED
);


-- =====================================================
-- 3. TABLE: anushthan_stotras
-- =====================================================

CREATE TABLE public.anushthan_stotras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL,

    anushthan_id UUID NOT NULL,

    stotra_id UUID NOT NULL,

    target_recitations INTEGER NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT anushthan_stotras_target_check
    CHECK (target_recitations > 0),

    CONSTRAINT anushthan_stotras_unique
    UNIQUE (anushthan_id, stotra_id),

    CONSTRAINT anushthan_stotras_anushthan_fkey
    FOREIGN KEY (user_id, anushthan_id)
    REFERENCES public.anushthans(user_id, id)
    ON DELETE CASCADE,

    CONSTRAINT anushthan_stotras_stotra_fkey
    FOREIGN KEY (user_id, stotra_id)
    REFERENCES public.stotras(user_id, id)
    ON DELETE NO ACTION
    DEFERRABLE INITIALLY DEFERRED
);


-- =====================================================
-- 4. ANUSHTHAN VALIDATION FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION public.validate_anushthan()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_today_new DATE;
    v_today_old DATE;
BEGIN

    -- Validate the proposed timezone
    IF NOT EXISTS (
        SELECT 1
        FROM pg_timezone_names
        WHERE name = NEW.timezone
    ) THEN
        RAISE EXCEPTION 'Invalid timezone: %', NEW.timezone;
    END IF;

    -- Today's date in the proposed timezone
    v_today_new := (NOW() AT TIME ZONE NEW.timezone)::DATE;

    IF TG_OP = 'INSERT' THEN

        -- New Anushthans cannot start in the past
        IF NEW.start_date < v_today_new THEN
            RAISE EXCEPTION 'Anushthan start date cannot be in the past';
        END IF;

    ELSIF TG_OP = 'UPDATE' THEN

        -- Today's date in the existing timezone
        v_today_old := (NOW() AT TIME ZONE OLD.timezone)::DATE;

        -- Ownership and identity cannot change
        IF NEW.id IS DISTINCT FROM OLD.id
           OR NEW.user_id IS DISTINCT FROM OLD.user_id THEN
            RAISE EXCEPTION 'Anushthan ownership and ID cannot be changed';
        END IF;

        -- A scheduled Anushthan cannot be rescheduled into the past
        IF OLD.start_date >= v_today_old
           AND NEW.start_date < v_today_new THEN
            RAISE EXCEPTION 'Anushthan start date cannot be in the past';
        END IF;

        -- Dates and timezone become immutable once started
        IF v_today_old >= OLD.start_date
           AND (
               NEW.start_date IS DISTINCT FROM OLD.start_date
               OR NEW.end_date IS DISTINCT FROM OLD.end_date
               OR NEW.timezone IS DISTINCT FROM OLD.timezone
           ) THEN
            RAISE EXCEPTION 'Anushthan dates and timezone cannot be changed after it starts';
        END IF;

        -- Outcome can only be changed after the end date
        IF NEW.outcome IS DISTINCT FROM OLD.outcome
           AND v_today_old <= OLD.end_date THEN
            RAISE EXCEPTION 'Anushthan outcome can only be recorded after its end date';
        END IF;

        NEW.updated_at := NOW();

    END IF;

    -- Serialize Anushthan creation and updates per user
    PERFORM pg_advisory_xact_lock(
        hashtextextended(NEW.user_id::TEXT, 0)
    );

    -- Anushthan date ranges must never overlap for the same user
    IF EXISTS (
        SELECT 1
        FROM public.anushthans AS existing
        WHERE existing.user_id = NEW.user_id
          AND existing.id IS DISTINCT FROM NEW.id
          AND daterange(
              existing.start_date,
              existing.end_date,
              '[]'
          ) && daterange(
              NEW.start_date,
              NEW.end_date,
              '[]'
          )
    ) THEN
        RAISE EXCEPTION 'Anushthan date ranges cannot overlap';
    END IF;

    RETURN NEW;
END;
$$;

-- =====================================================
-- 5. ANUSHTHAN VALIDATION TRIGGER
-- =====================================================

CREATE TRIGGER validate_anushthan_trigger
BEFORE INSERT OR UPDATE
ON public.anushthans
FOR EACH ROW
EXECUTE FUNCTION public.validate_anushthan();


-- =====================================================
-- 6. PREVENT DELETION AFTER ANUSHTHAN STARTS
-- =====================================================

CREATE OR REPLACE FUNCTION public.protect_anushthan_deletion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_today DATE;
BEGIN

    -- Allow deletion when the parent account is being deleted.
    -- This preserves the account-deletion cascade requirement.
    IF NOT EXISTS (
        SELECT 1
        FROM auth.users
        WHERE id = OLD.user_id
    ) THEN
        RETURN OLD;
    END IF;

    v_today := (NOW() AT TIME ZONE OLD.timezone)::DATE;

    -- Normal deletion is allowed only before the start date.
    IF v_today >= OLD.start_date THEN
        RAISE EXCEPTION 'Anushthans cannot be deleted after they start';
    END IF;

    RETURN OLD;
END;
$$;


CREATE TRIGGER protect_anushthan_deletion_trigger
BEFORE DELETE
ON public.anushthans
FOR EACH ROW
EXECUTE FUNCTION public.protect_anushthan_deletion();


-- =====================================================
-- 7. PROTECT ANUSHTHAN COMPONENTS
-- =====================================================

CREATE OR REPLACE FUNCTION public.protect_anushthan_components()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_user_id UUID;
    v_anushthan_id UUID;
    v_start_date DATE;
    v_timezone TEXT;
    v_created_at TIMESTAMPTZ;
    v_today DATE;
BEGIN

    IF TG_OP = 'INSERT' THEN
        v_user_id := NEW.user_id;
        v_anushthan_id := NEW.anushthan_id;

    ELSIF TG_OP = 'UPDATE' THEN

        -- A component cannot be moved to another user or Anushthan
        IF NEW.user_id IS DISTINCT FROM OLD.user_id
           OR NEW.anushthan_id IS DISTINCT FROM OLD.anushthan_id THEN
            RAISE EXCEPTION 'Anushthan component ownership cannot be changed';
        END IF;

        v_user_id := NEW.user_id;
        v_anushthan_id := NEW.anushthan_id;

    ELSE
        v_user_id := OLD.user_id;
        v_anushthan_id := OLD.anushthan_id;
    END IF;

    SELECT
        start_date,
        timezone,
        created_at
    INTO
        v_start_date,
        v_timezone,
        v_created_at
    FROM public.anushthans
    WHERE id = v_anushthan_id
      AND user_id = v_user_id;

    -- Parent may already have been deleted during a cascade
    IF NOT FOUND THEN
        IF TG_OP = 'DELETE' THEN
            RETURN OLD;
        END IF;

        RETURN NEW;
    END IF;

    v_today := (NOW() AT TIME ZONE v_timezone)::DATE;

    IF v_today >= v_start_date THEN

        -- Allow initial components in the same transaction
        -- that creates the Anushthan, including a start date of today.
        IF TG_OP = 'INSERT'
           AND v_created_at = TRANSACTION_TIMESTAMP() THEN
            RETURN NEW;
        END IF;

        RAISE EXCEPTION 'Anushthan components cannot be changed after the Anushthan starts';
    END IF;

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    END IF;

    RETURN NEW;
END;
$$;


CREATE TRIGGER protect_anushthan_mantras_trigger
BEFORE INSERT OR UPDATE OR DELETE
ON public.anushthan_mantras
FOR EACH ROW
EXECUTE FUNCTION public.protect_anushthan_components();


CREATE TRIGGER protect_anushthan_stotras_trigger
BEFORE INSERT OR UPDATE OR DELETE
ON public.anushthan_stotras
FOR EACH ROW
EXECUTE FUNCTION public.protect_anushthan_components();


-- =====================================================
-- 8. REQUIRE AT LEAST ONE ANUSHTHAN COMPONENT
-- =====================================================

CREATE OR REPLACE FUNCTION public.validate_anushthan_components()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_anushthan_id UUID;
BEGIN

    IF TG_TABLE_NAME = 'anushthans' THEN

        IF TG_OP = 'DELETE' THEN
            v_anushthan_id := OLD.id;
        ELSE
            v_anushthan_id := NEW.id;
        END IF;

    ELSE

        IF TG_OP = 'DELETE' THEN
            v_anushthan_id := OLD.anushthan_id;
        ELSE
            v_anushthan_id := NEW.anushthan_id;
        END IF;

    END IF;

    -- Parent may have been deleted
    IF NOT EXISTS (
        SELECT 1
        FROM public.anushthans
        WHERE id = v_anushthan_id
    ) THEN
        RETURN NULL;
    END IF;

    -- At least one mantra or stotra is required
    IF NOT EXISTS (
        SELECT 1
        FROM public.anushthan_mantras
        WHERE anushthan_id = v_anushthan_id
    )
    AND NOT EXISTS (
        SELECT 1
        FROM public.anushthan_stotras
        WHERE anushthan_id = v_anushthan_id
    ) THEN
        RAISE EXCEPTION 'An Anushthan must contain at least one mantra or stotra';
    END IF;

    RETURN NULL;
END;
$$;


-- Deferred validation allows parent and components
-- to be inserted together in one transaction.

CREATE CONSTRAINT TRIGGER validate_anushthan_has_component
AFTER INSERT
ON public.anushthans
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW
EXECUTE FUNCTION public.validate_anushthan_components();


CREATE CONSTRAINT TRIGGER validate_anushthan_mantra_component
AFTER INSERT OR UPDATE OR DELETE
ON public.anushthan_mantras
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW
EXECUTE FUNCTION public.validate_anushthan_components();


CREATE CONSTRAINT TRIGGER validate_anushthan_stotra_component
AFTER INSERT OR UPDATE OR DELETE
ON public.anushthan_stotras
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW
EXECUTE FUNCTION public.validate_anushthan_components();


-- =====================================================
-- 9. ATOMIC ANUSHTHAN CREATION FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION public.create_anushthan(
    p_name TEXT,
    p_start_date DATE,
    p_end_date DATE,
    p_timezone TEXT,
    p_mantras JSONB DEFAULT '[]'::JSONB,
    p_stotras JSONB DEFAULT '[]'::JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_user_id UUID;
    v_anushthan_id UUID;
    v_mantras JSONB;
    v_stotras JSONB;
BEGIN

    v_user_id := auth.uid();

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required';
    END IF;

    v_mantras := COALESCE(p_mantras, '[]'::JSONB);
    v_stotras := COALESCE(p_stotras, '[]'::JSONB);

    IF jsonb_typeof(v_mantras) <> 'array'
       OR jsonb_typeof(v_stotras) <> 'array' THEN
        RAISE EXCEPTION 'Mantras and stotras must be JSON arrays';
    END IF;

    IF jsonb_array_length(v_mantras) = 0
       AND jsonb_array_length(v_stotras) = 0 THEN
        RAISE EXCEPTION 'Select at least one mantra or stotra';
    END IF;

    -- Create parent
    INSERT INTO public.anushthans (
        user_id,
        name,
        start_date,
        end_date,
        timezone
    )
    VALUES (
        v_user_id,
        p_name,
        p_start_date,
        p_end_date,
        p_timezone
    )
    RETURNING id INTO v_anushthan_id;

    -- Insert selected mantras and their targets
    INSERT INTO public.anushthan_mantras (
        user_id,
        anushthan_id,
        mantra_id,
        target_malas
    )
    SELECT
        v_user_id,
        v_anushthan_id,
        entries.mantra_id,
        entries.target_malas
    FROM jsonb_to_recordset(v_mantras)
    AS entries(
        mantra_id UUID,
        target_malas INTEGER
    );

    -- Insert selected stotras and their targets
    INSERT INTO public.anushthan_stotras (
        user_id,
        anushthan_id,
        stotra_id,
        target_recitations
    )
    SELECT
        v_user_id,
        v_anushthan_id,
        entries.stotra_id,
        entries.target_recitations
    FROM jsonb_to_recordset(v_stotras)
    AS entries(
        stotra_id UUID,
        target_recitations INTEGER
    );

    RETURN v_anushthan_id;
END;
$$;


-- =====================================================
-- 10. ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.anushthans
ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.anushthan_mantras
ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.anushthan_stotras
ENABLE ROW LEVEL SECURITY;


-- =====================================================
-- 11. ANUSHTHAN POLICIES
-- =====================================================

CREATE POLICY "User can view their own anushthans"
ON public.anushthans
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);


CREATE POLICY "User can update their own anushthans"
ON public.anushthans
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);


CREATE POLICY "User can delete their own scheduled anushthans"
ON public.anushthans
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);


-- =====================================================
-- 12. ANUSHTHAN MANTRA POLICIES
-- =====================================================

CREATE POLICY "User can view their own anushthan mantras"
ON public.anushthan_mantras
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);


CREATE POLICY "User can add their own anushthan mantras"
ON public.anushthan_mantras
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);


CREATE POLICY "User can update their own anushthan mantras"
ON public.anushthan_mantras
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);


CREATE POLICY "User can delete their own anushthan mantras"
ON public.anushthan_mantras
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);


-- =====================================================
-- 13. ANUSHTHAN STOTRA POLICIES
-- =====================================================

CREATE POLICY "User can view their own anushthan stotras"
ON public.anushthan_stotras
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);


CREATE POLICY "User can add their own anushthan stotras"
ON public.anushthan_stotras
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);


CREATE POLICY "User can update their own anushthan stotras"
ON public.anushthan_stotras
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);


CREATE POLICY "User can delete their own anushthan stotras"
ON public.anushthan_stotras
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);


-- =====================================================
-- 14. TABLE PERMISSIONS
-- =====================================================

REVOKE ALL ON public.anushthans
FROM PUBLIC, anon, authenticated;

REVOKE ALL ON public.anushthan_mantras
FROM PUBLIC, anon, authenticated;

REVOKE ALL ON public.anushthan_stotras
FROM PUBLIC, anon, authenticated;


-- Parent table: no direct INSERT.
-- Creation must go through create_anushthan().
GRANT SELECT, UPDATE, DELETE
ON public.anushthans
TO authenticated;


-- Components can be managed while Scheduled.
-- Database triggers lock them once the Anushthan starts.
GRANT SELECT, INSERT, UPDATE, DELETE
ON public.anushthan_mantras
TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.anushthan_stotras
TO authenticated;


-- Restrict function execution
REVOKE ALL ON FUNCTION public.create_anushthan(
    TEXT, DATE, DATE, TEXT, JSONB, JSONB
)
FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.create_anushthan(
    TEXT, DATE, DATE, TEXT, JSONB, JSONB
)
TO authenticated;


-- =====================================================
-- END OF ANUSHTHAN MIGRATION
-- =====================================================
