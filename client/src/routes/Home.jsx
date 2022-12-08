import React from "react";
import Frame from "../layouts/Frame/Frame";
import InfiniteScrolling from "../layouts/InfiniteScrolling";
import IntroductionCard from "../layouts/IntroductionCard";

function Home() {
  return <Frame content={<HomeLayout path={"/home"} />} />;
}

function HomeLayout() {
  return (
    <div>
      <IntroductionCard
        name={localStorage.getItem("name")}
        message={"Welcome to Haribon Knights E-Wall!"}
      />
      <InfiniteScrolling type="home" />
    </div>
  );
}

export default Home;
