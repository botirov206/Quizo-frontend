import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MOCK_SCORE_HISTORY } from '../data/mock-student-stats';
import { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { CHART_CONFIG } from '../constants';
import { cn } from '@/lib/utils';

export const ScoreChart = () => {
  const chartData = useMemo(() => MOCK_SCORE_HISTORY.slice(-CHART_CONFIG.MAX_DATA_POINTS), []);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(600);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; score: number; title: string } | null>(null);

  // Update container width on mount and window resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const handleMouseEnter = useCallback((point: { x: number; y: number; score: number; title: string }) => {
    setTooltip(point);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  // Calculate dimensions
  const maxScore = 100;
  const minScore = 0;
  const width = containerWidth - 20; // Account for container padding
  const height = CHART_CONFIG.HEIGHT;
  const padding = 40;

  // Calculate points for the line
  const points = useMemo(() => {
    if (chartData.length === 0) return [];
    return chartData.map((data, index) => {
      const x = (index / (chartData.length - 1)) * (width - 2 * padding) + padding;
      const y = height - ((data.score - minScore) / (maxScore - minScore)) * (height - 2 * padding) - padding;
      return { x, y, score: data.score, title: data.quizTitle };
    });
  }, [chartData, width, height]);

  const pathData = useMemo(() => {
    if (points.length === 0) return '';
    return points.reduce((path, point, index) => {
      if (index === 0) return `M ${point.x} ${point.y}`;
      return `${path} L ${point.x} ${point.y}`;
    }, '');
  }, [points]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Score Trend</CardTitle>
        <p className="text-sm text-muted-foreground">Your performance over time</p>
      </CardHeader>
      <CardContent>
        <div ref={containerRef} className="relative w-full -mx-6 px-6" style={{ height: `${height}px` }}>
          <svg width={width} height={height} className="overflow-visible" style={{ display: 'block' }}>
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((score) => {
              const y = height - ((score - minScore) / (maxScore - minScore)) * (height - 2 * padding) - padding;
              return (
                <g key={score}>
                  <line
                    x1={padding}
                    y1={y}
                    x2={width - padding}
                    y2={y}
                    stroke={CHART_CONFIG.GRID_COLOR}
                    strokeWidth="1"
                    strokeDasharray="4"
                  />
                  <text
                    x={padding - 10}
                    y={y + 4}
                    fontSize="12"
                    fill="#6b7280"
                    textAnchor="end"
                  >
                    {score}%
                  </text>
                </g>
              );
            })}

            {/* Line path */}
            {pathData && (
              <path
                d={pathData}
                fill="none"
                stroke={CHART_CONFIG.LINE_COLOR}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Data points */}
            {points.map((point, index) => (
              <g key={index}>
                {/* Invisible larger circle for better hover area */}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="10"
                  fill="transparent"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => handleMouseEnter(point)}
                  onMouseLeave={handleMouseLeave}
                />
                {/* Visible circle */}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="4"
                  fill="#fff"
                  stroke={CHART_CONFIG.POINT_COLOR}
                  strokeWidth="2"
                  className={cn(
                    'transition-all duration-200',
                    tooltip?.title === point.title && 'drop-shadow-lg'
                  )}
                  style={{
                    cursor: 'pointer',
                    transform: tooltip?.title === point.title ? 'scale(1.3)' : 'scale(1)',
                    transformOrigin: `${point.x}px ${point.y}px`,
                  }}
                  onMouseEnter={() => handleMouseEnter(point)}
                  onMouseLeave={handleMouseLeave}
                />
              </g>
            ))}
          </svg>
          
          {/* Custom Tooltip */}
          {tooltip && (
            <div
              className="absolute z-10 px-3 py-2 text-sm bg-gray-900 text-white rounded-lg shadow-lg pointer-events-none animate-in fade-in-0 zoom-in-95"
              style={{
                left: `${tooltip.x}px`,
                top: `${tooltip.y - 60}px`,
                transform: 'translateX(-50%)',
              }}
            >
              <div className="font-semibold">{tooltip.title}</div>
              <div className="text-xs text-gray-300 mt-1">
                Score: <span className="font-medium text-white">{tooltip.score}%</span>
              </div>
              {/* Tooltip arrow */}
              <div
                className="absolute w-2 h-2 bg-gray-900 rotate-45"
                style={{
                  left: '50%',
                  bottom: '-4px',
                  transform: 'translateX(-50%)',
                }}
              />
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>Last {chartData.length} quizzes</span>
          <span className="text-blue-600 font-medium">
            Latest: {chartData[chartData.length - 1]?.score}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
