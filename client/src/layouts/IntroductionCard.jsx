import React from "react";
import { Text, useMantineTheme } from "@mantine/core";

function IntroductionCard({ name, message }) {
  const theme = useMantineTheme();

  return (
    <div
      style={{
        height: "auto",
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[6]
            : theme.colors.gray[0],

        borderRadius: "13px",
        padding: "2.375rem",
        fontSize: "1.125rem",

        boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
      }}
    >
      <Text style={{ fontWeight: "bold" }}>Hi! {name}</Text>
      <Text
        style={{
          color:
            theme.colorScheme === "dark" ? theme.colors.gray[6] : "#3E3E3E",
        }}
      >
        {message}
      </Text>
    </div>
  );
}

export default IntroductionCard;
