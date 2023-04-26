"use client";

import { AreaChart, Card, Title } from "@tremor/react";

type Props = {
  results: Root;
};

function Tempchart({ results }: Props) {
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
    "Uv Index": results.hourly.uv_index[i],
    "Temparature in degrees celcius": results.hourly.temperature_2m[i],
  }));
  const dataFormatter = (number: Number) => `${number}`;

  return (
    <Card>
      <Title>Temparature and graph documentation</Title>
      <AreaChart
        className="mt-6"
        data={data}
        index="time"
        categories={["Temparature in degrees celcius", "Uv Index"]}
        colors={["yellow", "rose"]}
        minValue={0}
        valueFormatter={dataFormatter}
        yAxisWidth={40}
      />
    </Card>
  );
}

export default Tempchart;
