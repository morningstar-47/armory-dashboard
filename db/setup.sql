-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'analyst' CHECK (role IN ('admin', 'commander', 'analyst', 'field')),
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  clearance VARCHAR(50) NOT NULL DEFAULT 'confidential' CHECK (clearance IN ('topsecret', 'secret', 'confidential')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(50) NOT NULL,
  resource VARCHAR(50) NOT NULL,
  details TEXT,
  ip_address VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  classification VARCHAR(50) NOT NULL DEFAULT 'confidential' CHECK (classification IN ('topsecret', 'secret', 'confidential')),
  status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected')),
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  severity VARCHAR(50) NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved')),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create intelligence_data table for map markers
CREATE TABLE IF NOT EXISTS intelligence_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  data_type VARCHAR(50) NOT NULL CHECK (data_type IN ('asset', 'threat', 'incident', 'observation')),
  classification VARCHAR(50) NOT NULL DEFAULT 'confidential' CHECK (classification IN ('topsecret', 'secret', 'confidential')),
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  reported_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sessions table for tracking user sessions
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address VARCHAR(50),
  user_agent TEXT
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update updated_at timestamp
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reports_updated_at
BEFORE UPDATE ON reports
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alerts_updated_at
BEFORE UPDATE ON alerts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_intelligence_data_updated_at
BEFORE UPDATE ON intelligence_data
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create function to log user actions
CREATE OR REPLACE FUNCTION log_user_action()
RETURNS TRIGGER AS $$
DECLARE
  action_type VARCHAR(50);
  resource_type VARCHAR(50);
  details_text TEXT;
  user_id UUID;
BEGIN
  -- Determine action type
  IF TG_OP = 'INSERT' THEN
    action_type := 'create';
  ELSIF TG_OP = 'UPDATE' THEN
    action_type := 'update';
  ELSIF TG_OP = 'DELETE' THEN
    action_type := 'delete';
  END IF;
  
  -- Set resource type based on table name
  resource_type := TG_TABLE_NAME;
  
  -- Create details text
  IF TG_OP = 'INSERT' THEN
    details_text := 'Created new ' || resource_type || ' record with ID: ' || NEW.id;
  ELSIF TG_OP = 'UPDATE' THEN
    details_text := 'Updated ' || resource_type || ' record with ID: ' || NEW.id;
  ELSIF TG_OP = 'DELETE' THEN
    details_text := 'Deleted ' || resource_type || ' record with ID: ' || OLD.id;
  END IF;
  
  -- Get user ID from auth.uid() or use NULL if not available
  BEGIN
    user_id := auth.uid();
  EXCEPTION WHEN OTHERS THEN
    user_id := NULL;
  END;
  
  -- Insert into audit_logs
  INSERT INTO audit_logs (user_id, action, resource, details, ip_address)
  VALUES (user_id, action_type, resource_type, details_text, NULL);
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for audit logging
CREATE TRIGGER users_audit_log_trigger
AFTER INSERT OR UPDATE OR DELETE ON users
FOR EACH ROW EXECUTE FUNCTION log_user_action();

CREATE TRIGGER reports_audit_log_trigger
AFTER INSERT OR UPDATE OR DELETE ON reports
FOR EACH ROW EXECUTE FUNCTION log_user_action();

CREATE TRIGGER alerts_audit_log_trigger
AFTER INSERT OR UPDATE OR DELETE ON alerts
FOR EACH ROW EXECUTE FUNCTION log_user_action();

CREATE TRIGGER intelligence_data_audit_log_trigger
AFTER INSERT OR UPDATE OR DELETE ON intelligence_data
FOR EACH ROW EXECUTE FUNCTION log_user_action();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE intelligence_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
-- Admin can see and modify all users
CREATE POLICY admin_users_policy ON users
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Users can see their own profile
CREATE POLICY users_select_own_policy ON users
  FOR SELECT
  USING (id = auth.uid());

-- Create RLS policies for audit_logs table
-- Admin can see all audit logs
CREATE POLICY admin_audit_logs_policy ON audit_logs
  FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

-- Create RLS policies for reports table
-- Admin and commanders can see all reports
CREATE POLICY admin_commander_reports_policy ON reports
  FOR SELECT
  USING (auth.jwt() ->> 'role' IN ('admin', 'commander'));

-- Users can see reports based on their clearance level
CREATE POLICY users_reports_policy ON reports
  FOR SELECT
  USING (
    (classification = 'confidential') OR
    (classification = 'secret' AND auth.jwt() ->> 'clearance' IN ('secret', 'topsecret')) OR
    (classification = 'topsecret' AND auth.jwt() ->> 'clearance' = 'topsecret')
  );

-- Authors can modify their own reports
CREATE POLICY authors_reports_policy ON reports
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

-- Create RLS policies for alerts table
-- Everyone can see alerts
CREATE POLICY all_alerts_policy ON alerts
  FOR SELECT
  USING (true);

-- Admin and commanders can create and modify alerts
CREATE POLICY admin_commander_alerts_policy ON alerts
  USING (auth.jwt() ->> 'role' IN ('admin', 'commander'))
  WITH CHECK (auth.jwt() ->> 'role' IN ('admin', 'commander'));

-- Users assigned to an alert can update it
CREATE POLICY assigned_alerts_policy ON alerts
  FOR UPDATE
  USING (assigned_to = auth.uid())
  WITH CHECK (assigned_to = auth.uid());

-- Create RLS policies for intelligence_data table
-- Admin and commanders can see all intelligence data
CREATE POLICY admin_commander_intelligence_policy ON intelligence_data
  FOR SELECT
  USING (auth.jwt() ->> 'role' IN ('admin', 'commander'));

-- Users can see intelligence data based on their clearance level
CREATE POLICY users_intelligence_policy ON intelligence_data
  FOR SELECT
  USING (
    (classification = 'confidential') OR
    (classification = 'secret' AND auth.jwt() ->> 'clearance' IN ('secret', 'topsecret')) OR
    (classification = 'topsecret' AND auth.jwt() ->> 'clearance' = 'topsecret')
  );

-- Reporters can modify their own intelligence data
CREATE POLICY reporters_intelligence_policy ON intelligence_data
  USING (reported_by = auth.uid())
  WITH CHECK (reported_by = auth.uid());

-- Create RLS policies for sessions table
-- Users can only see their own sessions
CREATE POLICY users_sessions_policy ON sessions
  FOR SELECT
  USING (user_id = auth.uid());

-- Admin can see all sessions
CREATE POLICY admin_sessions_policy ON sessions
  FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);
