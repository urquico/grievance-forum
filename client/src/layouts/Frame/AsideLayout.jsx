import React, { useLayoutEffect, useState } from "react";
import { MediaQuery, Text, Aside } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { getTrendTags } from "../../firebase-config";
import TagLinks from "./TagLinks";
import TagLoader from "../Loading/TagLoader";

function AsideLayout() {
  const [tags, setTags] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);

  useLayoutEffect(() => {
    getTrendTags().then((result) => {
      setTags([]);
      fetchData(result);
    });
  }, []);

  const fetchData = async (result) => {
    const isCollectionEmpty = result.size === 0;
    if (!isCollectionEmpty) {
      setTags(() => [
        ...result.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })),
      ]);
    } else {
      setIsEmpty(true);
    }
  };

  return (
    <div style={{ zIndex: "1" }}>
      <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
        <Aside p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
          <Text
            style={{
              fontWeight: "bold",
              marginBottom: "1rem",
              fontSize: "1.250rem",
            }}
          >
            Trending Topics
          </Text>
          {tags.length && !isEmpty === 0 ? (
            <>
              <TagLoader />
              <TagLoader />
              <TagLoader />
              <TagLoader />
              <TagLoader />
            </>
          ) : (
            <>
              {isEmpty ? (
                <Text
                  style={{
                    paddingLeft: "0.75rem",
                    opacity: "0.7",
                    textAlign: "center",
                  }}
                  fz="xs"
                >
                  no trending topics yet
                </Text>
              ) : (
                tags?.map((tag, index) => {
                  return (
                    <div style={{ marginBottom: "0.625rem" }}>
                      <TagLinks tag={tag.id} tagCount={tag.tagCount} />
                    </div>
                  );
                })
              )}
            </>
          )}
          <div
            style={{
              marginTop: "1.625rem",
              marginLeft: "0.75rem",
              opacity: "0.7",
              display: "flex",
            }}
          >
            <Links title={"Terms of Services"} path={"terms-of-services"} />
            <Links title={"Privacy Policy"} path={"privacy-policy"} />
            <Links title={"Features"} path={"features"} />
          </div>
          <Text fz="xs" style={{ marginLeft: "0.75rem", opacity: "0.7" }}>
            &copy; 2022 Haribon E-Wall
          </Text>
        </Aside>
      </MediaQuery>
    </div>
  );
}

function Links({ title, path }) {
  const navigate = useNavigate();

  return (
    <Text
      fz="xs"
      style={{ paddingRight: "8px", cursor: "pointer" }}
      onClick={() => navigate(`/${path}`)}
    >
      {title}
    </Text>
  );
}

export default AsideLayout;
