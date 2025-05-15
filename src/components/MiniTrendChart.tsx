import React from 'react';
import { cn } from '@/lib/utils';

interface MiniTrendChartProps {
  trend: 'up' | 'down' | 'stable';
  change?: string; // Optional: to display alongside the chart if needed
  className?: string;
}

const MiniTrendChart: React.FC<MiniTrendChartProps> = ({ trend, change, className }) => {
  const trendColor = trend === 'up' ? 'stroke-green-500' : trend === 'down' ? 'stroke-red-500' : 'stroke-gray-500';
  const areaColor = trend === 'up' ? 'fill-green-500/10' : trend === 'down' ? 'fill-red-500/10' : 'fill-gray-500/10';

  let dPath = "M0 15 L15 15 L30 15 L45 15 L60 15"; // Stable
  if (trend === 'up') {
    dPath = "M0 25 L15 15 L30 20 L45 10 L60 5";
  }
  if (trend === 'down') {
    dPath = "M0 5 L15 15 L30 10 L45 20 L60 25";
  }
  
  let areaPath = `${dPath} L60 30 L0 30 Z`;

  return (
    <div className={cn("h-8", className)} title={`Trend: ${trend}${change ? ", Change: "+change : ""}`}>
      <svg viewBox="0 0 60 30" className="w-full h-full" preserveAspectRatio="none">
        <path d={areaPath} className={cn(areaColor)} strokeWidth="0" />
        <path d={dPath} className={cn(trendColor, "opacity-70")} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

export default MiniTrendChart; 