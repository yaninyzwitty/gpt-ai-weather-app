"use client";
import { Card, Color, Metric, Text } from "@tremor/react";
type Props = {
  title: string;
  metric: string;
  color?: Color | undefined;
};
function Statcard({ title, metric, color }: Props) {
  return (
    <Card decorationColor={color} decoration="top">
      <Text>{title}</Text>
      <Metric>{metric}</Metric>
    </Card>
  );
}

export default Statcard;
