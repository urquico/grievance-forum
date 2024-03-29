/* eslint-disable react-hooks/exhaustive-deps */
import React, { useLayoutEffect, useState } from "react";
import { Button } from "@mantine/core";
import { getPost, getMorePosts, getUser } from "../firebase-config";
import EndPost from "./EndPost";
import LoadingPost from "./Loading/LoadingPost";
import PostCard from "./PostCard";

function InfiniteScrolling({ type, tag, category, isArchive }) {
  const [posts, setPosts] = useState([]);
  const [lastDoc, setLastDoc] = useState();
  const [isEmpty, setIsEmpty] = useState(false);
  const [college, setCollege] = useState("");
  const [program, setProgram] = useState("");

  useLayoutEffect(() => {
    if (type === "college") {
      getUser(localStorage.getItem("email")).then((result) => {
        setCollege(result.college);
      });
    } else if (type === "program") {
      getUser(localStorage.getItem("email")).then((result) => {
        setProgram(result.program);
      });
    }
  }, []);

  useLayoutEffect(() => {
    getPost(type, localStorage.getItem("email"), tag, category, college, program).then((result) => {
      setPosts([]);
      updateState(result);
    });
  }, [college, program, tag]);

  const fetchMoreData = () => {
    getMorePosts(
      lastDoc,
      type,
      localStorage.getItem("email"),
      tag,
      category,
      college,
      program
    ).then((result) => {
      updateState(result);
    });
  };

  const updateState = (result) => {
    const isCollectionEmpty = result.size === 0;
    if (!isCollectionEmpty) {
      setPosts((currentPost) => [
        ...currentPost,
        ...result.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          readTime: doc._document.readTime.timestamp.seconds,
        })),
      ]);
      // console.log(result);
      const lastDoc = result.docs[result.docs.length - 1];
      setLastDoc(lastDoc);
    } else {
      setIsEmpty(true);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {posts.length === 0 && !isEmpty ? (
        <>
          <LoadingPost />
          <LoadingPost />
          <LoadingPost />
          <LoadingPost />
          <LoadingPost />
          <LoadingPost />
        </>
      ) : (
        ""
      )}

      {posts?.map((post, index) => {
        const timeCurrent = new Date(post.readTime * 1000);
        const timePosted = new Date(post.timePosted.seconds * 1000);

        const hour = (timeCurrent.getTime() - timePosted.getTime()) / 1000 / 3600;

        return (
          <div key={index}>
            <PostCard
              isAnonymous={post.isAnonymous}
              email={post.userId}
              tags={post.tags}
              category={post.categoryId}
              time={hour.toLocaleString()}
              post={post.message}
              postId={post.id}
              isSolved={post.isSolved}
              voteNumber={post.upVote - post.downVote}
              votePoint={post.votePoint}
              previewOnly={false}
              isComment={false}
              isPendingPost={false}
              isArchive={isArchive}
              receiver={post.receiver}
              reasonForUrgency={post.reasonForUrgency}
              levelOfUrgency={post.levelOfUrgency}
              approver={post.approvedBy}
            />
          </div>
        );
      })}

      <Button
        variant="subtle"
        color="dark"
        onClick={fetchMoreData}
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "1rem",
        }}
      >
        Load more posts
      </Button>

      {posts.length === 0 ? (
        <EndPost content="No content available" />
      ) : isEmpty ? (
        <>
          <EndPost content="You've reached the end" />
        </>
      ) : (
        ""
      )}
    </div>
  );
}

export default InfiniteScrolling;
