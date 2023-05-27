import React from "react";
import Frame from "../layouts/Frame/Frame";
import InfiniteScrolling from "../layouts/InfiniteScrolling";
import IntroductionCard from "../layouts/IntroductionCard";
import { useDocumentTitle } from "@mantine/hooks";

function Home() {
  useDocumentTitle("Home");

  return <Frame content={<HomeLayout />} path={"/home"} />;
}

function HomeLayout() {
  return (
    <div>
      <IntroductionCard name={localStorage.getItem("name")} message={"Welcome to Haribon E-Wall!"} />
      <InfiniteScrolling type="home" isArchive={false} />
    </div>
  );
}

export default Home;
