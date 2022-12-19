import React, { useLayoutEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { RichTextEditor } from "@mantine/rte";
import { Button } from "@mantine/core";

import Frame from "../layouts/Frame/Frame";
import IntroductionCard from "../layouts/IntroductionCard";
import PostCard from "../layouts/PostCard";
import LoadingPost from "../layouts/Loading/LoadingPost";
import { getSinglePost } from "../firebase-config";
import { useMantineTheme } from "@mantine/core";

function Comment() {
  let { id } = useParams();
  return <Frame content={<CommentLayout />} path={`/comment/${id}`} />;
}

function CommentLayout() {
  const initialValue = "<p><b>Share</b> your <i>thoughts</i> ...</p>";

  let { id } = useParams();
  const [post, setPost] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeCurrent, setTimeCurrent] = useState(0);
  const [timePosted, setTimePosted] = useState(0);
  const [hour, setHour] = useState(0);
  const [text, setText] = useState(initialValue);
  const theme = useMantineTheme();

  useLayoutEffect(() => {
    getSinglePost(id).then((result) => {
      setPost({
        ...result.data(),
        id: result.id,
        readTime: result._document.readTime.timestamp.seconds,
      });
      setIsLoading(false);
      setTimeCurrent(new Date(post.readTime * 1000));
      setTimePosted(new Date(post.timePosted.seconds * 1000));
      setHour((timeCurrent.getTime() - timePosted.getTime()) / 1000 / 3600);
    });
  }, []);

  console.log(post);
  console.log(isLoading);

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
          />
          <div
            style={{
              display: "flex",
              height: "auto",
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[6]
                  : theme.colors.gray[0],
              marginTop: "1rem",

              borderRadius: "13px",
              padding: "2.375rem",

              boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
              flexDirection: "column",
            }}
          >
            <RichTextBox text={text} setText={setText} />
            <Button style={{ marginTop: "0.500rem" }}>Submit Comment</Button>
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