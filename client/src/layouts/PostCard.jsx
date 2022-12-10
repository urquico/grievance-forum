import React, { useLayoutEffect, useState } from "react";
import {
  useMantineTheme,
  Badge,
  Text,
  ActionIcon,
  Button,
  TypographyStylesProvider,
} from "@mantine/core";
import {
  IconMessage,
  IconArrowNarrowUp,
  IconArrowNarrowDown,
} from "@tabler/icons";
import { useNavigate } from "react-router-dom";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons";
import axios from "axios";
import User from "./User";
import { getUser, getVotePostData } from "../firebase-config";
import { PORT } from "../Globals";

function PostCard({
  email,
  isAnonymous,
  tags,
  category,
  time,
  post,
  postId,
  isSolved,
  voteNumber,
}) {
  const theme = useMantineTheme();
  const [publisher, setPublisher] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCurrentUserAdmin, setIsCurrentUserAdmin] = useState(false);
  const [upVote, setUpVote] = useState(false);
  const [downVote, setDownVote] = useState(false);
  const [voteCount, setVoteCount] = useState(voteNumber);
  const [readMore, setReadMore] = useState(false);
  const [voteUI, setVoteUI] = useState(undefined);
  const navigate = useNavigate();
  let timeDisplay = "";
  const weight = isCurrentUserAdmin ? 10 : 1;

  useLayoutEffect(() => {
    getUser(email).then((result) => {
      setPublisher(result.name);
      setIsAdmin(result.isAdmin); // check if the publisher is admin
    });
  }, [email]);

  useLayoutEffect(() => {
    getUser(localStorage.getItem("email")).then((result) => {
      setIsCurrentUserAdmin(result.isAdmin);
    });
  }, []);

  useLayoutEffect(() => {
    getVotePostData(postId, localStorage.getItem("email")).then((result) => {
      setVoteUI(result);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    if (voteUI?.postId === postId) {
      voteUI?.voteType ? setUpVote(true) : setDownVote(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const voteState = (voteType, post) => {};

  if (Math.floor(time) < 1) {
    if (Math.floor(time * 60) <= 1) {
      timeDisplay = `Posted ${Math.floor(time * 60)} minute ago`;
    } else {
      timeDisplay = `Posted ${Math.floor(time * 60)} minutes ago`;
    }
  } else if (Math.floor(time) === 1) {
    timeDisplay = `Posted ${Math.floor(time)} hour ago`;
  } else if (Math.floor(time) >= 2 && Math.floor(time) < 24) {
    timeDisplay = `Posted ${Math.floor(time)} hours ago`;
  } else if (Math.floor(time) >= 24 && Math.floor(time) <= 48) {
    timeDisplay = `Posted ${Math.floor(time / 24)} day ago`;
  } else if (Math.floor(time) > 48) {
    timeDisplay = `Posted ${Math.floor(time / 24)} days ago`;
  }

  const voteDown = async () => {
    if (!downVote) {
      setVoteCount(voteCount - weight);
      setDownVote(true);
      setUpVote(false);
      votePost("Down Voted", false);
    }
  };

  const voteUp = async () => {
    if (!upVote) {
      setVoteCount(voteCount + weight);
      setUpVote(true);
      setDownVote(false);
      votePost("Up Voted", true);
    }
  };

  const votePost = (title, voteType) => {
    showNotification({
      id: "load-data",
      loading: true,
      title: title,
      message: "Please Wait!",
      autoClose: false,
      disallowClose: true,
    });
    axios
      .post(`${PORT}/votePost`, {
        voteType: voteType,
        userId: localStorage.getItem("email"),
        postId: postId,
        weight: Number(weight),
      })
      .then(() => {
        setTimeout(() => {
          updateNotification({
            id: "load-data",
            color: "teal",
            title: "Success!",
            message: `Post has been ${title}`,
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
  };

  const writeComment = () => {
    console.log(postId, voteUI);
  };

  const votePointMargin = (number) => {
    if (number.toString().length === 1) {
      return "0.400rem";
    } else if (number.toString().length === 3) {
      return "-0.438rem";
    } else if (number.toString().length === 4) {
      return "-0.875rem";
    } else if (number.toString().length === 5) {
      return "-1.25rem";
    }
  };

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
      <User
        publisher={publisher}
        isAnonymous={isAnonymous}
        email={email}
        isAdmin={isAdmin}
        isCurrentUserAdmin={isCurrentUserAdmin}
        hideTrashAndBadge={false}
      />
      <div style={{ marginTop: "0.063rem" }}>
        {/* Category */}
        <Badge
          variant="gradient"
          gradient={
            category === "academic-concerns"
              ? { from: "orange", to: "red" }
              : { from: "teal", to: "lime", deg: 105 }
          }
          style={{ marginLeft: "2.500rem", cursor: "pointer" }}
          onClick={() => {
            navigate(`/category/${category}`);
          }}
        >
          {category}
        </Badge>
        {/* Tags */}
        {tags.map((tag) => {
          return (
            <Badge
              size="xs"
              variant="gradient"
              gradient={{ from: "indigo", to: "cyan" }}
              style={{ marginLeft: "0.250rem", cursor: "pointer" }}
              onClick={() => {
                navigate(`/tags/${tag}`);
              }}
            >
              {tag}
            </Badge>
          );
        })}
      </div>
      {/* POST MESSAGE -> VOTES UI */}
      <div
        style={{
          display: "flex",
          flexDirection: "rows",
          placeItems: "center",
        }}
      >
        <div style={{ marginLeft: "0.200rem", marginTop: "1rem" }}>
          <ActionIcon
            variant={upVote ? "filled" : "subtle"}
            onClick={voteUp}
            color={theme.colorScheme === "dark" ? "yellow" : "dark"}
          >
            <IconArrowNarrowUp size={20} />
          </ActionIcon>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: "1.500rem",
              marginLeft: votePointMargin(voteCount),
            }}
          >
            {voteCount}
          </Text>
          <ActionIcon
            variant={downVote ? "filled" : "subtle"}
            onClick={voteDown}
            color={theme.colorScheme === "dark" ? "yellow" : "dark"}
          >
            <IconArrowNarrowDown size={20} />
          </ActionIcon>
        </div>
        <Text
          lineClamp={readMore ? 0 : 4}
          style={{
            marginTop: "1.375rem",
            marginBottom: "0.500rem",
            marginLeft: "1rem",
            marginRight: "1rem",
            color:
              theme.colorScheme === "dark" ? theme.colors.gray[6] : "#3E3E3E",
            textAlign: "justify",
          }}
        >
          <TypographyStylesProvider>
            <div dangerouslySetInnerHTML={{ __html: post }} />
          </TypographyStylesProvider>
        </Text>
      </div>
      {post.split("").length > 155 ? (
        <Text
          onClick={() => setReadMore(!readMore)}
          style={{
            color: theme.colors.gray[0],
            cursor: "pointer",
            margin: "auto",
            marginRight: "1rem",
            marginBottom: "2rem",
            fontSize: "0.90rem",
            textDecoration: "",
          }}
        >
          {/* Polymorph this component */}
          {readMore ? "see less" : "read more"}
        </Text>
      ) : (
        ""
      )}
      <li
        style={{
          alignSelf: "end",
          marginRight: "1rem",
          fontSize: "0.625rem",
          color:
            theme.colorScheme === "dark"
              ? theme.colors.gray[7]
              : theme.colors.dark[1],
        }}
      >
        {timeDisplay}
        {isSolved ? (
          <Badge color="red" size="sm" style={{ marginLeft: "0.500rem" }}>
            Solved
          </Badge>
        ) : (
          ""
        )}
      </li>

      <div style={{ display: "flex", marginLeft: "2.5rem" }}>
        <Button
          leftIcon={<IconMessage size={20} />}
          variant="subtle"
          color="gray"
          onClick={writeComment}
          style={{
            cursor: "pointer",
            color:
              theme.colorScheme === "dark" ? theme.colors.gray[6] : "#747678",
            marginLeft: "0.250rem",
          }}
        >
          {isSolved ? "view comments" : "write a comment"}
        </Button>
      </div>
    </div>
  );
}

export default PostCard;
