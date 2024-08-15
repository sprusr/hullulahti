"use client";

import { FunctionComponent, useEffect, useRef } from "react";
import ChartJs from "chart.js/auto";

type Props = {
  predictions: Array<number>;
};

export const Chart: FunctionComponent<Props> = ({ predictions }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;

    const data = {
      labels: ["5 mins", "10 mins", "15 mins", "20 mins", "25 mins"],
      datasets: [
        {
          data: predictions,
          borderColor: "rgb(219, 39, 119)",
        },
      ],
    };

    const chart = new ChartJs(ref.current, {
      type: "line",
      data,
      options: {
        animation: false,
        plugins: {
          title: {
            display: true,
            text: "Estimated Upcoming Availability",
          },
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
          },
        },
      },
    });

    return () => chart.destroy();
  });
  return <canvas ref={ref} />;
};
