import { useState, useEffect, useCallback } from 'react';

interface TechnicalSummary {
  trend?: string;
  riskLevel?: string;
  confidence?: string;
  supportPrice?: number;
  resistancePrice?: number;
  shortTermAction?: string;
}

interface StockAnalysis {
  stock_code: string;
  stock_name: string;
  analysis_date: string;
  analysis_time: string;
  gemini_analysis: string;
  technical_summary: TechnicalSummary | string;
}

interface ApiResponse {
  success: boolean;
  data: StockAnalysis[];
  pagination?: {
    limit: number;
    offset: number;
    total: number;
  };
}

const SUPABASE_URL = 'https://bxqznxcrwuyvnpsvmbob.supabase.co';

export function useStockAnalysis(stockCodes: string[] = ['2330', '2317', '2454']) {
  const [data, setData] = useState<StockAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysis = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const results: StockAnalysis[] = [];
      
      const fetchPromises = stockCodes.map(async (stockCode) => {
        const response = await fetch(
          `${SUPABASE_URL}/functions/v1/get-stock-analysis?stock_code=${stockCode}&limit=1`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        
        if (!response.ok) {
          throw new Error(`API 請求失敗: ${response.status}`);
        }
        
        const json: ApiResponse = await response.json();
        
        if (json.success && json.data.length > 0) {
          return json.data[0];
        }
        return null;
      });
      
      const fetchedData = await Promise.all(fetchPromises);
      fetchedData.forEach(item => {
        if (item) results.push(item);
      });
      
      setData(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知錯誤');
    } finally {
      setLoading(false);
    }
  }, [stockCodes.join(',')]);

  useEffect(() => {
    fetchAnalysis();
  }, [fetchAnalysis]);

  return { data, loading, error, refetch: fetchAnalysis };
}
