import React from "react";
import Frame from "../layouts/Frame/Frame";
import InfiniteScrolling from "../layouts/InfiniteScrolling";
import IntroductionCard from "../layouts/IntroductionCard";
import { useDocumentTitle } from "@mantine/hooks";

function Archive() {
  useDocumentTitle("Archive");

  return <Frame content={<ArchiveLayout />} path={"/archive"} />;
}

function ArchiveLayout() {
  return (
    <div>
      <IntroductionCard
        name={localStorage.getItem("name")}
        message={"Welcome to Haribon E-Wall!"}
      />
      <InfiniteScrolling type="archive" isArchive={true} />
    </div>
  );
}

export default Archive;
