import React from "react";
import Frame from "../layouts/Frame/Frame";
import InfiniteScrolling from "../layouts/InfiniteScrolling";
import IntroductionCard from "../layouts/IntroductionCard";
import { useDocumentTitle } from "@mantine/hooks";

function College() {
  useDocumentTitle("College");

  return <Frame content={<CollegeLayout />} path={"/college"} />;
}

function CollegeLayout() {
  return (
    <div>
      <IntroductionCard
        name={localStorage.getItem("name")}
        message={"Welcome to Haribon E-Wall!"}
      />
      <InfiniteScrolling type="college" isArchive={false} />
    </div>
  );
}

export default College;
