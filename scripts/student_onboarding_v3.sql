ALTER TABLE student_onboarding
  ADD COLUMN IF NOT EXISTS diagnostic_math_score INTEGER,
  ADD COLUMN IF NOT EXISTS diagnostic_verbal_score INTEGER,
  ADD COLUMN IF NOT EXISTS diagnostic_total_score INTEGER,
  ADD COLUMN IF NOT EXISTS course_math_name TEXT,
  ADD COLUMN IF NOT EXISTS math_code TEXT,
  ADD COLUMN IF NOT EXISTS course_verbal_name TEXT,
  ADD COLUMN IF NOT EXISTS verbal_code TEXT,
  ADD COLUMN IF NOT EXISTS output_commitment_math BOOLEAN,
  ADD COLUMN IF NOT EXISTS output_commitment_verbal BOOLEAN;

UPDATE student_onboarding
SET
  diagnostic_math_score = COALESCE(diagnostic_math_score, 0),
  diagnostic_verbal_score = COALESCE(diagnostic_verbal_score, 0),
  diagnostic_total_score = COALESCE(diagnostic_total_score, diagnostic_score, 0),
  course_math_name = COALESCE(course_math_name, course_name, ''),
  math_code = COALESCE(math_code, ''),
  course_verbal_name = COALESCE(course_verbal_name, course_name, ''),
  verbal_code = COALESCE(verbal_code, ''),
  output_commitment_math = COALESCE(output_commitment_math, output_commitment, FALSE),
  output_commitment_verbal = COALESCE(output_commitment_verbal, output_commitment, FALSE)
WHERE
  diagnostic_math_score IS NULL
  OR diagnostic_verbal_score IS NULL
  OR diagnostic_total_score IS NULL
  OR course_math_name IS NULL
  OR math_code IS NULL
  OR course_verbal_name IS NULL
  OR verbal_code IS NULL
  OR output_commitment_math IS NULL
  OR output_commitment_verbal IS NULL;

ALTER TABLE student_onboarding
  ALTER COLUMN diagnostic_math_score SET DEFAULT 0,
  ALTER COLUMN diagnostic_verbal_score SET DEFAULT 0,
  ALTER COLUMN diagnostic_total_score SET DEFAULT 0,
  ALTER COLUMN course_math_name SET DEFAULT '',
  ALTER COLUMN math_code SET DEFAULT '',
  ALTER COLUMN course_verbal_name SET DEFAULT '',
  ALTER COLUMN verbal_code SET DEFAULT '',
  ALTER COLUMN output_commitment_math SET DEFAULT FALSE,
  ALTER COLUMN output_commitment_verbal SET DEFAULT FALSE;

ALTER TABLE student_onboarding
  ALTER COLUMN diagnostic_math_score SET NOT NULL,
  ALTER COLUMN diagnostic_verbal_score SET NOT NULL,
  ALTER COLUMN diagnostic_total_score SET NOT NULL,
  ALTER COLUMN course_math_name SET NOT NULL,
  ALTER COLUMN math_code SET NOT NULL,
  ALTER COLUMN course_verbal_name SET NOT NULL,
  ALTER COLUMN verbal_code SET NOT NULL,
  ALTER COLUMN output_commitment_math SET NOT NULL,
  ALTER COLUMN output_commitment_verbal SET NOT NULL;

ALTER TABLE student_onboarding
  ALTER COLUMN course_name DROP NOT NULL,
  ALTER COLUMN diagnostic_score DROP NOT NULL,
  ALTER COLUMN output_commitment DROP NOT NULL;
