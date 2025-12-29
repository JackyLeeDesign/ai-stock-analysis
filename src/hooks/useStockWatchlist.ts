import { useState, useEffect, useCallback } from 'react';

interface WatchlistItem {
  stock_code: string;
  stock_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  success: boolean;
  data: WatchlistItem[];
  pagination?: {
    limit: number;
    offset: number;
    total: number | null;
  };
}

const EXTERNAL_API_URL = 'https://bxqznxcrwuyvnpsvmbob.supabase.co';

export function useStockWatchlist(activeOnly: boolean = true) {
  const [data, setData] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWatchlist = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const searchParams = new URLSearchParams();
      if (!activeOnly) searchParams.set('active_only', 'false');

      const response = await fetch(
        `${EXTERNAL_API_URL}/functions/v1/get-stock-watchlist?${searchParams}`
      );
      
      if (!response.ok) {
        throw new Error(`API 請求失敗: ${response.status}`);
      }
      
      const json: ApiResponse = await response.json();
      
      if (json.success) {
        setData(json.data);
      } else {
        throw new Error('API 回應失敗');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知錯誤');
    } finally {
      setLoading(false);
    }
  }, [activeOnly]);

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  const stockCodes = data.map(item => item.stock_code);

  return { data, stockCodes, loading, error, refetch: fetchWatchlist };
}
