import React, { useState, useLayoutEffect } from "react";
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
import { IconTrash, IconX, IconAlertTriangle, IconStar } from "@tabler/icons";
import { IconCheck, IconArchive } from "@tabler/icons-react";

import { PORT } from "../Globals";
import { checkStarComment, checkSolveState } from "../firebase-config";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
  isPendingPost,
  isArchive,
}) {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [archiveOpened, setArchiveOpened] = useState(false);
  const [isStarComment, setIsStarComment] = useState();
  const [isSolved, setIsSolved] = useState(false);
  const navigate = useNavigate();

  const avatarColors = ["red"];

  useLayoutEffect(() => {
    checkSolveState(postId).then((result) => {
      setIsSolved(result);
    });
  });

  useLayoutEffect(() => {
    if (isComment) {
      checkStarComment(postId)
        .then((result) => {
          // console.log(result);
          setIsStarComment(result);
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  }, []);

  const generateRandomColor = () => {
    return avatarColors[Math.floor(Math.random() * avatarColors.length)];
  };

  const archiveBtn = () => {
    if (!previewOnly) {
      setArchiveOpened(true);
    }
  };

  const deleteBtn = () => {
    if (!previewOnly) {
      setOpened(true);
    }
  };

  const confirmArchive = () => {
    if (!previewOnly) {
      showNotification({
        id: "load-data",
        loading: true,
        title: "Deleting",
        message: "Please Wait!",
        autoClose: false,
        disallowClose: true,
      });
      archivePost();
      setArchiveOpened(false);
      navigate("/home");
    }
  };

  const archivePost = () => {
    axios
      .post(`${PORT}/archivePost`, {
        postId: postId,
      })
      .then(() => {
        setTimeout(() => {
          updateNotification({
            id: "load-data",
            color: "teal",
            title: "Success!",
            message: "Post has been Archived",
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
      if (!isComment) {
        navigate("/home");
      }
    }
  };

  const deletePost = () => {
    let endPoint = "";
    if (isComment) {
      endPoint = "/deleteComment";
    } else {
      if (isArchive) {
        endPoint = "/deleteArchive";
      } else {
        endPoint = "/deletePost";
      }
    }
    axios
      .post(`${PORT}${endPoint}`, {
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

  const starComment = () => {
    if (isComment) {
      showNotification({
        id: "load-data",
        loading: true,
        title: "Updating",
        message: "Please Wait!",
        autoClose: false,
        disallowClose: true,
      });
      setIsStarComment(!isStarComment);
      axios
        .post(`${PORT}/toggleStar`, {
          star: isStarComment,
          commentId: postId,
        })
        .then(() => {
          setTimeout(() => {
            updateNotification({
              id: "load-data",
              color: "teal",
              title: "Success!",
              message: "Star has been Updated",
              icon: <IconCheck size={16} />,
              autoClose: 2000,
            });
          }, 3000);
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
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <ConfirmationDialog
        opened={opened}
        setOpened={setOpened}
        confirmDelete={confirmDelete}
        verb="Delete"
      />
      <ConfirmationDialog
        opened={archiveOpened}
        setOpened={setArchiveOpened}
        confirmDelete={confirmArchive}
        verb="Archive"
      />
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
                  <ActionIcon
                    style={{
                      marginLeft: "0.500rem",
                      marginTop: "-0.150rem",
                      borderRadius: "50px",
                      cursor: isCurrentUserAdmin ? "pointer" : "context-menu",
                    }}
                    variant="filled"
                    color={isStarComment ? "yellow" : "gray"}
                  >
                    <IconStar
                      size={16}
                      onClick={isCurrentUserAdmin ? starComment : ""}
                      color="white"
                    />
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
            <>
              {isPendingPost ? (
                ""
              ) : (
                <div style={{ display: "flex" }}>
                  <>
                    {isSolved ? (
                      <ActionIcon>
                        <IconArchive onClick={archiveBtn} />
                      </ActionIcon>
                    ) : (
                      ""
                    )}
                    <ActionIcon>
                      <IconTrash onClick={deleteBtn} />
                    </ActionIcon>
                  </>
                </div>
              )}
            </>
          ) : (
            <></>
          )}
        </div>
      )}
    </div>
  );
}

function ConfirmationDialog({ opened, setOpened, confirmDelete, verb }) {
  return (
    <>
      {" "}
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
          <Button onClick={confirmDelete}>Yes, {verb} it</Button>
        </Center>
      </Modal>
    </>
  );
}

export default User;
