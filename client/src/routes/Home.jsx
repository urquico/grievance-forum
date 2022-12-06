import React from "react";
import Frame from "../layouts/Frame/Frame";
import InfiniteScrolling from "../layouts/InfiniteScrolling";
import IntroductionCard from "../layouts/IntroductionCard";

function Home() {
  return <Frame content={<HomeLayout />} />;
}

function HomeLayout() {
  return (
    <div>
      <IntroductionCard name={localStorage.getItem("name")} />
      <InfiniteScrolling type="home" />
    </div>
  );
}

export default Home;
