import React from "react";
import { useMantineTheme, Skeleton } from "@mantine/core";

function TagLoader() {
  const theme = useMantineTheme();

  return (
    <div
      style={{
        height: "auto",
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
        borderRadius: "13px",
        padding: "0.75rem",
        marginTop: "1rem",
        boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Skeleton height={8} mt={6} radius="xl" />
      <Skeleton height={8} mt={6} width="70%" radius="xl" />
    </div>
  );
}

export default TagLoader;
