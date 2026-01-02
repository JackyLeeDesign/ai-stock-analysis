import { useState, useEffect, useCallback } from 'react';

interface TechnicalSummary {
  trend?: string;
  riskLevel?: string;
  confidence?: number;
  supportPrice?: number;
  resistancePrice?: number;
  shortTermAction?: string;
  midTermAction?: string;
  longTermAction?: string;
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

const EXTERNAL_API_URL = 'https://bxqznxcrwuyvnpsvmbob.supabase.co';
const EXTERNAL_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4cXpueGNyd3V5dm5wc3ZtYm9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUwMTk0NjAsImV4cCI6MjA1MDU5NTQ2MH0.VNM6vNOHJ_vvnLU6RPuxAqsFCuGj-t5y2C8FGMnvl3k';

export function useStockAnalysis(stockCodes: string[] = ['2330', '2317', '2454']) {
  const [data, setData] = useState<StockAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysis = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const fetchPromises = stockCodes.map(async (stockCode) => {
        const response = await fetch(
          `${EXTERNAL_API_URL}/functions/v1/get-stock-analysis?stock_code=${stockCode}&limit=1`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${EXTERNAL_API_KEY}`,
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
      const results = fetchedData.filter((item): item is StockAnalysis => item !== null);
      
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
