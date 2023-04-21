import React from "react";
import Frame from "../layouts/Frame/Frame";
import InfiniteScrolling from "../layouts/InfiniteScrolling";
import IntroductionCard from "../layouts/IntroductionCard";
import { useDocumentTitle } from "@mantine/hooks";

function Program() {
  useDocumentTitle("Program");

  return <Frame content={<ProgramLayout />} path={"/program"} />;
}

function ProgramLayout() {
  return (
    <div>
      <IntroductionCard
        name={localStorage.getItem("name")}
        message={"Welcome to Haribon E-Wall!"}
      />
      <InfiniteScrolling type="program" isArchive={false} />
    </div>
  );
}

export default Program;
