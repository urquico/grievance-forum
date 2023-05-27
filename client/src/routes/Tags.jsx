import React, { useState, useLayoutEffect } from "react";

import { getAllTrends } from "../firebase-config";
import Frame from "../layouts/Frame/Frame";
import IntroductionCard from "../layouts/IntroductionCard";
import TagLinks from "../layouts/Frame/TagLinks";
import TagLoader from "../layouts/Loading/TagLoader";
import { useDocumentTitle } from "@mantine/hooks";
import { SimpleGrid } from "@mantine/core";

function Tags() {
  return <Frame content={<TagsLayout />} path="/tags" />;
}

function TagsLayout() {
  const [tags, setTags] = useState([]);
  useDocumentTitle("Tags");

  useLayoutEffect(() => {
    getAllTrends().then((result) => {
      setTags(() => [
        ...result.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })),
      ]);
    });
  }, []);

  return (
    <div>
      <IntroductionCard name={localStorage.getItem("name")} message={"List of tags created by the community."} />
      <SimpleGrid
        cols={4}
        spacing="xs"
        breakpoints={[
          { maxWidth: 980, cols: 3, spacing: "md" },
          { maxWidth: 755, cols: 2, spacing: "sm" },
          { maxWidth: 600, cols: 1, spacing: "sm" },
        ]}
        style={{ marginTop: "0.625rem" }}
      >
        {tags.length === 0 ? (
          <>
            <TagLoader />
            <TagLoader />
            <TagLoader />
            <TagLoader />
            <TagLoader />
            <TagLoader />
            <TagLoader />
            <TagLoader />
            <TagLoader />
            <TagLoader />
            <TagLoader />
            <TagLoader />
            <TagLoader />
            <TagLoader />
            <TagLoader />
            <TagLoader />
          </>
        ) : (
          <>
            {tags.map((tag) => {
              return (
                <>
                  {tag.tagCount === 0 ? (
                    ""
                  ) : (
                    <>
                      <TagLinks tag={tag.id} tagCount={tag.tagCount} />
                    </>
                  )}
                </>
              );
            })}
          </>
        )}
      </SimpleGrid>
    </div>
  );
}

export default Tags;
