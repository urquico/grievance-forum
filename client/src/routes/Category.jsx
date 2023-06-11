import React, { useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Text, useMantineTheme, Accordion, Button } from "@mantine/core";

import { getCategories } from "../firebase-config";
import Frame from "../layouts/Frame/Frame";
import IntroductionCard from "../layouts/IntroductionCard";
import TagLoader from "../layouts/Loading/TagLoader";
import { useDocumentTitle } from "@mantine/hooks";

function Category() {
  useDocumentTitle("Category");
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
      <IntroductionCard name={localStorage.getItem("name")} message={"Description of categories available in this platform."} />
      <div
        style={{
          height: "auto",
          backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
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
            {/* accordion */}
            <Accordion chevronPosition="left" variant="separated">
              {categories?.map((cat, index) => {
                const category = cat._document.data.value.mapValue.fields.category.stringValue;
                const description = cat._document.data.value.mapValue.fields.description.arrayValue.values;

                return (
                  <Accordion.Item value={category} key={index}>
                    <Accordion.Control>
                      <Text fw="bold">{category}</Text>
                    </Accordion.Control>
                    <Accordion.Panel>
                      {description.map((paragraph) => {
                        return (
                          <Text style={{ margin: "1.750rem", textIndent: "1rem" }} ta="justify">
                            {paragraph.stringValue}
                          </Text>
                        );
                      })}
                    </Accordion.Panel>
                    <Accordion.Panel style={{ display: "flex", width: "100%" }}>
                      <Button variant="subtle" color="dark" style={{ marginRight: "auto" }} onClick={() => navigate(`/category/${category.toLowerCase()}-concerns`)}>
                        <u>View Posts</u>
                      </Button>
                    </Accordion.Panel>
                  </Accordion.Item>
                );
              })}
            </Accordion>

            {/* accordion */}
          </>
        )}
      </div>
    </>
  );
}

export default Category;
