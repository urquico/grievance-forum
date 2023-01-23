import React from "react";
import { ResponsivePie } from "@nivo/pie";

function PieChartReview() {
  const data = [
    {
      id: "make",
      label: "make",
      value: 151,
      color: "hsl(85, 70%, 50%)",
    },
    {
      id: "go",
      label: "go",
      value: 53,
      color: "hsl(80, 70%, 50%)",
    },
    {
      id: "ruby",
      label: "ruby",
      value: 264,
      color: "hsl(109, 70%, 50%)",
    },
    {
      id: "c",
      label: "c",
      value: 168,
      color: "hsl(129, 70%, 50%)",
    },
    {
      id: "elixir",
      label: "elixir",
      value: 318,
      color: "hsl(129, 70%, 50%)",
    },
  ];

  return (
    <div>
      <ResponsivePie
        data={data}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        borderWidth={1}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.2]],
        }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
          from: "color",
          modifiers: [["darker", 2]],
        }}
        defs={[
          {
            id: "dots",
            type: "patternDots",
            background: "inherit",
            color: "rgba(255, 255, 255, 0.3)",
            size: 4,
            padding: 1,
            stagger: true,
          },
          {
            id: "lines",
            type: "patternLines",
            background: "inherit",
            color: "rgba(255, 255, 255, 0.3)",
            rotation: -45,
            lineWidth: 6,
            spacing: 10,
          },
        ]}
        legends={[
          {
            anchor: "bottom",
            direction: "row",
            justify: false,
            translateX: 0,
            translateY: 56,
            itemsSpacing: 0,
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: "#999",
            itemDirection: "left-to-right",
            itemOpacity: 1,
            symbolSize: 18,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: "#000",
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
}

export default PieChartReview;
