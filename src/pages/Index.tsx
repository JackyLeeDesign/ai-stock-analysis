import { useStockAnalysis } from '@/hooks/useStockAnalysis';
import { StockCard } from '@/components/StockCard';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, BarChart3, TrendingUp, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { data, loading, error, refetch } = useStockAnalysis(['2330', '2317', '2454']);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <header className="relative overflow-hidden border-b bg-card">
        <div className="absolute inset-0 gradient-primary opacity-5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative container py-8 md:py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-2xl gradient-primary shadow-lg shadow-primary/30 animate-scale-in">
                <BarChart3 className="h-7 w-7 md:h-8 md:w-8 text-primary-foreground" />
              </div>
              <div className="animate-fade-up">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                  台股 AI 分析
                </h1>
                <p className="text-muted-foreground text-sm md:text-base mt-1">
                  每日智能股票分析報告
                </p>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => refetch()}
              disabled={loading}
              className="animate-fade-in gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              重新整理
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 md:gap-4 mt-6 md:mt-8">
            {[
              { label: '追蹤股票', value: '3', icon: TrendingUp },
              { label: '今日更新', value: data.length.toString(), icon: RefreshCw },
              { label: '分析模型', value: 'Gemini', icon: BarChart3 },
            ].map((stat, i) => (
              <div 
                key={stat.label}
                className="rounded-xl border bg-card/50 backdrop-blur-sm p-3 md:p-4 animate-fade-up"
                style={{ animationDelay: `${(i + 1) * 100}ms` }}
              >
                <stat.icon className="h-4 w-4 md:h-5 md:w-5 text-primary mb-2" />
                <p className="text-xl md:text-2xl font-bold">{stat.value}</p>
                <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="container py-6 md:py-8">
        {error && (
          <Alert variant="destructive" className="mb-6 animate-fade-up">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>載入失敗</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div 
                  key={i} 
                  className="space-y-4 animate-pulse"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <Skeleton className="h-24 w-full rounded-xl" />
                  <div className="grid grid-cols-2 gap-3">
                    <Skeleton className="h-16 w-full rounded-xl" />
                    <Skeleton className="h-16 w-full rounded-xl" />
                  </div>
                  <Skeleton className="h-32 w-full rounded-xl" />
                </div>
              ))
            : data.map((stock, index) => (
                <StockCard
                  key={stock.stock_code}
                  stockCode={stock.stock_code}
                  stockName={stock.stock_name}
                  analysisDate={stock.analysis_date}
                  analysisTime={stock.analysis_time}
                  geminiAnalysis={stock.gemini_analysis}
                  technicalSummary={stock.technical_summary}
                  index={index}
                />
              ))}
        </div>

        {!loading && data.length === 0 && !error && (
          <div className="text-center py-16 animate-fade-up">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
              <BarChart3 className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-lg text-muted-foreground">目前沒有分析資料</p>
            <p className="text-sm text-muted-foreground mt-1">請稍後再試</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
