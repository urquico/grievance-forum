/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useLayoutEffect } from "react";
import {
  useMantineTheme,
  Button,
  Paper,
  Text,
  TypographyStylesProvider,
  Badge,
  Modal,
  Center,
  TextInput,
  Radio,
  Select,
} from "@mantine/core";
import { updateNotification, showNotification } from "@mantine/notifications";
import env from "react-dotenv";
import emailjs from "@emailjs/browser";

import User from "../layouts/User";
import { getUser, getCollegeInfo } from "../firebase-config";
import { IconCheck, IconX, IconAlertTriangle } from "@tabler/icons-react";
import axios from "axios";
import { PORT } from "../Globals";

function PendingPosts({
  post,
  email,
  time,
  isAnonymous,
  category,
  tags,
  postId,
  collegeId,
  program,
  receiver,
}) {
  const theme = useMantineTheme();
  const [isVisible, setIsVisible] = useState(true);
  const [isAdmin, setIsAdmin] = useState("");
  const [name, setName] = useState("");
  const [college, setCollege] = useState("");
  const [opened, setOpened] = useState(false);
  const [approvedOpen, setApprovedOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [levelOfUrgency, setLevelOfUrgency] = useState("");
  const [urgencyError, setUrgencyError] = useState(false);
  const [noteError, setNoteError] = useState(false);
  const [radioError, setRadioError] = useState(false);

  let timeDisplay = "";
  const cardVerb = "Submitted";

  useLayoutEffect(() => {
    getUser(email).then((result) => {
      setIsAdmin(result.isAdmin);
      setName(result.name);
      getCollegeInfo(collegeId).then((result) => {
        setCollege(result.label);
      });
    });
  }, [email]);

  const approvePost = () => {
    setApprovedOpen(true);
  };

  const confirmApprove = () => {
    showNotification({
      id: "load-data",
      loading: true,
      title: "Approving Post...",
      message: "Please Wait!",
      autoClose: false,
      disallowClose: true,
    });
    axios
      .post(`${PORT}/approvePost`, {
        category: category,
        isAnonymous: isAnonymous,
        message: post,
        userId: email,
        tags: tags,
        admin: localStorage.getItem("email"),
        postId: postId,
        college: collegeId,
        program: program,
        receiver: receiver,
        reasonForUrgency: customReason,
        levelOfUrgency: levelOfUrgency,
      })
      .then(() => {
        updateNotification({
          id: "load-data",
          color: "teal",
          title: "Success!",
          message: `Post has been approved`,
          icon: <IconCheck size={16} />,
          autoClose: 2000,
        });

        if (receiver.length > 0) {
          receiver.forEach((user) => {
            // if (user !== localStorage.getItem("email")) {
            //   emailjs
            //     .send(
            //       env.EMAILJS_SERVICE_ID,
            //       env.EMAILJS_TEMPLATE_ID,
            //       {
            //         receiver_email: user,
            //         sender_name: isAnonymous ? "Anonymous" : localStorage.getItem("name"),
            //         reply: "Hi, I mentioned you on my post. kindly check my concern",
            //       },
            //       env.EMAILJS_PUBLIC_KEY
            //     )
            //     .catch((err) => {
            //       console.log(err.message);
            //     });
            // }
          });
        }

        setApprovedOpen(false);
        setIsVisible(false);
      })
      .catch((error) => {
        updateNotification({
          id: "load-data",
          color: "red",
          title: "Error!!",
          message: error.message,
          icon: <IconX size={16} />,
          autoClose: 2000,
        });
      });
  };

  const declinePost = () => {
    setOpened(true);
  };

  const confirmDecline = () => {
    showNotification({
      id: "load-data",
      loading: true,
      title: "Declining Post...",
      message: "Please Wait!",
      autoClose: false,
      disallowClose: true,
    });
    axios
      .post(`${PORT}/deletePendingPost`, {
        postId: postId,
        admin: localStorage.getItem("email"),
        userId: email,
        message: reason === "others" ? customReason : reason,
      })
      .then(() => {
        updateNotification({
          id: "load-data",
          color: "teal",
          title: "Success!",
          message: `Post has been declined`,
          icon: <IconCheck size={16} />,
          autoClose: 2000,
        });
        setOpened(false);
        setIsVisible(false);
      })
      .catch((error) => {
        updateNotification({
          id: "load-data",
          color: "red",
          title: "Error!!",
          message: error.message,
          icon: <IconX size={16} />,
          autoClose: 2000,
        });
      });
  };

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
        display: isVisible ? "flex" : "none",
        height: "auto",
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],

        borderRadius: "13px",
        padding: "2.375rem",
        marginTop: "1rem",
        fontSize: "1.125rem",
        flexDirection: "column",
        boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
      }}
    >
      <Modal opened={opened} onClose={() => setOpened(false)} radius="md" centered size={260}>
        <Center>
          <IconAlertTriangle size={100} style={{ marginTop: "-3rem" }} />
        </Center>
        <Center>
          <Text fz="xl" fw={500}>
            Are you sure?
          </Text>
        </Center>
        <Center style={{ display: "flex", flexDirection: "column" }}>
          <Text fw="bold" c="dimmed" fz="sm">
            You won't be able to revert this.
          </Text>
          <Text style={{ marginBottom: "0.500rem" }} fz="sm" ta="center">
            Please choose a message for the sender
          </Text>
        </Center>

        <Radio.Group
          mt="xs"
          value={reason}
          onChange={(val) => {
            setReason(val);
            setRadioError(false);
          }}
          withAsterisk
          label="Reasons"
          error={radioError ? "Please select one" : ""}
        >
          <Radio value="Contains unblocked profanity" label="Contains unblocked profanity" />
          <Radio value="Already answered" label="Already answered" />
          <Radio value="Spam Posts" label="Spam Post" />

          <Radio value="others" label="Other Reason" />
        </Radio.Group>

        {reason === "others" ? (
          <TextInput
            placeholder="Message"
            label="Enter Message"
            onChange={(event) => setCustomReason(event.currentTarget.value)}
          />
        ) : (
          ""
        )}

        <Center style={{ marginTop: "1rem" }}>
          <Button style={{ marginRight: "0.25rem" }} color="red" onClick={() => setOpened(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (reason === "") {
                setRadioError(true);
              } else {
                confirmDecline();
              }
            }}
          >
            Yes, Decline it
          </Button>
        </Center>
      </Modal>

      <Modal
        opened={approvedOpen}
        onClose={() => setApprovedOpen(false)}
        radius="md"
        centered
        size={260}
      >
        <Center>
          <IconAlertTriangle size={100} style={{ marginTop: "-3rem" }} />
        </Center>
        <Center>
          <Text fz="xl" fw={500}>
            Are you sure?
          </Text>
        </Center>
        <Center style={{ display: "flex", flexDirection: "column" }}>
          <Text fw="bold" c="dimmed" fz="sm">
            You won't be able to revert this.
          </Text>
          <Text style={{ marginBottom: "0.500rem" }} fz="sm" ta="center">
            Please rate the urgency of the post
          </Text>
        </Center>

        <Select
          label="Levels of Urgency"
          placeholder="Pick one"
          data={[
            { value: "mild", label: "Mild" },
            { value: "moderate", label: "Moderate" },
            { value: "severe", label: "Needs Urgent Action" },
          ]}
          value={levelOfUrgency}
          onChange={(val) => {
            setUrgencyError(false);
            setLevelOfUrgency(val);
          }}
          error={urgencyError ? "Select one" : ""}
        />
        <TextInput
          placeholder="Enter Message"
          label="Note"
          onChange={(event) => {
            setCustomReason(event.currentTarget.value);
            setNoteError(false);
          }}
          error={noteError ? "Please enter a note" : ""}
        />

        <Center style={{ marginTop: "1rem" }}>
          <Button
            style={{ marginRight: "0.25rem" }}
            color="red"
            onClick={() => setApprovedOpen(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (customReason === "") {
                setNoteError(true);
              }
              if (levelOfUrgency === "") {
                setUrgencyError(true);
              }
              if (customReason !== "" && levelOfUrgency !== "") {
                confirmApprove();
              }
            }}
          >
            Yes, Accept it
          </Button>
        </Center>
      </Modal>

      <User
        publisher={name}
        isAnonymous={isAnonymous}
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
            <Badge variant="outline" color="orange" style={{ marginLeft: "0.200rem" }}>
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

        {receiver.length === 0 ? (
          <></>
        ) : (
          <Text fz="xs" c="dimmed">
            • {timeDisplay} for{" | "}
            {receiver.map((user, i, { length }) => {
              if (i + 1 === length) {
                return (
                  <>
                    <u>{user}</u>
                  </>
                );
              } else {
                return (
                  <>
                    <u>{user}</u> |{" "}
                  </>
                );
              }
            })}
          </Text>
        )}
      </Paper>

      <Button
        style={{ marginTop: "1rem" }}
        leftIcon={<IconCheck size="17" />}
        onClick={approvePost}
      >
        Approve
      </Button>
      <Button
        leftIcon={<IconX size="17" />}
        style={{ marginTop: "0.500rem" }}
        variant="outline"
        color={theme.colorScheme === "dark" ? "gray" : "dark"}
        onClick={declinePost}
      >
        Decline
      </Button>
    </div>
  );
}

export default PendingPosts;
