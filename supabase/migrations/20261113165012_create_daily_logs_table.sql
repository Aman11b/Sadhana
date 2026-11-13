--==========================
-- TABLE: daily_logs
--==========================


CREATE TABLE public.daily_logs(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
    REFERENCES auth.users(id)
    ON DELETE CASCADE,

    practice_date DATE NOT NULL,

    timezone TEXT NOT NULL,

    comment TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ not null DEFAULT NOW(),

    CONSTRAINT daily_logs_timezone_format_check
    CHECK (
        timezone <> ''
        AND timezone=BTRIM(timezone)
    ),

    CONSTRAINT daily_logs_comment_length_check
    CHECK (
        comment IS NULL
        OR CHAR_LENGTH(comment)<=2000
    ),

    CONSTRAINT daily_logs_user_date_unique
    UNIQUE(user_id,practice_date),

    CONSTRAINT daily_logs_user_id_id_unique
    UNIQUE(user_id,id)
);

-- =========================================
-- TRIGGER FUNCTION: daily_logs validation
-- =========================================

CREATE OR REPLACE FUNCTION public.validate_daily_log()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Validate timezone againt POstgreSQL's timezone list
    IF NOT EXISTS(
        SELECT 1
        FROM pg_timezone_names
        WHERE name = NEW.timezone
    )THEN
    RAISE EXCEPTION 'Invalid timezone: %',NEW.timezone;
    END IF;

    -- Prevent future practice date using the user's timezone
    IF NEW.practice_date > 
    (NOW() AT TIME ZONE NEW.timezone)::DATE THEN
    RAISE EXCEPTION 'Practice date cannot be in the future';
    END IF;

    -- Automatic update updated_at
    NEW.updated_at=NOW();
    RETURN NEW;
END;
$$;

-- =========================================
-- TRIGGER: daily_logs
-- =========================================
CREATE TRIGGER validate_daily_log_before_write
BEFORE INSERT OR UPDATE
ON public.daily_logs
FOR EACH ROW
EXECUTE FUNCTION public.validate_daily_log();

-- =========================================
-- ROW LEVEL SECURITY TABLE: daily_logs
-- =========================================
ALTER TABLE public.daily_logs
ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User can view their own daily logs"
ON public.daily_logs
FOR SELECT
TO authenticated
USING (auth.uid()=user_id);

CREATE POLICY "User can add their own daily logs"
ON public.daily_logs
FOR INSERT
TO authenticated
WITH CHECK (auth.uid()=user_id);

CREATE POLICY "User can update their own daily logs"
ON public.daily_logs
FOR UPDATE
TO authenticated
USING (auth.uid()=user_id)
WITH CHECK (auth.uid()=user_id);

-- =========================================
-- TABLE PERMISSIONS: daily_logs
-- =========================================
GRANT SELECT,INSERT,UPDATE
ON public.daily_logs
TO authenticated;