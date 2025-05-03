-- Create login_logs table
CREATE TABLE IF NOT EXISTS login_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  success BOOLEAN NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT
);

-- Enable RLS
ALTER TABLE login_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Usuários podem ver seus próprios logs"
ON login_logs FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Apenas o sistema pode inserir logs"
ON login_logs FOR INSERT
WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_login_logs_user_id ON login_logs(user_id);
CREATE INDEX idx_login_logs_timestamp ON login_logs(timestamp); 