import React from "react";
import { useMantineTheme } from "@mantine/core";
import User from "./User";

function PostCard({ publisher, isAnonymous, email }) {
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
      <User publisher={publisher} isAnonymous={isAnonymous} email={email} />
    </div>
  );
}

export default PostCard;
