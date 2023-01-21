import React from "react";
import Frame from "../layouts/Frame/Frame";
import IntroductionCard from "../layouts/IntroductionCard";

import { useMantineTheme } from "@mantine/core";
import { useDocumentTitle } from "@mantine/hooks";

function Profanities() {
  useDocumentTitle("Profanities");
  return <Frame content={<ProfanitiesLayout />} path={"/profanities"} />;
}

function ProfanitiesLayout() {
  const theme = useMantineTheme();

  return (
    <div>
      <IntroductionCard
        name={localStorage.getItem("name")}
        message={`sa mga admin dyan, pwede kayo mag add ng profanity dyan`}
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
      ></div>
    </div>
  );
}

export default Profanities;
