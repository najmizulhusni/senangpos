-- Add admin_reply column to support_tickets table
ALTER TABLE support_tickets ADD COLUMN IF NOT EXISTS admin_reply TEXT;
ALTER TABLE support_tickets ADD COLUMN IF NOT EXISTS replied_at TIMESTAMP WITH TIME ZONE;
