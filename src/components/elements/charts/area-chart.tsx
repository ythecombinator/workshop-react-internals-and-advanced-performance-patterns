import { AxisBottom, AxisLeft } from '@visx/axis';
import { curveMonotoneX } from '@visx/curve';
import { LinearGradient } from '@visx/gradient';
import { Group } from '@visx/group';
import { AreaClosed } from '@visx/shape';
import { ScaleLinear, ScaleTime } from 'd3-scale';
import React from 'react';

//  ---------------------------------------------------------------------------
//  TYPES
//  ---------------------------------------------------------------------------

interface DataPoint {
  date: string | Date;
  value: number;
}

interface AreaChartProps {
  data: DataPoint[];
  gradientColor: string;
  width: number;
  yMax: number;
  margin: {
    left: number;
    top: number;
    right: number;
    bottom: number;
  };
  xScale: ScaleTime<number, number>;
  yScale: ScaleLinear<number, number>;
  hideBottomAxis?: boolean;
  hideLeftAxis?: boolean;
  top?: number;
  left?: number;
  children?: React.ReactNode;
}

interface AxisLabelProps {
  textAnchor: string;
  fontFamily: string;
  fontSize: number;
  fill: string;
  dx?: string;
  dy?: string;
}

//  ---------------------------------------------------------------------------
//  UTILS
//  ---------------------------------------------------------------------------

const axisColor = '#000000';

const axisBottomTickLabelProps: AxisLabelProps = {
  textAnchor: 'middle',
  fontFamily: 'Arial',
  fontSize: 10,
  fill: axisColor,
};

const axisLeftTickLabelProps: AxisLabelProps = {
  dx: '-0.25em',
  dy: '0.25em',
  fontFamily: 'Arial',
  fontSize: 10,
  textAnchor: 'end',
  fill: axisColor,
};

const getDate = (d: DataPoint): Date => new Date(d.date);
const getValue = (d: DataPoint): number => d.value;

//  ---------------------------------------------------------------------------
//  UI: CORE
//  ---------------------------------------------------------------------------

export default function AreaChart({
  data,
  gradientColor,
  width,
  yMax,
  margin,
  xScale,
  yScale,
  hideBottomAxis = false,
  hideLeftAxis = false,
  top,
  left,
  children,
}: AreaChartProps): React.ReactElement | null {
  if (width < 10) {
    return null;
  }

  return (
    <Group left={left || margin.left} top={top || margin.top}>
      <LinearGradient
        id="gradient"
        from={gradientColor}
        fromOpacity={1}
        to={gradientColor}
        toOpacity={0.2}
      />
      <AreaClosed<DataPoint>
        data={data}
        x={(d) => xScale(getDate(d)) || 0}
        y={(d) => yScale(getValue(d)) || 0}
        yScale={yScale}
        strokeWidth={1}
        stroke="url(#gradient)"
        fill="url(#gradient)"
        curve={curveMonotoneX}
      />
      {!hideBottomAxis && (
        <AxisBottom
          top={yMax}
          scale={xScale}
          numTicks={width > 520 ? 10 : 5}
          stroke={axisColor}
          tickStroke={axisColor}
          tickLabelProps={() => axisBottomTickLabelProps}
        />
      )}
      {!hideLeftAxis && (
        <AxisLeft
          scale={yScale}
          numTicks={5}
          stroke={axisColor}
          tickStroke={axisColor}
          tickLabelProps={() => axisLeftTickLabelProps}
        />
      )}
      {children}
    </Group>
  );
}
