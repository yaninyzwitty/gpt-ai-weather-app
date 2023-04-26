"use client";

import { AreaChart, Card, Title } from "@tremor/react";

type Props = {
  results: Root;
};

function RainChart({ results }: Props) {
  const hourly = results?.hourly?.time
    .map((time) =>
      new Date(time).toLocaleString("en-US", {
        hour: "numeric",
        hour12: false,
      })
    )
    .slice(0, 24);

  const data = hourly.map((hour, i) => ({
    time: Number(hour),
    "Rain (%)": results.hourly.precipitation_probability[i],
  }));
  const dataFormatter = (number: Number) => `${number}%`;

  return (
    <Card>
      <Title>Chances of rain</Title>
      <AreaChart
        className="mt-6"
        data={data}
        index="time"
        categories={["Rain (%)"]}
        colors={["yellow", "rose"]}
        minValue={0}
        maxValue={100}
        showLegend
        valueFormatter={dataFormatter}
        yAxisWidth={40}
      />
    </Card>
  );
}

export default RainChart;
