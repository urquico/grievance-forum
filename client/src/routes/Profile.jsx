import React from "react";
import Frame from "../layouts/Frame/Frame";
import InfiniteScrolling from "../layouts/InfiniteScrolling";
import IntroductionCard from "../layouts/IntroductionCard";
import { useDocumentTitle } from "@mantine/hooks";

function Profile() {
  useDocumentTitle(Profile);
  return <Frame content={<ProfileLayout />} path={"/profile"} />;
}

function ProfileLayout() {
  return (
    <>
      <IntroductionCard
        name={localStorage.getItem("name")}
        message={"Welcome to your profile, you can see your activities here"}
      />
      <InfiniteScrolling type="profile" />
    </>
  );
}

export default Profile;
