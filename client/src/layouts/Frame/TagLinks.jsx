import React from "react";
import { useNavigate } from "react-router-dom";
import { useMantineTheme, Text } from "@mantine/core";

function TagLinks({ tag, tagCount }) {
  const theme = useMantineTheme();
  const navigate = useNavigate();

  const path = () => {
    navigate(`/tags/${tag}`);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "auto",
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[6]
            : theme.colors.gray[0],
        padding: "0.75rem",
        borderRadius: "13px",
      }}
    >
      <Text
        fz="l"
        fw={700}
        tt="uppercase"
        style={{ cursor: "pointer" }}
        onClick={path}
      >
        {tag}
      </Text>
      <Text fz="xs">{tagCount.toLocaleString("en-US")} Posts</Text>
    </div>
  );
}

export default TagLinks;
