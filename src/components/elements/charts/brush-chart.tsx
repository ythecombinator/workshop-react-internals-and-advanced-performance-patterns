import { Brush } from '@visx/brush';
import { LinearGradient } from '@visx/gradient';
import { PatternLines } from '@visx/pattern';
import { scaleLinear, scaleTime } from '@visx/scale';
import { extent, max } from 'd3-array';
import { ScaleLinear, ScaleTime } from 'd3-scale';
import React, { useMemo, useRef, useState } from 'react';

import { metadata } from '@utils/theme';

import AreaChart from './area-chart';

//  ---------------------------------------------------------------------------
//  TYPES
//  ---------------------------------------------------------------------------

interface DataPoint {
  date: string | Date;
  value: number;
}

interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface BrushDomain {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}

interface BrushPosition {
  start: { x: number };
  end: { x: number };
}

interface BrushChartProps {
  compact?: boolean;
  width: number;
  height: number;
  margin?: Margin;
  initialData?: DataPoint[];
  onChange: (data: DataPoint[]) => void;
}

//  ---------------------------------------------------------------------------
//  UTILS
//  ---------------------------------------------------------------------------

const brushMargin: Margin = { top: 10, bottom: 15, left: 50, right: 20 };
const chartSeparation = 30;
const PATTERN_ID = 'brush_pattern';
const GRADIENT_ID = 'brush_gradient';

export const accentColor = '#f6acc8';
export const background = metadata.secondaryColor;
export const background2 = metadata.primaryColor;

const selectedBrushStyle = {
  fill: `url(#${PATTERN_ID})`,
  stroke: 'white',
};

const getDate = (d: DataPoint): Date => new Date(d.date);
const getValue = (d: DataPoint): number => d.value;

//  ---------------------------------------------------------------------------
//  UI: CORE
//  ---------------------------------------------------------------------------

function BrushChart({
  compact = false,
  width,
  height,
  margin = {
    top: 20,
    left: 50,
    bottom: 20,
    right: 20,
  },
  initialData: stock = [],
  onChange,
}: BrushChartProps): React.ReactElement {
  const brushRef = useRef<Brush | null>(null);
  const [filteredStock, setFilteredStock] = useState<DataPoint[]>(stock);

  const onBrushChange = (domain: BrushDomain | null) => {
    if (!domain) return;
    const { x0, x1, y0, y1 } = domain;
    const stockCopy = stock.filter((s) => {
      const x = getDate(s).getTime();
      const y = getValue(s);
      return x > x0 && x < x1 && y > y0 && y < y1;
    });
    setFilteredStock(stockCopy);
    onChange(stockCopy);
  };

  const innerHeight = height - margin.top - margin.bottom;
  const topChartBottomMargin = compact
    ? chartSeparation / 2
    : chartSeparation + 10;
  const topChartHeight = 0.8 * innerHeight - topChartBottomMargin;
  const bottomChartHeight = innerHeight - topChartHeight - chartSeparation;

  // bounds
  const xMax = Math.max(width - margin.left - margin.right, 0);
  const yMax = Math.max(topChartHeight, 0);
  const xBrushMax = Math.max(width - brushMargin.left - brushMargin.right, 0);
  const yBrushMax = Math.max(
    bottomChartHeight - brushMargin.top - brushMargin.bottom,
    0
  );

  // scales
  const dateScale: ScaleTime<number, number> = useMemo(
    () =>
      scaleTime({
        range: [0, xMax],
        domain: extent(filteredStock, getDate) as [Date, Date],
      }),
    [xMax, filteredStock]
  );

  const stockScale: ScaleLinear<number, number> = useMemo(
    () =>
      scaleLinear({
        range: [yMax, 0],
        domain: [0, max(filteredStock, getValue) || 0],
        nice: true,
      }),
    [yMax, filteredStock]
  );

  const brushDateScale: ScaleTime<number, number> = useMemo(
    () =>
      scaleTime({
        range: [0, xBrushMax],
        domain: extent(stock, getDate) as [Date, Date],
      }),
    [xBrushMax, stock]
  );

  const brushStockScale: ScaleLinear<number, number> = useMemo(
    () =>
      scaleLinear({
        range: [yBrushMax, 0],
        domain: [0, max(stock, getValue) || 0],
        nice: true,
      }),
    [yBrushMax, stock]
  );

  const initialBrushPosition = useMemo(
    (): BrushPosition => ({
      start: { x: brushDateScale(getDate(stock[50] || stock[0])) },
      end: {
        x: brushDateScale(getDate(stock[100] || stock[stock.length - 1])),
      },
    }),
    [brushDateScale, stock]
  );

  return (
    <div>
      <svg width={width} height={height}>
        <LinearGradient
          id={GRADIENT_ID}
          from={background}
          to={background}
          rotate={45}
        />
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill={`url(#${GRADIENT_ID})`}
        />
        <AreaChart
          hideBottomAxis={compact}
          data={filteredStock}
          width={width}
          margin={{ ...margin, bottom: topChartBottomMargin }}
          yMax={yMax}
          xScale={dateScale}
          yScale={stockScale}
          gradientColor={background2}
        />
        <AreaChart
          hideBottomAxis
          hideLeftAxis
          data={stock}
          width={width}
          yMax={yBrushMax}
          xScale={brushDateScale}
          yScale={brushStockScale}
          margin={brushMargin}
          top={topChartHeight + topChartBottomMargin + margin.top}
          gradientColor={background}
        >
          <PatternLines
            id={PATTERN_ID}
            height={8}
            width={8}
            stroke={accentColor}
            strokeWidth={1}
            orientation={['diagonal']}
          />
          <Brush
            xScale={brushDateScale}
            yScale={brushStockScale}
            width={xBrushMax}
            height={yBrushMax}
            margin={brushMargin}
            handleSize={8}
            innerRef={brushRef}
            resizeTriggerAreas={['left', 'right']}
            brushDirection="horizontal"
            initialBrushPosition={initialBrushPosition}
            onChange={onBrushChange}
            onClick={() => setFilteredStock(stock)}
            selectedBoxStyle={selectedBrushStyle}
            useWindowMoveEvents
          />
        </AreaChart>
      </svg>
    </div>
  );
}

export default BrushChart;
