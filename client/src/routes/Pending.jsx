import React, { useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDocumentTitle } from "@mantine/hooks";
import { getUser } from "../firebase-config";

import { useMantineTheme, Text } from "@mantine/core";

import Frame from "../layouts/Frame/Frame";
import PendingPosts from "../layouts/PendingPosts";

function Reviews() {
  useDocumentTitle("Pending");
  return <Frame content={<PendingLayout />} path={"/pending"} />;
}

function PendingLayout() {
  const navigate = useNavigate();
  const theme = useMantineTheme();

  useLayoutEffect(() => {
    getUser(localStorage.getItem("email")).then((result) => {
      if (!result.isAdmin) {
        navigate("/home");
      }
    });
  }, []);

  return (
    <>
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
        <Text fz="xl" fw="bold">
          Pending Posts
        </Text>
      </div>
      <PendingPosts />
    </>
  );
}

export default Reviews;
