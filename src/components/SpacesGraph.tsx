import { extent as d3Extent, format, line as d3Line, scaleLinear } from "d3";
import { Axis, Orient } from "d3-axis-for-react";
import { FunctionComponent } from "react";

type Props = {
  className?: string;
  data: Array<number>;
  dataInterval?: number;
  width?: number;
  height?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
};

export const SpacesGraph: FunctionComponent<Props> = ({
  className,
  data,
  dataInterval = 10,
  width = 400,
  height = 240,
  marginTop = 10,
  marginRight = 40,
  marginBottom = 30,
  marginLeft = 40,
}) => {
  const x = scaleLinear(
    [0, (data.length - 1) * dataInterval],
    [marginLeft, width - marginRight]
  );

  const extent = d3Extent([0, ...data]);
  if (extent[0] === undefined) {
    return null;
  }

  const y = scaleLinear(extent, [height - marginBottom, marginTop]);

  const line = d3Line((d, i) => x(i * 10), y);

  return (
    <svg className={className} viewBox={`0 0 ${width} ${height}`}>
      <g transform={`translate(0,${height - marginBottom})`}>
        <Axis scale={x} orient={Orient.bottom} ticks={[7, "d"]} />
      </g>
      <g transform={`translate(${marginLeft},0)`}>
        <Axis scale={y} orient={Orient.left} tickFormat={format("d")} />
      </g>
      <path
        fill="none"
        stroke="currentColor"
        d={line(data) ?? undefined}
      />
      <g fill="var(--background-color)" stroke="currentColor">
        {data.map((d, i) => (
          <circle key={i} cx={x(i * dataInterval)} cy={y(d)} r="2.5" />
        ))}
      </g>
    </svg>
  );
};
