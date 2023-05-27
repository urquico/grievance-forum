import React, { useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDocumentTitle } from "@mantine/hooks";
import { getAllPendingPosts, getAllPosts, getAllUsers, getRegisteredUsersCount, getUser } from "../firebase-config";

import Frame from "../layouts/Frame/Frame";
import PieChartReview from "../layouts/PieChartReview";
import { useMantineTheme, Text, SegmentedControl, Center, Paper, Group, RingProgress } from "@mantine/core";
import { IconUserCheck, IconMailbox, IconFileLike } from "@tabler/icons-react";
import axios from "axios";
import { PORT } from "../Globals";

function Reviews() {
  useDocumentTitle("Reviews");
  return <Frame content={<ReviewsLayout />} path={"/reports"} />;
}

function ReviewsLayout() {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const [view, setView] = useState("yesterday");
  const [registeredUsersCount, setRegisteredUsersCount] = useState(0);
  const [allUsersCount, setAllUsersCount] = useState(0);
  const [allPendingPosts, setAllPendingPosts] = useState(0);
  const [allPosts, setAllPosts] = useState(0);

  useLayoutEffect(() => {
    getUser(localStorage.getItem("email")).then((result) => {
      if (!result.isAdmin) {
        navigate("/home");
      }
    });
  }, [navigate]);

  useLayoutEffect(() => {
    getRegisteredUsersCount()
      .then((result) => {
        setRegisteredUsersCount(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useLayoutEffect(() => {
    getAllUsers()
      .then((result) => {
        setAllUsersCount(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useLayoutEffect(() => {
    getAllPendingPosts()
      .then((result) => {
        setAllPendingPosts(result.size);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useLayoutEffect(() => {
    getAllPosts()
      .then((result) => {
        setAllPosts(result.size);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          height: "auto",
          borderRadius: "13px",
          padding: "2.375rem",
          fontSize: "1.125rem",
        }}
      >
        <Paper withBorder radius="md" p="xl" style={{ marginRight: "1rem" }}>
          <Group>
            <RingProgress
              size={80}
              roundCaps
              thickness={8}
              sections={[
                {
                  value: (registeredUsersCount / allUsersCount) * 100,
                  color: "blue",
                },
              ]}
              label={
                <Center>
                  <IconUserCheck size="1.4rem" stroke={1.5} />
                </Center>
              }
            />

            <div>
              <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
                Registered Users
              </Text>
              <Text weight={700} size="xl">
                {registeredUsersCount}
              </Text>
            </div>
          </Group>
        </Paper>

        <Paper withBorder radius="md" p="xl" style={{ marginRight: "1rem" }}>
          <Group>
            <RingProgress
              size={80}
              roundCaps
              thickness={8}
              sections={[
                {
                  value: 100,
                  color: "orange",
                },
              ]}
              label={
                <Center>
                  <IconMailbox size="1.4rem" stroke={1.5} />
                </Center>
              }
            />

            <div>
              <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
                Pending Posts
              </Text>
              <Text weight={700} size="xl">
                {allPendingPosts}
              </Text>
            </div>
          </Group>
        </Paper>

        <Paper withBorder radius="md" p="xl">
          <Group>
            <RingProgress
              size={80}
              roundCaps
              thickness={8}
              sections={[
                {
                  value: 100,
                  color: "green",
                },
              ]}
              label={
                <Center>
                  <IconFileLike size="1.4rem" stroke={1.5} />
                </Center>
              }
            />

            <div>
              <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
                Public Posts
              </Text>
              <Text weight={700} size="xl">
                {allPosts}
              </Text>
            </div>
          </Group>
        </Paper>
      </div>

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
          backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],

          borderRadius: "13px",
          padding: "2.375rem",
          fontSize: "1.125rem",

          boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
        }}
      >
        {view === "yesterday" ? (
          <Reports label={"Yesterday's Report"} day={1} />
        ) : view === "weekly" ? (
          <Reports label={"Last Week's Report"} day={7} />
        ) : view === "monthly" ? (
          <Reports label={"Last Month's Report"} day={30} />
        ) : (
          <Reports label={"Last Year's Report"} day={365} />
        )}
      </div>
    </>
  );
}

function Reports({ label, day }) {
  const [report, setReport] = useState();
  const currentDate = new Date();
  const yesterday = new Date(currentDate);
  yesterday.setDate(currentDate.getDate() - day);

  const formattedDate = yesterday.toDateString();
  const formattedDateToday = currentDate.toDateString();

  useLayoutEffect(() => {
    axios
      .post(`${PORT}/generateReport`, { days: day })
      .then((result) => {
        setReport(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [day]);

  return (
    <>
      <Text fz="xl" fw="bold">
        {label}
      </Text>
      <Text c="dimmed" fz="sm">
        {formattedDate} - {formattedDateToday}
      </Text>
      {report === undefined || report?.totalPosts === 0 ? (
        <Text fz="xl" fw="bold" c="dimmed" style={{ marginTop: "1rem" }} ta="center">
          No Data
        </Text>
      ) : (
        <>
          <Text fz="xl" fw="bold" c="dimmed" style={{ marginTop: "1rem" }}>
            {report?.totalPosts} Total Posts
          </Text>
          <PieChartReview data={report?.category} label={"Categories"} />
          <PieChartReview data={report?.solvedStates} label={"Solved Posts"} />
          <PieChartReview data={report?.anonymousPosts} label={"Anonymous Posts"} />
          <PieChartReview data={report?.college} label={"College"} />
          <PieChartReview data={report?.program} label={"Program"} />
          <PieChartReview data={report?.levelOfUrgency} label={"Level of Urgency"} />
          <PieChartReview data={report?.tags} label={"Tags"} />
        </>
      )}
    </>
  );
}

export default Reviews;
