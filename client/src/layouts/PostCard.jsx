import React, { useLayoutEffect, useState } from "react";
import { useMantineTheme } from "@mantine/core";
import axios from "axios";
import User from "./User";
import { getUser } from "../firebase-config";

function PostCard({ email, isAnonymous }) {
  const theme = useMantineTheme();
  const [publisher, setPublisher] = useState("");

  useLayoutEffect(() => {
    getUser(email).then((result) => {
      setPublisher(result.name);
      console.log(result);
    });
  }, []);

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
