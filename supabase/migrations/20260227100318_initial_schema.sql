-- 1. Create the games table
CREATE TABLE IF NOT EXISTS games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users NOT NULL,
    cash NUMERIC NOT NULL,
    engineer_count INT DEFAULT 4,
    sales_staff_count INT DEFAULT 2,
    product_quality NUMERIC NOT NULL,
    current_quarter INT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    engineer_to_be_hired INT DEFAULT 4,
    sales_to_be_hired INT DEFAULT 2,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create the turn_history table
CREATE TABLE IF NOT EXISTS turn_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id UUID REFERENCES games(id) ON DELETE CASCADE NOT NULL,
    quarter INT NOT NULL,
    price NUMERIC NOT NULL,
    salary_pct NUMERIC NOT NULL,
    engineer_to_be_hired INT NOT NULL,
    sales_to_be_hired INT NOT NULL,
    revenue NUMERIC NOT NULL,
    net_income NUMERIC NOT NULL,
    cash_end NUMERIC NOT NULL,
    engineer_count INT NOT NULL,
    sales_staff_count INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Row Level Security
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE turn_history ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies for the games table
CREATE POLICY "Users can insert their own game" 
ON games FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own game" 
ON games FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own game" 
ON games FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own game" 
ON games FOR DELETE USING (auth.uid() = user_id);

-- 5. Create RLS Policies for the turn_history table
CREATE POLICY "Users can insert history for their game" 
ON turn_history FOR INSERT WITH CHECK (
    game_id IN (SELECT id FROM games WHERE user_id = auth.uid())
);

CREATE POLICY "Users can view history for their game" 
ON turn_history FOR SELECT USING (
    game_id IN (SELECT id FROM games WHERE user_id = auth.uid())
);

CREATE POLICY "Users can delete their own game history" 
ON turn_history FOR DELETE USING (
    game_id IN (SELECT id FROM games WHERE user_id = auth.uid())
);

-- -- 6. Create the atomic RPC function
CREATE OR REPLACE FUNCTION advance_game_turn(
  p_game_id UUID,
  p_cash NUMERIC,
  p_engineer_count INT,
  p_sales_staff_count INT,
  p_quality NUMERIC,
  p_quarter INT,
  p_status TEXT,
  p_price NUMERIC,
  p_salary_pct NUMERIC,
  p_engineer_to_be_hired INT,
  p_sales_to_be_hired INT,
  p_revenue NUMERIC,
  p_net_income NUMERIC
) RETURNS VOID AS $$
BEGIN
  UPDATE games SET 
    cash = p_cash, 
    engineer_count = p_engineer_count, 
    sales_staff_count = p_sales_staff_count, 
    product_quality = p_quality, 
    current_quarter = p_quarter, 
    status = p_status,
    engineer_to_be_hired = p_engineer_to_be_hired,
    sales_to_be_hired = p_sales_to_be_hired
  WHERE id = p_game_id;

  INSERT INTO turn_history (
    game_id, quarter, price, salary_pct, engineer_to_be_hired, sales_to_be_hired, 
    revenue, net_income, cash_end, engineer_count, sales_staff_count
  ) VALUES (
    p_game_id, p_quarter - 1, p_price, p_salary_pct, p_engineer_to_be_hired, p_sales_to_be_hired, 
    p_revenue, p_net_income, p_cash, p_engineer_count, p_sales_staff_count
  );
END;
$$ LANGUAGE plpgsql;