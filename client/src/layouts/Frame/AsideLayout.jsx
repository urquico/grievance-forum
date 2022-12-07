import React from "react";
import { MediaQuery, Text, Aside } from "@mantine/core";

function AsideLayout() {
  return (
    <div>
      {" "}
      <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
        <Aside p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
          <Text
            style={{
              fontWeight: "bold",
              marginBottom: "2rem",
              fontSize: "1.250rem",
            }}
          >
            Trending
          </Text>
        </Aside>
      </MediaQuery>
    </div>
  );
}

export default AsideLayout;
