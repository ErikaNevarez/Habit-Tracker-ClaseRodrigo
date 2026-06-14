CREATE TABLE habits (
  id              uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid          NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name            varchar(60)   NOT NULL,
  description     varchar(280),
  frequency       text          NOT NULL CHECK (frequency IN ('daily', 'weekly')),
  target_per_week int           CHECK (target_per_week BETWEEN 1 AND 7),
  best_streak     int           NOT NULL DEFAULT 0,
  archived_at     timestamptz,
  created_at      timestamptz   NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX habits_user_name_active_idx
  ON habits (user_id, name)
  WHERE archived_at IS NULL;

ALTER TABLE habits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "habits_select_own"
  ON habits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "habits_insert_own"
  ON habits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "habits_update_own"
  ON habits FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "habits_delete_own"
  ON habits FOR DELETE
  USING (auth.uid() = user_id);
