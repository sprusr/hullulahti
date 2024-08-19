import {
  extent as d3Extent,
  format,
  line as d3Line,
  scaleLinear,
  scaleUtc,
} from "d3";
import { Axis, Orient } from "d3-axis-for-react";
import { DateTime } from "luxon";
import { FunctionComponent } from "react";

type Props = {
  className?: string;
  data: Array<number>;
  width?: number;
  height?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
};

const timeTickFormat = (date: Date) =>
  DateTime.fromJSDate(date)
    .setZone("Europe/Helsinki")
    .toLocaleString(DateTime.TIME_SIMPLE);

export const MorningSpacesGraph: FunctionComponent<Props> = ({
  className,
  data,
  width = 400,
  height = 240,
  marginTop = 10,
  marginRight = 40,
  marginBottom = 30,
  marginLeft = 40,
}) => {
  const x = scaleUtc(
    [
      DateTime.now()
        .setZone("Europe/Helsinki")
        .set({ hour: 6, minute: 0, second: 0, millisecond: 0 })
        .toJSDate(),
      DateTime.now()
        .setZone("Europe/Helsinki")
        .set({ hour: 9, minute: 0, second: 0, millisecond: 0 })
        .toJSDate(),
    ],
    [marginLeft, width - marginRight]
  );

  const extent = d3Extent([0, ...data]);
  if (extent[0] === undefined) {
    return null;
  }

  const y = scaleLinear(extent, [height - marginBottom, marginTop]);

  const line = d3Line(
    (d, i) =>
      x(
        DateTime.now()
          .set({ hour: 6, minute: 0, second: 0, millisecond: 0 })
          .plus({ minutes: i * 30 })
          .toJSDate()
      ),
    y
  );

  return (
    <svg className={className} viewBox={`0 0 ${width} ${height}`}>
      <g transform={`translate(0,${height - marginBottom})`}>
        <Axis
          scale={x}
          orient={Orient.bottom}
          ticks={[7]}
          tickFormat={timeTickFormat}
        />
      </g>
      <g transform={`translate(${marginLeft},0)`}>
        <Axis scale={y} orient={Orient.left} tickFormat={format("d")} />
      </g>
      <path fill="none" stroke="currentColor" d={line(data) ?? undefined} />
      <g fill="var(--background-color)" stroke="currentColor">
        {data.map((d, i) => (
          <circle
            key={i}
            cx={x(
              DateTime.now()
                .set({ hour: 6, minute: 0, second: 0, millisecond: 0 })
                .plus({ minutes: i * 30 })
                .toJSDate()
            )}
            cy={y(d)}
            r="2.5"
          />
        ))}
      </g>
    </svg>
  );
};
