import React, { useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDocumentTitle } from "@mantine/hooks";
import { getReport, getUser } from "../firebase-config";

import Frame from "../layouts/Frame/Frame";
import PieChartReview from "../layouts/PieChartReview";
import { useMantineTheme, Text, SegmentedControl, Center } from "@mantine/core";

function Reviews() {
  useDocumentTitle("Reviews");
  return <Frame content={<ReviewsLayout />} path={"/reports"} />;
}

function ReviewsLayout() {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const [view, setView] = useState("yesterday");

  useLayoutEffect(() => {
    getUser(localStorage.getItem("email")).then((result) => {
      if (!result.isAdmin) {
        navigate("/home");
      }
    });
  }, []);

  return (
    <>
      <Center>
        <SegmentedControl
          style={{ marginTop: "0.750rem", marginBottom: "0.750rem" }}
          data={[
            { label: "Yesterday", value: "yesterday" },
            { label: "Weekly", value: "weekly" },
            { label: "Monthly", value: "monthly" },
            { label: "Yearly", value: "yearly" },
          ]}
          value={view}
          onChange={setView}
        />
      </Center>
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
        {view === "yesterday" ? (
          <Reports label={"Yesterday's Report"} day={1} type="daily" />
        ) : view === "weekly" ? (
          <Reports label={"Last Week's Report"} day={7} type="weekly" />
        ) : view === "monthly" ? (
          <Reports label={"Last Month's Report"} day={30} type="monthly" />
        ) : (
          <Reports label={"Last Year's Report"} day={365} type="yearly" />
        )}
      </div>
    </>
  );
}

function Reports({ label, day, type }) {
  const [report, setReport] = useState();
  const currentDate = new Date();
  const yesterday = new Date(currentDate);
  yesterday.setDate(currentDate.getDate() - day);

  const formattedDate = yesterday.toDateString();
  const formattedDateToday = currentDate.toDateString();

  const yesterdayQ = new Date(currentDate);
  yesterdayQ.setDate(currentDate.getDate() - 1);
  const formattedDateQ = yesterdayQ.toDateString();

  const dateObj = new Date(formattedDateQ);
  const dateReport = dateObj
    .toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "-");

  useLayoutEffect(() => {
    getReport(dateReport, type)
      .then((result) => {
        setReport(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [day, type]);

  return (
    <>
      <Text fz="xl" fw="bold">
        {label}
      </Text>
      <Text c="dimmed" fz="sm">
        {formattedDate} - {formattedDateToday}
      </Text>
      {report === undefined || report?.totalPosts === 0 ? (
        <Text
          fz="xl"
          fw="bold"
          c="dimmed"
          style={{ marginTop: "1rem" }}
          ta="center"
        >
          No Data
        </Text>
      ) : (
        <>
          <Text fz="xl" fw="bold" c="dimmed" style={{ marginTop: "1rem" }}>
            {report?.totalPosts} Total Posts
          </Text>
          <PieChartReview data={report?.category} label={"Categories"} />
          <PieChartReview data={report?.solvedStates} label={"Solved Posts"} />
          <PieChartReview
            data={report?.anonymousPosts}
            label={"Anonymous Posts"}
          />
          <PieChartReview data={report?.college} label={"College"} />
          <PieChartReview data={report?.program} label={"Program"} />
          <PieChartReview
            data={report?.levelOfUrgency}
            label={"Level of Urgency"}
          />
          <PieChartReview data={report?.tags} label={"Tags"} />
        </>
      )}
    </>
  );
}

export default Reviews;
