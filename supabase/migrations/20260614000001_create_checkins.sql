CREATE TABLE checkins (
  id        uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id  uuid    NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  date      date    NOT NULL,
  done      boolean NOT NULL DEFAULT false,

  CONSTRAINT checkins_habit_date_unique UNIQUE (habit_id, date)
);

ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "checkins_select_own"
  ON checkins FOR SELECT
  USING (
    habit_id IN (
      SELECT id FROM habits WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "checkins_insert_own"
  ON checkins FOR INSERT
  WITH CHECK (
    habit_id IN (
      SELECT id FROM habits WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "checkins_update_own"
  ON checkins FOR UPDATE
  USING (
    habit_id IN (
      SELECT id FROM habits WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    habit_id IN (
      SELECT id FROM habits WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "checkins_delete_own"
  ON checkins FOR DELETE
  USING (
    habit_id IN (
      SELECT id FROM habits WHERE user_id = auth.uid()
    )
  );
