import React, { useState, useLayoutEffect } from "react";
import {
  useMantineTheme,
  Button,
  Paper,
  Text,
  TypographyStylesProvider,
  Badge,
} from "@mantine/core";
import User from "../layouts/User";
import { getUser, getCollegeInfo } from "../firebase-config";
import { IconCheck, IconX } from "@tabler/icons-react";

function PendingPosts({ post, email, publisher, time }) {
  const theme = useMantineTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [college, setCollege] = useState("");
  const [program, setProgram] = useState("");
  const [isAdmin, setIsAdmin] = useState("");
  let timeDisplay = "";
  const cardVerb = "Submitted";

  useLayoutEffect(() => {
    getUser(email).then((result) => {
      setIsAdmin(result.isAdmin);
      getCollegeInfo(result.college).then((resultData) => {
        setCollege(resultData.label);
        setProgram(result.program);
      });
    });
  }, [email]);

  if (Math.floor(time) < 1) {
    if (Math.floor(time * 60) <= 1) {
      timeDisplay = `${cardVerb} ${Math.floor(time * 60)} minute ago`;
    } else {
      timeDisplay = `${cardVerb} ${Math.floor(time * 60)} minutes ago`;
    }
  } else if (Math.floor(time) === 1) {
    timeDisplay = `${cardVerb} ${Math.floor(time)} hour ago`;
  } else if (Math.floor(time) >= 2 && Math.floor(time) < 24) {
    timeDisplay = `${cardVerb} ${Math.floor(time)} hours ago`;
  } else if (Math.floor(time) >= 24 && Math.floor(time) <= 48) {
    timeDisplay = `${cardVerb} ${Math.floor(time / 24)} day ago`;
  } else if (Math.floor(time) > 48) {
    timeDisplay = `${cardVerb} ${Math.floor(time / 24)} days ago`;
  } else if (
    parseFloat(time.replace(",", "")) / 24 / 30.437 >= 1 &&
    parseFloat(time.replace(",", "")) / 24 / 30.437 <= 2
  ) {
    timeDisplay = `${cardVerb} ${Math.floor(
      parseFloat(time.replace(",", "")) / 24 / 30.437
    )} month ago`;
  } else {
    timeDisplay = `${cardVerb} ${Math.floor(
      parseFloat(time.replace(",", "")) / 24 / 30.437
    )} months ago`;
  }

  return (
    <div
      style={{
        display: isVisible ? "none" : "flex",
        height: "auto",
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[6]
            : theme.colors.gray[0],

        borderRadius: "13px",
        padding: "2.375rem",
        marginTop: "1rem",
        fontSize: "1.125rem",
        flexDirection: "column",
        boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
      }}
    >
      <User
        publisher={publisher}
        isAnonymous={false}
        email={email}
        isAdmin={isAdmin}
        isCurrentUserAdmin={true}
        hideTrashAndBadge={false}
        previewOnly={false}
        postId=""
        tags={""}
        setIsVisible={setIsVisible}
        isComment={false}
        isPendingPost={true}
      />

      <div style={{ marginLeft: "2.500rem" }}>
        {college === "" ? (
          ""
        ) : (
          <>
            <Badge variant="outline" color="pink">
              {college}
            </Badge>
            <Badge
              variant="outline"
              color="orange"
              style={{ marginLeft: "0.200rem" }}
            >
              {program}
            </Badge>
          </>
        )}
      </div>

      <Paper shadow="sm" p="xl" withBorder style={{ marginTop: "1rem" }}>
        <Text>
          <TypographyStylesProvider>
            <div dangerouslySetInnerHTML={{ __html: post }} />
          </TypographyStylesProvider>
        </Text>

        <Text fz="xs" c="dimmed">
          • {timeDisplay}
        </Text>
      </Paper>

      <Button style={{ marginTop: "1rem" }} leftIcon={<IconCheck size="17" />}>
        Approve
      </Button>
      <Button
        leftIcon={<IconX size="17" />}
        style={{ marginTop: "0.500rem" }}
        variant="outline"
        color={theme.colorScheme === "dark" ? "gray" : "dark"}
      >
        Decline
      </Button>
    </div>
  );
}

export default PendingPosts;
