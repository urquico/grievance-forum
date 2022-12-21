import React, { useState } from "react";
import {
  Avatar,
  Text,
  useMantineTheme,
  Badge,
  ActionIcon,
  Modal,
  Button,
  Center,
} from "@mantine/core";
import { showNotification, updateNotification } from "@mantine/notifications";
import {
  IconTrash,
  IconCheck,
  IconX,
  IconAlertTriangle,
  IconStar,
} from "@tabler/icons";
import { PORT } from "../Globals";
import axios from "axios";

function User({
  publisher,
  isAnonymous,
  email,
  isAdmin,
  isCurrentUserAdmin,
  hideTrashAndBadge,
  previewOnly,
  postId,
  tags,
  setIsVisible,
  isComment,
}) {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  const avatarColors = [
    "red",
    "pink",
    "grape",
    "violet",
    "indigo",
    "blue",
    "cyan",
    "teal",
    "green",
    "lime",
    "yellow",
    "orange",
  ];

  const generateRandomColor = () => {
    return avatarColors[Math.floor(Math.random() * avatarColors.length)];
  };

  const confirmDelete = () => {
    if (!previewOnly) {
      showNotification({
        id: "load-data",
        loading: true,
        title: "Deleting",
        message: "Please Wait!",
        autoClose: false,
        disallowClose: true,
      });
      deletePost();
      setOpened(false);
    }
  };

  const deleteBtn = () => {
    if (!previewOnly) {
      setOpened(true);
    }
  };

  const deletePost = () => {
    axios
      .post(`${PORT}/deletePost`, {
        postId: postId,
        userId: localStorage.getItem("email"),
        tags: tags,
      })
      .then(() => {
        setTimeout(() => {
          updateNotification({
            id: "load-data",
            color: "teal",
            title: "Success!",
            message: "Post has been Deleted",
            icon: <IconCheck size={16} />,
            autoClose: 2000,
          });
        }, 3000);

        setIsVisible(true);
      })
      .catch((error) => {
        console.log(error.message);
        setTimeout(() => {
          updateNotification({
            id: "load-data",
            color: "red",
            title: "Error!!",
            message: error.message,
            icon: <IconX size={16} />,
            autoClose: 2000,
          });
        }, 3000);
      });
  };

  // const deleteVotedPost = () => {};
  // const deleteTagCount = () => {};

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        radius="md"
        centered
        size="md"
      >
        <Center>
          <IconAlertTriangle size={100} style={{ marginTop: "-3rem" }} />
        </Center>
        <Center>
          <Text fz="xl" fw={500}>
            Are you sure?
          </Text>
        </Center>
        <Center>
          <Text style={{ marginBottom: "0.500rem" }} fz="sm">
            You won't be able to revert this
          </Text>
        </Center>
        <Center>
          <Button
            style={{ marginRight: "0.25rem" }}
            color="red"
            onClick={() => setOpened(false)}
          >
            Cancel
          </Button>
          <Button onClick={confirmDelete}>Yes, Delete it</Button>
        </Center>
      </Modal>
      <Avatar src={null} alt={publisher} color={generateRandomColor()}>
        {isAnonymous ? "H" : email?.toUpperCase()[0] + publisher[0]}
      </Avatar>
      <Text
        style={{
          fontSize: "1rem",
          fontWeight: "bold",
          marginLeft: "0.563rem",
        }}
      >
        {isAnonymous ? "HARONYMOUS" : publisher}
        <Text
          style={{
            fontSize: "0.750rem",
            color:
              theme.colorScheme === "dark" ? theme.colors.gray[6] : "#747678",
            position: "relative",
            top: "-0.438rem",
          }}
        >
          {isAnonymous ? "" : email}
        </Text>
      </Text>
      {hideTrashAndBadge ? (
        ""
      ) : (
        <>
          {isAnonymous ? (
            <Badge style={{ marginLeft: "5px" }} color="red">
              secret
            </Badge>
          ) : (
            <>
              <Badge
                style={{ marginLeft: "5px" }}
                color={isAdmin ? "blue" : "green"}
              >
                {isAdmin ? "Admin" : "Student"}
              </Badge>
              {isComment ? (
                <>
                  <ActionIcon>
                    <IconStar size={16} variant="filled" />
                  </ActionIcon>
                </>
              ) : (
                <></>
              )}
            </>
          )}
        </>
      )}
      {hideTrashAndBadge ? (
        ""
      ) : (
        <div style={{ margin: "auto", marginRight: "1rem" }}>
          {localStorage.getItem("email") === email || isCurrentUserAdmin ? (
            <ActionIcon>
              <IconTrash onClick={deleteBtn} />
            </ActionIcon>
          ) : (
            <></>
          )}
        </div>
      )}
    </div>
  );
}

export default User;
