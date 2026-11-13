
-- =========================================
-- TABLE: mantras
-- Add active and archived status
-- =========================================

ALTER TABLE public.mantras
ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE,
ADD COLUMN is_archived BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE public.mantras
ADD CONSTRAINT mantras_archive_status_check
CHECK (
    NOT is_archived OR NOT is_active
);


-- =========================================
-- TABLE: stotras
-- Add active and archived status
-- =========================================

ALTER TABLE public.stotras
ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE,
ADD COLUMN is_archived BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE public.stotras
ADD CONSTRAINT stotras_archive_status_check
CHECK (
    NOT is_archived OR NOT is_active
);
