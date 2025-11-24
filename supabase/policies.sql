-- Enable RLS on tables if not already enabled
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;

ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated users to insert a new company
-- This is necessary because during registration, the user is authenticated but doesn't have a company yet.
CREATE POLICY "Allow authenticated users to create companies" ON empresas FOR
INSERT
    TO authenticated
WITH
    CHECK (true);

-- Policy to allow authenticated users to view their own company
CREATE POLICY "Allow users to view their own company" ON empresas FOR
SELECT TO authenticated USING (
        id IN (
            SELECT empresa_id
            FROM usuarios
            WHERE
                id = auth.uid ()
        )
    );

-- Policy to allow authenticated users to insert their own user profile
-- The ID must match the auth.uid()
CREATE POLICY "Allow users to create their own profile" ON usuarios FOR
INSERT
    TO authenticated
WITH
    CHECK (auth.uid () = id);

-- Policy to allow users to view their own profile
CREATE POLICY "Allow users to view their own profile" ON usuarios FOR
SELECT TO authenticated USING (auth.uid () = id);

-- Policy to allow users to update their own profile
CREATE POLICY "Allow users to update their own profile" ON usuarios FOR
UPDATE TO authenticated USING (auth.uid () = id);