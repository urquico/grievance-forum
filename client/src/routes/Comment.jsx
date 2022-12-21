import React, { useLayoutEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { RichTextEditor } from "@mantine/rte";
import { Button } from "@mantine/core";

import Frame from "../layouts/Frame/Frame";
import IntroductionCard from "../layouts/IntroductionCard";
import PostCard from "../layouts/PostCard";
import LoadingPost from "../layouts/Loading/LoadingPost";
import { getSinglePost, getComments } from "../firebase-config";
import { useMantineTheme, Timeline } from "@mantine/core";
import axios from "axios";
import { PORT } from "../Globals";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons";
import EndPost from "../layouts/EndPost";

function Comment() {
  let { id } = useParams();
  return <Frame content={<CommentLayout />} path={`/comment/${id}`} />;
}

function CommentLayout() {
  const initialValue = "<p><b>Share</b> your <i>thoughts</i> ...</p>";

  let { id } = useParams();
  const [post, setPost] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCommentsLoading, setIsCommentsLoading] = useState(true);
  const [timeCurrent, setTimeCurrent] = useState(0);
  const [timePosted, setTimePosted] = useState(0);
  const [hour, setHour] = useState(0);
  const [text, setText] = useState(initialValue);
  const [comments, setComments] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const theme = useMantineTheme();

  useLayoutEffect(() => {
    getSinglePost(id).then((result) => {
      setPost({
        ...result.data(),
        id: result.id,
        readTime: result._document.readTime.timestamp.seconds,
      });
      setIsLoading(false);
      setTimeCurrent(Date(post.readTime * 1000));
      setTimePosted(Date(post.timePosted.seconds * 1000));
      setHour((timeCurrent.getTime() - timePosted.getTime()) / 1000 / 3600);
    });
  }, []);
  console.log(timeCurrent);
  console.log(timePosted);
  console.log(hour);

  useLayoutEffect(() => {
    getComments(id).then((result) => {
      commentState(result);
      setIsCommentsLoading(false);
    });
  }, []);

  const commentState = (result) => {
    const isCollectionEmpty = result.size === 0;
    console.log(result);
    console.log(isCollectionEmpty);
    if (!isCollectionEmpty) {
      setComments(() => [
        ...result.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          readTime: doc._document.readTime.timestamp.seconds,
        })),
      ]);
      // setComments(result);
      // console.log(result);
    } else {
      setIsEmpty(true);
    }
  };

  console.log(comments);

  const submitComment = () => {
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
        setTimeout(() => {
          updateNotification({
            id: "load-data",
            color: "teal",
            title: "Success!",
            message: "Comment has been Submitted",
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

  return (
    <div>
      <IntroductionCard name={localStorage.getItem("name")} message={id} />
      {isLoading ? (
        <LoadingPost />
      ) : (
        <div
          style={{
            display: "flex",
            height: "auto",
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[6]
                : theme.colors.gray[0],
            borderRadius: "13px",
            padding: "2.375rem",
            marginTop: "1rem",
            boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
            flexDirection: "column",
          }}
        >
          <PostCard
            isAnonymous={post.isAnonymous}
            email={post.userId}
            tags={post.tags}
            category={post.categoryId}
            time={hour.toLocaleString()}
            post={post.message}
            postId={id}
            isSolved={post.isSolved}
            voteNumber={post.upVote - post.downVote}
            previewOnly={false}
            isComment={false}
          />
          <div>
            {" "}
            {isEmpty ? (
              <EndPost content="No comments yet" />
            ) : (
              <Timeline>
                {comments?.map((comment, index) => {
                  const timeCurrent = new Date(comment.readTime * 1000);
                  const timeCommented = new Date(
                    comment.timeCommented.seconds * 1000
                  );

                  const hour =
                    (timeCurrent.getTime() - timeCommented.getTime()) /
                    1000 /
                    3600;

                  return (
                    <Timeline.Item key={index}>
                      <PostCard
                        style={{ marginLeft: "2rem" }}
                        isAnonymous={false}
                        email={comment.userId}
                        tags={[]}
                        category={""}
                        time={hour.toLocaleString()}
                        post={comment.reply}
                        postId={""}
                        isSolved={false}
                        voteNumber={0}
                        previewOnly={false}
                        isComment={true}
                      />
                    </Timeline.Item>
                  );
                })}
                <Timeline.Item lineVariant="dashed">
                  <div
                    style={{
                      display: "flex",
                      height: "auto",
                      backgroundColor:
                        theme.colorScheme === "dark"
                          ? theme.colors.dark[6]
                          : theme.colors.gray[0],
                      marginTop: isEmpty ? "" : "1rem",
                      marginLeft: "2rem",
                      borderRadius: "13px",
                      padding: "2.375rem",

                      boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
                      flexDirection: "column",
                    }}
                  >
                    <RichTextBox text={text} setText={setText} />
                    <Button
                      style={{ marginTop: "0.500rem" }}
                      onClick={submitComment}
                    >
                      Submit Comment
                    </Button>
                  </div>
                </Timeline.Item>
                <Timeline.Item active={1}></Timeline.Item>
              </Timeline>
            )}
          </div>
        </div>
      )}
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
      controls={[
        ["bold", "italic", "underline", "link", "strike", "clean"],
        ["unorderedList", "orderedList", "h1", "h2", "h3", "h4"],
        ["sup", "sub", "blockquote", "code"],
      ]}
    />
  );
}

export default Comment;
