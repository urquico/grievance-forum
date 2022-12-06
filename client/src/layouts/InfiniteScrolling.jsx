import React, { useLayoutEffect, useState } from "react";
import { Button } from "@mantine/core";
import { getPost, getMorePosts } from "../firebase-config";
import EndPost from "./EndPost";
import LoadingPost from "./LoadingPost";
import PostCard from "./PostCard";

function InfiniteScrolling({ type }) {
  const [posts, setPosts] = useState([]);
  const [lastDoc, setLastDoc] = useState();
  const [isEmpty, setIsEmpty] = useState(false);

  useLayoutEffect(() => {
    getPost().then((result) => {
      setPosts([]);
      updateState(result);
    });
  }, []);

  const fetchMoreData = () => {
    getMorePosts(lastDoc).then((result) => {
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
        return (
          <div key={index}>
            <PostCard isAnonymous={post.isAnonymous} email={post.userId} />
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
