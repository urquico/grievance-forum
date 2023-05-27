import React from "react";
import { Loader, Center, useMantineTheme } from "@mantine/core";

export default function Loading() {
  const theme = useMantineTheme();

  return (
    <Center
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
      }}
    >
      <Loader />
    </Center>
  );
}
