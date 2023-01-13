import React, { useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Text, useMantineTheme, Badge } from "@mantine/core";

import { getCategories } from "../firebase-config";
import Frame from "../layouts/Frame/Frame";
import IntroductionCard from "../layouts/IntroductionCard";
import TagLoader from "../layouts/Loading/TagLoader";

function Category() {
  return <Frame content={<CategoryLayout />} path={"/category"} />;
}

function CategoryLayout() {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useLayoutEffect(() => {
    getCategories()
      .then((result) => {
        setCategories(result);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, []);

  return (
    <>
      <IntroductionCard
        name={localStorage.getItem("name")}
        message={"Description of categories available in this platform."}
      />
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
        <Text style={{ fontSize: "2rem" }} fw={700}>
          CATEGORIES
        </Text>
        {categories.length === 0 ? (
          <>
            <TagLoader />
            <TagLoader />
          </>
        ) : (
          <>
            {" "}
            {categories?.map((cat) => {
              const category =
                cat._document.data.value.mapValue.fields.category.stringValue;
              const description =
                cat._document.data.value.mapValue.fields.description
                  .stringValue;
              return (
                <>
                  <div style={{ width: "50%", marginTop: "1.500rem" }}>
                    <Badge
                      variant="gradient"
                      gradient={
                        category === "Academic"
                          ? { from: "orange", to: "red" }
                          : { from: "teal", to: "lime", deg: 105 }
                      }
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        navigate(
                          `/category/${category.toLowerCase()}-concerns`
                        );
                      }}
                      size="xl"
                    >
                      {category + "-concerns"}
                    </Badge>
                  </div>
                  <Text style={{ marginLeft: "2.500rem" }}>{description}</Text>
                </>
              );
            })}
          </>
        )}
      </div>
    </>
  );
}

export default Category;
