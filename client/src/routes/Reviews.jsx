import React, { useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDocumentTitle } from "@mantine/hooks";
import { getUser } from "../firebase-config";

import Frame from "../layouts/Frame/Frame";
import PieChartReview from "../layouts/PieChartReview";
import { useMantineTheme, Text } from "@mantine/core";

function Reviews() {
  useDocumentTitle("Reviews");
  return <Frame content={<ReviewsLayout />} path={"/reports"} />;
}

function ReviewsLayout() {
  const navigate = useNavigate();
  const theme = useMantineTheme();
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

  useLayoutEffect(() => {
    getUser(localStorage.getItem("email")).then((result) => {
      if (!result.isAdmin) {
        navigate("/home");
      }
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
        fontSize: "1.125rem",

        boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
      }}
    >
      <Text fz="xl" fw="bold">
        Review
      </Text>
      <PieChartReview data={data} />
    </div>
  );
}

export default Reviews;
