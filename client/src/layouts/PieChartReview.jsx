import React from "react";
import { ResponsivePie } from "@nivo/pie";
import { useMantineTheme, Text } from "@mantine/core";

function PieChartReview({ data, label }) {
  const theme = useMantineTheme();

  return (
    <div
      style={{
        width: "100%",
        height: "50vh",
        display: "flex",
        flexDirection: "column",
        marginTop: "1rem",
      }}
    >
      <Text fz="xl" ta="center" fw="bold">
        {label}
      </Text>
      <ResponsivePie
        style={{ margin: "auto" }}
        data={data || []}
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
        arcLinkLabelsTextColor={
          theme.colorScheme === "dark" ? "#fffeee" : "#000"
        }
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
      />
    </div>
  );
}

export default PieChartReview;
