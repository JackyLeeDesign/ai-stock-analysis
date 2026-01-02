import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, Calendar, Clock, Shield, Target, Zap } from 'lucide-react';

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

interface StockCardProps {
  stockCode: string;
  stockName: string;
  analysisDate: string;
  analysisTime: string;
  geminiAnalysis: string;
  technicalSummary: TechnicalSummary | string;
  index?: number;
}

function getTrendIcon(trend?: string) {
  if (trend?.includes('上漲') || trend?.toLowerCase().includes('up') || trend?.includes('bullish')) {
    return <TrendingUp className="h-5 w-5" />;
  }
  if (trend?.includes('下跌') || trend?.toLowerCase().includes('down') || trend?.includes('bearish')) {
    return <TrendingDown className="h-5 w-5" />;
  }
  return <Minus className="h-5 w-5" />;
}

function getTrendColor(trend?: string) {
  if (trend?.includes('上漲') || trend?.toLowerCase().includes('up') || trend?.includes('bullish')) {
    return 'bg-success text-success-foreground';
  }
  if (trend?.includes('下跌') || trend?.toLowerCase().includes('down') || trend?.includes('bearish')) {
    return 'bg-accent text-accent-foreground';
  }
  return 'bg-muted text-muted-foreground';
}

function getRiskBadgeClass(risk?: string) {
  if (risk?.includes('高') || risk?.toLowerCase().includes('high')) return 'bg-accent/20 text-accent border-accent/30';
  if (risk?.includes('低') || risk?.toLowerCase().includes('low')) return 'bg-success/20 text-success border-success/30';
  return 'bg-warning/20 text-warning border-warning/30';
}

const cardColors = [
  'from-primary/10 via-primary/5 to-transparent border-primary/20',
  'from-secondary/10 via-secondary/5 to-transparent border-secondary/20',
  'from-accent/10 via-accent/5 to-transparent border-accent/20',
];

export function StockCard({
  stockCode,
  stockName,
  analysisDate,
  analysisTime,
  geminiAnalysis,
  technicalSummary,
  index = 0,
}: StockCardProps) {
  const summary = typeof technicalSummary === 'string' ? null : technicalSummary;
  const colorClass = cardColors[index % cardColors.length];

  return (
    <Card 
      className={`overflow-hidden border-2 bg-gradient-to-br ${colorClass} backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 animate-fade-up`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${getTrendColor(summary?.trend)} shadow-lg transition-transform duration-300 hover:scale-110`}>
              {getTrendIcon(summary?.trend)}
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight">{stockName}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="font-mono text-sm px-3 py-0.5">
                  {stockCode}
                </Badge>
                {summary?.trend && (
                  <Badge className={`${getTrendColor(summary.trend)} text-xs`}>
                    {summary.trend}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="text-right text-sm text-muted-foreground space-y-1">
            <div className="flex items-center justify-end gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>{analysisDate}</span>
            </div>
            <div className="flex items-center justify-end gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{analysisTime === 'morning' ? '上午盤' : '下午盤'}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {summary && (
          <div className="grid grid-cols-2 gap-3">
            {summary.riskLevel && (
              <div className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 ${getRiskBadgeClass(summary.riskLevel)}`}>
                <Shield className="h-4 w-4 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs opacity-80">風險等級</p>
                  <p className="font-semibold truncate">{summary.riskLevel}</p>
                </div>
              </div>
            )}
            {summary.confidence !== undefined && (
              <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-3 py-2.5 text-primary">
                <Target className="h-4 w-4 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs opacity-80">信心度</p>
                  <p className="font-semibold truncate">{summary.confidence}%</p>
                </div>
              </div>
            )}
            {summary.supportPrice && (
              <div className="flex items-center gap-2 rounded-xl border border-success/20 bg-success/10 px-3 py-2.5 text-success">
                <TrendingDown className="h-4 w-4 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs opacity-80">支撐價</p>
                  <p className="font-semibold">{summary.supportPrice}</p>
                </div>
              </div>
            )}
            {summary.resistancePrice && (
              <div className="flex items-center gap-2 rounded-xl border border-accent/20 bg-accent/10 px-3 py-2.5 text-accent">
                <TrendingUp className="h-4 w-4 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs opacity-80">壓力價</p>
                  <p className="font-semibold">{summary.resistancePrice}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {(summary?.shortTermAction || summary?.midTermAction || summary?.longTermAction) && (
          <div className="rounded-xl border bg-card/50 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">操作建議</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              {summary?.shortTermAction && (
                <div className="rounded-lg bg-muted/50 p-2">
                  <p className="text-xs text-muted-foreground mb-1">短線 1-5日</p>
                  <Badge variant="outline" className="font-semibold">
                    {summary.shortTermAction === 'buy' ? '買入' : summary.shortTermAction === 'sell' ? '賣出' : '持有'}
                  </Badge>
                </div>
              )}
              {summary?.midTermAction && (
                <div className="rounded-lg bg-muted/50 p-2">
                  <p className="text-xs text-muted-foreground mb-1">中線 1-4週</p>
                  <Badge variant="outline" className="font-semibold">
                    {summary.midTermAction === 'buy' ? '買入' : summary.midTermAction === 'sell' ? '賣出' : '持有'}
                  </Badge>
                </div>
              )}
              {summary?.longTermAction && (
                <div className="rounded-lg bg-muted/50 p-2">
                  <p className="text-xs text-muted-foreground mb-1">長線 1-3月</p>
                  <Badge variant="outline" className="font-semibold">
                    {summary.longTermAction === 'buy' ? '買入' : summary.longTermAction === 'sell' ? '賣出' : '持有'}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        )}

        {typeof technicalSummary === 'string' && technicalSummary && (
          <div className="rounded-xl bg-muted/50 p-4">
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">技術摘要</h4>
            <p className="text-sm leading-relaxed">{technicalSummary}</p>
          </div>
        )}

        {geminiAnalysis && (
          <div className="rounded-xl bg-card border p-4">
            <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-secondary animate-pulse-soft" />
              AI 深度分析
            </h4>
            <div className="text-sm leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto scrollbar-thin">
              {geminiAnalysis}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
