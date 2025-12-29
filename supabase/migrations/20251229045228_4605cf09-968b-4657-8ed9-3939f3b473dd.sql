-- Create stock watchlist table
CREATE TABLE public.stock_watchlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stock_code TEXT NOT NULL,
  stock_name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.stock_watchlist ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (stock watchlist is public data)
CREATE POLICY "Anyone can view active stocks" 
ON public.stock_watchlist 
FOR SELECT 
USING (is_active = true);

-- Insert default stocks
INSERT INTO public.stock_watchlist (stock_code, stock_name) VALUES
  ('2330', '台積電'),
  ('2317', '鴻海'),
  ('2454', '聯發科');

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_stock_watchlist_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_stock_watchlist_updated_at
BEFORE UPDATE ON public.stock_watchlist
FOR EACH ROW
EXECUTE FUNCTION public.update_stock_watchlist_updated_at();