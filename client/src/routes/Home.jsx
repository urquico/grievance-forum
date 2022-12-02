import React from "react";
import Frame from "../layouts/Frame";

function Home() {
  return <Frame content={<HomeLayout />} />;
}

function HomeLayout() {
  return <div>{localStorage.getItem("name")}</div>;
}

export default Home;
