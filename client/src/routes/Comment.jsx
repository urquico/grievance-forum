import React, { useLayoutEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RichTextEditor } from "@mantine/rte";
import { Button } from "@mantine/core";

import Frame from "../layouts/Frame/Frame";
import IntroductionCard from "../layouts/IntroductionCard";
import PostCard from "../layouts/PostCard";
import LoadingPost from "../layouts/Loading/LoadingPost";
import {
  getSinglePost,
  getComments,
  checkSolveState,
  getUser,
  removeHTMLTags,
} from "../firebase-config";
import { useMantineTheme, Switch, Text } from "@mantine/core";
import axios from "axios";
import { PORT } from "../Globals";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons";
import EndPost from "../layouts/EndPost";
import env from "react-dotenv";
import emailjs from "@emailjs/browser";
import { useDocumentTitle } from "@mantine/hooks";

function Comment() {
  let { id } = useParams();
  useDocumentTitle("Comments");
  return <Frame content={<CommentLayout id={id} />} path={`/comment/${id}`} />;
}

function CommentLayout({ id }) {
  const initialValue = "";
  const navigate = useNavigate();

  const [post, setPost] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCommentsLoading, setIsCommentsLoading] = useState(true);
  const [text, setText] = useState(initialValue);
  const [comments, setComments] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isSolve, setIsSolve] = useState();
  const [isCurrentUserAdmin, setIsCurrentUserAdmin] = useState(false);
  const [restrictComment, setRestrictComment] = useState(false);
  const [isPostAnonymous, setIsPostAnonymous] = useState(false);
  let timeCurrent = 0,
    timePosted = 0,
    hour = 0;

  const theme = useMantineTheme();

  useLayoutEffect(() => {
    getSinglePost(id, "Posts").then((result) => {
      setPost({
        ...result.data(),
        id: result.id,
        readTime: result._document.readTime.timestamp.seconds,
      });
      setIsLoading(false);
      setIsPostAnonymous(result.data().isAnonymous);
    });
  }, [id]);

  useLayoutEffect(() => {
    checkSolveState(id).then((result) => {
      setIsSolve(result);
    });
  }, [id]);

  useLayoutEffect(() => {
    getUser(localStorage.getItem("email")).then((result) => {
      if (!result.userAgreedSLA) {
        navigate("/setup");
      }
      setIsCurrentUserAdmin(result.isAdmin);
    });
  }, [navigate]);

  useLayoutEffect(() => {
    getComments(id).then((result) => {
      commentState(result);
      setIsCommentsLoading(false);
    });
  }, [id]);

  const generateTime = () => {
    timeCurrent = new Date(post?.readTime * 1000);
    timePosted = new Date(post?.timePosted?.seconds * 1000);

    hour = (timeCurrent.getTime() - timePosted.getTime()) / 1000 / 3600;

    return hour;
  };

  const commentState = (result) => {
    const isCollectionEmpty = result.size === 0;
    if (!isCollectionEmpty) {
      setComments(result);
    } else {
      setIsEmpty(true);
    }
  };

  const submitComment = () => {
    if (!restrictComment) {
      setRestrictComment(true);
      showNotification({
        id: "load-data",
        loading: true,
        title: "Submitting your comment",
        message: "Please Wait!",
        autoClose: false,
        disallowClose: true,
      });
      axios
        .post(`${PORT}/writeComment`, {
          userId: localStorage.getItem("email"),
          postId: id,
          reply: text,
        })
        .then(() => {
          updateNotification({
            id: "load-data",
            color: "teal",
            title: "Success!",
            message: "Comment has been Submitted",
            icon: <IconCheck size={16} />,
            autoClose: 2000,
          });
          setRestrictComment(false);
          navigate("/home");

          if (localStorage.getItem("email") !== post.userId) {
            axios
              .post(`${PORT}/notifyPublisher`, {
                notificationType: "reply",
                notifier: localStorage.getItem("name"),
                postId: id,
                userId: post.userId,
              })
              .then(() => {
                // emailjs
                //   .send(
                //     env.EMAILJS_SERVICE_ID,
                //     env.EMAILJS_TEMPLATE_ID,
                //     {
                //       receiver_email: post.userId,
                //       sender_name: localStorage.getItem("name"),
                //       reply: removeHTMLTags(text),
                //     },
                //     env.EMAILJS_PUBLIC_KEY
                //   )
                //   .then((result) => {})
                //   .catch((err) => {
                //     console.log(err.message);
                //   });
              })
              .catch((err) => {
                console.log(err.message);
              });
          }
        })
        .catch((error) => {
          console.log(error.message);
          updateNotification({
            id: "load-data",
            color: "red",
            title: "Error!!",
            message: error.message,
            icon: <IconX size={16} />,
            autoClose: 2000,
          });
        });
    }
  };

  return (
    <div>
      <IntroductionCard
        name={localStorage.getItem("name")}
        message={`<br/>Welcome to the comment section. <br/> <i>Please <b>avoid the use of offensive language</b> that would make others uncomfortable. </i>
`}
      />
      {isLoading ? (
        <>
          <LoadingPost />
          <LoadingPost />
          <LoadingPost />
          <LoadingPost />
          <LoadingPost />
          <LoadingPost />
          <LoadingPost />
        </>
      ) : (
        <div
          style={{
            display: "flex",
            height: "auto",
            backgroundColor:
              theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
            borderRadius: "13px",
            padding: "2.375rem",
            marginTop: "1rem",
            boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
            flexDirection: "column",
          }}
        >
          {isCurrentUserAdmin ? (
            <SolveSwitch isSolve={isSolve} setIsSolve={setIsSolve} postId={id} />
          ) : (
            ""
          )}
          {post?.length !== 0 ? (
            <>
              <PostCard
                isAnonymous={post.isAnonymous}
                email={post.userId}
                tags={post.tags}
                category={post.categoryId}
                time={generateTime().toLocaleString()}
                post={post.message}
                postId={id}
                isSolved={isSolve}
                voteNumber={post.upVote - post.downVote}
                previewOnly={false}
                isComment={false}
                approver={post.approvedBy}
              />
            </>
          ) : (
            ""
          )}

          <div
            style={{
              display: isSolve ? "none" : "flex",
              height: "auto",
              backgroundColor:
                theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
              marginTop: isEmpty ? "1rem" : "1rem",
              borderRadius: "13px",
              padding: "2.375rem",

              boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
              flexDirection: "column",
            }}
          >
            <RichTextBox text={text} setText={setText} disabled={true} />
            <Button style={{ marginTop: "0.500rem" }} onClick={submitComment}>
              Submit Comment
            </Button>
          </div>

          <div>
            {isEmpty ? (
              <EndPost content="No comments yet" />
            ) : (
              <>
                {isCommentsLoading ? (
                  <>
                    <LoadingPost />
                    <LoadingPost />
                    <LoadingPost />
                    <LoadingPost />
                    <LoadingPost />
                    <LoadingPost />
                  </>
                ) : (
                  <>
                    {comments?.map((comment, index) => {
                      const timeCurrent = new Date(comment.readTime * 1000);
                      const timeCommented = new Date(comment.timeCommented.seconds * 1000);

                      const hour = (timeCurrent.getTime() - timeCommented.getTime()) / 1000 / 3600;

                      return (
                        <PostCard
                          key={index}
                          style={{ marginLeft: "2rem" }}
                          // isAnonymous={isUserOwnerOfPost ? (isPostAnonymous ? true : false) : false}
                          isAnonymous={
                            isPostAnonymous
                              ? comment.userId === post.userId
                                ? true
                                : false
                              : false
                          }
                          email={comment.userId}
                          tags={[]}
                          category={""}
                          time={hour.toLocaleString()}
                          post={comment.reply}
                          postId={comment.id}
                          isSolved={false}
                          voteNumber={0}
                          previewOnly={false}
                          isComment={true}
                        />
                      );
                    })}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SolveSwitch({ isSolve, setIsSolve, postId }) {
  const theme = useMantineTheme();
  const state = isSolve ? "opened" : "marked as solved";

  const toggleSolve = () => {
    showNotification({
      id: "load-data",
      loading: true,
      title: "Loading",
      message: "Please Wait!",
      autoClose: false,
      disallowClose: true,
    });
    axios
      .post(`${PORT}/toggleSolve`, { isSolved: !isSolve, postId: postId })
      .then(() => {
        updateNotification({
          id: "load-data",
          color: "teal",
          title: "Success!",
          message: `The post has been ${state}`,
          icon: <IconCheck size={16} />,
          autoClose: 2000,
        });
      })
      .catch((error) => {
        console.log(error.message);
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

  return (
    <div
      style={{
        width: "100%",
        height: "auto",
        backgroundColor: theme.colorScheme === "dark" ? "#25262B" : "#f4f4f4",
        borderRadius: "4px",
        border: "1px solid",
        borderColor: theme.colorScheme === "dark" ? "#373A40" : "#CED4DA",
        display: "flex",
        padding: "0.75rem",
        marginBottom: "1rem",
      }}
    >
      <Text
        fz="sm"
        style={{
          marginLeft: "0",
          marginRight: "auto",
          marginTop: "0.3rem",
          color: theme.colorScheme === "dark" ? theme.colors.gray[6] : "#5E5F61",
        }}
      >
        {isSolve ? "Open Topic" : " Mark as Solved"}
      </Text>

      <Switch
        style={{
          marginTop: "-1rem",
        }}
        checked={isSolve}
        onChange={(event) => setIsSolve(event.currentTarget.checked)}
        onClick={toggleSolve}
        labelPosition="left"
        onLabel="Solved"
        offLabel={"Open"}
        size="lg"
      />
    </div>
  );
}

function RichTextBox({ text, setText }) {
  return (
    <RichTextEditor
      style={{ marginTop: "1rem", zIndex: "1" }}
      value={text}
      onChange={setText}
      sticky={true}
      stickyOffset={60}
      placeholder={"Share your thoughts"}
      controls={[
        ["bold", "italic", "underline", "link", "strike", "clean"],
        ["unorderedList", "orderedList", "h1", "h2", "h3", "h4"],
        ["sup", "sub", "blockquote", "code"],
      ]}
    />
  );
}

export default Comment;
