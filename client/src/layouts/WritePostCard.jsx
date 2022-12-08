import React from "react";
import { useMantineTheme, Text, Switch } from "@mantine/core";

function WritePostCard() {
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
        marginTop: "1rem",
        boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <PostAnonymously />
    </div>
  );
}

function PostAnonymously() {
  const theme = useMantineTheme();

  return (
    <div
      style={{
        width: "100%",
        height: "auto",
        backgroundColor: theme.colorScheme === "dark" ? "#2C2E33" : "#f4f4f4",
        borderRadius: "4px",
        border: "1px solid",
        borderColor:
          theme.colorScheme === "dark" ? theme.colors.gray[7] : "#CED4DA",
        display: "flex",
        padding: "0.75rem",
      }}
    >
      <Text
        fz="sm"
        style={{
          marginLeft: "0",
          marginRight: "auto",
          marginTop: "0.3rem",
          color:
            theme.colorScheme === "dark" ? theme.colors.gray[6] : "#5E5F61",
        }}
      >
        Post Anonymously
      </Text>

      <Switch
        style={{
          color:
            theme.colorScheme === "dark" ? theme.colors.gray[6] : "#5E5F61",
          marginTop: "-1rem",
        }}
        labelPosition="left"
        onLabel="ANONYMOUS"
        offLabel={`YOU`}
        size="lg"
      />
    </div>
  );
}

export default WritePostCard;