CREATE INDEX IF NOT EXISTS users_role_idx ON users(role);
CREATE INDEX IF NOT EXISTS users_status_idx ON users(status);
CREATE INDEX IF NOT EXISTS audit_logs_user_id_idx ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS audit_logs_action_idx ON audit_logs(action);
CREATE INDEX IF NOT EXISTS audit_logs_resource_idx ON audit_logs(resource);
CREATE INDEX IF NOT EXISTS reports_author_id_idx ON reports(author_id);
CREATE INDEX IF NOT EXISTS reports_status_idx ON reports(status);
CREATE INDEX IF NOT EXISTS reports_classification_idx ON reports(classification);
CREATE INDEX IF NOT EXISTS alerts_severity_idx ON alerts(severity);
CREATE INDEX IF NOT EXISTS alerts_status_idx ON alerts(status);
CREATE INDEX IF NOT EXISTS alerts_assigned_to_idx ON alerts(assigned_to);
CREATE INDEX IF NOT EXISTS intelligence_data_data_type_idx ON intelligence_data(data_type);
CREATE INDEX IF NOT EXISTS intelligence_data_classification_idx ON intelligence_data(classification);
CREATE INDEX IF NOT EXISTS intelligence_data_reported_by_idx ON intelligence_data(reported_by);
CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id);
CREATE INDEX IF NOT EXISTS sessions_expires_at_idx ON sessions(expires_at);

-- Insert initial admin user if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@armory.gov') THEN
    INSERT INTO users (id, email, first_name, last_name, role, status, clearance)
    VALUES (
      uuid_generate_v4(),
      'admin@armory.gov',
      'System',
      'Administrator',
      'admin',
      'active',
      'topsecret'
    );
  END IF;
END
$$;
